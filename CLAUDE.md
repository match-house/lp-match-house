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
- Qualquer alteração em campanha ativa (verba, lance, público, posicionamento, pausar/ativar) **exige aprovação direta do usuário antes** — nunca executar por conta própria, mesmo que pareça pequena.

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

## Rodar localmente

`npx serve -p 3456 .` (config em `.claude/launch.json`).
