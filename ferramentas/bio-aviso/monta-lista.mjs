// Lista do aviso "cartão novo do link" (Mateus, 08/11: "avise aos que ja
// estao com link na bio"). Quem tem o link na bio: visitas pelo navegador do
// Instagram ou "colei o link" marcado (GET /backoffice/instagram/visitas,
// salvo em bio-visitas.json). Sem contas internas, de teste e duplicadas: só
// entra quem está no ranking (que já as tira). Primeiro nome como na
// campanha ative-ia.
import fs from 'fs';
const here = f => new URL(f, import.meta.url);
const ig = JSON.parse(fs.readFileSync(here('../bio-visitas.json'), 'utf8'));
const r = JSON.parse(fs.readFileSync(here('../ranking/corretores.json'), 'utf8'));
const rank = new Map(r.map(x => [x.id_user, x]));
const FORA = new Set([3, 39, 56, 937, 941, 980, 999, 1011, 1014, 1033, 1095, 1096]);
const cap = w => w.charAt(0).toLocaleUpperCase('pt-BR') + w.slice(1).toLocaleLowerCase('pt-BR');
const NOME_CERTO = { 1471: 'Léo', 1551: 'Ferraz Imóveis', 1602: 'KLR Prime Imóveis' };
const primeiro = (nome, id) => NOME_CERTO[id] || ((nome || '').trim() ? cap(nome.trim().split(/\s+/)[0]) : '');
const vistos = new Map();
const add = (ids, slug, motivo) => { for (const id of ids) { const v = vistos.get(id) || { slug, motivo: new Set() }; v.motivo.add(motivo); vistos.set(id, v); } };
for (const c of ig.corretores || []) if (c.visitas_total > 0) add(c.id_users, c.slug, 'visitas');
for (const b of ig.bio_marcada || []) add(b.id_users, b.slug, 'marcou');
const lista = [];
for (const [id, v] of vistos) {
  const x = rank.get(id);
  if (FORA.has(id) || !x) { console.log('fora:', id, v.slug, FORA.has(id) ? '(interna/teste)' : '(não está no ranking)'); continue; }
  const slug = (x.link || '').replace(/^smartli\.ink\//, '') || v.slug;
  lista.push({ id_user: id, nome: x.corretor, primeiro: primeiro(x.corretor, id), slug, motivo: [...v.motivo].join('+'), imoveis: x.imoveis_no_ar });
}
lista.sort((a, b) => a.id_user - b.id_user);
fs.writeFileSync(here('./lista.json'), JSON.stringify(lista, null, 1));
console.log(lista.length, 'corretores');
for (const x of lista) if (!x.primeiro || x.primeiro.length < 3 || !x.slug) console.log('conferir:', x.id_user, JSON.stringify(x.nome), '->', x.primeiro, x.slug);
