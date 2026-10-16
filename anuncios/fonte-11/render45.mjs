import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
const erros = []; p.on('pageerror', e => erros.push(String(e))); p.on('requestfailed', r => erros.push('falhou ' + r.url()));
await p.goto('file://' + process.cwd() + '/artes45-r.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
const fam = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
for (const [id, nome] of [['a11','11a-promessa'],['b11','11b-placa-qr'],['c11','11c-mais-leads'],['d11','11d-cole-o-link']]) {
  await p.locator('#' + id).screenshot({ path: `${nome}-4x5.png` });
}
console.log('fontes carregadas:', fam, 'erros:', erros);
await b.close();
