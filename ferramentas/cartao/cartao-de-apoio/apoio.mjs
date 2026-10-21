// Cartão de apoio do cartão Smart Link (21/10/2026): a versão simples da
// carta-berço. Um cartão de 10 x 15 cm, sem faca e sem colagem, que vai num
// envelope carta comum (11,4 x 16,2 cm). O cartão de PVC fica preso por 2
// pontos de cola removível, como nas cartas de banco.
// Gera, em tamanho real:
//   apoio-arte.pdf      página 1, a frente (onde vai o cartão); página 2, o verso.
//                       Com 3 mm de sangria, 4x4.
//   apoio-montagem.pdf  onde pôr o cartão e os pontos de cola (para quem monta)
//   previa-frente.png, previa-verso.png  como fica (só para ver)
// Uso: node apoio.mjs   (as medidas ficam no objeto M, abaixo)
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { PDFDocument } from 'pdf-lib';

const here = dirname(fileURLToPath(import.meta.url));
const up = (f) => readFileSync(join(here, '..', f), 'utf8');

// Medidas em mm.
const M = {
  sangria: 3,
  apoio: { w: 100, h: 150 },
  // em pé (Mateus, 20/10: "o cartão vem no sentido longitudinal")
  cartao: { w: 54, h: 85.6, r: 3.18, topo: 16 },
  // 2 pontos de cola, no meio do cartão, a esta distância do topo e do pé dele
  cola: { recuo: 20, diam: 10 },
};

const n = (v, casas) => (casas == null ? String(v) : v.toFixed(casas)).replace('.', ',');

const AZUL2 = '#04124d';
const wordmark = (cor) =>
  up('wordmark-branco.svg').replace(/fill="#ffffff"/g, `fill="${cor}"`);
const mBranco = up('m-branco.svg');

const A = M.apoio, K = M.cartao;
const kx = (A.w - K.w) / 2, ky = K.topo;

const fontes = `
  @font-face { font-family: "Poppins"; src: url("../Poppins-Regular.ttf"); font-weight: 400; }
  @font-face { font-family: "Poppins"; src: url("../Poppins-SemiBold.ttf"); font-weight: 600; }
  html, body { margin: 0; padding: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: "Poppins", sans-serif; }
  .page { position: relative; overflow: hidden; break-after: page; }
  .page:last-child { break-after: auto; }
  .abs { position: absolute; }
  .abs svg { display: block; width: 100%; height: auto; }
`;

function doc(w, h, corpo, extra = '') {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
  @page { size: ${w}mm ${h}mm; margin: 0; }
  ${fontes}
  .page { width: ${w}mm; height: ${h}mm; }
  ${extra}
  </style></head><body>${corpo}</body></html>`;
}

// ---- arte

// Frente: igual à cartela aprovada em 20/10 (Mateus: "deixe minimalista
// somente a marca igual ao C6"): branca, o lugar do cartão e o logo embaixo.
// O cartão vem com `comCartao` só na prévia.
function frente(comCartao = '') {
  const s = M.sangria, W = A.w + 2 * s, H = A.h + 2 * s;
  const lw = 34;
  const cartao = comCartao
    ? `<div class="abs" style="left:${s + kx}mm;top:${s + ky}mm;width:${K.w}mm;height:${K.h}mm;border-radius:${K.r}mm;overflow:hidden;box-shadow:0 .6mm 1.6mm rgba(4,18,77,.28)">
         <img src="${comCartao}" style="position:absolute;width:${K.h + 0.6}mm;height:${K.w + 0.6}mm;left:${(K.w - K.h) / 2 - 0.3}mm;top:${(K.h - K.w) / 2 - 0.3}mm;transform:rotate(-90deg)">
       </div>`
    : '';
  return `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="#ffffff"/>
      <rect x="${s + kx}" y="${s + ky}" width="${K.w}" height="${K.h}" rx="${K.r}" fill="#eef1f8"/>
    </svg>
    ${cartao}
    <div class="abs" style="left:${s + (A.w - lw) / 2}mm;top:${s + 121}mm;width:${lw}mm">${wordmark(AZUL2)}</div>
  </div>`;
}

// Verso: no azul da luva de 20/10, com o "como usar" em poucas linhas e o M.
function verso() {
  const s = M.sangria, W = A.w + 2 * s, H = A.h + 2 * s;
  const m = 14; // margem do texto
  const passos = [
    ['Aproxime do celular do cliente.', 'O seu Smart Link abre na hora, sem aplicativo.'],
    ['No iPhone, encoste no topo do aparelho.', 'No Android, no meio das costas, com o NFC ligado.'],
    ['Sem NFC?', 'A câmera lê o QR do verso do cartão.'],
  ];
  const itens = passos
    .map(
      ([a, b], i) => `
      <div style="display:flex;gap:3.2mm;align-items:flex-start">
        <div style="flex:none;width:5.2mm;height:5.2mm;border-radius:50%;border:.3mm solid rgba(255,255,255,.55);color:#fff;font-size:2.7mm;font-weight:600;display:grid;place-items:center;line-height:1">${i + 1}</div>
        <div style="font-size:3.15mm;line-height:1.42;color:#fff"><span style="font-weight:600">${a}</span><br><span style="color:rgba(255,255,255,.78)">${b}</span></div>
      </div>`,
    )
    .join('');
  return `
  <div class="page" style="background:${AZUL2}">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="${AZUL2}"/>
    </svg>
    <div class="abs" style="left:${s + m}mm;top:${s + 22}mm;width:${A.w - 2 * m}mm">
      <div style="font-size:2.5mm;letter-spacing:.22em;color:rgba(255,255,255,.6);font-weight:600">COMO USAR</div>
      <div style="font-size:5.6mm;line-height:1.18;color:#fff;font-weight:600;margin-top:2.6mm">Seu cartão Smart Link chegou.</div>
      <div style="display:grid;gap:5.2mm;margin-top:8mm">${itens}</div>
      <div style="margin-top:9mm;padding-top:4.2mm;border-top:.25mm solid rgba(255,255,255,.22);font-size:3mm;line-height:1.45;color:rgba(255,255,255,.78)">
        Deixe o seu Smart Link também na bio do Instagram e nas redes.
      </div>
    </div>
    <div class="abs" style="left:${s + (A.w - 10) / 2}mm;top:${s + 132}mm;width:10mm">${mBranco}</div>
  </div>`;
}

// Para quem monta: o cartão, os 2 pontos de cola e as medidas.
function montagem() {
  const pad = 22, W = A.w + 2 * pad, H = A.h + 2 * pad + 8;
  const C = M.cola, cx = A.w / 2;
  const cy1 = ky + C.recuo, cy2 = ky + K.h - C.recuo;
  const rot = (x, y, txt, tam = 3, cor = '#555') =>
    `<text x="${x}" y="${y}" font-size="${tam}" fill="${cor}" text-anchor="middle" font-family="Poppins">${txt}</text>`;
  const cota = (x1, y1, x2, y2, txt) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, vert = x1 === x2;
    const t = vert
      ? `<text x="${mx - 1.6}" y="${my}" font-size="2.8" text-anchor="middle" font-family="Poppins" transform="rotate(-90 ${mx - 1.6} ${my})">${txt}</text>`
      : `<text x="${mx}" y="${my - 1.6}" font-size="2.8" text-anchor="middle" font-family="Poppins">${txt}</text>`;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="0.2" marker-start="url(#seta)" marker-end="url(#seta)"/>${t}`;
  };
  const corpo = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="${-pad} ${-pad} ${W} ${H}">
      <defs><marker id="seta" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="2.4" markerHeight="2.4" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 Z" fill="#000"/></marker></defs>
      <rect x="${-pad}" y="${-pad}" width="${W}" height="${H}" fill="#fff"/>
      <rect x="0" y="0" width="${A.w}" height="${A.h}" fill="none" stroke="#ec008c" stroke-width="0.25"/>
      <rect x="${kx}" y="${ky}" width="${K.w}" height="${K.h}" rx="${K.r}" fill="#eef1f8" stroke="#999" stroke-width="0.2" stroke-dasharray="1 1"/>
      <circle cx="${cx}" cy="${cy1}" r="${C.diam / 2}" fill="none" stroke="#00a651" stroke-width="0.3"/>
      <circle cx="${cx}" cy="${cy2}" r="${C.diam / 2}" fill="none" stroke="#00a651" stroke-width="0.3"/>
      ${rot(cx, cy1 + 1, 'cola', 2.6, '#00a651')}
      ${rot(cx, cy2 + 1, 'cola', 2.6, '#00a651')}
      ${rot(cx, ky + K.h / 2 + 1, `cartão em pé, ${n(K.w)} x ${n(K.h)} mm`, 2.8)}
      ${cota(0, -8, A.w, -8, `${A.w} mm`)}
      ${cota(-8, 0, -8, A.h, `${A.h} mm`)}
      ${cota(A.w + 8, 0, A.w + 8, ky, `${ky}`)}
      ${cota(0, ky + K.h + 6, kx, ky + K.h + 6, `${n(kx)}`)}
      ${cota(kx + K.w + 4, ky, kx + K.w + 4, cy1, `${C.recuo}`)}
      ${rot(A.w / 2, A.h + 9, `Cartão de apoio ${A.w} x ${A.h} mm, corte reto, couché 300 g, 4x4`, 3.2, '#000')}
      ${rot(A.w / 2, A.h + 14, `2 pontos de cola removível de ${C.diam} mm, no meio do cartão, a ${C.recuo} mm do topo e do pé dele`, 3)}
      ${rot(A.w / 2, A.h + 19, 'Vai num envelope carta de 11,4 x 16,2 cm', 3)}
    </svg>
  </div>`;
  return doc(W, H, corpo);
}

// ---------------------------------------------------------------- saída

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs')); }
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });

// O Chrome arredonda o tamanho da página para cima. Acerta a caixa exata e
// marca o corte (TrimBox) e a sangria (BleedBox).
const pt = (v) => (v * 72) / 25.4;
async function pdf(nome, html, w, h, sangria = 0) {
  const arq = join(here, nome + '.html');
  writeFileSync(arq, html);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(arq).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = join(here, nome + '.pdf');
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true });
  await page.close();
  const d = await PDFDocument.load(readFileSync(out));
  for (const p of d.getPages()) {
    const { height } = p.getMediaBox();
    const W = pt(w), H = pt(h), y0 = height - H, b = pt(sangria);
    p.setMediaBox(0, y0, W, H);
    p.setCropBox(0, y0, W, H);
    p.setBleedBox(0, y0, W, H);
    p.setTrimBox(b, y0 + b, W - 2 * b, H - 2 * b);
  }
  writeFileSync(out, await d.save());
  return out;
}

// Prévia em PNG, sem a sangria, com o cartão Blue e o Green em cima.
async function png(nome, html) {
  const arq = join(here, nome + '.html');
  writeFileSync(arq, html);
  const page = await browser.newPage({ deviceScaleFactor: 3 });
  await page.goto(pathToFileURL(arq).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const s = M.sangria;
  const mm = await page.evaluate(() => {
    const d = document.createElement('div');
    d.style.width = '100mm';
    document.body.appendChild(d);
    const v = d.getBoundingClientRect().width / 100;
    d.remove();
    return v;
  });
  await page.screenshot({
    path: join(here, nome + '.png'),
    clip: { x: s * mm, y: s * mm, width: A.w * mm, height: A.h * mm },
  });
  await page.close();
}

const s = M.sangria, W = A.w + 2 * s, H = A.h + 2 * s;
const feitos = [
  await pdf('apoio-arte', doc(W, H, frente() + verso()), W, H, s),
  await pdf('apoio-montagem', montagem(), A.w + 44, A.h + 52),
];
await png('previa-frente-blue', doc(W, H, frente('../previa-blue-frente.png')));
await png('previa-frente-green', doc(W, H, frente('../previa-green-frente.png')));
await png('previa-verso', doc(W, H, verso()));

for (const f of feitos) {
  const d = await PDFDocument.load(readFileSync(f));
  const tam = d.getPages().map((p) => {
    const { width, height } = p.getSize();
    return `${(width / 72 * 25.4).toFixed(1)} x ${(height / 72 * 25.4).toFixed(1)} mm`;
  });
  console.log(f.split('/').pop(), tam.join(' | '));
}
await browser.close();
