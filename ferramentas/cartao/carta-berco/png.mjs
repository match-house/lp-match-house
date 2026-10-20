// Prévias em PNG das páginas (para conferir na tela). Uso: node png.mjs
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs')); }
const here = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const S = process.argv[2] || join(here, 'png');
for (const nome of ['luva-arte', 'luva-tecnico', 'cartela-arte', 'cartela-tecnico']) {
  const p = await b.newPage({ deviceScaleFactor: 2 });
  await p.goto(pathToFileURL(join(here, nome + '.html')).href, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const pags = await p.$$('.page');
  for (let i = 0; i < pags.length; i++) {
    await pags[i].screenshot({ path: join(S, `${nome}${pags.length > 1 ? '-' + (i + 1) : ''}.png`) });
  }
  await p.close();
}
await b.close();
