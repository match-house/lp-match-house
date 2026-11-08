// CAC do mês até ontem × mês anterior, por canal (Mateus, 08/11: "Coloca isso
// no relatório diário todo dia"). Só node; roda de dentro da pasta custos.
//
// Uso: node cac-mes.mjs <ontem AAAA-MM-DD> <pasta com meses/ e fixos/>
//   A pasta é o out_dir de um ArtifactData get/list da área de custos:
//   meses/<AAAA-MM>.json dos dois meses e fixos/*.json.
// Divisão do gasto da Meta por campanha (app, LP, outras): o doc de custos só
// tem o total da Meta. Passe META_SPLIT='{"2026-11":{"app":0,"lp":0}}' (sem
// imposto) quando a Meta gastar; outubro já vem abaixo.
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const [ontem, pasta] = process.argv.slice(2);
if (!ontem || !pasta) { console.error('uso: node cac-mes.mjs <ontem> <pasta>'); process.exit(1); }
const mes = ontem.slice(0, 7);
const [a, m] = mes.split('-').map(Number);
const ant = m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, '0')}`;
const diasMes = (aa, mm) => new Date(aa, mm, 0).getDate();
const IMP = 1.1383;
const SPLIT = { '2026-10': { app: 1784.02, lp: 126.65 }, ...JSON.parse(process.env.META_SPLIT || '{}') };

const run = (s, arg) => {
  for (let i = 0; i < 3; i++) {
    try { return JSON.parse(execFileSync('node', [s, arg], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })); } catch { /* 502 passageiro: tenta de novo */ }
  }
  throw new Error(`${s} ${arg} falhou 3 vezes`);
};
const soma = o => Object.values(o || {}).reduce((x, y) => x + (+y || 0), 0);

function bloco(mesX, ultimoDia) {
  const doc = JSON.parse(fs.readFileSync(path.join(pasta, 'meses', `${mesX}.json`), 'utf8'));
  const F = doc.fornecedores;
  const g = Object.fromEntries(Object.entries(F).map(([k, o]) => [k, soma(o.dias)]));
  const orig = run('origens.mjs', ultimoDia)['mês'];
  const L = n => orig[n] || { contas: 0, concluiram: 0, publicaram: 0 };
  const split = SPLIT[mesX];
  const meta = g.meta_ads || 0;
  const linhas = [{ canal: 'ChatGPT', gasto: g.openai_ads || 0, ...L('ChatGPT') }];
  if (split) {
    linhas.push({ canal: 'Meta app', gasto: split.app * IMP, ...L('Meta app') });
    linhas.push({ canal: 'Meta LP', gasto: split.lp * IMP, ...L('Meta LP') });
    const outras = Math.max(0, meta - split.app - split.lp);
    if (outras > 0.01) linhas.push({ canal: 'Outras da Meta (sem conta)', gasto: outras * IMP, contas: 0, concluiram: 0, publicaram: 0 });
  } else {
    const c = ['Meta app', 'Meta LP', 'Meta WhatsApp 6800'].map(L);
    linhas.push({ canal: 'Meta (todas)', gasto: meta * IMP, contas: c.reduce((x, y) => x + y.contas, 0), concluiram: c.reduce((x, y) => x + y.concluiram, 0), publicaram: c.reduce((x, y) => x + y.publicaram, 0) });
  }
  linhas.push({ canal: 'Google', gasto: g.google_ads || 0, ...L('Google') });
  const tot = orig.Total;
  const midia = meta * IMP + (g.google_ads || 0) + (g.openai_ads || 0);
  linhas.push({ canal: 'Total', gasto: midia, ...tot });
  const uso = Object.entries(g).reduce((x, [k, v]) => x + (k === 'meta_ads' ? v * IMP : v), 0);
  const dias = Number(ultimoDia.slice(8, 10));
  const fixos = fs.readdirSync(path.join(pasta, 'fixos')).filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(pasta, 'fixos', f), 'utf8')))
    .reduce((x, d) => x + (+d.valor_brl_mes || 0), 0);
  const [aa, mm] = mesX.split('-').map(Number);
  const fixosProp = fixos * dias / diasMes(aa, mm);
  return { mes: mesX, ate: ultimoDia, linhas, uso, fixos_proporcionais: fixosProp,
    total_por_publicou: tot.publicaram ? (uso + fixosProp) / tot.publicaram : null };
}

const r = (x, n) => (n ? (x / n).toFixed(2) : '-');
const pct = (p, c) => (c ? `${Math.round(p / c * 1000) / 10}%` : '-');
const ultimoAnt = `${ant}-${String(diasMes(...ant.split('-').map(Number))).padStart(2, '0')}`;
for (const b of [bloco(mes, ontem), bloco(ant, ultimoAnt)]) {
  console.log(`\n${b.mes} até ${b.ate}`);
  console.log('canal | gasto | por conta | por concluiu | por publicou | % publicou');
  for (const l of b.linhas) {
    console.log(`${l.canal} | ${l.gasto.toFixed(2)} | ${r(l.gasto, l.contas)} (${l.contas}) | ${r(l.gasto, l.concluiram)} (${l.concluiram}) | ${r(l.gasto, l.publicaram)} (${l.publicaram}) | ${pct(l.publicaram, l.contas)}`);
  }
  console.log(`uso ${b.uso.toFixed(2)} + fixos proporcionais ${b.fixos_proporcionais.toFixed(2)} → total por publicou ${b.total_por_publicou?.toFixed(2)}`);
}
