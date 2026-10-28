#!/usr/bin/env node
// Cadastros por dia para o CAC da área de custos (pedido do Mateus em 30/09).
// Versão em node do cac.py (25/10: o python pede aprovação a cada vez; o
// Mateus quer as rotinas rodando sozinhas). Mesma saída e mesmas listas.
//
// Uso: node cac.mjs 2026-10 [ate]  -> imprime {"funil": {...}} para o update do doc do mês.
//
// - cadastros: contas criadas no dia (horário de Brasília), sem contas internas/teste;
// - pagos: desses, os que vieram de anúncio (utm_source Meta, Google ou ChatGPT);
// - publicaram: desses, os que já publicaram imóvel HOJE (coorte do dia);
// - canais (Mateus, 21/10): por canal (chatgpt, meta, google, sem_anuncio),
//   contas, concluiram (passaram do código) e publicaram por dia.
// Fonte: /backoffice/signups (a credencial do ambiente põe o token sozinho).
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Mesma lista do Funil Smart Link (confirmada pelo Mateus em 29/09; 993 é teste pelo nome).
// Duplicadas (regra de higiene da lista): 1240, 1241, 1242 (10/10); 836, 1103, 1128,
// 1187, 1196, 1238 (11/10); 1373 (da 1351), 1372 (da 1317), 1361 (da 1191) e 1502 (da 1498).
// 39: conta interna (smartli.ink/matchhouse, Mateus em 12/10).
export const INTERNOS = new Set([1011, 1014, 1033, 1095, 1096, 980, 941, 937, 999, 993, 3, 56, 39,
  1240, 1241, 1242, 836, 1103, 1128, 1187, 1196, 1238, 1373, 1372, 1361, 1502]);
export const PAGOS = new Set(['meta', 'ig', 'fb', 'facebook', 'instagram', 'google', 'chatgpt', 'openai']);
export const META = new Set(['meta', 'ig', 'fb', 'facebook', 'instagram']);
// Cadastros que chegaram sem utm, com a origem achada no Amplitude (detalhe de
// cada um no cac.py).
export const ORIGEM_CORRIGIDA = {
  1101: 'meta', 1119: 'meta', 1127: 'meta', 1132: 'meta', 1147: 'meta',
  1157: 'chatgpt', 1159: 'chatgpt', 1161: 'chatgpt',
  1194: 'chatgpt', 1198: 'meta', 1202: 'chatgpt', 1219: 'chatgpt', 1224: 'meta', 1185: 'meta',
  1227: 'chatgpt', 1228: 'chatgpt', 1229: 'chatgpt', 1231: 'chatgpt', 1236: 'chatgpt',
};

// Dia em Brasília (UTC-3) de um instante ISO.
export const diaBRT = iso => new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString().slice(0, 10);
export const hojeBRT = () => diaBRT(new Date().toISOString());
export const somaDias = (dia, n) => new Date(Date.parse(dia + 'T12:00:00Z') + n * 86400e3).toISOString().slice(0, 10);

export function buscar(de, ate) {
  const itens = [];
  for (let pagina = 1; ; pagina++) {
    const url = `https://api.matchhouse.com.br/backoffice/signups?from=${de}&to=${ate}&page=${pagina}&page_size=100`;
    const d = JSON.parse(execFileSync('curl', ['-sS', '--fail', '--max-time', '40', url], { encoding: 'utf8' }));
    itens.push(...d.items);
    if (pagina >= d.total_pages) return itens;
  }
}

// utm_source da conta, com a correção à mão na frente (uma conta antiga sem
// origem pode ganhar uma depois, no login, e não é a do cadastro).
export const origemDe = it => ORIGEM_CORRIGIDA[it.id_user] || (it.utm_source || '').trim().toLowerCase();

// O Instagram marca sozinho os links da bio (utm_source ig, utm_medium social,
// utm_content link_in_bio): é orgânico, não anúncio (achado em 25/10, conta 1471,
// vinda da bio do @matchhouse.br). Os anúncios da Meta vêm com utm_medium cpc.
export const organicoInstagram = it => META.has(origemDe(it)) && (it.utm_medium || '').trim().toLowerCase() === 'social';

export function canalDe(it) {
  const o = origemDe(it);
  if (o === 'chatgpt' || o === 'openai') return 'chatgpt';
  if (o === 'google') return 'google';
  if (META.has(o) && !organicoInstagram(it)) return 'meta';
  return 'sem_anuncio';
}

function main() {
  const mes = process.argv[2];
  const inicio = `${mes}-01`;
  const [ano, m] = mes.split('-').map(Number);
  const fimMes = new Date(Date.UTC(ano, m, 0)).toISOString().slice(0, 10);
  const ontem = somaDias(hojeBRT(), -1);
  const ate = process.argv[3] || (fimMes < ontem ? fimMes : ontem);

  const cad = {}, pagos = {}, pub = {};
  const canais = Object.fromEntries(['chatgpt', 'meta', 'google', 'sem_anuncio'].map(c => [c, { contas: {}, concluiram: {}, publicaram: {} }]));
  const vistos = new Set();
  const mais = (o, k) => { o[k] = (o[k] || 0) + 1; };
  for (const it of buscar(inicio, ate)) {
    if (INTERNOS.has(it.id_user) || vistos.has(it.id_user)) continue;
    vistos.add(it.id_user);
    const k = diaBRT(it.cadastro_em);
    if (k < inicio || k > ate) continue;
    mais(cad, k);
    const c = canalDe(it);
    if (c !== 'sem_anuncio') mais(pagos, k);
    if ((it.publicados || 0) > 0) mais(pub, k);
    mais(canais[c].contas, k);
    if (it.sms_verificado_em) mais(canais[c].concluiram, k);
    if ((it.publicados || 0) > 0) mais(canais[c].publicaram, k);
  }
  const agora = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 16) + '-03:00';
  console.log(JSON.stringify({ funil: {
    cadastros: cad, pagos, publicaram: pub, canais,
    fonte: 'backoffice /signups; sem contas internas, de teste e duplicadas; publicaram = coorte do dia, contada no dia da atualização',
    contado_em: agora,
  } }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
