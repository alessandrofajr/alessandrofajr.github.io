---
layout: post
title: "Como configurar um feed RSS em um blog 11ty (eleventy)"
permalink: /blog/configurar-feed-rss-11ty/
date: 2024-08-01
updated: 2024-08-01
tags: 
    - tech
---

Embora seja um recurso praticamente minguante na web moderna, gosto da ideia de ter um feed RSS (Rich Site Summary) para o blog. Poucas pessoas vão se inscrever? Provavelmente. Mas há quem use, e é simples de implementar no **11ty**.

Apesar da simplicidade, teve um detalhe que me custou uns bons minutos na primeira vez que tentei fazer isso: é preciso especificar a versão do [plugin de RSS](https://www.11ty.dev/docs/plugins/rss/) para evitar problemas de compatibilidade. 

A versão estável do **11ty** que estou usando nesse projeto é a 2.0.1, mas a opção mais recente do plugin de RSS do **11ty** espera que estejamos na versão 3.0.0. 

1. Por isso, o primeiro passo é instalar o plugin com o comando `npm install @11ty/eleventy-plugin-rss@1.2.0 --save-dev`;
2. Depois, volte ao arquivo `eleventy.config.js` e adicione duas linhas: uma logo no início do arquivo e outra dentro da função `eleventyConfig`:
```js
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

    eleventyConfig.addPlugin(pluginRss);

}
```
Para ser breve, não incluí o código completo com as outras funções que já foram escritas.

3. Agora, em `src`, crie um arquivo `feed.njk`. O *front matter* desse arquivo vai conter detalhes do site, enquanto a segunda parte constrói a estrutura para criar o arquivo `xml`:
```njk
---json
{
  "permalink": "feed.xml",
  "eleventyExcludeFromCollections": true,
  "metadata": {
    "title": "Blog",
    "description": "Insira uma descrição",
    "language": "pt-br",
    "url": "https://seusite.com/",
    "author": {
      "name": "Seu Nome",
      "email": "seuemail@seusite.com"
    }
  }
}
---
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:base="{{ '{{ metadata.url }}' }}">
  <title>{{ '{{ metadata.title }}' }}</title>
  <subtitle>{{ '{{ metadata.description }}' }}</subtitle>
  <link href="{{ '{{ permalink | absoluteUrl(metadata.url) }}' }}" rel="self"/>
  <link href="{{ '{{ metadata.url }}' }}"/>
  <updated>{{ '{{ collections.blog | getNewestCollectionItemDate | dateToRfc3339 }}' }}</updated>
  <id>{{ '{{ metadata.url }}' }}</id>
  <author>
    <name>{{ '{{ metadata.author.name }}' }}</name>
  </author>
  {{ '{%- for post in collections.blog | reverse %}' }}
  {{ '{%- set absolutePostUrl = post.url | absoluteUrl(metadata.url) %}' }}
  <entry>
    <title>{{ '{{ post.data.title }}' }}</title>
    <link href="{{ '{{ absolutePostUrl }}' }}"/>
    <updated>{{ '{{ post.date | dateToRfc3339 }}' }}</updated>
    <id>{{ '{{ absolutePostUrl }}' }}</id>
    <content xml:lang="{{ '{{ metadata.language }}" type="html">{{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) }}' }}</content>
  </entry>
  {{ '{%- endfor %}' }}
</feed>
```
Não vou entrar nos pormenores do que cada linha está fazendo, mas há aqui uma série de referências aos metadados que construímos no *front matter* e alguns loops para recuperar as publicações na nossa coleção de blog. 

Esse modelo, inclusive, é o [mesmo que aparece na documentação oficial do **11ty**](https://v2-0-1.11ty.dev/docs/plugins/rss/#sample-feed-templates) para a versão mais antiga do plugin de RSS.

Você pode acessar o seu feed RSS em `http://localhost:8080/feed.xml`. Geralmente é uma boa ideia incluir o link para o feed em algum canto do site, no rodapé, por exemplo. Se quiser, pode [validar o resultado no site da W3](https://validator.w3.org/feed/).

O próximo passo é [adicionar uma página 404 e favicon](/blog/adicionar-pagina-404-favicon-11ty/)

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
