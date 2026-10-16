// Acerta o tamanho exato da página (89,6 x 58 mm) e marca o corte (TrimBox,
// 85,6 x 54 mm) e a sangria (BleedBox). O Chrome arredonda a altura da página;
// o conteúdo fica no topo, então o excesso sai de baixo.
// Uso: node caixas.mjs [arquivo.pdf]   (padrão: cartoes-camila.pdf)
import { PDFDocument } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'fs';
const mm = v => v * 72 / 25.4;
const arq = process.argv[2] || 'cartoes-camila.pdf';
const pdf = await PDFDocument.load(readFileSync(arq));
for (const p of pdf.getPages()) {
  const { height } = p.getMediaBox();
  const W = mm(89.6), H = mm(58), y0 = height - H, b = mm(2);
  p.setMediaBox(0, y0, W, H);
  p.setCropBox(0, y0, W, H);
  p.setBleedBox(0, y0, W, H);
  p.setTrimBox(b, y0 + b, W - 2 * b, H - 2 * b);
}
writeFileSync(arq, await pdf.save());
console.log(arq);
