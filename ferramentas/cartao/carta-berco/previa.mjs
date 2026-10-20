// Prévia da carta-berço montada (só para ver; não vai para a gráfica).
// Usa as PNGs de png.mjs (luva-arte, cartela-arte-1) e a prévia do cartão Blue.
// Uso: node previa.mjs <pasta das PNGs>
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs')); }
const here = dirname(fileURLToPath(import.meta.url));
const pasta = process.argv[2] || join(here, 'png');
const uri = (f) => 'data:image/png;base64,' + readFileSync(f).toString('base64');
const luva = uri(join(pasta, 'luva-arte.png'));
const cartela = uri(join(pasta, 'cartela-arte-1.png'));
const cartao = uri(join(here, '..', 'previa-blue-frente.png'));
const html = `<!doctype html><meta charset="utf-8"><style>
  body { margin: 0; background: #e6e9f1; }
  .cena { position: relative; width: 170mm; height: 312mm; }
  .p { position: absolute; }
  .cartela { left: 35mm; top: 12mm; width: 100mm; height: 184mm; border-radius: 2mm;
    background: url(${cartela}) -3mm -3mm / 106mm 190mm; box-shadow: 0 1mm 4mm rgba(4,18,77,.25); }
  .cartao { left: 58mm; top: 30mm; width: 54mm; height: 85.6mm; border-radius: 3.18mm; overflow: hidden;
    box-shadow: 0 .6mm 1.6mm rgba(0,0,0,.35); }
  /* em pé: a arte do cartão (deitada) gira 90° */
  .cartao img { position: absolute; left: -17.8mm; top: 13.8mm; width: 89.6mm; height: 58mm; transform: rotate(-90deg); }
  .luva { left: 33mm; top: 112mm; width: 104mm; height: 190mm;
    background: url(${luva}) -3mm -3mm / 229.5mm 215.5mm;
    -webkit-mask: radial-gradient(circle 13mm at 52mm 0, transparent 99%, #000 100%);
    mask: radial-gradient(circle 13mm at 52mm 0, transparent 99%, #000 100%);
    filter: drop-shadow(0 1.2mm 3mm rgba(4,18,77,.35)); }
</style><div class="cena">
  <div class="p cartela"></div>
  <div class="p cartao"><img src="${cartao}"></div>
  <div class="p luva"></div>
</div>`;
const arq = join(pasta, 'previa.html');
writeFileSync(arq, html);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const p = await b.newPage({ deviceScaleFactor: 2 });
await p.goto(pathToFileURL(arq).href);
await (await p.$('.cena')).screenshot({ path: join(here, 'previa.png') });
await b.close();
console.log(join(here, 'previa.png'));
