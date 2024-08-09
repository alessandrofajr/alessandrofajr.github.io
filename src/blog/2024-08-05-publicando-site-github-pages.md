---
layout: post
title: "Como publicar site 11ty (eleventy) no GitHub Pages"
permalink: /blog/publicar-site-11ty-github-pages/
date: 2024-08-05
updated: 2024-08-05
tags: 
    - tech
---

Com o site criado, chegou a hora de colocá-lo no ar. Eu escolhi o GitHub Pages e achei o processo relativamente fácil. Digo "relativamente" porque precisei superar alguns obstáculos, fazer vários testes e entender o que estava acontecendo por de trás dos panos. 

O que quero dizer aqui é que: é fácil, depois que pega a manha. E acho que expliquei direitinho nesse post.

Existem duas opções: usar ou não o GitHub Actions. Se você optar por essa ferramenta, vai dar um pouco mais de trabalho agora e ficará mais fácil conforme você decidir atualizar o site.

## Colocando o site no ar usando GitHub Pages + GitHub Actions

1. Crie seu repositório no GitHub. Eu escolhi fazer no repositório com `alessandrofajr.github.io`, que permite acessar o site nesse mesmo endereço, sem precisar acessar especificando um diretório (ex: `alessandrofajr.github.io/nome_do_repo`). 

Se você ainda não está familiarizado com o GitHub Pages, vale a pena dar uma [lida rápida na documentação](https://docs.github.com/pt/pages/getting-started-with-github-pages/creating-a-github-pages-site). De forma muito direta, o repositório precisa ser chamado `<seu_nome_de_usuário>.github.io`;

2. Caso você tenha iniciado o projeto **11ty** em outro repositório, é preciso mesclá-los. Aqui tem um [guia de como fazer isso](https://horadecodar.com.br/como-fazer-o-merge-de-dois-repositorios-em-git/).
3. É necessário sinalizar para o GitHub Pages que não estamos criando um projeto com o [framework Jekyll](https://jekyllrb.com/). Basta criar, no diretório raiz do repositório, um arquivo chamado `.nojekyll`, sem nada escrito nele;
4. Hora de criar o workflow do GitHub Actions, responsável por instalar as dependências no lado do GitHub. No diretório raiz do repositório, crie uma pasta chamada `.github` (com ponto e tudo) e, dentro dela, crie outra pasta chamada `workflows`;
5. Dentro de `.github/workflows`, crie um arquivo chamado `eleventy_build.yml`, com o seguinte conteúdo:
```yml
name: Eleventy Build

on:
  push:
    branches:
      - main
      
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: '20.15.1'

      - run: npm ci

      - run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```
Esse arquivo diz ao GitHub Actions para que, quando houver um push para a branch `main`, ele deve instalar o NodeJS, rodar o comando `npm ci` que instala as dependências definidas no arquivo `package-lock.json` e, em seguida, rodar o comando `npm run build` para criar o site. Ele usa uma espécie de pacote específico chamado `actions-gh_pages` para abstrair parte desse deploy e permitir a criação de uma branch chamada `gh_pages`.

Parte importante desse arquivo YML está no trecho `github_token: ${{ secrets.GITHUB_TOKEN }}`. Precisamos dessa chave para permitir que, ao realizar o deploy, o GitHub Actions possa escrever os conteúdos na branch `gh_pages`. 

6. Gere as chaves para fazer o deploy, conforme a [documentação](https://github.com/peaceiris/actions-gh-pages/tree/main?tab=readme-ov-file#%EF%B8%8F-create-ssh-deploy-key) do `actions-gh-pages`:
    1. Abra o seu Terminal e rode o comando `ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""`. Troque o trecho `email` pelo seu email cadastrado no GitHub. Ao rodar isso, você deve ver que duas chaves foram geradas, uma pública e uma privada;
    2. Copie a chave pública com o comando `cat gh-pages.pub | pbcopy` (isso vale para Linux e macOS, a linha de comando no Windows provavelmente é outra);
    3. Vá até o seu repositório do GitHub, clique em "Settings" > "Deploy Keys" > "Add deploy key". Dê um nome a essa chave, cole o conteúdo e salve, marcando a caixinha "Allow write access";
    4. Agora, copie a chave privada com o comando `cat gh-pages | pbcopy`;
    5. Nas configurações do repositório, escolha "Secrets and Variables" > "Actions" > "New repository secret". Dê o nome de `ACTIONS_DEPLOY_KEY` e cole a chave.

7. Agora é só fazer commit das alterações e um push para a branch `main` do repositório. Eu costumo fazer todo o desenvolvimento em uma branch `dev` e abrir um Pull Request para mesclar com a `main`. 
8. Assim que `main` receber um push, o GitHub Actions vai entrar em ação. Depois de alguns segundos, você pode atualizar o seu repositório e procurar pela branch `gh-pages` que será criada automaticamente. Nela, deverá encontrar todo o conteúdo do site que foi construído (são os mesmos arquivos que aparecem na pasta `_site` localmente).
9. Se você acessar a URL do seu GitHub Pages e o site não estiver no ar, vá até "Settings" no repositório, procure por "Pages" no menu lateral e escolha "Deploy from a branch" na opção "Source". Logo abaixo, escolha a branch "gh-pages" e a pasta "/(root)". Salve e espere alguns segundos (tive uma certa dor de cabeça nessa etapa e, em algum momento, troquei a branch e a pasta para que essas alterações pegassem no tranco).

![Opção para fazer deploy no GitHub Pages](/img/gh-pages-deploy.png)

Seu site deve estar disponível na web! O que essa configuração toda está fazendo é automatizar o *build* do site, escrevendo os arquivos no repositório `gh-pages` sempre que fazemos um push para `main`. Por de trás dos panos, o GitHub Pages faz o *deploy*, publicando nosso site na internet. Demorou um tempo para eu entender essa segunda parte e bati cabeça tentando deixar a opção "GitHub Actions" marcada no menu da imagem acima.

**Uma dica importante:** se você estiver usando o parâmetro `permalink` no seu *front matter*, certifique-se se colocar uma `/` ao final do link. Do contrário, ao clicar para abrir um post, o navegador irá pedir para baixar um arquivo em vez de acessar a página. Isso porque o **11ty** não vai entender que é para gerar uma página HTML se não houver a barra no final.

## Colocando o site no ar sem o GitHub Actions

A primeira vez que coloquei o meu site no ar, consegui fazê-lo sem depender do GitHub Actions (ainda que eu tenha feito isso sem querer). Os primeiros passos são os mesmos:

1. Crie o repositório no GitHub (leia acima para saber como utilizar uma URL `usuario.github.io`);
2. Mescle com o repositório que você estava usando para o desenvolvimento, caso seja necessário;
3. Crie, na raiz do projeto, um arquivo chamado `.nojekyll`, sem nada escrito nele;
4. Aqui o processo muda: vá até o arquivo `eleventy.config.js` e mude a linha `output: "docs"`, trocando `"_site` por `"docs"`;
5. Feito isso, rode **localmente** o comando `npm run build`, o que irá construir a pasta `docs` no diretório raiz;
6. Adicione a pasta `docs` usando `git add docs` e faça o commit para `main`;
7. Vá até as Configurações do repositório, navegue até "Pages" e escolha "Deploy from a branch" na opção "Source". Logo abaixo, escolha a branch "main" e a pasta "/docs". Salve e espere alguns segundos. Essa é a mesma opção indicada na imagem acima. Em alguns segundos o seu site deve estar no ar.

O pulo do gato nesse método é que, toda vez que você quiser publicar algum conteúdo ou atualizar o site, é preciso fazer o build **localmente** e enviar as modificações para o GitHub na sequência. O GitHub Actions, por sua vez, cuida do build sozinho.

O próximo passo é [configurar um domínio personalizado](/blog/como-configurar-dominio-github-pages/)

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
