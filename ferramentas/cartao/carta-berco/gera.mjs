// Carta-berço do cartão Smart Link: luva (envelope que desliza) e cartela
// (segura o cartão por 4 cortes nos cantos, sem cola). Gera, em tamanho real:
//   luva-arte.pdf     arte do lado de fora, com 3 mm de sangria (4x0)
//   luva-faca.pdf     só as linhas: corte (magenta) e vinco (verde tracejado)
//   luva-tecnico.pdf  desenho técnico com as medidas
//   cartela-arte.pdf  frente e verso, com sangria (4x4)
//   cartela-faca.pdf  só as linhas
//   cartela-tecnico.pdf
//   previa.png        como fica montado (previa.mjs; só para ver, não vai para a gráfica)
// Uso: node gera.mjs   (as medidas ficam no objeto M, abaixo)
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { PDFDocument } from 'pdf-lib';

const here = dirname(fileURLToPath(import.meta.url));
const up = (f) => readFileSync(join(here, '..', f), 'utf8');

// Medidas em mm.
const M = {
  sangria: 3,
  // em pé (Mateus, 20/10: "o cartão vem no sentido longitudinal"): o lado
  // comprido acompanha o comprimento da cartela
  cartao: { w: 85.6, h: 54, r: 3.18, emPe: true },
  cartela: { w: 100, h: 184, r: 2, topoCartao: 18 },
  luva: {
    w: 104, // 2 mm de folga de cada lado da cartela
    h: 190, // 6 mm de folga no fundo: a cartela fica abaixo da boca
    vinco: 1.5, // vinco duplo nas dobras, para caber cartela + cartão
    aba: 14, // aba de cola lateral
    fundo: 18, // aba do fundo
    meiaLua: 13, // raio do recorte para puxar
  },
  corte: { recuo: 4, meio: 6 }, // cortes dos cantos do cartão
};

// número com vírgula, como a gráfica lê
const n = (v, casas) => (casas == null ? String(v) : v.toFixed(casas)).replace('.', ',');

const AZUL2 = '#04124d';
const CORTE = '#ec008c';
const VINCO = '#00a651';

const wordmark = (cor) =>
  up('wordmark-branco.svg').replace(/fill="#ffffff"/g, `fill="${cor}"`);
const mBranco = up('m-branco.svg');

// ---------------------------------------------------------------- geometria

function luvaGeo() {
  const L = M.luva;
  const ax0 = 0, ax1 = L.w; // frente
  const bx0 = L.w + L.vinco, bx1 = bx0 + L.w; // verso
  const gx1 = bx1 + L.aba; // aba de cola
  const fy0 = L.h + L.vinco, fy1 = fy0 + L.fundo; // aba do fundo
  const cx = L.w / 2, r = L.meiaLua;
  const ch = 3; // chanfro das abas
  // contorno de corte, no sentido horário a partir do canto de cima da frente
  const corte = [
    `M ${ax0} 0`,
    `L ${cx - r} 0`,
    `A ${r} ${r} 0 0 0 ${cx + r} 0`, // meia-lua na boca da frente
    `L ${bx1} 0`,
    `L ${gx1} ${ch + 6}`,
    `L ${gx1} ${L.h - ch - 6}`,
    `L ${bx1} ${L.h}`,
    `L ${ax1} ${L.h}`,
    `L ${ax1 - 2} ${fy0}`,
    `L ${ax1 - 2 - ch} ${fy1}`,
    `L ${ax0 + 2 + ch} ${fy1}`,
    `L ${ax0 + 2} ${fy0}`,
    `L ${ax0} ${L.h}`,
    'Z',
  ].join(' ');
  const vincos = [
    [ax1, 0, ax1, L.h],
    [bx0, 0, bx0, L.h],
    [bx1, 0, bx1, L.h],
    [ax0 + 2, L.h, ax1 - 2, L.h],
    [ax0 + 2, fy0, ax1 - 2, fy0],
  ];
  return { ax0, ax1, bx0, bx1, gx1, fy0, fy1, corte, vincos, W: gx1, H: fy1 };
}

function cartelaGeo() {
  const C = M.cartela, K = M.cartao, { recuo: a, meio: m } = M.corte;
  const kw = K.emPe ? K.h : K.w, kh = K.emPe ? K.w : K.h;
  const x0 = (C.w - kw) / 2, x1 = x0 + kw;
  const y0 = C.topoCartao, y1 = y0 + kh;
  const r = C.r;
  const corte = `M ${r} 0 H ${C.w - r} A ${r} ${r} 0 0 1 ${C.w} ${r} V ${C.h - r} A ${r} ${r} 0 0 1 ${C.w - r} ${C.h} H ${r} A ${r} ${r} 0 0 1 0 ${C.h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  // corte reto a 45° em cada canto, a `a` mm do canto para dentro
  const cantos = [
    [x0 + a, y0 + a, 1, -1],
    [x1 - a, y0 + a, 1, 1],
    [x0 + a, y1 - a, 1, 1],
    [x1 - a, y1 - a, 1, -1],
  ].map(([px, py, dx, dy]) => [px - m * dx, py - m * dy, px + m * dx, py + m * dy]);
  return { x0, x1, y0, y1, kw, kh, corte, cantos, W: C.w, H: C.h };
}

// ---------------------------------------------------------------- html

const fontes = `
  @font-face { font-family: "Poppins"; src: url("../Poppins-Regular.ttf"); font-weight: 400; }
  @font-face { font-family: "Poppins"; src: url("../Poppins-SemiBold.ttf"); font-weight: 600; }
  @font-face { font-family: "Plex Mono"; src: url("../plexmono-500.woff2"); font-weight: 500; }
  html, body { margin: 0; padding: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: "Poppins", sans-serif; }
  .page { position: relative; overflow: hidden; break-after: page; }
  .page:last-child { break-after: auto; }
  .abs { position: absolute; }
  .abs svg { display: block; width: 100%; height: auto; }
  .t { position: absolute; text-align: center; }
`;

function doc(w, h, corpo, extra = '') {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
  @page { size: ${w}mm ${h}mm; margin: 0; }
  ${fontes}
  .page { width: ${w}mm; height: ${h}mm; }
  ${extra}
  </style></head><body>${corpo}</body></html>`;
}

const linhas = (g, { rotulos = false, larg = 0.25 } = {}) => {
  const v = (g.vincos || [])
    .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${VINCO}" stroke-width="${larg}" stroke-dasharray="2 1.2"/>`)
    .join('');
  const c = (g.cantos || [])
    .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${CORTE}" stroke-width="${larg}"/>`)
    .join('');
  return `<path d="${g.corte}" fill="none" stroke="${CORTE}" stroke-width="${larg}"/>${v}${c}${rotulos || ''}`;
};

// ---- luva

// Ícones das redes, em branco sobre o azul, numa linha centralizada:
// Instagram, YouTube, LinkedIn, Facebook e o M da Match House.
const ICONES = [
  `<svg viewBox="0 0 24 24"><rect x="2.2" y="2.2" width="19.6" height="19.6" rx="5.6" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.6" cy="6.4" r="1.35" fill="#fff"/></svg>`,
  `<svg viewBox="0 0 24 24"><rect x="0.8" y="4.6" width="22.4" height="14.8" rx="4.4" fill="#fff"/><path d="M9.8 8.4 L16 12 L9.8 15.6 Z" fill="${AZUL2}"/></svg>`,
  `<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="3.2" fill="#fff"/><circle cx="7.1" cy="7.1" r="1.65" fill="${AZUL2}"/><rect x="5.7" y="9.6" width="2.8" height="8.6" fill="${AZUL2}"/><path d="M10.4 9.6h2.7v1.2c.5-.8 1.5-1.5 3-1.5 2.5 0 3.5 1.6 3.5 4.2v4.7h-2.8v-4.2c0-1.3-.4-2.1-1.6-2.1-1.2 0-2 .9-2 2.2v4.1h-2.8z" fill="${AZUL2}"/></svg>`,
  `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.2" fill="#fff"/><path d="M13.3 22.1v-7.4h2.5l.4-2.9h-2.9V10c0-.8.3-1.4 1.4-1.4h1.6V6c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2H7.8v2.9h2.4v7.2" fill="${AZUL2}"/></svg>`,
];
function redes(x, y, largura) {
  const t = 6, gap = 5;
  const itens = [...ICONES.map((i) => [t, i]), [9, mBranco]];
  const total = itens.reduce((a, [w]) => a + w, 0) + gap * (itens.length - 1);
  let cx = x + (largura - total) / 2;
  return itens
    .map(([w, svg]) => {
      const alt = w === t ? t : w * 0.448; // o M é mais largo que alto
      const html = `<div class="abs" style="left:${cx}mm;top:${y + (t - alt) / 2}mm;width:${w}mm">${svg}</div>`;
      cx += w + gap;
      return html;
    })
    .join('');
}

function luvaArte(g) {
  // Minimalista, só a marca, como a embalagem da C6 Tag (Mateus, 20/10:
  // "deixe minimalista somente a marca igual ao C6"): azul liso por fora,
  // o logo na frente, com "desbloqueie seu mundo" pequeno embaixo. No verso,
  // os ícones das redes e o M (Mateus, 20/10: "insta, youtube, in, F, e o M
  // da Match").
  const s = M.sangria, L = M.luva;
  const W = g.W + 2 * s, H = g.H + 2 * s;
  const px = (x) => x + s;
  const fundo = `
    <rect x="0" y="0" width="${W}" height="${H}" fill="${AZUL2}"/>
    <!-- abas de cola sem tinta, a 2 mm da dobra -->
    <rect x="${px(g.bx1) + 2}" y="0" width="${L.aba + s}" height="${H}" fill="#fff"/>
    <rect x="0" y="${s + g.fy0 + 2}" width="${px(L.w) + 2}" height="${L.fundo + s}" fill="#fff"/>`;
  const fx = s, fw = L.w; // frente
  const bx = s + g.bx0; // verso
  const lw = 46; // largura do logo da frente
  const corpo = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">${fundo}</svg>
    <div class="abs" style="left:${fx + (fw - lw) / 2}mm;top:${s + 85}mm;width:${lw}mm">${wordmark('#ffffff')}</div>
    <!-- Mateus, 20/10: "escreva pequeno embaixo da marca" -->
    <div class="t" style="left:${fx}mm;top:${s + 99.5}mm;width:${fw}mm;color:rgba(255,255,255,.78);font-size:2.9mm;letter-spacing:.08em">desbloqueie seu mundo</div>
    ${redes(bx, s + 166, fw)}
  </div>`;
  return doc(W, H, corpo, '.abs svg[viewBox] { width:100%; height:auto; }');
}

function luvaFaca(g, tecnico = false) {
  const s = M.sangria, L = M.luva;
  const pad = tecnico ? 22 : s;
  const W = g.W + 2 * pad, H = g.H + 2 * pad;
  const rot = (x, y, txt, tam = 3) =>
    `<text x="${x}" y="${y}" font-size="${tam}" fill="#555" text-anchor="middle" font-family="Poppins">${txt}</text>`;
  const cota = (x1, y1, x2, y2, txt, lado = 'baixo') => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const off = lado === 'baixo' ? 4 : lado === 'cima' ? -2 : 0;
    const vert = x1 === x2;
    const t = vert
      ? `<text x="${mx - 2}" y="${my}" font-size="3" fill="#000" text-anchor="middle" font-family="Poppins" transform="rotate(-90 ${mx - 2} ${my})">${txt}</text>`
      : `<text x="${mx}" y="${my + off}" font-size="3" fill="#000" text-anchor="middle" font-family="Poppins">${txt}</text>`;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000" stroke-width="0.2" marker-start="url(#seta)" marker-end="url(#seta)"/>${t}`;
  };
  const rotulos = `
    ${rot(L.w / 2, 60, 'FRENTE (lado de fora)')}
    ${rot(g.bx0 + L.w / 2, 60, 'VERSO')}
    ${rot(g.bx1 + L.aba / 2, L.h / 2, 'COLA', 2.6)}
    ${rot(L.w / 2, g.fy0 + 11, 'FUNDO: dobra para dentro e cola no verso', 2.6)}
    ${rot(L.w / 2, 24, 'meia-lua para puxar', 2.4)}
    ${rot((L.w + g.bx0) / 2, -3, `vinco duplo de ${n(L.vinco)} mm`, 2.2)}`;
  const cotas = tecnico
    ? `
    ${cota(0, -10, L.w, -10, `${L.w} mm`, 'cima')}
    ${cota(g.bx0, -10, g.bx1, -10, `${L.w} mm`, 'cima')}
    ${cota(g.bx1, -10, g.gx1, -10, `${L.aba}`, 'cima')}
    ${cota(-10, 0, -10, L.h, `${L.h} mm`)}
    ${cota(-10, g.fy0, -10, g.fy1, `${L.fundo}`)}
    ${cota(L.w / 2 - L.meiaLua, -4, L.w / 2 + L.meiaLua, -4, `meia-lua raio ${L.meiaLua}`, 'cima')}
    ${rot(g.W / 2, g.H + 12, `Luva aberta: ${n(g.W, 1)} x ${n(g.H, 1)} mm · fechada: ${L.w} x ${L.h} mm · vinco duplo de ${n(L.vinco)} mm nas dobras`, 3.2)}
    ${rot(g.W / 2, g.H + 17, 'Corte em magenta (linha cheia) · vinco em verde (tracejado) · abas de cola sem tinta', 3.2)}`
    : '';
  const corpo = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="${-pad} ${-pad} ${W} ${H}">
      <defs><marker id="seta" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="2.4" markerHeight="2.4" orient="auto-start-reverse"><path d="M0 0 L6 3 L0 6 Z" fill="#000"/></marker></defs>
      <rect x="${-pad}" y="${-pad}" width="${W}" height="${H}" fill="#fff"/>
      ${linhas(g, { rotulos: tecnico ? rotulos : '', larg: 0.25 })}
      ${cotas}
    </svg>
  </div>`;
  return doc(W, H, corpo);
}

// ---- cartela

function cartelaArte(g) {
  // Minimalista, só a marca: frente branca com o cartão e o logo embaixo;
  // verso no azul da luva, com o M pequeno.
  const s = M.sangria, C = M.cartela, K = M.cartao;
  const W = g.W + 2 * s, H = g.H + 2 * s;
  const lw = 34;
  const frente = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="#ffffff"/>
      <rect x="${s + g.x0}" y="${s + g.y0}" width="${g.kw}" height="${g.kh}" rx="${K.r}" fill="#eef1f8"/>
    </svg>
    <div class="abs" style="left:${s + (C.w - lw) / 2}mm;top:${s + 150}mm;width:${lw}mm">${wordmark(AZUL2)}</div>
  </div>`;
  const verso = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="${AZUL2}"/>
    </svg>
    <div class="abs" style="left:${s + (C.w - 10) / 2}mm;top:${s + 165}mm;width:10mm">${mBranco}</div>
  </div>`;
  return doc(W, H, frente + verso);
}

function cartelaFaca(g, tecnico = false) {
  const s = M.sangria, K = M.cartao, C = M.cartela;
  const pad = tecnico ? 22 : s;
  const W = g.W + 2 * pad, H = g.H + 2 * pad;
  const rot = (x, y, txt, tam = 3) =>
    `<text x="${x}" y="${y}" font-size="${tam}" fill="#555" text-anchor="middle" font-family="Poppins">${txt}</text>`;
  const cartao = tecnico
    ? `<rect x="${g.x0}" y="${g.y0}" width="${g.kw}" height="${g.kh}" rx="${K.r}" fill="none" stroke="#999" stroke-width="0.2" stroke-dasharray="1 1"/>${rot(C.w / 2, g.y0 + g.kh / 2, `cartão em pé, ${n(g.kw)} x ${n(g.kh)} mm`, 2.8)}`
    : '';
  const notas = tecnico
    ? `${rot(C.w / 2, C.h + 8, `Cartela ${C.w} x ${C.h} mm, cantos com raio ${C.r} mm`, 3.2)}
       ${rot(C.w / 2, C.h + 13, `4 cortes retos a 45°, de ${(2 * M.corte.meio * Math.SQRT2).toFixed(0)} mm, a ${M.corte.recuo} mm de cada canto do cartão para dentro`, 3)}
       ${rot(C.w / 2, -8, `topo do cartão a ${C.topoCartao} mm da borda · ${n(g.x0, 1)} mm de cada lado`, 3)}
       ${rot(C.w / 2, C.h + 18, 'Corte em magenta · o cartão encaixa pelos cantos, sem cola', 3)}`
    : '';
  const corpo = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="${-pad} ${-pad} ${W} ${H}">
      <rect x="${-pad}" y="${-pad}" width="${W}" height="${H}" fill="#fff"/>
      ${cartao}
      ${linhas(g, { larg: 0.25 })}
      ${notas}
    </svg>
  </div>`;
  return doc(W, H, corpo);
}

// ---------------------------------------------------------------- saída

let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs')); }
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });

// O Chrome arredonda o tamanho da página para cima. Acerta a caixa exata
// (o conteúdo fica no canto de cima à esquerda) e marca o corte (TrimBox) e
// a sangria (BleedBox), quando a página tem sangria.
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

const gl = luvaGeo();
const gc = cartelaGeo();
const s = M.sangria, t = 22;
const feitos = [
  await pdf('luva-arte', luvaArte(gl), gl.W + 2 * s, gl.H + 2 * s, s),
  await pdf('luva-faca', luvaFaca(gl), gl.W + 2 * s, gl.H + 2 * s, s),
  await pdf('luva-tecnico', luvaFaca(gl, true), gl.W + 2 * t, gl.H + 2 * t),
  await pdf('cartela-arte', cartelaArte(gc), gc.W + 2 * s, gc.H + 2 * s, s),
  await pdf('cartela-faca', cartelaFaca(gc), gc.W + 2 * s, gc.H + 2 * s, s),
  await pdf('cartela-tecnico', cartelaFaca(gc, true), gc.W + 2 * t, gc.H + 2 * t),
];

// confere o tamanho de cada página (pontos → mm)
for (const f of feitos) {
  const d = await PDFDocument.load(readFileSync(f));
  const tam = d.getPages().map((p) => {
    const { width, height } = p.getSize();
    return `${(width / 72 * 25.4).toFixed(1)} x ${(height / 72 * 25.4).toFixed(1)} mm`;
  });
  console.log(f.split('/').pop(), tam.join(' | '));
}
await browser.close();
