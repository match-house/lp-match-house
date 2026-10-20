# Cartão Smart Link (NFC + QR) · Green e Blue

Fonte editável do cartão, remontada em 16/10/2026 a partir do PDF da amostra
da INMC (`original/amostra-inmc-match-house.pdf`, enviado à Vixcard em 08/10).
Os arquivos de trabalho de antes se perderam no reinício do scratchpad em 13/10.

## Versão 2 (19/10/2026)

A amostra impressa da Vixcard funcionou (NFC e QR), mas o Mateus achou que
"ficou muito pequeno para leitura e as cores muito escuras nao da para
diferenciar o azul do verde". No PVC os fundos da v1 saíram quase pretos.
A v2 muda:

- o mesmo verde escuro e o mesmo azul-noite da v1, mais claros: verde
  #0c5e42 a #053524 (v1: #012a1e a #00140e) e azul #0b2a8a a #04124d
  (v1: #00073e a #000318), com o brilho no canto mais forte. Um verde e um
  azul claros foram testados e recusados pelo Mateus: "nao quero tb esse
  verde e esse azul, mantenha aquele so ilumine mais.. assim nao ficou um
  alto padrão";
- texto branco ou quase branco, sem cinza escuro; logo e wordmark brancos;
- 20/10, a palavra final do Mateus: "Vamos voltar tudo para o tamanho que
  estava antes.. a cor ja vai resolver o problema. entao resumindo: so
  vamos mudar do que foi impresso de teste, a cor e a retirada da
  marcaçao do chip". Então a v2 é a amostra impressa com só duas mudanças:
  - a cor (acima), com o texto, o logo e o wordmark brancos;
  - sem o desenho do chip na frente.
  Letra, QR, marca e posições são os da amostra. As tentativas com letra e
  QR maiores (19 e 20/10) estão no commit 2bfb38c; não voltar a elas.

A v1 está em `v1/` (PDF e prévias) e no commit 1deddfa (HTML).

Amostra 2 para a Vixcard: `amostra-inmc-v2.pdf`, com a conta interna INMC
Patrimonial, como a amostra 1 (nenhum dado de corretor vai ao fornecedor).
Sai de `amostra-inmc-v2.html`, gerado a partir de `cartoes-camila.html`.

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
- Texto e QR a pelo menos 3 mm do corte. Menor texto: 1,8 mm de corpo,
  como na amostra impressa, branco sobre fundo de cor.
- Nome e link longos encolhem sozinhos até caber (`data-fit`, largura em
  mm; `data-min`, menor corpo). Se nem no mínimo couber, o `render.mjs`
  mostra "AVISO: NAO CABE".
- Número do chip: na amostra a Vixcard imprimiu o ID do chip em preto no
  verso, embaixo, onde agora ficam o link e as instruções. Se o ID precisar
  ir impresso, pedir no verso, no canto de cima à direita, em branco.
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
