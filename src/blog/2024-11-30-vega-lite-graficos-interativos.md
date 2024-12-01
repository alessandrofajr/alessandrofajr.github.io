---
layout: post
title: "Criando filtros interativos em Vega-Lite no Observable Framework"
permalink: /blog/vega-lite-graficos-interativos-observable-framework/
date: 2024-11-30
updated: 2024-11-30
tags: 
    - tech
---

Filtrar os dados a partir de cliques nos gráficos, realizando algum tipo de detalhamento das informações, é um comportamento comum em dashboards. Esse tipo de interação é configurada de forma intuitiva nos softwares de business intelligence, ao custo de ficar preso às muitas outras restrições como a falta de transparência nas computações.

Brincando com o [Observable Framework](https://observablehq.com/framework/), queria construir algo similar usando a biblioteca de gráficos [Vega-Lite](https://vega.github.io/vega-lite/). O suporte à esse tipo de interação está nos ["Selection Parameters"](https://vega.github.io/vega-lite/docs/selection.html), mas a forma com que os cliques são interpretados não era exatamente o que eu desejava e que creio ser o mais natural para os usuários.

Explico: eu queria que, quando o usuário clicasse novamente sobre o mesmo elemento, o filtro voltasse ao estado padrão. Um reset. Brinquei com algumas funcionalidades interessantes do trio Observable Framework, Vega-Lite e [Arquero](https://idl.uw.edu/arquero/).

## A ideia e os dados
Escolhi um dataset da [Base dos Dados](https://basedosdados.org/dataset/3e31e540-81ba-4665-9e72-3f81c176adad?table=b955feef-1649-428b-ba46-bc891d2facc2) sobre o consumo de energia elétrica no Brasil. O objetivo era plotar um mapa coroplético mostrando os estados de maior consumo e permitir que o usuário clicasse em cada unidade federativa para detalhar um gráfico de barras ao lado que destrinchava o tipo de consumo (residencial, comercial, industrial).

Baixei também a [tabela](https://basedosdados.org/api/tables/downloadTable?p=YnJfYmRfZGlyZXRvcmlvc19icmFzaWw=&q=dWY=&d=dHJ1ZQ==&s=ZnJlZQ==) que "traduz" a coluna `sigla_uf` para os códigos padronizados do IBGE, disponibilizada pela própria Base dos Dados.

# A implementação

Importei as bibliotecas e configurei o [plugin de tooltip do Vega-Lite](https://alessandrofajr.com/blog/observable-framework-vega-lite-api-tooltip/):

```js
import * as aq from 'npm:arquero';
import { op, table } from 'npm:arquero';
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";
import * as vegaTooltip from "npm:vega-tooltip";
```

```js
const vl = vegaLiteApi.register(vega, vegaLite, {
  init: (view) => {
    view.tooltip(new vegaTooltip.Handler().call);
    if (view.container()) view.container().style["overflow-x"] = "auto";
  }
});
```

Em seguida, importei os dados baixados e transformei os CSVs em tabelas do Arquero. 

Para esse experimento, quis usar o Arquero para manipular os dados porque os arquivos são pequenos, não passam de 2 MB juntos. Essa manipulação feita direto no navegador, com o Arquero, não traria muito impacto na performance e permitiria eu aplicar os filtros da maneira que pensei ser a mais fácil.

```js
const energyConsumptionData = FileAttachment("data/br_mme_consumo_energia_eletrica_uf.csv").csv();
const brazilStateCodes = FileAttachment("data/br_bd_diretorios_brasil_uf.csv").csv();
```

```js
let brazilStateCodesAq = aq
    .from(brazilStateCodes)
```

```js
let energyConsumptionDataAq = aq
    .from(energyConsumptionData)
    .join_left(brazilStateCodesAq, ['sigla_uf', 'sigla']) // Join to 'translate' the data with the state code
    .select(aq.not('regiao', 'sigla')) // Removing columns
```

Manipulei os dados para fazer o cálculo do consumo total de energia no país por UF.

```js
let totalConsumptionByState = energyConsumptionDataAq
    .filter((d) => d.ano == "2023" && d.tipo_consumo != "Cativo")
    .groupby("sigla_uf", "id_uf", "nome")
    .rollup({ consumo_total: aq.op.sum("consumo") }).objects()
```

Em seguida, criei a configuração de visualização do mapa. Plotar mapa é sempre um passo que exige um pouquinho mais de atenção, já que é necessário trabalhar com dados `topojson`. Não basta inserir os dados originais com a UF e esperar que a biblioteca localize o país e faça a mágina acontecer.

Fui no site do IBGE pegar a [API de malhas geográficas](https://servicodados.ibge.gov.br/api/docs/malhas?versao=3). Com o `topojson` em mãos, definimos a especificação no Vega-Lite. Os detalhes que queremos estão dentro da chave "BRUF" (o código completo do mapa está mais abaixo):

```js
data: {
    url: "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/json&qualidade=intermediaria&intrarregiao=UF",
    format: {
    type: "topojson",
    feature: "BRUF"}
    },
    projection: {
        type: "mercator",
    }
```

Precisamos vincular a chave `properties.codarea` dos dados do IBGE com os mesmos códigos nos dados de consumo. É nesse passo, inclusive, que especificamos as informações que serão exibidas no mapa.

```js
transform: [
    {
        lookup: "properties.codarea",
        from: {
        data: { values: totalConsumptionByState },
        key: "id_uf",
        fields: ["consumo_total", "nome"]   
        }
    }
]
```

Definimos também qual é o campo que queremos recuperar quando o usuário clicar no mapa:

```js
selection: {
    stateSelector: {
        type: "point",
        fields: ["properties.codarea", "nome"]
    }
}
```

Assim fica a especificação completa do mapa:

```js
let brazilMap = await vl.render({
    spec:{
        width: 550,
        height: 400,
        autosize: {type: "fit", contains: "padding"},
        title: {
            text: "Consumo total de energia por estado em 2023",
            anchor: "start",
            offset: 20,
            fontSize: 20,
            subtitle: [`Clique em um estado para filtrar o gráfico ao lado`, `Clique novamente para voltar à agregação nacional.`],
            subtitleFontSize: 16
            },
        data: {
            url: "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/json&qualidade=intermediaria&intrarregiao=UF",
            format: {
            type: "topojson",
            feature: "BRUF"
            }
        },
        projection: {
            type: "mercator",
        },
        transform: [
            {
                lookup: "properties.codarea", // Vinculates 'properties.codarea' from TopoJSON
                from: {
                data: { values: totalConsumptionByState }, // Energy consumption data
                key: "id_uf", // Field to link with TopoJSON
                fields: ["consumo_total", "nome"] // Data to be used on the map
                }
            }
            ],
        selection: {
            stateSelector: {
                type: "point",
                fields: ["properties.codarea", "nome"] // Field used to give the signal to the Listener
            }
        },
        mark: {
            type: "geoshape",
            stroke: "white",
            strokeWidth: 0.5
            },
        encoding: {
            color: {
                field: "consumo_total",
                type: "quantitative",
                scale: {
                scheme: "blues" 
                },
                title: "Consumo em MWh",
                legend: {
                    direction: "vertical",
                    orient: "bottom-left",
                    offset: 10
                }
            },
            tooltip: [
                { field: "nome", type: "nominal", title: "Estado:" },
                { field: "consumo_total", type: "quantitative", title: "Consumo Total (MWh):" }
                ]
            }
        }
})
```

Agora vem a parte interessante de recuperar e armazenar em uma variável o clique do usuário. O Observable Framework tem a característica de ser [reativo](https://observablehq.com/framework/reactivity), e é uma dessas abstrações da ferramenta que utilizei. 

Para implementar o comportamento desejado de alternar entre o estado clicado e o filtro padrão, precisei configurar variáveis reativas e um listener para os cliques no mapa.

```js
let clickedStateCode = Mutable('0');
let setClickedStateCode = (x) => {clickedStateCode.value = x};

let clickedStateName = Mutable('Brasil');
let setClickedStateName = (x) => {clickedStateName.value = x};
```

A função `stateSelectorHandler` aplica a lógica de reset ao verificar se o estado clicado é igual ao valor atual armazenado, invocando `setClickedStateCode` e `setClickedStateName`. (A variável `clickedStateName` vai servir para exibir o nome do estado no título do gráfico de barras):

```js
function stateSelectorHandler(name, value) {

    const newSelection = value["properties\\.codarea"]?.[0] ?? '0';
    const stateSelected = value.nome?.[0] ?? 'Brasil'
    
    if (clickedStateCode === newSelection) {
        setClickedStateCode('0');
        setClickedStateName('Brasil');
    } else {
        setClickedStateCode(newSelection);
        setClickedStateName(stateSelected);
    }
}
```

Repare que no código acima utilizamos o [operador de encadeamento opcional](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Optional_chaining) `?.`. Se, por um acaso, o usuário clicar em algum elemento que retornaria um valor `undefined` ou `null`, em vez de termos um erro, há um retorno de `undefined` ou `null`. Para evitar isso, definimos um valor padrão com `?? '0'`, o [operador de coalescência nula](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing).

Para obtermos os valores após o clique, adicionamos um [SignalListener](https://vega.github.io/vega/docs/signals/) ao gráfico, passando os parâmetros definidos na própria especificação da visualização e a nossa função recém-criada `stateSelectorHandler`.
 
```js
brazilMap.value.addSignalListener("stateSelector", stateSelectorHandler);
```

Em um primeiro momento, tive bastante dificuldade para fazer o `listener` funcionar corretamente. Ao clicar no mapa uma segunda vez, eram disparadas diversas chamadas da função que altera o valor da nossa variável `Mutable`. [Pedi ajuda no fórum do Observable Framework](https://github.com/observablehq/framework/discussions/1829) e descobri que eu precisava remover o `listener` utilizando a promessa `invalidation`. Como o Framework funciona por blocos de código, o meu bloco que define a variável `Mutable` ficava rodando diversas vezes.

```js
invalidation.then(() => {
    brazilMap.value.removeSignalListener("stateSelector", stateSelectorHandler);
});
```

Um `console.log(clickedStateCode)` me mostrou que a interação estava dando certo, então era hora de filtrar os dados e construir o gráfico de barras. Primeiro, precisei manipular os dados para calcular o consumo total do Brasil. Isso porque os dados traziam informações granuladas por estado e, caso o usuário não tivesse clicado em nada, o gráfico de barras deveria mostrar as informações a nível nacional, somente para o ano de 2023:

```js
let brazilTotalConsumption = energyConsumptionDataAq
    .filter((d) => d.ano == "2023" && d.tipo_consumo != "Cativo" && d.tipo_consumo != "Total")
    .groupby("tipo_consumo")
    .rollup({
        consumo_ano: aq.op.sum("consumo")
        })
    .derive({
        sigla_uf: () => "BR",
        id_uf: () => "0",
        nome: () => "Brasil"
        })
    .select(['sigla_uf', 'id_uf', 'nome', 'tipo_consumo', 'consumo_ano'])
```

Os dados também tinham granularidade mensal, então agreguei os dados por estado e ano, da mesma forma que tinha feito para o país:

```js
let consumptionByState = energyConsumptionDataAq
    .filter((d) => d.ano == "2023" && d.tipo_consumo != "Cativo" && d.tipo_consumo != "Total") 
    .groupby("sigla_uf", "id_uf", "nome", "tipo_consumo")
    .rollup({ consumo_ano: aq.op.sum("consumo") })
```

Juntei tudo num único dataset que era filtrado por `clickedStateCode` e é esse o trecho do código responsável por filtrar os dados de acordo com o valor da variável que armazena o clique do usuário:

```js
let consumptionTreatedData = consumptionByState
    .concat(brazilTotalConsumption)
    .filter(aq.escape((d) => d.id_uf == clickedStateCode))
```

Para finalizar, plotamos o gráfico de barras com os dados de `consumptionTreatedData`. A variável `clickedStateName` é utilizada para ajustar dinamicamente o título do gráfico com o nome do estado selecionado ou 'Brasil' no caso de agregação nacional.

```js
let barChart = await vl.render({
    spec: {
        width: 500,
        height: 400,
        autosize: {type: "fit", contains: "padding"},
        title: {
            text: `Consumo de energia por categoria: ${clickedStateName}`,
            anchor: "start",
            offset: 20,
            fontSize: 20,
            subtitle: [`Interaja com o mapa para mudar o estado`],
            subtitleFontSize: 16
            },
        data: { values: consumptionTreatedData },
        mark: { type: "bar" },
        encoding: {
            x: {
                field: "consumo_ano", 
                type: "quantitative",
                axis: { grid: true },
                title: "Consumo Anual (MWh)"
                },
            y: {
                field: "tipo_consumo",
                type: "nominal",
                axis: { grid: false },
                title: "Tipo de Consumo"
                }
        }
  }
});
```

O resultado final pode ser [acessado aqui](https://alessandrofajr.com/vega-lite-interactive-charts/). O código-fonte completo está [neste repositório do GitHub](https://github.com/alessandrofajr/vega-lite-interactive-charts).