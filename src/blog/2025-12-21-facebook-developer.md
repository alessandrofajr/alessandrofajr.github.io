---
layout: post
title: Tentei criar um bot no WhatsApp. A Meta me baniu antes que ele saísse do papel
permalink: /blog/facebook-meta-whatsapp-business-developer/
date: 2025-12-21
updated: 2025-12-21
tags: 
    - tech
---

*Texto que escrevi e publiquei originalmente no [Manual do Usuário](https://manualdousuario.net/whatsapp-plataforma-banido/).*

Parte da jornada de aprendizado da maioria das pessoas que começam a meter a mão em código é tentar criar projetos que, com sorte, possam virar algo útil para si e para    os outros. Em maio deste ano, quis entender melhor da API do WhatsApp: configurei meu ambiente local, loguei na plataforma de desenvolvimento da Meta e comecei a mexer aqui e ali.

Peguei um número de testes que a própria plataforma ofereceu, mandei um "Hello World" e testei alguns comandos básicos da arquitetura que estava desenhando. Poucas semanas depois, precisei deixar o projeto em stand-by.

Ao tentar retomar essa ideia há algumas semanas, me assustei com a mensagem na página de desenvolvedor da Meta: "**Não é possível acessar este serviço**. Para mais informações, consulte os Termos de Serviço da Plataforma e a Política do Desenvolvedor da Meta. Se você acha que recebeu esta mensagem por engano, envie uma solicitação de suporte."

![Mensagem de conta banida na plataforma de desenvolvimento do Facebook](/img/facebook-developers-conta-banida.png)

Clicando no link para solicitação de suporte, outra mensagem: **"Conta de desenvolvedor suspensa"** pelo "Termo da Plataforma 7.e.i.3". Eis o que diz o documento:

> Você criou ou manteve Apps para burlar, ou tentar burlar, nossas ações de monitoramento (que pode incluir a criação ou manutenção de Apps para burlar quaisquer restrições ou monitoramento que realizarmos em seus outros Apps ou conta devido a uma violação de nossos termos e políticas);

Fiquei surpreso com a mensagem porque:

1. Eu não recebi nenhum e-mail avisando sobre a suspensão ou pedindo algum ajuste;
2. Não tive nenhuma chance de entender por que meu app, em ambiente de desenvolvimento, feriu qualquer termo da plataforma.

Preenchi o tal formulário para apelar da decisão, mas ele parece levar do nada a lugar nenhum. Não existe nenhum indicativo de prazo para que alguém ou algum sistema revise o meu pedido, por exemplo. A cada dia, o formulário reabre para que eu possa enviar uma nova solicitação, com a apelo do dia anterior registrado logo abaixo.

Um dos campos no formulário pergunta: "Você fez as alterações necessárias? Explique as alterações que você fez para cumprir este Termo da Plataforma". 
A ironia é que eu nem tenho como fazer alteração alguma, já que estou trancado para fora da plataforma, e meu app está em um ambiente de desenvolvimento (ou seja, não foi publicado em lugar algum, não está disponível para absolutamente ninguém).

![Página de apelações da plataforma de desenvolvimento do Facebook](/img/facebook-developers-dispute.png)

Dezenas de outras pessoas estão nessa mesma sinuca de bico, e ninguém relata ter resolvido. É o caso do desenvolvedor João Filipe, que também teve sua conta suspensa e me contou ter enviado pelo menos 15 solicitações de revisão para a Meta. Segundo ele, a página de suporte exclui as apelações, como se ele nunca as tivesse enviado.

Filipe empreende e perdeu acesso ao aplicativo de sua empresa – embora o app continue funcionando, somente as pessoas que trabalham com ele conseguem acessar os recursos de desenvolvimento. Se não fosse por isso, ele acredita que teria perdido sua empresa. Outro efeito colateral da suspensão envolve não conseguir usar a API de Conversões para anúncios nas plataformas do Facebook e Instagram.

No Reddit, pelo menos [três](https://www.reddit.com/r/facebook/comments/1h1c79w/developer_account_suspended_no_warning_no/) [threads](https://www.reddit.com/r/WhatsappBusinessAPI/comments/1ldowzf/developer_account_suspended_for_circumvention/) [distintas](facebook_developer_account_restricted_no_review) relatam o mesmíssimo caso.

Na própria comunidade de desenvolvimento da Meta, [existem](https://developers.facebook.com/community/threads/1934177984018926/
) [vários](https://developers.facebook.com/community/threads/802106002978326/) [posts](https://developers.facebook.com/community/threads/1358539545223405/) sem nenhum retorno de algum representante da companhia há meses. Até no [LinkedIn](https://www.linkedin.com/posts/naman-jhawar-6644bb15_hello-linkedin-folks-looking-for-meta-developer-activity-7332335821955485697-m8zR/) eu encontrei relatos similares.

Mais do que a frustração de não conseguir levar adiante uma ideia, fica a sensação de impotência diante de um sistema em que nenhuma regra é clara e nenhum canal de contato existe de fato. A Meta concentra um dos principais aplicativos do país, mas oferece aos desenvolvedores o oposto de transparência. Procurei à beça alguma forma de falar com um humano, sem sucesso. 

O que era para ser uma tentativa de construir algo legal virou um lembrete de como depender da boa vontade de uma plataforma colossal como a Meta expõe uma fragilidade no ecossistema sobre o qual a internet de hoje se apoia. E um gostinho amargo de injustiça, afinal, não dá para dizer que infringi algum termo ou fiz algo de errado.

Procurei a assessoria de imprensa da Meta para um posicionamento mas não obtive nenhuma resposta.