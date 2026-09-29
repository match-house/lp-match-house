# Match House — Landing Page (lp-match-house)

Notas do projeto para agentes. Ler antes de mexer.

## Fluxo de trabalho padrão (o agente faz tudo)

- O usuário **não é técnico** e espera que o agente **execute o processo inteiro**, do começo ao fim, sem pedir para ele mexer em git/GitHub.
- Priorizar sempre o caminho **mais prático e rápido**. Para uma correção/ajuste pequeno e de baixo risco:
  1. Fazer a alteração e commitar.
  2. **Levar direto para a `main`** — pode commitar/pushar na `main` (foi assim nos "publiques" anteriores) ou, se estiver numa branch, abrir o PR **e já dar o merge você mesmo**. Não deixar esperando aprovação para tarefas simples.
  3. Confirmar que a mudança chegou na `main` (é o que "publica" o site).
  4. Avisar o usuário que está no ar e lembrar do **hard refresh (Ctrl+Shift+R)** por causa do cache.
- Só parar para perguntar quando a mudança for **ambígua, grande ou arriscada** (ex.: reescrita, mudança de conteúdo/preço, algo que afete conversão). Ajuste visual/layout/cópia pequena: executar direto.
- Ao mexer em algo, **não regredir o que já estava corrigido** (ex.: não alterar a velocidade de digitação da conversa — `velocidadeDigitacao`, hoje 65ms — nem quebrar os grids responsivos de mobile).

## Deploy / Publicação (IMPORTANTE)

- O site em produção — **https://www.matchhouse.com.br** — é servido a partir da branch **`main`**.
- **Toda alteração que precisa ir ao ar tem que chegar na `main`.** Commitar só numa branch de feature NÃO muda o site publicado.
- Depois do push na `main`, se a publicação não for automática, é preciso acionar o "publish" do site para a versão nova subir.
- Cache é agressivo (principalmente favicon). Depois de publicar, testar com hard refresh (Ctrl+Shift+R).

## Estrutura

- `index.html` — LP principal (a que está no ar). É um "design doc" (`<x-dc>` + `support.js`); o `<helmet>` é processado por JS.
- `concept-a/b/c/d.html` — rascunhos de conceito, não são a página publicada.
- `diagnostico/`, `politica-de-privacidade.html` — páginas auxiliares.
- `favicon.png` — o "M" da marca (64×64). `logo.png`, `assets/logo-*.png` — logos.

## Favicon / aba do navegador

- Favicon e `<title>` devem ficar no **`<head>` estático real** (linhas do topo do arquivo, antes de `<script src="./support.js">`), **não** dentro do `<helmet>`.
  - Motivo: o `<helmet>` só injeta as tags via JS depois do load, e o navegador não atualiza o favicon de forma confiável nesse caso.
- Padrão usado no `index.html`:
  ```html
  <title>Match House · Smart Link para Bio de Corretores de Imóveis</title>
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="apple-touch-icon" href="favicon.png">
  ```

## Meta Ads — regras fixas do usuário

- **NUNCA ligar a expansão de público (Advantage+ audience / `advantage_audience`)** em nenhum conjunto de anúncios. Decisão explícita do usuário em 17/08/2026: a segmentação é sempre manual. Não propor de novo, não ligar "para testar".
- **Não renomear o evento `Lead`** do pixel (1159381878670820) — a campanha otimiza por ele e renomear zera o aprendizado (aviso também no `tracking.js`).
- **Autonomia desde 29/09**, nas palavras do Mateus: "te dei autonomia no MCP para controlar a campanha, distribuir recursos, alterar LP, fazer novos criativos". Com dois limites que ele escolheu no mesmo dia:
  - **Teto de R$ 125/dia no Meta** somando as campanhas (hoje LP R$ 50 + app R$ 75). Redistribuir entre campanhas e anúncios pode; passar do total, não.
  - **Só UMA conversa mexe na campanha, na LP e nos criativos**: a sessão `session_01AcwN8eqkNLzNHMM46binBv`. Se você é outra conversa, não pause, não ligue, não crie anúncio e não mude verba; leia os números e, se achar que algo precisa mudar, diga ao Mateus. Em 28/09 duas conversas mexeram ao mesmo tempo (7a e 7b pausados, 10g e 10a criados, pausa das 23h13 perdida) e uma não sabia o que a outra tinha feito.
- Toda mudança feita com essa autonomia sai no relatório diário com o motivo e o número que a justificou.
- Pausa noturna: os dois conjuntos param às 23h13 e voltam às 07h13 (Brasília). Desde 29/09 isso é feito por rotina desta conversa, porque a regra automática do Meta parou de funcionar em 28/09 e o MCP não mexe em regras.
- Google Ads não está conectado no MCP: dá para ler (via GA4), não para mudar.

## Contas de teste e internas — fora de qualquer número (confirmado em 29/09)

Tirar do funil, dos relatórios e de custo por cadastro (id_user):

- Testes: 1011, 1014, 1033, 1095, 1096.
- Internas: 980 (Leo Zeferino, equipe), 941 (testematheus), 937 (e-mail
  @matchhouse), 999 (INMC Patrimonial, conta própria).
- Ainda não confirmadas: 955 e 993. Perguntar uma vez, sem insistir.

Em 29/09 um relatório de funil saiu sem tirar 1014, 1033, 1095 e 1096: deu
161 cadastros de julho a setembro em vez de 157.

## Backoffice da API — como ler

`https://api.matchhouse.com.br/backoffice/...` responde nas sessões do
ambiente Default: a credencial "Backoffice Match House" do ambiente põe o
cabeçalho `x-backoffice-token` sozinho. Não peça o token e não o escreva em
lugar nenhum. As rotas estão em `api/src/modules/backoffice/*.controller.ts`.
Leitura é livre; `POST /backoffice/messages/send` só com o "pode" do Mateus
para aquela mensagem.

## Limite de imóveis no ar: 100 (desde 29/09/2026)

- Em 29/09, às 10h29, o Mateus subiu para 100 o limite do plano de entrada
  (id 1), que é o plano que todo cadastro recebe. Antes era 30, segundo a ata
  de 23/07; o banco não guarda o valor antigo. A API lê o limite do plano na
  hora de publicar, então os 100 valem para contas antigas e novas desse plano.
- Em tudo que vai para cliente (LP, mensagens, modelos, roteiros de venda):
  "até 100 imóveis no ar". Não escrever mais 30.
- Exceção: quem ainda paga um plano antigo, já desativado, fica com o número
  daquele plano até a assinatura acabar (10, 25, 30, 50 ou 60). Se um
  corretor disser que travou antes de 100, é isso: confirmar com o Mateus
  antes de responder.
- Achado de 29/09: publicar pelo app.smartli.ink hoje não confere o limite
  (a mutation enableProperty da API liga o anúncio sem checar). Corrigir é
  decisão do Mateus, porque passa a barrar quem está em plano menor.

## Custos da empresa — o que não entra mais

- **Globalsys (House027) é passado** (Mateus, 29/09): não existe mais esse
  custo. Não somar em custo mensal, ponto de equilíbrio, CAC nem projeção, e
  não citar nem como "saindo". Já saiu da área de custos.

## Planos por lead qualificado (decidido pelo Mateus em 29/09, ainda não lançado)

- Cobra-se pelos leads que a IA qualifica (nome + celular), não por imóvel.
  Imóvel fica em até 100 em todos os planos: são os imóveis que enchem as
  páginas públicas que trazem outros corretores.
- **Plano de entrada, sem cobrança:** link, até 100 imóveis, IA atendendo e
  os **3 primeiros leads do mês** com nome e celular à mostra. Do 4º em
  diante a IA continua atendendo (o cliente do corretor nunca fica sem
  resposta); só o contato fica bloqueado até assinar.
- **Pro, R$ 147/mês:** até **30 leads qualificados** por mês e 100 imóveis.
- Ordem: primeiro contar os leads direito (conserto na API, 29/09), medir 30
  dias de leads por corretor, depois ligar a cobrança. Nada de preço na LP
  nem em mensagem para corretor até o Mateus liberar.
- Nunca escrever "gratuito" ou "grátis": é "plano de entrada".

## Falar com corretor — que link mandar (regras de 24/09)

Errei os três na mesma manhã. Ficam escritas para não repetir.

- **Nunca mandar `matchhouse.co` para corretor.** A vitrine é a listagem geral,
  não é onde ele conserta nada e não é o que ele deve receber. Para corrigir um
  imóvel, o link é `app.smartli.ink/dashboard/imoveis/<id>/editar`, que abre
  direto na tela de edição daquele imóvel.
- **O primeiro link da mensagem é o que vira o card do WhatsApp.** Se a
  mensagem começa por `app.smartli.ink`, o preview sai como "Crie seu Smart
  Link" — o card de captação, mostrado para quem já é cliente. Então o link
  público do corretor (`smartli.ink/<slug>`) vem **antes** do link do painel:
  aí o card é o dele, com a foto e a IA dele. Confirmado na prática em 24/09.
- **"Crie seu Smart Link" no perfil do corretor NÃO se tira.** A página de um
  corretor é vista por outros corretores e é a porta de entrada mais barata que
  existe — decisão do Mateus: "o objetivo é que outros corretores vejam e
  baixem". Ela leva ao cadastro, marcada com `utm_source=smartli.ink` e
  `utm_content=perfil-<slug>`, que é como se sabe qual corretor trouxe quem.
- Telefone e e-mail de corretor saem do `contatos-ativacao-ACUMULADO.csv` no
  Drive; imóvel, valor e corretor saem do `vitrine-imoveis-ACUMULADO.csv`, que
  o export diário atualiza sozinho. Não levantar isso a print de novo.
- A esteira de ativação manda **um e-mail por corretor por dia, 8h–21h**.
  Disparo manual no mesmo dia pode dobrar na caixa de alguém.

## Como entregar mensagem pronta para o Mateus (regra dele, 24/09)

- **Toda mensagem que ele vai enviar — WhatsApp, e-mail, chamado — sai em
  BLOCO DE CÓDIGO (crase tripla) aqui no chat.** É o bloco de código que faz o
  app desenhar o ícone de copiar; citação com `>` NÃO desenha, e foi
  exatamente o que ele cobrou em 24/09: "cadê o ícone de copiar que te pedi?".
  Nada de texto solto e nada de citação para mensagem que ele vai mandar.
- Pedido original: "sempre que me mandar uma mensagem deixar o botão de copiar
  me ajuda muito". Selecionar texto à mão no celular, no meio de dez conversas
  abertas, trava o trabalho dele.
- O formato que funcionou em 24/09 é um artifact: um cartão por destinatário,
  com nome, o que está errado, a mensagem inteira visível, botão "Copiar" e,
  quando for WhatsApp, um botão verde que abre a conversa da pessoa já com o
  texto dentro (`https://wa.me/55DDDNUMERO?text=` + texto codificado).
- Telefone e e-mail saem do `contatos-ativacao-ACUMULADO.csv` no Drive.

## Mensagens de ajuda do app — elas dizem onde a pessoa travou

`SUPPORT_MESSAGES` em `app/src/constants.ts` preenche o WhatsApp com uma frase
escrita na voz da PESSOA, diferente por passo. Quem recebe sabe onde ela está
sem precisar perguntar:

| Frase que chega | Onde ela travou |
|---|---|
| "Estou criando meu Smart Link…" | primeira tela, criando a conta |
| "Estou no passo do código por SMS…" | verificação por SMS |
| "Estou escolhendo o meu link…" | escolhendo o slug |
| "Meu telefone já está em outra conta…" | conta duplicada |
| "Caí num link do Match House que não abre…" | link quebrado |

O clique é medido como `support_click` (com `step`) no Amplitude.

## Rodar localmente

`npx serve -p 3456 .` (config em `.claude/launch.json`).
