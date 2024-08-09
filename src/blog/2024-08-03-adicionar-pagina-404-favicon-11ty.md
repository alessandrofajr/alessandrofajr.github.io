---
layout: post
title: "Como adicionar página 404 e favicon a um blog no 11ty (eleventy)"
permalink: /blog/adicionar-pagina-404-favicon-11ty/
date: 2024-08-03
updated: 2024-08-03
tags: 
    - tech
---

Para encerrar os itens que considero os mais básicos para um site/blog, é uma boa ideia adicionar dois itens: um favicon (aquele ícone que aparece na barra de abas ou de favoritos do navegador) e uma página de erro 404, para quando um leitor cair em uma URL que não existe.

## Como adicionar uma página 404

Mais simples do que isso, impossível: crie um arquivo `404.md` dentro da pasta `src`. A minha eu escrevi dessa forma:

```md
---
title: Ops! Não encontrado
layout: default
permalink: 404.html
---

# 404

Parece que a página que você estava procurando não existe. Que tal voltar para a [página inicial](/)?
```

Se você acessar uma URL que não existe, a página já deve estar funcionando. É importante que o *front matter* tenha o parâmetro `permalink: 404.html` para funcionar.

## Como adicionar um favicon

Aqui, o primeiro passo é criar um favicon.

1. Usei o [Favicon.io](https://favicon.io/favicon-generator/) com um gerador por texto e coloquei um emoji. Baixe os arquivos, escolha aquele com a extensão `.ico` e cole na pasta `src`. 
2. Vá até `src/_includes/partials/head.njk` e inclua a referência ao ícone `<link rel="icon" href="/favicon.ico" sizes="any">`
3. Navegue até `eleventy.config.js` e inclua a linha `eleventyConfig.addPassthroughCopy("src/favicon.ico");`, assim como tínhamos feito com o CSS.

O próximo passo é [publicar o site usando GitHub Pages (de graça)](/blog/publicar-site-11ty-github-pages/)

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
