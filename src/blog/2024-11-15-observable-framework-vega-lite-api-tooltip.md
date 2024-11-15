---
layout: post
title: "Como ativar a API de tooltip do Vega-Lite no Observable Framework"
permalink: /blog/observable-framework-vega-lite-api-tooltip/
date: 2024-11-15
updated: 2024-11-15
tags: 
    - tech
---

Tenho usado o [Observable Framework](https://observablehq.com/framework/) para criar dashboards na [Belo](https://belo.re/). Gostei da ferramenta pela autonomia: por ser baseada em código, em vez de interfaces de arrastar e soltar, como a maioria dos softwares de Business Intelligence, tenho muito mais controle.

A curva de aprendizagem não é muito íngreme, mas há alguns detalhes que não constam na documentação do projeto. O [plugin de tooltip](https://vega.github.io/vega-lite/docs/tooltip.html#plugin) do [Vega-Lite](https://vega.github.io/vega-lite/), por exemplo, não vem ativo por padrão e não basta importar a biblioteca correspondente. 

**É preciso instanciar o manipulador de tooltip e associá-lo à visualização para que ela funcione corretamente**. Caso contrário, elas ficam dependentes das caixas de diálogo do navegador, que demoram muito para aparecer.

Essas são as importações:

```js
import * as vega from "npm:vega";
import * as vegaLite from "npm:vega-lite";
import * as vegaLiteApi from "npm:vega-lite-api";
import * as vegaTooltip from "npm:vega-tooltip";
```

E aqui a chamada para que a tooltip passe a funcionar:

```js
const vl = vegaLiteApi.register(vega, vegaLite, {
  init: (view) => {
    view.tooltip(new vegaTooltip.Handler().call);
    if (view.container()) view.container().style["overflow-x"] = "auto";
  }
});
```

[Este link](https://observablehq.observablehq.cloud/pangea/party/vega-lite-tooltips) contém um exemplo ao vivo, que foi o que me ajudou a resolver o problema. 