---
layout: post
title: "Como criar um site usando 11ty (eleventy)"
permalink: /blog/criando-site-com-11ty/
date: 2024-07-24
updated: 2024-07-24
tags: 
    - tech
---

Quando decidi criar esse site, passei um bom tempo pesquisando opções de frameworks que pudessem atender às minhas necessidades: algo fácil, flexível e leve. De cara, pulei algumas ferramentas mais robustas como [WordPress](https://wordpress.com/) e [Ghost](https://ghost.org/). Me deparei com diversas opções: [Jekyll](https://jekyllrb.com/), [Astro](https://astro.build/) (que quero testar em algum momento) e, claro, o **[11ty](https://www.11ty.dev/)**.

Optei por esse último por me parecer aquele que atendia melhor às necessidades mencionadas. Pesou a favor o fato de um site superleve que admiro ter sido desenvolvido com esse framework, a página pessoal do designer de produtos [Luke Mitchell](https://www.interroban.gg/).

Nesse post, vou explicar como dei os primeiros passos na criação do site/blog. Aqui dá ver o básico do básico e, em posts seguintes, vou detalhar outras particularidades e desafios que encontrei no desenvolvimento (veja no pé do texto os links para as etapas seguintes).

## Requisitos
O **11ty** é um gerador de sites estáticos (daqueles que não dependem de um banco de dados) escrito em JavaScript, baseado em NodeJS. 

Por isso, é preciso instalar essa ferramenta na máquina. Não é preciso saber nada sobre NodeJS para fazer um site com 11ty *(mas é bom ter uma familiaridade básica com HTML, CSS e JavaScript)*:

- Acesse o site do [NodeJS](https://nodejs.org/en/) e instale a versão LTS disponível;

## Primeiros passos
Com o NodeJS instalado, vamos iniciar o desenvolvimento:

1. Crie uma pasta para o seu projeto, preferencialmente clone um repositório do Git;
2. Abra um Terminal na pasta do seu projeto e rode o comando `npm init -y`;
3. Instale o **11ty** usando o comando `npm install @11ty/eleventy --save-dev` *(essa flag `--save-dev` serve para incluir, automaticamente, o 11ty nas dependências do projeto que são listadas no arquivo `package.json`. Se você tem alguma familiaridade com Python, é um equivalente ao `requirements.txt`. Recomendo [essa explicação, em inglês,](https://stackoverflow.com/questions/22891211/what-is-the-difference-between-save-and-save-dev) sobre a parte `-dev`)*;
4. Crie uma pasta, dentro do diretório do seu projeto, chamada `src`. Essa pasta pode ter outro nome, mas convencionalmente costuma de chamar assim;
5. Dentro de `src`, crie um arquivo chamado `index.md` e escreva qualquer coisa, como um clássico "Hello World!";
6.  Fora de `src`, no diretório raiz do seu projeto, crie um arquivo chamado `eleventy.config.js`;
7. Dentro de `eleventy.config.js`, escreva o seguinte código:
```js
module.exports = function(eleventyConfig) {

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
```
O arquivo `eleventy.config.js` é, como o próprio nome diz, um arquivo de configuração que nos permitirá adicionar e ajustar algumas funcionalidades no nosso site/blog. A documentação do **11ty** reforça que ele é opcional, mas vale a pena criá-lo desde o começo do projeto. 

O que as linhas acima estão fazendo é, basicamente, invocando a função de configuração do framework e definindo os diretórios de input e output. Quando o **11ty** roda, ele escreve os arquivos dentro dessa pasta `_site` especificada em `output` e as fornece para o servidor.

8. No diretório raiz, procure o seu arquivo `package.json` e adicione dentro da chave `scripts`, logo acima de `tests`, o trecho para que possamos passar um comando no Terminal para construir o site. Vamos incluir os atalhos para `build`, `serve` e `watch`:
```json
  "scripts": {
    "build": "eleventy",
    "serve": "eleventy --serve",
    "watch": "eleventy --watch",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

9. Agora, em seu Terminal, insira o comando `npm run serve`;
10. Acesse o endereço indicado, geralmente `localhost:8080` e *voilà*, você verá o que escreveu no `index.md`.
11. Para finalizar, vamos editar o `index.md` com o *front matter*, um bloco de metadados colocado no início do documento Markdown, cercado por três traços `---`, usado para definir informações como título, data, tags e outros dados específicos. 

```md
---
title: Meu site
---
Hello World!
```

Você pode notar que a informação colocada em `title` é aquilo que é exibido no navegador como título da página.

Vamos considerar esses os passos necessários para *criar* um site no 11ty. O próximo passo é [entender como funcionam os layouts](/blog/como-usar-layouts-11ty/).

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
