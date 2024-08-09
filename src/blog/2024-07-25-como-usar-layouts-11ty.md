---
layout: post
title: "Entendendo como usar layouts no 11ty (eleventy)"
permalink: /blog/como-usar-layouts-11ty/
date: 2024-07-25
updated: 2024-07-25
tags: 
    - tech
---

No último post, descrevi como [iniciar o projeto com **11ty**](/blog/criando-site-com-11ty/) e acessar o site pela primeira vez. Agora, vou dar um exemplo sobre como criar uma estrutura básica com uma página inicial e seção dedicada ao blog, com listagem de posts. 

Aqui, as coisas começam a ficar mais interessantes porque vamos começar a entender como o **11ty** funciona em termos de estrutura e visualizar algumas das suas capacidades. Assim como boa parte dos frameworks para criação de sites estáticos, o **11ty** converte automaticamente os arquivos Markdown *(.md)* para HTML. 

Mas ele vai além: é possível usar diversas linguagens de template para construir o site. A documentação lista 11 linguagens diferentes (daí o nome), que podem ser empregadas em conjunto. A documentação oficial costuma dar exemplos com Nunjucks *(.nkj)*, que é a que eu vou descrever nos exemplos abaixo. Vale a pena dar uma passadinha na [documentação própria do Nunjucks](https://mozilla.github.io/nunjucks/).

Com esses arquivos, conseguimos criar módulos reaproveitáveis para o nosso site. Imagine o cenário: em todo o meu projeto, o cabeçalho e o rodapé vão se repetir. Se eu precisar copiar e colar o código desses elementos em cada página que eu for criar, vai dar um trabalhão. Se eu quiser editar esses elementos no futuro, a dor de cabeça de multiplica.

Por isso, criamos layouts modulares que podem ser facilmente integrados pelo framework. Mão na massa:

## Criando a estrutura de layouts

1. No diretório do seu projeto, dentro de `src`, crie outra pasta chamada `_includes` (com underline mesmo). Os nomes das pastas que descrevo ao longo desse guia são convenções;
2. Dentro de `_includes`, crie mais duas pastas: uma chamada `layouts` e outra chamada `partials`;
3. Agora, crie um arquivo chamado `default.njk` dentro de `layouts`. Esse arquivo terá o esqueleto base do HTML do site:

```njk
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ "{{ title }}" }}</title>
</head>
  <body>
    <header>
      <h1><a href="/">Meu site</a></h1>
    </header>
    <main>
      {{ "{{ content | safe }}" }}
    </main>
  </body>
</html>
``` 
A gente põe os elementos com duas chaves, como se fôssemos chamar variáveis. É assim que o **11ty** vai puxar o título do seu arquivo Markdown e o conteúdo. Para esse layout funcionar precisamos fazer outras **duas coisas**.

4. Abra o seu arquivo `eleventy.config.js` e o edite incluindo as linhas `includes: "_includes",` e `layouts: "_includes/layouts"`:
```js
module.exports = function(eleventyConfig) {

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
Isso fará com que o nosso framework saiba onde procurar os diretórios que criamos e os respectivos layouts. Para isso fazer sentido, precisamos indicar o layout a ser utilizado.

5. Volte ao `index.md` e no *front matter*, adicione mais uma especificação com a linha `layout: default`:
```md
---
title: Meu site
layout: default
---
Hello World!
```
Agora, a página inicial do nosso site herda o layout que criamos. Como falei, uma das coisas interessantes do **11ty** é a capacidade de construir o site de forma modular. Vamos colocar isso em prática.

6. Dentro da pasta `partials`, crie um arquivo `head.njk` e inclua o trecho da tag `<head>`que escrevemos template padrão:
```njk
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ "{{ title }}" }}</title>
```

7. Volte ao arquivo `default.njk` e substitua o conteúdo que está dentro das tags `<head> </head>` por `{{ '{% include "partials/head.njk" %}' }}`. Ficará assim:
```njk
<!DOCTYPE html>
<html lang="pt-br">
<head>
  {{ '{% include "partials/head.njk" %}' }}
</head>
  <body>
    <header>
      <h1><a href="/">Meu site</a></h1>
    </header>
    <main>
      {{ "{{ content | safe }}" }}
    </main>
  </body>
</html>
```
A vantagem de fazer isso é que, sempre que você precisar adicionar algo dentro do seu header, como incluir a [referência para o seu CSS](blog/como-adicionar-css-11ty/), para o seu [favicon](/blog/adicionar-pagina-404-favicon-11ty/) ou para uma fonte específica, basta editar o arquivo `head.njk` para refletir a alteração em todos os seus layouts (para além do default, já que criaremos outros adiante).

O próximo passo é [como criar um blog e listar seus posts em uma página](/blog/como-criar-blog-11ty/)

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
