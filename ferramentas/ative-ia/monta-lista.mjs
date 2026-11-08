// Lista da campanha "ponha a sua IA para trabalhar" (Mateus, 08/11): os
// corretores com imóvel no ar, sem contas internas, de teste e duplicadas (o
// ranking já tira). Quem tem mais imóveis vem primeiro. Primeiro nome:
// a primeira palavra do nome, com a inicial maiúscula; nome de empresa ou
// abreviado ("S.", "LTDA") vira o nome inteiro curto, e sem nome fica vazio.
import fs from 'fs';
const r = JSON.parse(fs.readFileSync(new URL('../ranking/corretores.json', import.meta.url), 'utf8'));
const L = (Array.isArray(r) ? r : (r.linhas || r.corretores)).filter(x => x.imoveis_no_ar > 0);
const cap = w => w.charAt(0).toLocaleUpperCase('pt-BR') + w.slice(1).toLocaleLowerCase('pt-BR');
// Conferidos à mão em 08/11: nome de empresa fica como está, e quem pôs o
// cargo depois do nome fica só com o primeiro nome.
const NOME_CERTO = {
  1258: "S. Cezzar", 1113: "Guilherme", 1320: "Imobiliária Portal Barra Bonita", 1132: "New House Imóveis",
  1304: "JSM Imóveis", 1551: "Ferraz Imóveis", 1602: "KLR Prime Imóveis",
};
function primeiro (nome, id) {
  if (NOME_CERTO[id]) return NOME_CERTO[id];
  const n = (nome || "").trim().replace(/\s+/g, " ");
  return n ? cap(n.split(" ")[0]) : "";
}
// Quem já tem o link na bio recebe o aviso do cartão novo (bio-aviso), que
// traz os mesmos dois passos; não recebe esta campanha também (08/11).
let foraBio = new Set();
try { foraBio = new Set(JSON.parse(fs.readFileSync(new URL('../bio-aviso/lista.json', import.meta.url), 'utf8')).map(x => x.id_user)); } catch {}
const lista = L.filter(x => !foraBio.has(x.id_user)).map(x => ({
  id_user: x.id_user, nome: x.corretor, primeiro: primeiro(x.corretor, x.id_user), slug: (x.link || '').replace(/^smartli\.ink\//, ''),
  imoveis: x.imoveis_no_ar, v30: x.visitas_site_30d || 0, ig: x.visitas_instagram || 0,
})).sort((a, b) => b.imoveis - a.imoveis || a.id_user - b.id_user);
fs.writeFileSync(new URL('./lista.json', import.meta.url), JSON.stringify(lista, null, 1));
console.log(lista.length, 'corretores');
for (const x of lista.slice(0, 200)) if (!x.primeiro || !x.slug || x.primeiro.length < 3) console.log('conferir:', x.id_user, JSON.stringify(x.nome), '->', JSON.stringify(x.primeiro), x.slug);
