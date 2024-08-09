---
layout: post
title: "Como ajustar deslocamento de datas no 11ty (eleventy)"
permalink: /blog/lidando-com-datas-11ty/
date: 2024-07-27
updated: 2024-07-27
tags: 
    - tech
---

O problema que eu mais bati cabeça ao criar esse site com o **11ty** teve a ver com a maneira que o framework lida com as datas. Por mais que eu incluísse a data desejada no *front matter* do arquivo, a página sempre exibia o dia anterior. 

A documentação do projeto lista essa como "uma das ciladas comuns" – isso porque o **11ty** assume o fuso horário como UTC e, se você escrever a data sem um horário, como `2024-07-27`, ele interpretará isso como "a zero hora do dia 27 de julho de 2024 no fuso UTC". O fato de estarmos atrás do horário gera essa divergência.

**Importante:** no Brasil, costumamos escrever a data ao contrário, começando pelo dia e terminando com o ano. O framework espera que escrevemos no padrão utilizado nos Estados Unidos.

Existem algumas maneiras de contornar esse problema. A mais direta, que não exige código, [encontrei no blog Jack of all trad.es, de Will Bjorn](https://jackofalltrad.es/posts/writing-dates-for-an-11ty-blog-post/): usar o formato completo da data, incluindo a diferença de horário. Tomei a liberade de traduzir a explicação dele.

## Resolvendo o problema sem código

No campo `date` do nosso *front matter*, devemos seguir o formato `YYYY-MM-DDTHH:mm:ss.sssZ`:

```txt
YYYY -> Ano
MM -> Mês
DD -> Dia
T -> Um caractere semântico que indica o fim da data e o início do horário.
HH -> Hora
: -> Dois pontos
mm -> Minuto
ss -> Segundo
. -> Um ponto.
sss -> Milissegundos, caso você se importe com essa precisão. Escreva 000 se não se importar.
Z -> Z significa o horário UTC. Podemos substuí-lo com um número inteiro positivo ou negativo.
```

No caso do horário de Brasília, colocaríamos -3 ao final: `2024-07-27T14:30:00.000-3`

## Resolvendo o problema com código, usando filtros

Embora a solução acima seja bastante simples e eficaz, tive problemas quando quis especificar em templates `.njk` o formato que queria exibir a data. 

No meu caso particular, não queria mostrar o horário das publicações, somente o dia, mês e ano. Na versão atual desse site, quis manter a data no formato dos Estados Unidos, mas creio que a maioria dos brasileiros vão querer modificar essa exibição. É aqui que entra a capacidade de utilização de filtros do **11ty**.

Esse [post do blog de Justus Grunow](https://www.justus.ws/tech/eleventy-utc-dates/) explica como resolver o problema usando a biblioteca Moment.js. Como eu queria que esse projeto dependesse do mínimo de bibliotecas possíveis, resolvi escrever o código na mão:

1. Criei, dentro da pasta `src`, um arquivo chamado `filters.js`;
2. Nele, escrevi o seguinte código:
```js
module.exports = function(eleventyConfig) {
    eleventyConfig.addFilter('date', function(date, format) {
      const dateObj = new Date(date);
      return formatDate(dateObj, format);
    });
  };
  
  function formatDate(date, format) {

    date.setHours(date.getHours() + 3);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    
    switch (format) {
      case 'YYYY-MM-DD':
        return `${day}-${month}-${year}`;
      default:
        return `${day}-${month}-${year}`;
    }
  }
```
A partir do método de filtros nativos do **11ty**, recebe uma string com a data do nosso *front matter*, faz um parsing dessa string em um objeto de data do JavaScript, e retorna esse objeto no formato estabelecido pela função `formatDate`. 

A primeira coisa que a função `formatDate` faz é adicionar três horas à data, para fazer o ajuste de fuso horário. 

Por que adicionar três horas? Ao escrever uma data qualquer, o fuso UTC será considerado. No meu navegador, ocorrerá uma _subtração_ de três horas, pelo fuso GMT-3. Então eu estou compensando a subtração para exibir o horário. É o jeito ideal? Provavelmente não. Mas funciona.

Depois, o código separada cada item do objeto de data, obtendo individualmente o ano, o mês e o dia. Por fim, caso a data esteja escrita como `YYYY-MM-DD`, ela irá retornar como `DD-MM-YYYY` (e definimos esse formato como o padrão). É possível modificar essa função para que ela exiba o mês por extenso, por exemplo. 

Para que ela funcione, é preciso ainda adicionar o filtro ao nosso `eleventy.config.js` e aplicá-lo.

3. No `eleventy.config.js` vamos adicionar, logo no início do arquivo, a chamada para o arquivo de filtros e usar o método `addPlugin`:
```js
const filters = require('./filters');

module.exports = function(eleventyConfig) {

eleventyConfig.addCollection("blog", function(collection) {
    return collection.getFilteredByGlob("src/blog/*.md").filter(function(item) {
      return !item.inputPath.endsWith("index.md");
    });
  });

  eleventyConfig.addPlugin(filters);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts"
    }
  };
};
```

4. Vamos aplicar o filtro na lista de publicações, modificando o arquivo `blog/index.md`. Adicionaremos a data para cada post:
```md
---
layout: default
title: blog
pagination:
  data: collections.blog
  size: 10
  reverse: true
  alias: posts
---

## Blog
<ul>
{{ '{% for post in pagination.items %}' }}
<li><a href="">{{ '{{ post.data.title }}' }}</a> - {{ '{{ post.date | date: "%d-%m-%Y" }}' }}</li>
{{ '{% endfor %}' }}
</ul>

<nav>
  {{ '{% if pagination.href.previous %}' }}
    <a href="{{ pagination.href.previous }}">Página anterior</a>
  {{ '{% else %}' }}
  {{ '{% endif %}' }}
  {{ '{% if pagination.href.next %}' }}
    <a href="{{ pagination.href.next }}">Próxima página</a>
  {{ '{% else %}' }}
  {{ '{% endif %}' }}
</nav>
```

A **sintaxe usada para aplicar esse mesmo filtro em arquivos de layout `.njk` é ligeiramente diferente**. 

Em vez de colocarmos `date | date: "%Y-%m-%d"`, usaremos `{{ '{{ date | date("YYYY-MM-DD") }}' }}`. Note que o filtro vem sempre depois do pipe `|`.

5. Vamos voltar ao layout `post.njk` que criamos quando [configuramos o blog](/blog/como-criar-blog-11ty/), modificando a linha que contém ``<p>{{ "{{ date }}" }}</p>`` para incluir o filtro com `{{ '{{ date | date("DD-MM-YYYY") }}' }}`.

```njk
<!DOCTYPE html>
<html lang="pt-br">
<head>
  {{ '{% include "partials/head.njk" %}' }}
</head>
<body>
    <header>
      <h1><a href="/">Meu site</a> / <a href="/blog">blog</a></h1>
    </header>
    <main>
        <h2>{{ "{{ title }}" }}</h2>
        <p>{{ '{{ date | date("DD-MM-YYYY") }}' }}</p>
        <div class="blog-content">
          {{ "{{ content | safe }}" }}
        <div>
    </main>
  </div>
</body>
</html>
```

Pronto! Essa lógica do filtro pode ser aplicada em outros contextos do **11ty**. 

O próximo passo é [deixar o site bonito, usando CSS](/blog/como-adicionar-css-11ty/)

# Guia 11ty
- [Iniciando um projeto 11ty: como criar um site usando o framework](/blog/criando-site-com-11ty/)
- [Entendendo como funcionam os layouts](/blog/como-usar-layouts-11ty/)
- [Como criar um blog e listar seus posts em uma página](/blog/como-criar-blog-11ty/)
- [Adicionando paginação à lista de publicações](/blog/como-adicionar-paginacao-11ty/)
- [Como consertar o deslocamento de datas no 11ty](/blog/lidando-com-datas-11ty/)
- [Deixando o site bonito com CSS](/blog/como-adicionar-css-11ty/)
- [Como configurar um feed RSS](/blog/configurar-feed-rss-11ty/)
- [Adicionando página 404 e favicon](/blog/adicionar-pagina-404-favicon-11ty/)
- [Publicando o site usando GitHub Pages (de graça)](/blog/publicar-site-11ty-github-pages/)
- [Como configurar um domínio personalizado](/blog/como-configurar-dominio-github-pages/)

Todo o código produzido ao longo dos posts pode ser acessado [neste repositório](https://github.com/alessandrofajr/11ty-starter-blog).
