---
layout: post
title: "Como adicionar paginação a um blog no 11ty (eleventy)"
permalink: /blog/como-adicionar-paginacao-11ty/
date: 2024-07-27
updated: 2024-07-27
tags: 
    - tech
---

Com a [seção do nosso blog pronta](/blog/como-criar-blog-11ty/), a tendência é que a lista a lista de publicações fique extensa com o passar do tempo. O **11ty** tem uma solução de paginação integrada que é muito simples de implementar.

1. Volte ao arquivo `blog/index.md` e altere o *front matter*:
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
```
Ao incluir a especificação de `pagination`, apontamos para uma coleção de dados do blog, o tamanho da página, definimos que queremos ordenar essa coleção de trás para frente e um sinônimo.

2. É preciso alterar outro trecho do `blog/index.md`, modificando o loop que criamos anteriormente, pedindo para que o código recupere cada post a partir dos itens de paginação. Além disso, adicione links para permitir a navegação. O arquivo completo ficará assim:
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
<li><a href="">{{ '{{ post.data.title }}' }}</a></li>
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
O código dentro das tags `<nav>` possuem uma condicional para exibir os links de "próxima página" e "página anterior" somente se esses links existirem. Dessa forma, evitamos de criar um link que não leva para lugar nenhum.

Crie alguns posts para testar a paginação e brinque com o tamanho da paginação. Dois passos bem simples. 

O próximo passo é [entender o deslocamento de datas no 11ty](/blog/lidando-com-datas-11ty/)

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
