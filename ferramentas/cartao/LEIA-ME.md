# Cartão Smart Link (NFC + QR) · Green e Blue

Fonte editável do cartão, remontada em 16/10/2026 a partir do PDF da amostra
da INMC (`original/amostra-inmc-match-house.pdf`, enviado à Vixcard em 08/10).
Os arquivos de trabalho de antes se perderam no reinício do scratchpad em 13/10.

## O que tem aqui

- `cartoes-camila.html`: as 4 faces (Green frente e verso, Blue frente e verso)
  com a Camila Duarte, a corretora fictícia do exemplo. Por isso as duas faces
  levam "EXEMPLO" e o CRECI é `00000-F`. Não trocar por corretor real sem a
  autorização dele.
- `cartoes-camila.pdf`: o PDF de impressão, em vetor, com as fontes embutidas.
- `previa-*.png`: as 4 faces a 300 dpi, só para ver.
- `qr-camila.svg`: o QR do verso, que abre
  `https://smartli.ink/camiladuarte?utm_source=qr&utm_medium=cartao`
  (conferido com leitor de QR em 16/10). O slug `camiladuarte` é reservado na
  API desde 14/10 (api #99).
- Logos (`m-branco.svg`, `m-azul.svg`, `wordmark-*.svg`, tirados do app) e
  fontes (Poppins e IBM Plex Mono, licença OFL).

## Medidas para a gráfica

- Corte: 85,6 x 54 mm (CR80). Página: 89,6 x 58 mm, com 2 mm de sangria por
  lado e sem marcas de corte. O PDF marca o corte (TrimBox) e a sangria
  (BleedBox).
- Texto e QR a pelo menos 3 mm do corte. Menor texto: 1,8 mm de corpo
  (5,1 pt), claro sobre fundo escuro, igual ao original.
- Arquivo em RGB, para a gráfica converter em CMYK. O QR é vetor e preto puro:
  imprimir só com preto (K 100%).
- Chip: o link gravado é o do Smart Link com `utm_source=nfc&utm_medium=cartao`.
  O QR impresso leva `utm_source=qr`; é assim mesmo.

## Para outro corretor

1. Copiar `cartoes-camila.html` com outro nome e trocar os campos marcados com
   `DADOS`: o nome da IA, o link, o número do cartão, o nome, a profissão e o
   CRECI. Tirar o "EXEMPLO" só se for um corretor de verdade, com a
   autorização dele.
2. `npm install`, depois `node qr.mjs <slug> qr-<slug>.svg` e apontar o
   `<img>` do verso para o arquivo novo.
3. `node render.mjs <arquivo.html>`, depois `node caixas.mjs <arquivo.pdf>`.
   Para a Camila, basta `npm run pdf`.

Níveis: Green de 1 a 4 colegas ativos (e também com 10 imóveis no ar); Blue a
partir de 5. O Partner é o Blue com "PARTNER" impresso (frente:
"MATCH HOUSE · PARTNER", "Nº 001").
