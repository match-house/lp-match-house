# Carta-berço do cartão Smart Link (luva + cartela)

Desenhada em 20/10/2026, a pedido do Mateus ("faz o desenho da luva e
cartela"), no estilo da embalagem da C6 Tag. Tudo em tamanho real (1:1), em mm.

## Para mandar à gráfica

| Arquivo | O que é |
|---|---|
| `luva-arte.pdf` | arte do lado de fora da luva, com 3 mm de sangria. Por dentro, sem impressão (4x0). |
| `luva-faca.pdf` | só as linhas da luva, no mesmo tamanho e na mesma posição da arte |
| `luva-tecnico.pdf` | desenho técnico da luva, com as medidas |
| `cartela-arte.pdf` | página 1, a frente (onde vai o cartão); página 2, o verso. Com 3 mm de sangria (4x4). |
| `cartela-faca.pdf` | só as linhas da cartela |
| `cartela-tecnico.pdf` | desenho técnico da cartela, com as medidas |
| `previa.png` | como fica montado (só para ver; não vai para impressão) |

- Corte: linha magenta cheia. Vinco (dobra): linha verde tracejada.
- Nos PDFs de arte, a TrimBox marca o corte e a BleedBox, a sangria.
- Papel: cartão de uns 300 g.

## Medidas

- **Cartão:** 85,6 x 54 mm (PVC, cantos com raio 3,18 mm), vem da Vixcard.
- **Cartela:** 100 x 184 mm, cantos com raio 2 mm.
  - O cartão fica em pé, com o lado comprido no sentido da cartela (Mateus,
    20/10: "o cartão vem no sentido longitudinal"). Fica centralizado, com o
    topo a 18 mm da borda de cima e 23 mm de cada lado.
  - Ele encaixa por 4 cortes retos a 45°, de 17 mm, um em cada canto, a 4 mm
    do canto do cartão para dentro. Sem cola.
- **Luva fechada:** 104 x 190 mm (2 mm de folga de cada lado da cartela e 6 mm
  no fundo).
  - Aberta: 223,5 x 209,5 mm. Da esquerda para a direita: frente, verso e aba
    de cola de 14 mm. O fundo é uma aba de 18 mm que dobra para dentro e cola
    no verso.
  - Vinco duplo de 1,5 mm nas dobras, para caber cartela + cartão
    (uns 1,1 mm).
  - Meia-lua de raio 13 mm na boca da frente, para puxar. Como a cartela fica
    6 mm abaixo da boca, a meia-lua mostra uns 7 mm dela.
  - Abas de cola sem tinta (a tinta da frente e do verso passa 2 mm da dobra).

## Arte: só a marca (Mateus, 20/10: "deixe minimalista somente a marca igual ao C6")

- **Luva:** azul liso (#04124d) por fora. Na frente, o logo Match House em
  branco; no verso, o M pequeno embaixo. Sem texto.
- **Cartela:** frente branca, com o cartão e o logo azul embaixo. Verso no
  azul da luva, com o M pequeno.
- Serve para o Green e para o Blue: não tem nome nem número do corretor.

## Como gerar de novo

`node gera.mjs` (as medidas ficam no objeto `M` do começo) e depois
`node png.mjs <pasta>` e `node previa.mjs <pasta>`. Os scripts usam
o `node_modules` da pasta de cima (pdf-lib) e o Playwright do ambiente.
