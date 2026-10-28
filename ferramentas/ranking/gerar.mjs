// Ranking dos corretores (Mateus, 22/10/2026: "queria ter um ranking de
// corretores, os que mais colocaram imoveis, link na bio, receberam visitas,
// indicaram, geraram novos usuarios pelos seus links").
//
// Uso: node gerar.mjs <visitas-corretores-ACUMULADO.csv>
// Escreve corretores.json (uma linha por corretor com Smart Link) ao lado deste
// arquivo e imprime os totais. O CSV de visitas vem da exportação diária do
// funil (Drive); sem ele, as colunas de visitas saem vazias.
// Versão em node do gerar.py (28/10), porque o python pede aprovação a cada vez.
//
// Fontes:
// - imóveis no ar, nome e link: /backoffice/signups (todas as contas);
// - link na bio: /backoffice/instagram/visitas?days=90 (visitas abertas no
//   navegador do Instagram, gravadas desde 17/10) e "colei o link" marcado;
// - visitas ao Smart Link: o CSV de visitas (tabela agent_metrics do site);
// - indicações: /backoffice/indicacao/indicacoes (aprovadas e a conferir);
// - cadastros trazidos: contas novas com utm_source smartli.ink e
//   utm_content perfil-<slug> (o botão "Crie seu Smart Link" do site e o
//   convite do Indique e Ganhe), sem as contas internas, de teste e duplicadas.
// Fora do ranking: as mesmas contas internas, de teste e duplicadas do cac.mjs.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTERNOS, buscar, hojeBRT, somaDias } from '../custos/cac.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.matchhouse.com.br/backoffice';

const get = p => JSON.parse(execFileSync('curl', ['-sS', '--fail', '--max-time', '60', API + p], { encoding: 'utf8' }));

function todasAsContas() {
  const itens = [];
  const hoje = hojeBRT();
  for (let d = '2023-01-01'; d <= hoje;) {
    const f = somaDias(d, 89) < hoje ? somaDias(d, 89) : hoje;
    itens.push(...buscar(d, f));
    d = somaDias(f, 1);
  }
  const vistos = new Set();
  return itens.filter(it => !vistos.has(it.id_user) && vistos.add(it.id_user));
}

function indicacoes() {
  const out = [];
  for (let pagina = 1; ; pagina++) {
    const d = get(`/indicacao/indicacoes?page=${pagina}&page_size=100`);
    out.push(...d.indicacoes);
    if (pagina >= d.total_pages) return out;
  }
}

// CSV simples (sem vírgula dentro dos campos): id_agent e as colunas de visitas.
function visitasDoSite(caminho) {
  if (!caminho || !fs.existsSync(caminho)) return new Map();
  const linhas = fs.readFileSync(caminho, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
  const cab = linhas.shift().split(',');
  const m = new Map();
  for (const l of linhas) {
    const v = l.split(',');
    const r = Object.fromEntries(cab.map((c, i) => [c, v[i]]));
    m.set(Number(r.id_agent), r);
  }
  return m;
}

const contas = todasAsContas();
const fora = INTERNOS;

// Cadastros trazidos pelo link de cada corretor (utm_content perfil-<slug>).
const trazidos = {}, trazidosPub = {};
for (const it of contas) {
  if (fora.has(it.id_user)) continue;
  if ((it.utm_source || '').trim().toLowerCase() !== 'smartli.ink') continue;
  const cont = (it.utm_content || '').trim();
  if (!cont.startsWith('perfil-')) continue;
  const slug = cont.slice('perfil-'.length);
  if (slug === (it.slug || '')) continue; // o próprio perfil
  trazidos[slug] = (trazidos[slug] || 0) + 1;
  if ((it.publicados || 0) > 0) trazidosPub[slug] = (trazidosPub[slug] || 0) + 1;
}

const indAprov = {}, indPend = {};
for (const i of indicacoes()) {
  const quem = i.indicador?.id_user;
  const indicado = i.indicado?.id_user;
  if (quem == null || fora.has(quem) || fora.has(indicado)) continue;
  if (i.status === 'APPROVED') indAprov[quem] = (indAprov[quem] || 0) + 1;
  else if (i.status === 'PENDING') indPend[quem] = (indPend[quem] || 0) + 1;
}

const ig = get('/instagram/visitas?days=90');
const igPorAgente = new Map((ig.corretores || []).map(c => [c.id_agent, c]));
const bioMarcada = new Set((ig.bio_marcada || []).map(b => b.id_agent));
const site = visitasDoSite(process.argv[2] || '');
const ig7 = get('/instagram/visitas?days=7');
const por7 = new Map((ig7.corretores || []).map(c => [c.id_agent, c.visitas_periodo]));

const linhas = [];
for (const it of contas) {
  const u = it.id_user, slug = it.slug, agente = it.id_agent;
  if (fora.has(u) || !slug || agente == null) continue;
  const g = igPorAgente.get(agente) || {};
  const s = site.get(agente);
  const igTotal = g.visitas_total || 0;
  const marcou = bioMarcada.has(agente) || !!g.bio_marcada;
  linhas.push({
    id_user: u,
    corretor: (it.nome || slug).trim(),
    link: `smartli.ink/${slug}`,
    cadastro: it.cadastro_em.slice(0, 10),
    imoveis_no_ar: it.publicados || 0,
    imoveis_total: it.imoveis_total || 0,
    bio: igTotal > 0 ? 'Confirmada' : (marcou ? 'Marcou' : 'Não'),
    visitas_instagram: igTotal,
    visitas_instagram_7d: por7.get(agente) || 0,
    visitas_site: s ? parseInt(s.visitas_total, 10) : null,
    visitas_site_30d: s ? parseInt(s.visitas_30d, 10) : null,
    indicacoes_aprovadas: indAprov[u] || 0,
    indicacoes_a_conferir: indPend[u] || 0,
    cadastros_trazidos: trazidos[slug] || 0,
    trazidos_que_publicaram: trazidosPub[slug] || 0,
  });
}

linhas.sort((a, b) => b.imoveis_no_ar - a.imoveis_no_ar || (a.corretor < b.corretor ? -1 : a.corretor > b.corretor ? 1 : 0));
fs.writeFileSync(path.join(AQUI, 'corretores.json'), JSON.stringify(linhas));
const n = f => linhas.filter(f).length;
console.log(JSON.stringify({
  corretores_com_link: linhas.length,
  com_imovel_no_ar: n(l => l.imoveis_no_ar > 0),
  bio_confirmada: n(l => l.bio === 'Confirmada'),
  bio_marcou: n(l => l.bio === 'Marcou'),
  com_visitas_site: n(l => (l.visitas_site || 0) > 0),
  indicaram: n(l => l.indicacoes_aprovadas + l.indicacoes_a_conferir > 0),
  trouxeram_cadastro: n(l => l.cadastros_trazidos > 0),
  csv_visitas: site.size > 0,
}));
