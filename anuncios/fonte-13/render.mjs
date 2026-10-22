import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const p = await b.newPage({ viewport: { width: 2400, height: 4000 }, deviceScaleFactor: 1 });
const erros = []; p.on('pageerror', e => erros.push(String(e))); p.on('requestfailed', r => erros.push('falhou ' + r.url()));
await p.goto('file://' + process.cwd() + '/artes.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
const fam = await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
for (const [id, nome] of [['a45','13a-desbloqueado-2214-4x5'],['a916','13a-desbloqueado-2214-9x16'],['b45','13b-quem-atende-agora-4x5'],['b916','13b-quem-atende-agora-9x16']]) {
  await p.locator('#' + id).screenshot({ path: `${nome}.png` });
}
console.log('fontes carregadas:', fam, 'erros:', erros);
await b.close();
