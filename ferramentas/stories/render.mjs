import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 2400, height: 4000 }, deviceScaleFactor: 1 });
const erros = []; p.on('pageerror', e => erros.push(String(e))); p.on('requestfailed', r => erros.push('falhou ' + r.url()));
await p.goto('file://' + process.cwd() + '/semana1.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
const fam = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['e1f','e1s','e2f','e2s','e3f','e3s','e4f','e4s','e5f','e5s','e7f','e7s','t1s','t2s','r0','r1','r2','r3'];
for (const id of ids) {
  await p.locator('#' + id).screenshot({ path: `out/${id}.jpg`, type: 'jpeg', quality: 92 });
}
console.log('fontes carregadas:', fam, 'erros:', erros);
await b.close();
