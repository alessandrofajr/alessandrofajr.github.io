---
layout: post
title: Meu setup no terminal zsh
permalink: /blog/setup-zsh/
date: 2025-10-25
updated: 2025-10-25
tags: 
    - tech
---

Sessões de pair coding quase sempre rendem muitos frutos, desde o entendimento de um modo de resolver determinado problema a pequenas utilidades do dia a dia. 

Num dia desses, por exemplo, notei que o Terminal do meu colega [André Martins](https://www.linkedin.com/in/andre-martins-3a9520201/) tinha funções interessantes, como um autocompletar bem esperto.

Foi assim que descobri da existência do [Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh), um framework para o terminal **zsh**. Aqui, um registro da minha configuração atual:

1. No Mac, o zsh costuma vir como o terminal padrão, mas no Linux talvez seja necessário [instalá-lo](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH);
2. Com o zsh já configurado, instalei o Oh My Zsh:
    
    ```
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    ```
3. Depois, baixei quatro plugins, responsáveis pela mágica do autocompletar e outras facilidades:
    - [autosuggesions plugin](https://github.com/zsh-users/zsh-autosuggestions)
    
    `git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions`

    - [zsh-syntax-highlighting plugin](https://github.com/zsh-users/zsh-syntax-highlighting)

    `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting`

     - [zsh-fast-syntax-highlighting plugin](https://dev.to/zeromeroz/(https://github.com/zdharma/fast-syntax-highlighting))

     `git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting`

    - [zsh-autocomplete plugin](https://github.com/marlonrichert/zsh-autocomplete)

    `git clone --depth 1 -- https://github.com/marlonrichert/zsh-autocomplete.git $ZSH_CUSTOM/plugins/zsh-autocomplete`
4. Depois de baixados, é hora de incluí-los no arquivo de configuração, rodando `nano ~/.zshrc` e editando a seção de plugins:
``` 
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
  fast-syntax-highlighting
  zsh-autocomplete
 )
```
5. Pra deixar tudo funcionando, basta reinicar o ambiente com `source ~/.zshrc`