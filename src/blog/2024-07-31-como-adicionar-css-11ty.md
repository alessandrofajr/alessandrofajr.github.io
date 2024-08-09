---
layout: post
title: "Como adicionar CSS ao 11ty (eleventy) e deixar site estiloso"
permalink: /blog/como-adicionar-css-11ty/
date: 2024-07-31
updated: 2024-07-31
tags: 
    - tech
---

Agora que temos nosso blog bem estruturado, com alguns conteúdos já listados, vamos dar um visual básico ao site. Não irei me aprofundar no CSS - a ideia é mostrar como aplicar os estilos no **11ty**. 

Os meus objetivos serão:
- Colocar uma nova cor de fundo;
- Centralizar o conteúdo;
- Definir uma nova fonte.

1. Crie, dentro do diretório `src` um arquivo chamado `styles.css`;
2. Escolhi uma cor de fundo pastel e apliquei às tags `html` e `body`. Aproveitei também para definir uma nova fonte (no passo 3, detalho que é preciso fazer uma referência à fonte para completar a mudança da tipografia):
```css
html, body {
    background-color: #fbf5e4;
    font-family: 'Open Sans', sans-serif;
    color: #000000;
    margin: 0;
    padding: 0;
    height: 100%;
    scrollbar-gutter: stable;
}

header {
    max-width: 550px;
    width: 100%;
    margin: 10px auto;
}

main {
    max-width: 550px;
    width: 100%;
    margin: 10px auto;
    padding: 10px;
    flex: 1;
}
```

3. Somente criar esse arquivo não é o suficiente. Faça uma referência a ele no HTML. Volte ao arquivo em `src/layouts/partials/head.njk` e adicione duas linhas:
```njk
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ '{{ title }}' }}</title>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
```
Aproveite para incluir o link que faz referência à fonte escolhida para o site. Nesse caso, usei o [Google Fonts](https://fonts.google.com/selection/embed) para isso.

4. O novo visual ainda não será aplicado. Modifique o arquivo `eleventy.config.js` e adicione o método `addPassthroughCopy` dentro da função `eleventyConfig` (suprimi parte do código para simplificar):
```js
module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/styles.css");

}
```

Agora nosso site tem um visual. Tire proveito dos layouts do **11ty** para criar classes especifícas para cada página, ajustando o CSS conforme o seu gosto. No próximo post, vamos ver como [adicionar um feed RSS ao blog]((/blog/configurar-feed-rss-11ty/)).

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
