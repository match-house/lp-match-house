// QR do verso, em vetor e preto puro, com módulos preenchidos (sem traço),
// para a gráfica imprimir só com K 100%.
// Uso: node qr.mjs <slug> [arquivo.svg]   (padrão: camiladuarte -> qr-camila.svg)
import QR from 'qrcode';
import { writeFileSync } from 'fs';
const slug = process.argv[2] || 'camiladuarte';
const saida = process.argv[3] || (slug === 'camiladuarte' ? 'qr-camila.svg' : `qr-${slug}.svg`);
const url = `https://smartli.ink/${slug}?utm_source=qr&utm_medium=cartao`;
const { modules } = QR.create(url, { errorCorrectionLevel: 'M' });
const n = modules.size;
let d = '';
for (let y = 0; y < n; y++) {
  let x = 0;
  while (x < n) {
    if (!modules.get(y, x)) { x++; continue; }
    let w = 0;
    while (x + w < n && modules.get(y, x + w)) w++;
    d += `M${x} ${y}h${w}v1.02h-${w}z`;
    x += w;
  }
}
writeFileSync(saida, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}"><path fill="#000000" d="${d}"/></svg>\n`);
console.log(saida, url);
