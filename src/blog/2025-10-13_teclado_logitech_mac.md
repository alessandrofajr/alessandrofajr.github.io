---
layout: post
title: Como eu fiz o teclado Logitech parar de trocar os acentos ` e ~ por § e ± no Mac
permalink: /blog/teclado-logitech-mac/
date: 2025-10-14
updated: 2025-10-14
tags: 
    - tech
---

Comprei um teclado sem fio da Logitech para alternar entre um notebook Windows e um Mac via Bluetooth, em vez de precisar trocar o dongle USB de um pro outro – parecia que eu tava preso a um cabo, no final das contas.

A caixa do Logitech K950 indica o layout "US INTL", padrão que eu estou habituado. Foi bem tranquilo de conectar no Windows: pareei o Bluetooth e indiquei o layout americano… Sucesso.

Quando fui fazer o mesmo no Mac, começou a dor de cabeça. Por mais que eu selecionasse o layout "US INTL", a tecla abaixo do ESC cuspia os símbolos § (parágrafo) e ± (sinal de mais ou menos), em vez dos esperados ` (crase) e ~ (til). 

Para usar os acentos, eu precisava recorrer à tecla que fica entre o Shift e o Z. Se eu tivesse que reprogramar a minha mente toda vez que mudasse de computador, o esforço de ter um teclado para alternar entre os computadores seria em vão.

Tentei mudar o tipo de teclado nos Ajustes do Mac para ANSI, ISO, colocar outros idiomas de entrada, fiz de tudo. Estava quase cedendo a um app chamado Karabiner, mas não queria ter mais um processo rodando no plano de fundo, mais um software para manter atualizado. Sem contar que eu não estava confortável em conceder várias permissões pro app registrar cada tecla apertada. 

Encontrar a solução foi complicado: o negócio só começou a clarear quando pesquisei as palavras-chave `grave_accent_and_tilde` (tecla dos acentos de crase e tio) e `non_us_backslash` (tecla da barra invertida). Depois de bater cabeça, [esse post](https://lazycoder.ro/posts/remapping-tilde-macos-logitech-keyboard/) do desenvolvedor Gabriel Martin me salvou. Fiz um pequeno ajuste e fiquei bem satisfeito.

## Como resolvi essa treta

Por meio da ferramenta hideutil, via Terminal, é possível remapear as teclas. Então, troquei a saída da tecla logo abaixo do ESC pela que está ao lado do Shift. 

É só rodar isso aqui no Terminal:

```
#!/bin/zsh

CURRENT_MAPPING=$(hidutil property --get "UserKeyMapping")

if [[ $CURRENT_MAPPING == *"HIDKeyboardModifierMappingDst"* ]]; then
    hidutil property --set '{"UserKeyMapping":[]}'
else
    hidutil property --set '{"UserKeyMapping": [{"HIDKeyboardModifierMappingSrc": 0x700000064, "HIDKeyboardModifierMappingDst": 0x700000035}, {"HIDKeyboardModifierMappingSrc": 0x700000035, "HIDKeyboardModifierMappingDst": 0x700000064}]}'
fi
```

Funciona como um interruptor, você faz e desfaz o mapeamento rodando o script.

Ter que colar esse código toda vez que o computador reiniciasse ou que eu precisasse desfazer o remapeamento para usar o teclado nativo do Macbook não me pareceu ideal. 

O próprio Gabriel dá o caminho das pedras: usar o Automator para configurar um atalho. Eu não reproduzi a ideia dele, mas acho que a minha solução ficou ótima para o meu caso:

- Abri o **Automator**;
- Escolhi o tipo "Aplicativo";
- No painel da esquerda, pesquisei por **“Executar Script Shell”**;
- Na caixa de script que se abriu, colei o código abaixo (ele está ligeiramente modificado em relação à versão acima porque adicionei uma notificação para me certificar que rodou):
```
#!/bin/zsh

CURRENT_MAPPING=$(hidutil property --get "UserKeyMapping")

if [[ $CURRENT_MAPPING == *"HIDKeyboardModifierMappingDst"* ]]; then
    hidutil property --set '{"UserKeyMapping":[]}'
    osascript -e 'display notification "Remapeamento desativado" with title "Remap"'
else
    hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000064,"HIDKeyboardModifierMappingDst":0x700000035},{"HIDKeyboardModifierMappingSrc":0x700000035,"HIDKeyboardModifierMappingDst":0x700000064}]}'
    osascript -e 'display notification "Remapeamento ativado" with title "Remap"'
fi
```
- Salvei o app resultante na minha pasta de Documentos como `RemapTeclas.app`;
- Sempre que preciso alternar esse mapeamento, seja por que vou usar o notebook sem o teclado externo ou por que reiniciei o computador, abro esse arquivo.

Pensei em ver alguma forma de colocar esse app na barra de menus, mas deixei pra lá por enquanto. Parece que tem como fazer usando algo como [xbar](https://xbarapp.com/).

Ah, e dá para adaptar o script para remapear outras teclas. [Esse site](https://hidutil-generator.netlify.app/) te ajuda a pegar os códigos.