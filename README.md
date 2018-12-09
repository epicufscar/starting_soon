# Starting soon

"Começando em breve" é um projeto com o objetivo de ajudar palestrantes e eventos em geral para deixar os participantes atualizados do que está acontecendo, enquanto os organizadores aguardam mais pessoas chegarem para começar o evento. A inspiração vem das live streams onde deixa-se uma imagem, geralmente com um contador, e uma música de fundo. Isso faz com que os espectadores/participantes fiquem mais animados, ansiosos e menos entediados.

## Configurações

Esta tela deve ser altamente configurável, visto que pode ser utilizada em diversos eventos de organizadores diferentes. Com isso, os organizadores são capazes de manter a mesma identidade visual do restante do evento.

### Detalhes do evento

Aqui, os organizadores podem definir informações como:
- Nome da organização
- Nome do evento
- Redes sociais
- Redes sociais (em caso de haver dois palestrantes ou organizadores)

### Contagem regressiva

Para deixar os participantes menos preocupados ou entediados, recomenda-se colocar um contador, representando quando tempo falta para o evento começar. O organizador pode então definir qual é o horário do evento ou então adicionar ao contador um respectivo tempo, para facilitar situações como "vamos esperar mais 15 minutos".

### Música

O entretenimento fica por conta da música de fundo. Para isso, o organizador pode fornecer alguma playlist ou um vídeo do YouTube e com isso, o(s) vídeo(s) fica(m) sendo reproduzido(s) até que o organizador pause-o.

### Tema

A parte mais complexa do projeto fica por conta do tema. Por outro lado, é a parte mais modular, também. Um tema é composto por um arquivo de estilo (CSS) e um arquivo de programação (JavaScript). Com eles, o tema poderá estilizar e fazer as animações necessárias para que o tema seja devidamente aplicado. Além dos temas já criados, haverá outro específico para customização, onde o organizador poderá colocar seu próprio fundo, definir o estilo das fontes e etc. Para deixar os temas mais customizáveis, mas sem perder suas essências, eles poderão prover à aplicação algumas configurações, como cores e posicionamento do player de vídeo. Para isto, é necessário que haja uma comunicação muito bem definida entre a aplicação principal e o tema.

#### Opções do tema

O tema deverá informar à aplicação quais são suas opções de customização, juntamente com um callback para que a aplicação informe ao tema os novos valores caso sejam alterados.

#### Remoção do tema

O tema deve prover uma função que remova todas as alterações que ele fez ao DOM.

## Demais funcionalidades

### Atalhos

A aplicação é amplamente manipulada por meio de atalhos, para facilitar a alteração de configurações durante o evento. Os atalhos presentes são:

Nome do atalho | Tecla padrão associada
:-: | :-:
Abrir configurações | o
Fechar configurações | Esc
Reproduzir música | Ctrl+Down
Pausar música | Ctrl+Down
Música anterior | Ctrl+Left
Próxima música | Ctrl+Right
Editar informações do evento | i
Editar contagem regressiva | c
Editar música de fundo | m
Editar tema | t
Editar atalhos | a

### Link permanente

Uma das funcionalidades previstas (#13) é a possibilidade de gerar um link permanente, para que o organizador possa configurar todas as informações, salvar o link e na hora do evento apenas abrí-lo. Um desafio a ser superado é que para o tema genérico (que serve de base para customização mais abrangente), haverão campos complexos de mais para serem codificados via URL (como por exemplo imagem de fundo em base 64).
