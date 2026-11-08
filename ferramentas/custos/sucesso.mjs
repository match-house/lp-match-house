// Sucesso do cliente (Mateus, 08/11: "Pode colocar no funil diário").
// O sucesso do corretor é receber um cliente dele com nome e celular, sem
// precisar estar no celular. O cartão mostra, para os últimos 7 e 30 dias,
// quantos corretores com imóvel no ar chegaram a cada passo:
//   link na bio → visitas no link → visitas do Instagram → cliente escreveu
//   para a IA → cliente com nome e celular (sem o celular do próprio corretor).
// Fontes (backoffice; o cabeçalho entra pela credencial do ambiente):
//   - ranking/corretores.json (o gerar.mjs do relatório): a base, sem contas
//     internas, de teste e duplicadas; imóveis no ar e a bio;
//   - /backoffice/visitas/origens?days=N: visitas e origem (gravada desde 22/10);
//   - /backoffice/leads?days=N: conversas da IA (visitante_escreveu);
//   - /backoffice/leads/mes (mês atual e anterior) e as conversas com lead:
//     candidatos; /backoffice/relatorio-pro?id_agent=&dias=N conta os clientes
//     (celulares distintos, tirando o do próprio corretor).
// Uso: node custos/sucesso.mjs <hoje AAAA-MM-DD> > sucesso.json
import fs from 'fs';
import { execFileSync } from 'node:child_process';

const API = 'https://api.matchhouse.com.br/backoffice';
const hoje = process.argv[2] || new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);

// curl, e não fetch: a credencial do backoffice entra pelo proxy do ambiente.
async function get (path) {
  for (let t = 1; t <= 4; t++) {
    try {
      return JSON.parse(execFileSync('curl', ['-sS', '--fail', '--max-time', '60', API + path], { encoding: 'utf8' }));
    } catch (e) { if (t === 4) throw e; }
    await new Promise(s => setTimeout(s, 3000 * t));
  }
}

const rk = JSON.parse(fs.readFileSync(new URL('../ranking/corretores.json', import.meta.url), 'utf8'));
const linhas = Array.isArray(rk) ? rk : (rk.linhas || rk.corretores);
const porSlug = new Map(linhas.map(l => [(l.link || '').replace(/^smartli\.ink\//, '').toLowerCase(), l]));
const publicaram = linhas.filter(l => l.imoveis_no_ar > 0);
const ehBase = slug => { const l = porSlug.get((slug || '').toLowerCase()); return !!l && l.imoveis_no_ar > 0; };

const mes = hoje.slice(0, 7);
const [a, m] = mes.split('-').map(Number);
const mesAnt = `${m === 1 ? a - 1 : a}-${String(m === 1 ? 12 : m - 1).padStart(2, '0')}`;
const leadsMes = [await get(`/leads/mes?mes=${mes}`), await get(`/leads/mes?mes=${mesAnt}`)];

const janela = async dias => {
  const [orig, conv] = [await get(`/visitas/origens?days=${dias}`), await get(`/leads?days=${dias}&page_size=1`)];
  const vis = (orig.corretores || []).filter(c => ehBase(c.slug));
  const escreveu = (conv.por_corretor?.contagem || []).filter(c => ehBase(c.slug) && c.visitante_escreveu > 0);
  // candidatos a cliente: quem tem lead no mês atual ou no anterior, ou conversa com lead
  const cand = new Map();
  for (const lm of leadsMes) for (const c of lm.por_corretor || []) if (c.qualificados > 0) cand.set(c.id_agent, c.slug);
  for (const c of conv.por_corretor?.contagem || []) if (c.leads_qualificados > 0) cand.set(c.id_agent, c.slug);
  const comCliente = [];
  for (const [id_agent, slug] of cand) {
    if (!ehBase(slug)) continue;
    const r = await get(`/relatorio-pro?id_agent=${id_agent}&dias=${dias}`);
    if ((r.clientes || 0) > 0) comCliente.push({ slug, clientes: r.clientes });
  }
  return {
    visitas: vis.filter(c => c.visitas > 0).length,
    instagram: vis.filter(c => (c.por_origem?.instagram || 0) > 0).length,
    escreveu: escreveu.length,
    cliente: comCliente.length,
    clientes: comCliente.reduce((s, c) => s + c.clientes, 0),
    lista: comCliente,
    conversas_incompletas: !!(conv.resumo?.incompleto || conv.por_corretor?.incompleto),
  };
};

const j7 = await janela(7);
const j30 = await janela(30);
const nome = slug => { const l = porSlug.get(slug.toLowerCase()); return l ? (l.corretor || '').trim() : slug; };
const c7 = new Map(j7.lista.map(c => [c.slug, c.clientes]));
const out = {
  atualizado: hoje,
  base: publicaram.length,
  bio: publicaram.filter(l => l.bio === 'Confirmada' || l.bio === 'Marcou').length,
  bio_confirmada: publicaram.filter(l => l.bio === 'Confirmada').length,
  d7: { ...j7, lista: undefined },
  d30: { ...j30, lista: undefined },
  com_cliente: j30.lista
    .map(c => ({ nome: nome(c.slug), link: `smartli.ink/${c.slug}`, clientes_30d: c.clientes, clientes_7d: c7.get(c.slug) || 0 }))
    .sort((x, y) => y.clientes_30d - x.clientes_30d || x.nome.localeCompare(y.nome)),
};
console.log(JSON.stringify(out, null, 1));
