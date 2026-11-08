// Medição da campanha "ponha a sua IA para trabalhar" (Mateus, 08/11: "meça
// tudo isso, tá? Quem clicou aonde, quem fez o quê"). Tira uma foto de cada
// corretor da lista e compara com a foto de antes do envio (08/11).
//
// Por corretor: recebeu o e-mail e o WhatsApp (os logs dos scripts), a bio
// (ranking: Não, Marcou ou Confirmada; visitas pelo Instagram), as redes no
// Smart Link (só os nomes, pela mesma consulta pública da página dele), as
// visitas por origem desde 08/11 e as conversas da IA. Os toques na página
// (abriu, copiou o link, copiou a saudação ou a ausência) vêm do Amplitude,
// pelo Windsor, no relatório diário; aqui fica só o que o backoffice sabe.
//
// Uso: node ative-ia/medir.mjs <hoje AAAA-MM-DD>   (grava medidas/<hoje>.json
// e imprime a comparação com medidas/2026-11-08.json)
import fs from 'fs';
import { execFileSync } from 'node:child_process';

const D = new URL('./', import.meta.url);
const hoje = process.argv[2] || new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
const BASE = '2026-11-08';
const API = 'https://api.matchhouse.com.br';

const curl = (args) => {
  for (let t = 1; t <= 4; t++) {
    try { return JSON.parse(execFileSync('curl', ['-sS', '--fail', '--max-time', '60', ...args], { encoding: 'utf8' })); } catch (e) { if (t === 4) throw e; }
    execFileSync('sleep', [String(3 * t)]);
  }
};
const get = (p) => curl([API + '/backoffice' + p]);
const redesDe = (id) => {
  const q = JSON.stringify({ query: `{ findAllSocialMediaByIdUser(id_user: ${Number(id)}) { name_social_media } }` });
  const r = curl(['-X', 'POST', API + '/graphql', '-H', 'content-type: application/json', '-d', q]);
  return [...new Set((r.data?.findAllSocialMediaByIdUser || []).map(s => String(s.name_social_media || '').toLowerCase()))].sort();
};
const jsonl = (f) => { try { return fs.readFileSync(new URL(f, D), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)); } catch { return []; } };

const lista = JSON.parse(fs.readFileSync(new URL('lista.json', D), 'utf8'));
const rk = JSON.parse(fs.readFileSync(new URL('../ranking/corretores.json', D), 'utf8'));
const linhas = Array.isArray(rk) ? rk : (rk.linhas || rk.corretores);
const rkPorId = new Map(linhas.map(l => [l.id_user, l]));
const emails = new Map(jsonl('enviados-email.jsonl').filter(x => x.status === 'enviado').map(x => [x.id_user, x.em]));
const whats = new Map(jsonl('enviados-whats.jsonl').filter(x => x.status === 'enviado').map(x => [x.id_user, x.em]));

// visitas por origem desde a foto de antes (o dia da foto inclusive)
const dias = Math.max(1, Math.min(90, Math.round((Date.parse(hoje) - Date.parse(BASE)) / 864e5) + 1));
const orig = get(`/visitas/origens?days=${dias}`);
const visPorSlug = new Map((orig.corretores || []).map(c => [String(c.slug).toLowerCase(), c]));
const conv = get(`/leads?days=${dias}&page_size=1`);
const convPorSlug = new Map((conv.por_corretor?.contagem || []).map(c => [String(c.slug).toLowerCase(), c]));

const fotos = [];
for (const p of lista) {
  const r = rkPorId.get(p.id_user) || {};
  const v = visPorSlug.get(p.slug.toLowerCase());
  const c = convPorSlug.get(p.slug.toLowerCase());
  fotos.push({
    id_user: p.id_user, slug: p.slug,
    email_em: emails.get(p.id_user) || null,
    whats_em: whats.get(p.id_user) || null,
    bio: r.bio || 'Não',
    ig_total: r.visitas_instagram || 0,
    redes: redesDe(p.id_user),
    visitas: v?.visitas || 0,
    direto: v?.por_origem?.direto || 0,
    instagram: v?.por_origem?.instagram || 0,
    whatsapp: v?.por_origem?.whatsapp || 0,
    conversas: c?.visitante_escreveu || 0,
  });
}
fs.mkdirSync(new URL('medidas/', D), { recursive: true });
fs.writeFileSync(new URL(`medidas/${hoje}.json`, D), JSON.stringify({ dia: hoje, desde: BASE, dias, fotos }, null, 1));

let antes = null;
try { antes = JSON.parse(fs.readFileSync(new URL(`medidas/${BASE}.json`, D), 'utf8')); } catch {}
const A = new Map((antes?.fotos || []).map(f => [f.id_user, f]));
const temIg = (f) => (f?.redes || []).includes('instagram');
const n = (fn) => fotos.filter(fn).length;
const resumo = {
  dia: hoje, corretores: fotos.length,
  receberam_email: n(f => f.email_em), receberam_whatsapp: n(f => f.whats_em),
  bio: { antes: (antes?.fotos || []).filter(f => f.bio !== 'Não').length, agora: n(f => f.bio !== 'Não'),
    novos: fotos.filter(f => f.bio !== 'Não' && (A.get(f.id_user)?.bio || 'Não') === 'Não').map(f => f.slug) },
  instagram_no_smart_link: { antes: (antes?.fotos || []).filter(temIg).length, agora: n(temIg),
    novos: fotos.filter(f => temIg(f) && !temIg(A.get(f.id_user))).map(f => f.slug) },
  com_redes: { antes: (antes?.fotos || []).filter(f => f.redes.length).length, agora: n(f => f.redes.length) },
  desde_a_foto: { dias, com_visita: n(f => f.visitas > 0), com_visita_direto: n(f => f.direto > 0), com_visita_instagram: n(f => f.instagram > 0), com_conversa: n(f => f.conversas > 0),
    visitas: fotos.reduce((s, f) => s + f.visitas, 0), direto: fotos.reduce((s, f) => s + f.direto, 0), instagram: fotos.reduce((s, f) => s + f.instagram, 0) },
};
console.log(JSON.stringify(resumo, null, 1));
