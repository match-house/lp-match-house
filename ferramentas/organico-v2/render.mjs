import pw from "/opt/node22/lib/node_modules/playwright/index.js";
import fs from "node:fs";
const { chromium } = pw;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2400, height: 4000 }, deviceScaleFactor: 1 });
const erros = []; p.on("pageerror", e => erros.push(String(e))); p.on("requestfailed", r => erros.push("falhou " + r.url()));
await p.goto("file://" + process.cwd() + "/pecas.html"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
const fam = await p.evaluate(() => [...document.fonts].filter(f => f.status === "loaded").length);
fs.mkdirSync("out", { recursive: true });
const ids = await p.$$eval(".art", els => els.map(e => e.id));
// confere se algum texto sai da arte
const vaza = await p.$$eval(".art", els => els.flatMap(a => { const r = a.getBoundingClientRect(); return [...a.querySelectorAll("*")].filter(e => { const q = e.getBoundingClientRect(); return q.width && (q.right > r.right + 1 || q.bottom > r.bottom + 1 || q.left < r.left - 1); }).map(e => a.id + ":" + e.className); }));
for (const id of ids) await p.locator("#" + id).screenshot({ path: `out/${id}.jpg`, type: "jpeg", quality: 92 });
console.log("fontes:", fam, "artes:", ids.length, "erros:", erros, "vaza:", vaza);
await b.close();
