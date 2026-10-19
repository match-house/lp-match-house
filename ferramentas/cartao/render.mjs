// Gera o PDF de impressão (4 páginas, vetor, fontes embutidas) a partir do HTML.
// Depois rode caixas.mjs, que acerta o tamanho exato da página.
// Uso: node render.mjs [arquivo.html]   (padrão: cartoes-camila.html)
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, basename } from 'path';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs')); }
const here = dirname(fileURLToPath(import.meta.url));
const html = process.argv[2] || 'cartoes-camila.html';
const pdf = join(here, basename(html, '.html') + '.pdf');
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath: exe }).catch(() => chromium.launch());
const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') console.log('AVISO:', m.text()); });
await page.goto(pathToFileURL(join(here, html)).href, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// espera o ajuste de nome e link longos (data-fit), quando a página tem
await page.waitForFunction(() => !document.querySelector('[data-fit]') || document.body.dataset.pronto === '1');
await page.pdf({ path: pdf, width: '3.52756in', height: '2.28346in', printBackground: true });
await browser.close();
console.log(pdf);
