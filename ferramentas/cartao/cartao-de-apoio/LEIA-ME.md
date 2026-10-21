# Cartão de apoio do cartão Smart Link (10 x 15 cm)

Desenhado em 21/10/2026, depois do orçamento 008358 da Alphagraphics
(envelope com faca e colagem a R$ 25,52 em 100 unidades). Mateus: "achei o
valor muito alto, pesquise uma alternativa". É a versão simples da
carta-berço (`../carta-berco/`): sem faca, sem colagem e sem luva.

## O kit

1. **Cartão de apoio**, 100 x 150 mm, corte reto, couché 300 g, 4x4. Serve
   para o Green e para o Blue: não tem nome nem número do corretor, então
   pode ser impresso em quantidade e guardado.
2. **Cartão de PVC** (Vixcard), em pé, preso por **2 pontos de cola
   removível** de 10 mm, como nas cartas de banco. Ele sai sem marcar.
3. **Envelope carta** de 11,4 x 16,2 cm (por exemplo, o colorido da Scrity,
   pacote de 100). Sobra uns 7 mm de cada lado.
4. Opcional: adesivo redondo com o M para fechar.

Vai como carta registrada pelos Correios.

## Arte

- **Frente:** igual à cartela de 20/10 (Mateus: "deixe minimalista somente a
  marca igual ao C6"): branca, o lugar do cartão em cinza bem claro e o logo
  azul embaixo.
- **Verso:** no azul da luva (#04124d), "Seu cartão Smart Link chegou." e
  o como usar em 3 passos (aproximar do celular; topo do iPhone, meio das
  costas no Android; a câmera lê o QR), o convite da bio e o M.
- Se quiser baratear, o verso pode sair sem impressão (4x0): só a página 1
  do `apoio-arte.pdf`.

## Arquivos

| Arquivo | O que é |
|---|---|
| `apoio-arte.pdf` | página 1, a frente; página 2, o verso. 106 x 156 mm, com 3 mm de sangria (TrimBox e BleedBox marcadas) |
| `apoio-montagem.pdf` | onde vai o cartão e os 2 pontos de cola, com as medidas (para quem monta) |
| `previa-frente-blue.png`, `previa-frente-green.png`, `previa-verso.png` | como fica (só para ver) |

## Como gerar de novo

`node apoio.mjs` nesta pasta (as medidas ficam no objeto `M`). Usa o
`pdf-lib` e as fontes e logos da pasta de cima, e o Playwright do ambiente.
