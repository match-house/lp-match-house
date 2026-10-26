const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2400, height: 2100 } });
const e = []; p.on('requestfailed', r => e.push(r.url())); await p.goto('file://' + __dirname + '/arte.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
for (const id of ['f', 's']) await p.locator('#' + id).screenshot({ path: `out/14d-${id}.jpg`, type: 'jpeg', quality: 92 });
console.log('falhas', e, 'fontes', await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length)); await b.close(); })();
