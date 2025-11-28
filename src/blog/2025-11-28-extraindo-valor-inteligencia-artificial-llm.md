---
layout: post
title: Usando a IA como ajudante, não como substituta
permalink: /blog/extraindo-valor-inteligencia-artificial-llm/
date: 2025-11-28
updated: 2025-11-28
tags: 
    - tech
---

O hype da inteligência artificial é inescapável, especialmente para quem trabalha com tecnologia: novos modelos saindo a cada mês, soluções de agentes aqui e acolá, guias de uso… Correndo o risco de alimentar ainda mais a pilha de textos sobre o tema, aqui vai uma perspectiva para tirar proveito da tecnologia com mais intencionalidade e sem cair na espiral de achar que a IA vai assumir tudo amanhã de manhã.

Desde que coloquei esse site no ar, planejava adicionar um recurso para mostrar uma citação e um link do dia. Com uma massa de dados mais completa para colocar isso em prática, decidi acelerar o desenvolvimento usando IA e optei por testar o [Kiro](https://kiro.dev/), a IDE baseada em agentes da Amazon. 

Depois de ler o [artigo da Birgitta Böckeler sobre Spec-Driven-Development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html), fiquei curioso para colocar a mão na massa (ou melhor, deixar com que a ferramenta colocasse a mão na massa por mim).

Mandei o meu prompt e a IDE começou a me explicar seu plano, primeiro com um arquivo `design.md` onde montou um resumo do que seria desenvolvido, como seria feito e até um diagrama da arquitetura planejada. Em seguida, gerou um `requirements.md` com os requisitos de desenvolvimento. Por fim, criou um `tasks.md` decompondo o que precisaria ser feito.

Tudo o que eu fiz foi enviar esses 533 caracteres:

> Meu site pessoal possui uma seção de links e outra de citações. Essas seções são alimentadas por dois arquivos separados: "src/_data/links.json" e "src/_data/quotes.json". Quero adicionar, na página inicial, dois componentes: Citação do Dia e Link do Dia. A ideia é obter, a partir desses arquivos JSON, uma entrada aleatória e exibir na página inicial em caixas separadas. Quero usar uma abordagem client-side, uma vez que o meu site é estático, e realizar a atualização meia-noite no horário de Brasília sem precisar de um rebuild.

Em menos de uma hora e meia, eu tinha na versão local do meu site o que eu queria. Precisei adaptar trechos do código que estavam levando para links inexistentes e fazer ajustes visuais, mas intervi muito pouco. 

E é aqui que a coisa ganha contorno para mim: não fiquei satisfeito com a ideia de simplesmente implementar o código que me foi entregue, porque vi ali a possibilidade de aprender.

Por exemplo: para fazer a seleção do link e da citação do dia, a IA usou o que chamou de "seleção aleatória determinística" para que o mesmo link e a mesma citação aparecessem para qualquer pessoa que acessasse o site e que as seleções permanecessem inalteradas durante todo o dia – afinal, eu não tenho um banco de dados para armazenar e persistir um valor. 

O nome da técnica que a LLM cuspiu é, na verdade, relacionado com [geradores de números pseudo-aleatórios](https://en.wikipedia.org/wiki/Pseudorandom_number_generator) (PRNGs, na sigla em inglês). 

Desconhecia esse algoritmo, como ela funcionava e em quais casos era aplicado. Comecei perguntando em LLMs sobre a implementação e aprofundei minha pesquisa para validar o que foi exposto. Descobri que jogos utilizam essa técnica para gerar comportamentos aleatórios de inimigos ou NPCs e que é central na criptografia. Interessante!

Investigando com mais profundidade o que a IA está sugerindo ou implementando, posso aumentar o meu repertório. Pode custar um pouco de velocidade, mas alavanca o aprendizado. Inclusive, a partir desse entendimento, consegui encontrar um bug na implementação.

A curiosidade tem um papel fundamental para enxergar essas ferramentas como ajudantes, não como  substitutas para o que fazemos – e aposto nesse caminho para navegar essa nova era. Ressoa muito com a ideia de [trabalhar ao lado da IA e não embaixo dela](https://frankchimero.com/blog/2025/beyond-the-machine/).