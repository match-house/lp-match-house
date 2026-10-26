#!/usr/bin/env node
// De onde vêm os corretores (Mateus, 22/10/2026: "precisamos saber de onde
// vem todos os corretores"). Versão em node do origens.py (25/10), com as
// mesmas regras; o detalhe de cada origem está no cabeçalho do origens.py.
//
// Uso: node origens.mjs <AAAA-MM-DD de ontem>
// Imprime um JSON com ontem, 7 dias e o mês de ontem: por origem, as contas
// criadas, quantas concluíram (passaram do código) e quantas já publicaram o
// 1º imóvel. Fora: as contas internas, de teste e duplicadas do cac.mjs.
import { buscar, INTERNOS, META, diaBRT, somaDias, origemDe, organicoInstagram } from './cac.mjs';

const ORDEM = ['ChatGPT', 'Meta app', 'Meta LP', 'Google', 'Página de outro corretor',
  'Convite do Indique e Ganhe', 'Instagram sem anúncio', 'Busca no Google',
  'WhatsApp', 'Outro site', 'Digitou smartli.ink', 'QR (placa ou cartão)',
  'Cartão NFC', 'Sem origem'];
const SEMPRE = ['Página de outro corretor', 'Convite do Indique e Ganhe', 'Instagram sem anúncio'];

// Contas sem utm cuja origem foi achada no Amplitude.
const ORIGEM_ACHADA = {
  // 22/10: abriu o link de um WhatsApp da esteira que tinha ido para outra
  // conta, no mesmo celular, e criou conta nova.
  1441: ['WhatsApp da esteira', null],
};

function origem(it) {
  const u = it.id_user;
  if (ORIGEM_ACHADA[u]) return ORIGEM_ACHADA[u];
  const src = origemDe(it);
  const med = (it.utm_medium || '').trim().toLowerCase();
  const cont = (it.utm_content || '').trim();
  if (src === 'chatgpt' || src === 'openai') return ['ChatGPT', null];
  if (src === 'chatgpt.com') return ['ChatGPT sem anúncio (resposta)', null];
  if (src === 'google') return ['Google', null];
  // Link da bio marcado pelo próprio Instagram (ig / social / link_in_bio).
  if (organicoInstagram(it)) return ['Instagram sem anúncio', cont === 'link_in_bio' ? 'link da bio no Instagram' : null];
  // 26/10: a 14b leva ao diagnóstico (utm_content 14d-diagnostico), não à LP.
  if (META.has(src) && (cont.endsWith('-diagnostico') || (it.utm_campaign || '').includes('diagnostico'))) return ['Meta diagnóstico', null];
  if (META.has(src)) return [(!cont || cont.endsWith('-app')) ? 'Meta app' : 'Meta LP', null];
  if (src === 'smartli.ink') {
    const slug = cont.startsWith('perfil-') ? cont.slice('perfil-'.length) : null;
    if (med === 'indicacao') return ['Convite do Indique e Ganhe', slug];
    if (med === 'direto') return ['Digitou smartli.ink', null];
    return ['Página de outro corretor', slug];
  }
  if (src === 'org-instagram') return ['Instagram sem anúncio', cont === 'bio' ? 'bio do @matchhouse.br' : null];
  if (src === 'org-google' || src === 'org-busca') return ['Busca no Google', null];
  if (src === 'org-whatsapp') return ['WhatsApp', null];
  if (src.startsWith('org-')) return ['Outro site', src.slice(4)];
  if (src === 'qr') return ['QR (placa ou cartão)', null];
  if (src === 'nfc') return ['Cartão NFC', null];
  if (!src || src === 'direto' || src === 'teste_manual') return ['Sem origem', null];
  return [`Outra (${src})`, null];
}

function contar(itens, de, ate) {
  const res = {};
  const novo = () => ({ contas: 0, concluiram: 0, publicaram: 0, quem_trouxe: {} });
  for (const it of itens) {
    const dia = diaBRT(it.cadastro_em);
    if (dia < de || dia > ate) continue;
    const [o, slug] = origem(it);
    const r = (res[o] ||= novo());
    r.contas += 1;
    r.concluiram += it.sms_verificado_em ? 1 : 0;
    r.publicaram += (it.publicados || 0) > 0 ? 1 : 0;
    if (slug) r.quem_trouxe[slug] = (r.quem_trouxe[slug] || 0) + 1;
  }
  for (const k of SEMPRE) res[k] ||= novo();
  const chaves = [...ORDEM.filter(k => k in res), ...Object.keys(res).filter(k => !ORDEM.includes(k)).sort()];
  const out = {};
  for (const k of chaves) {
    if (!Object.keys(res[k].quem_trouxe).length) delete res[k].quem_trouxe;
    out[k] = res[k];
  }
  const soma = x => Object.values(res).reduce((s, v) => s + v[x], 0);
  out.Total = { contas: soma('contas'), concluiram: soma('concluiram'), publicaram: soma('publicaram') };
  return out;
}

const ontem = process.argv[2];
const inicioMes = ontem.slice(0, 8) + '01';
const seteAtras = somaDias(ontem, -6);
const de = inicioMes < seteAtras ? inicioMes : seteAtras;
const vistos = new Set(), itens = [];
for (const it of buscar(de, ontem)) {
  if (INTERNOS.has(it.id_user) || vistos.has(it.id_user)) continue;
  vistos.add(it.id_user);
  itens.push(it);
}
console.log(JSON.stringify({
  ontem: contar(itens, ontem, ontem),
  '7 dias': contar(itens, seteAtras, ontem),
  'mês': contar(itens, inicioMes, ontem),
}, null, 1));
