---
layout: post
title: "Como configurar um domínio personalizado no GitHub Pages"
permalink: /blog/como-configurar-dominio-github-pages/
date: 2024-08-08
updated: 2024-08-08
tags: 
    - tech
---

Ao hospedar um site no GitHub Pages, ganhanmos uma URL padrão até que maneirinha: `seu_usuario.github.io`. Mas domínio personalizado é mais legal.

O próprio GitHub possui uma [documentação extensiva](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) sobre isso. Aqui, pretendo documentar de uma forma mais direta o processo.

1. Registre o seu domínio. Eu usei a CloudFlare Registrar, mas existem diversas outras opções;
2. Na plataforma do Registrar escolhido, procure pela opção para realizar a configuração de DNS. O DNS é como um "mapa" que converte os endereços de IP para os nomes que acessamos. Se tiver curiosidade para entender como isso funciona, [esse vídeo](https://youtu.be/72snZctFFtA?si=r7OpZXc7RINKEthc) (em inglês) explica muito bem. Essa [página da Mozilla](https://developer.mozilla.org/pt-BR/docs/Learn/Common_questions/Web_mechanics/What_is_a_domain_name#how_does_a_dns_request_work) (em português) também é um ótimo recurso;
3. Agora, aponte os endereços de IP do GitHub Pages para o nosso domínio "apex", que é o domínio raiz, sem a parte do "www". No meu caso, é o `alessandrofajr.com`. Criei 4 regras, todas com a opção de proxy desabilitada:
    - Regra tipo `A` com o nome `@` (que no CloudFlare, pelo menos, aponta para a raiz) apontando para o endereço IPv4 185.199.110.153;
    - Regra tipo `A` com o nome `@` apontando para o endereço IPv4 185.199.111.153
    - Regra tipo `A` com o nome `@` apontando para o endereço IPv4 185.199.109.153
    - Regra tipo `A` com o nome `@` apontando para o endereço IPv4 185.199.108.153

4. Para que as pessoas qeu acessarem a versão com `www` também sejam enviadas para o site, crie outra regra, também com a opção de proxy desabilitada:
    - Regra tipo `CNAME` com o alvo para `alessandrofajr.github.io`

5. A documentação do GitHub Pages indica que preciso criar um arquivo chamado `CNAME`. Eu coloquei ele dentro da pasta `src` e, dentro dele, escrevi o meu domínio `alessandrofajr.com`;
6. Se estiver usando **11ty**, vá até o arquivo `eleventy.config.js` e adicione a linha `eleventyConfig.addPassthroughCopy("src/CNAME");`;
7. Nas configurações do repositório no GitHub, acesse a opção "Pages" no menu à esquerda, inclua o domínio no campo "Custom domain" e tique a caixinha "Enforce HTTPS".

Alguns minutos depois, o site deve estar acessível por meio do domínio. Sucesso.

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
