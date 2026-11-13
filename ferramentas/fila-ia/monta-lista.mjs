// Lista da fila "IA no seu WhatsApp" (Mateus, 13/11: "Pode fazer o 1 e o 2.
// preço normal"): quem tem imóvel no ar, sem contas internas, de teste e
// duplicadas (o ranking já tira) e sem o Enio (196), que recebe mensagem
// própria. Primeiro os que tiveram cliente escrevendo para a IA nos 30 dias
// (mais conversas antes), depois os outros por visitas no mês.
import fs from 'fs';
const r = JSON.parse(fs.readFileSync(new URL('../ranking/corretores.json', import.meta.url), 'utf8'));
const L = (Array.isArray(r) ? r : (r.linhas || r.corretores)).filter(x => x.imoveis_no_ar > 0);
const conv = JSON.parse(fs.readFileSync(new URL('./leads30.json', import.meta.url), 'utf8'));
const esc = new Map((conv.por_corretor?.contagem || []).filter(c => c.visitante_escreveu > 0).map(c => [String(c.slug || '').toLowerCase(), c.visitante_escreveu]));
const FORA = new Set([3, 56, 39, 937, 941, 980, 999, 1011, 1014, 1033, 1095, 1096, 196]);
const cap = w => w.charAt(0).toLocaleUpperCase('pt-BR') + w.slice(1).toLocaleLowerCase('pt-BR');
const NOME_CERTO = {
  1258: 'S. Cezzar', 1113: 'Guilherme', 1320: 'Imobiliária Portal Barra Bonita', 1132: 'New House Imóveis',
  1304: 'JSM Imóveis', 1551: 'Ferraz Imóveis', 1602: 'KLR Prime Imóveis',
};
const primeiro = (nome, id) => NOME_CERTO[id] || ((n) => (n ? cap(n.split(' ')[0]) : ''))((nome || '').trim().replace(/\s+/g, ' '));
const slug = x => (x.link || '').replace(/^.*smartli\.ink\//, '').toLowerCase();
const lista = L.filter(x => !FORA.has(x.id_user)).map(x => ({
  id_user: x.id_user, nome: x.corretor, primeiro: primeiro(x.corretor, x.id_user), slug: slug(x),
  imoveis: x.imoveis_no_ar, conversas30d: esc.get(slug(x)) || 0, v30: x.visitas_site_30d || 0,
})).sort((a, b) => b.conversas30d - a.conversas30d || b.v30 - a.v30 || a.id_user - b.id_user);
fs.writeFileSync(new URL('./lista.json', import.meta.url), JSON.stringify(lista, null, 1));
console.log(lista.length, 'corretores;', lista.filter(x => x.conversas30d > 0).length, 'com cliente escrevendo nos 30 dias');
for (const x of lista) if (!x.primeiro || !x.slug || x.primeiro.length < 3) console.log('conferir:', x.id_user, JSON.stringify(x.nome), '->', JSON.stringify(x.primeiro), x.slug);
