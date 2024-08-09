---
layout: post
title: "Como criar um blog no 11ty (eleventy)"
permalink: /blog/como-criar-blog-11ty/
date: 2024-07-26
updated: 2024-07-26
tags: 
    - tech
---

Vamos criar uma seção dedicada ao blog e entender como podemos exibir uma lista de posts.

## Criando o blog

1. Dentro de `src`, crie uma pasta chamada `blog`. Esse diretório irá funcionar como uma nova página no seu site e, portanto, será acessada em `localhost:8080/blog`;
2. Dentro de `blog`, crie um arquivo chamado `index.md`, a principal página dessa seção. Nesse arquivo vamos incluir um *front matter* e a estrutura que desejamos, além de um loop que irá recuperar cada post. Esse arquivo terá uma [referência ao layout que acabamos de criar](/blog/como-usar-layouts-11ty/):
```md
---
layout: default
title: blog
---

## Blog
<ul>
{{ '{% for post in collections.blog reversed %}' }}
<li><a href="{{post.url}}">{{ '{{ post.data.title }}'}}</a></li>
{{ '{% endfor %}'}}
</ul>
```

Estamos dizendo que, para cada post na coleção "blog", em ordem reversa, vamos listar cada um deles e recuperar a URL e o título. Por padrão, a URL será o título do arquivo que criamos, mas podemos inserir uma tag no *Front Matter* chamada *permalink* (lembre-se sempre de incluir uma barra ao final do permalink, que deve seguir uma estrutura de separação com traços: `/blog/seu-permalink/`). Podemos misturar elementos Markdown com HTML em nossos arquivos.

3. Nessa mesma pasta `blog`, adicione outros arquivos – que serão os seus posts – incluindo um nome e a extensão `.md`. Por exempo: `meu-primeiro-post.md`. Se estiver pouco inspirado, use o [Lorem Ipsum](https://loremipsum.io/). Dentro desse arquivo, você poderá escolher itens do seu *front matter*, mas neste guia manterei uma estrutura simples:
```md
---
layout: post
title: "Como criar um blog no 11ty (eleventy)"
date: 2024-07-26
---

Seu texto aqui!
```
Para o `layout`, incluí algo diferente do padrão, porque quero seguir outra estrutura de página para o conteúdo do blog. No [último post](/blog/como-usar-layouts-11ty) expliquei como eles funcionam e não vou me delongar por aqui. O código que usei para criar o layout `post.njk` foi esse:
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
        <p>{{ "{{ date }}" }}</p>
        <div class="blog-content">
          {{ "{{ content | safe }}" }}
        <div>
    </main>
  </div>
</body>
</html>
```

4. Não basta só criar a pasta e os arquivos, é preicso voltar ao arquivo `eleventy.config.js` e chamar a função `addCollection`. O arquivo vai ficar assim:
```js
module.exports = function(eleventyConfig) {

eleventyConfig.addCollection("blog", function(collection) {
    return collection.getFilteredByGlob("src/blog/*.md").filter(function(item) {
      return !item.inputPath.endsWith("index.md");
    });
  });

  eleventyConfig.addPassthroughCopy("src/img");

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
Foram adicionadas cinco linhas entre a que começa com `module.exports` e o `return {`. Criamos uma coleção filtrada pelos arquivos que estão dentro do diretório `src/blog` que contenham a extensão `.md`, com exceção de `index.md`. Aproveitei para adicionar a linha `eleventyConfig.addPassthroughCopy("src/img");` que vai permitir que adicionemos imagens aos posts (desde que elas estejam dentro da pasta `src/img`).

5. Em seu Terminal, insira o comando `npm run serve`, se não tiver feito isso anteriormente. Se já tiver feito, o site atualiza sozinho e você poderá acessar `localhost:8080/blog`;
6. Você pode voltar ao `index.md` da pasta `src` e editá-lo para incluir um link para o blog. Bastaria adicionar uma linha como `[blog](/blog)`, usando a notação do Markdown.

A essa altura, você já conseguirá ver seus posts dentro na página do blog.

O próximo passo é [adicionar paginação à lista de publicações](/blog/como-adicionar-paginacao-11ty/)

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
