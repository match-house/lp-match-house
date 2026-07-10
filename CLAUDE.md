# Match House — Landing Page (lp-match-house)

Notas do projeto para agentes. Ler antes de mexer.

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

## Rodar localmente

`npx serve -p 3456 .` (config em `.claude/launch.json`).
