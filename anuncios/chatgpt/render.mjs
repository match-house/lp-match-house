import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 4000, height: 2800 }, deviceScaleFactor: 1 });
const erros = []; p.on('pageerror', e => erros.push(String(e))); p.on('requestfailed', r => erros.push('falhou ' + r.url()));
await p.goto('file://' + process.cwd() + '/artes.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
const fam = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
for (const [id, nome] of [['a', 'ip-a-cole-o-anuncio'], ['b', 'ip-b-texto-do-whatsapp'], ['c', 'ip-c-imoveis-num-link'], ['d', 'ip-d-tire-as-fotos'], ['e', 'ip-e-pdf-do-lancamento'], ['f', 'ip-f-ia-mostra-imoveis']]) {
  await p.locator('#' + id).screenshot({ path: `${nome}.png` });
}
console.log('fontes carregadas:', fam, 'erros:', erros);
await b.close();
