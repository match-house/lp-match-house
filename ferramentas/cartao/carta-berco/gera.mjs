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
  cartao: { w: 85.6, h: 54, r: 3.18 },
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

const AZUL1 = '#0b2a8a';
const AZUL2 = '#04124d';
const CIANO = '#00efff';
const CORTE = '#ec008c';
const VINCO = '#00a651';

const wordmark = (cor) =>
  up('wordmark-branco.svg').replace(/fill="#ffffff"/g, `fill="${cor}"`);
const mAzul = up('m-azul.svg');
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
  const x0 = (C.w - K.w) / 2, x1 = x0 + K.w;
  const y0 = C.topoCartao, y1 = y0 + K.h;
  const r = C.r;
  const corte = `M ${r} 0 H ${C.w - r} A ${r} ${r} 0 0 1 ${C.w} ${r} V ${C.h - r} A ${r} ${r} 0 0 1 ${C.w - r} ${C.h} H ${r} A ${r} ${r} 0 0 1 0 ${C.h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  // corte reto a 45° em cada canto, a `a` mm do canto para dentro
  const cantos = [
    [x0 + a, y0 + a, 1, -1],
    [x1 - a, y0 + a, 1, 1],
    [x0 + a, y1 - a, 1, 1],
    [x1 - a, y1 - a, 1, -1],
  ].map(([px, py, dx, dy]) => [px - m * dx, py - m * dy, px + m * dx, py + m * dy]);
  return { x0, x1, y0, y1, corte, cantos, W: C.w, H: C.h };
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

function luvaArte(g) {
  const s = M.sangria, L = M.luva;
  const W = g.W + 2 * s, H = g.H + 2 * s;
  const px = (x) => x + s;
  const fundo = `
    <rect x="0" y="0" width="${W}" height="${H}" fill="${AZUL2}"/>
    <defs>
      <linearGradient id="gf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${AZUL1}"/><stop offset="1" stop-color="${AZUL2}"/>
      </linearGradient>
      <radialGradient id="brilho" cx="${px(L.w) - 6}" cy="${s + 18}" r="70" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="rgba(20,100,230,.7)"/><stop offset="1" stop-color="rgba(20,100,230,0)"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="${px(L.w)}" height="${s + L.h}" fill="url(#gf)"/>
    <rect x="0" y="0" width="${px(L.w)}" height="${s + L.h}" fill="url(#brilho)"/>
    <!-- abas de cola sem tinta, a 2 mm da dobra -->
    <rect x="${px(g.bx1) + 2}" y="0" width="${L.aba + s}" height="${H}" fill="#fff"/>
    <rect x="0" y="${s + g.fy0 + 2}" width="${px(L.w) + 2}" height="${L.fundo + s}" fill="#fff"/>`;
  const fx = s, fw = L.w; // frente
  const bx = s + g.bx0; // verso
  const corpo = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">${fundo}</svg>
    <div class="abs" style="left:${fx + (fw - 44) / 2}mm;top:${s + 26}mm;width:44mm">${wordmark('#ffffff')}</div>
    <div class="t" style="left:${fx + 8}mm;top:${s + 70}mm;width:${fw - 16}mm;color:#fff;font-weight:600;font-size:8.2mm;line-height:1.12">Seu Smart Link chegou.</div>
    <div class="t" style="left:${fx + 12}mm;top:${s + 104}mm;width:${fw - 24}mm;color:${CIANO};font-size:3.7mm;line-height:1.4">Puxe pela meia-lua e encoste o cartão no celular de quem você atende.</div>
    <div class="t" style="left:${fx}mm;top:${s + 170}mm;width:${fw}mm;color:rgba(255,255,255,.72);font-family:'Plex Mono',monospace;font-size:3.3mm;letter-spacing:.06em">smartli.ink</div>

    <div class="t" style="left:${bx + 12}mm;top:${s + 66}mm;width:${fw - 24}mm;color:#fff;font-weight:600;font-size:5mm;line-height:1.25">Um presente da Match House</div>
    <div class="t" style="left:${bx + 12}mm;top:${s + 84}mm;width:${fw - 24}mm;color:#dde2f2;font-size:3.3mm;line-height:1.5">Dentro está o seu cartão Smart Link. Ele abre o seu link, com os seus imóveis e a sua IA, que responde na hora.</div>
    <div class="abs" style="left:${bx + (fw - 16) / 2}mm;top:${s + 150}mm;width:16mm">${mBranco}</div>
    <div class="t" style="left:${bx}mm;top:${s + 162}mm;width:${fw}mm;color:rgba(255,255,255,.72);font-size:2.8mm;letter-spacing:.12em">MATCH HOUSE</div>
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
  const s = M.sangria, C = M.cartela, K = M.cartao;
  const W = g.W + 2 * s, H = g.H + 2 * s;
  const passo = (n, y, txt) => `
    <div class="abs" style="left:${s + 10}mm;top:${s + y}mm;width:6mm;height:6mm;border-radius:50%;background:${AZUL1};color:#fff;font-weight:600;font-size:3.2mm;line-height:6mm;text-align:center">${n}</div>
    <div class="abs" style="left:${s + 19}mm;top:${s + y - 0.4}mm;width:${C.w - 29}mm;color:${AZUL2};font-size:3.2mm;line-height:1.42">${txt}</div>`;
  const frente = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="#ffffff"/>
      <rect x="0" y="0" width="${W}" height="${s + 1.6}" fill="${CIANO}"/>
      <rect x="${s + g.x0}" y="${s + g.y0}" width="${K.w}" height="${K.h}" rx="${K.r}" fill="#eef1f8"/>
    </svg>
    <div class="t" style="left:${s}mm;top:${s + 8.2}mm;width:${C.w}mm;color:${AZUL1};font-weight:600;font-size:2.5mm;letter-spacing:.18em">O SEU CARTÃO SMART LINK</div>
    <div class="abs" style="left:${s + 10}mm;top:${s + 84}mm;color:${AZUL2};font-weight:600;font-size:4.6mm">Como usar</div>
    ${passo(1, 95, 'Encoste o cartão atrás do celular do cliente. O seu Smart Link abre na tela.')}
    ${passo(2, 112, 'Se não abrir, peça para ele apontar a câmera para o QR do cartão.')}
    ${passo(3, 129, 'Leve na carteira e mostre em cada visita e em cada atendimento.')}
    <svg class="abs" style="left:${s + 10}mm;top:${s + 150}mm;width:${C.w - 20}mm;height:0.3mm" viewBox="0 0 80 0.3"><rect width="80" height="0.3" fill="#d3d9ee"/></svg>
    <div class="abs" style="left:${s + (C.w - 30) / 2}mm;top:${s + 157}mm;width:30mm">${wordmark(AZUL1)}</div>
    <div class="t" style="left:${s}mm;top:${s + 168.5}mm;width:${C.w}mm;color:#4a5578;font-size:2.7mm">Dúvidas? WhatsApp (27) 99854-6800</div>
  </div>`;
  const verso = `
  <div class="page">
    <svg class="abs" style="left:0;top:0;width:${W}mm;height:${H}mm" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="gv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${AZUL1}"/><stop offset="1" stop-color="${AZUL2}"/></linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#gv)"/>
    </svg>
    <div class="abs" style="left:${s + (C.w - 20) / 2}mm;top:${s + 80}mm;width:20mm">${mAzul}</div>
    <div class="t" style="left:${s}mm;top:${s + 94}mm;width:${C.w}mm;color:rgba(255,255,255,.72);font-family:'Plex Mono',monospace;font-size:3mm;letter-spacing:.06em">smartli.ink</div>
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
    ? `<rect x="${g.x0}" y="${g.y0}" width="${K.w}" height="${K.h}" rx="${K.r}" fill="none" stroke="#999" stroke-width="0.2" stroke-dasharray="1 1"/>${rot(C.w / 2, g.y0 + K.h / 2, `posição do cartão ${n(K.w)} x ${K.h} mm`, 2.8)}`
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
