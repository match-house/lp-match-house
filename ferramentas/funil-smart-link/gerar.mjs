// Gera funil-smart-link.html (formato do relatório "Funil Smart Link Q3").
// Versão em node do gerar.py (25/10: o python pede aprovação a cada vez; o
// Mateus quer as rotinas rodando sozinhas). Mesma página e mesmos totais.
//
// Fonte: backoffice da API (a credencial do ambiente põe o token sozinho).
// Uso: node gerar.mjs   -> escreve funil-smart-link.html ao lado deste arquivo.
// Telefone e e-mail não entram na página.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const INICIO = '2026-07-01';
const SEMANA_ZERO = '2026-06-29'; // segunda-feira antes de 1º/07

// Lista confirmada pelo Mateus em 29/09 (993 segue a confirmar, mas o nome é de teste).
const INTERNOS = {
  1011: 'teste manual (utm teste_manual)',
  1014: 'teste (natalia perim)',
  1033: 'teste (Fred Perim)',
  1095: 'teste (Izis Perim)',
  1096: 'teste (Matheus Costa)',
  980: 'equipe (Leo Zeferino)',
  941: 'teste (slug testematheus)',
  937: 'teste (e-mail @matchhouse)',
  999: 'conta própria (INMC Patrimonial)',
  993: 'teste (nome "yuri teste"), a confirmar',
  3: 'conta interna (Admin, admin-1; confirmada pelo Mateus em 06/10)',
  56: 'conta interna (Match House, match-house-27; confirmada pelo Mateus em 06/10)',
  39: 'conta interna (smartli.ink/matchhouse, confirmada pelo Mateus em 12/10)',
  // Duplicadas, fora dos números pela regra de higiene da lista (Mateus).
  1240: 'conta duplicada (2ª conta; a principal é a 196)',
  1241: 'conta duplicada (2ª conta; a principal é a 1226)',
  1242: 'conta duplicada (3ª conta; a principal é a 1226)',
  836: 'conta duplicada (a principal é a 722)',
  1103: 'conta duplicada (1ª tentativa; a principal é a 1104)',
  1128: 'conta duplicada (2ª conta; a principal é a 1126)',
  1187: 'conta duplicada (2ª conta; a principal é a 1137)',
  1196: 'conta duplicada (2ª conta; a principal é a 560)',
  1238: 'conta duplicada (2ª conta; a principal é a 756)',
  1373: 'conta duplicada (2ª conta; a principal é a 1351)',
  1361: 'conta duplicada (2ª conta; a principal é a 1191)',
  1502: 'conta duplicada (2ª conta; a principal é a 1498)',
  1372: 'conta duplicada (2ª conta; a principal é a 1317)',
};

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const META_SRC = new Set(['meta', 'ig', 'fb', 'facebook', 'instagram']);

// Horário de Brasília (UTC-3): um Date "deslocado", lido com os getUTC*.
const brt = iso => new Date(new Date(iso).getTime() - 3 * 3600e3);
const p2 = n => String(n).padStart(2, '0');
const dia = d => d.toISOString().slice(0, 10);              // AAAA-MM-DD
const ddmm = d => `${p2(d.getUTCDate())}/${p2(d.getUTCMonth() + 1)}`;
const hhmm = d => `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`;
const maisDias = (d, n) => new Date(d.getTime() + n * 86400e3);
const deDia = s => new Date(s + 'T00:00:00Z');

const curl = url => execFileSync('curl', ['-sS', '--fail', '--max-time', '40', url], { encoding: 'utf8' });

function buscar(de, ate) {
  const itens = [];
  for (let pagina = 1; ; pagina++) {
    const d = JSON.parse(curl(`https://api.matchhouse.com.br/backoffice/signups?from=${de}&to=${ate}&page=${pagina}&page_size=100`));
    itens.push(...d.items);
    if (pagina >= d.total_pages) return itens;
  }
}

function canal(it) {
  const s = (it.utm_source || '').trim().toLowerCase();
  if (!s) return 'Sem UTM';
  // Link da bio marcado pelo próprio Instagram (ig / social): orgânico, não anúncio (25/10).
  if (META_SRC.has(s) && (it.utm_medium || '').trim().toLowerCase() === 'social') return 'Outros';
  if (META_SRC.has(s)) return 'Meta';
  if (s === 'google') return 'Google';
  return 'Outros';
}

function etapa(it) {
  if (!it.slug) return 1;
  if (!it.imoveis_total) return 2;
  if (!it.publicados) return 3;
  return 4;
}

const ETAPAS = [
  ['login_pendente', 'Entrou e não confirmou o celular'],
  ['link_vazio', 'Link no ar, sem imóvel'],
  ['rascunho', 'Imóvel em rascunho'],
  ['publicado', 'Publicou imóvel'],
  ['ia_respondeu', 'A IA já atendeu um cliente'],
];

const esteira = dias => JSON.parse(curl(`https://api.matchhouse.com.br/backoffice/activation/whatsapp?days=${dias}`));

const ehNum = v => typeof v === 'number';
// a - b em cada número: days=N conta de N-1 dias atrás até agora.
function menos(a, b) {
  if (a && typeof a === 'object' && !Array.isArray(a)) {
    const out = {};
    for (const [k, v] of Object.entries(a)) out[k] = menos(v, (b && typeof b === 'object' && !Array.isArray(b)) ? b[k] : undefined);
    return out;
  }
  if (ehNum(a)) return a - (ehNum(b) ? b : 0);
  return a;
}

function tabelaEsteira(d) {
  const em = d.emails, wa = d.whatsapp;
  const head = '<thead><tr><th>Etapa</th><th class="r">E-mails</th><th class="r">Erro</th>' +
    '<th class="r">WhatsApp</th><th class="r">Entregues</th><th class="r">Lidos</th>' +
    '<th class="r">Falhou</th></tr></thead>';
  const linhas = [];
  for (const [chave, nome] of [...ETAPAS, ['total', 'Total']]) {
    const e = chave === 'total' ? em.total : (em.por_etapa[chave] || {});
    const w = chave === 'total' ? wa.total : (wa.por_etapa[chave] || {});
    const falhou = (w.falhou || 0) + (w.erro || 0);
    const [b0, b1] = chave === 'total' ? ['<b>', '</b>'] : ['', ''];
    linhas.push(
      `<tr><td>${b0}${nome}${b1}</td><td class="r num">${b0}${e.enviados ?? 0}${b1}</td>` +
      `<td class="r num">${e.erro ?? 0}</td><td class="r num">${b0}${w.enviados ?? 0}${b1}</td>` +
      `<td class="r num">${w.entregues ?? 0}</td><td class="r num">${w.lidos ?? 0}</td>` +
      `<td class="r num">${falhou}</td></tr>`);
  }
  return `<table>${head}<tbody>${linhas.join('')}</tbody></table>`;
}

function respostas(d) {
  const r = d.respostas || {};
  const pausa = (d.pausa_automatica || {}).houve;
  return `Mensagens recebidas no WhatsApp: <b>${r.mensagens_recebidas ?? 0}</b> · ` +
    `pediram SAIR: <b>${r.sair ?? 0}</b> · VOLTAR: <b>${r.voltar ?? 0}</b> · ` +
    `autorizaram pelo link: <b>${r.autorizaram_pelo_link ?? 0}</b> · ` +
    `pausa automática: <b>${pausa ? 'sim' : 'não'}</b>`;
}

function blocoEsteira(hoje) {
  let d1, d2, d8;
  try { d1 = esteira(1); d2 = esteira(2); d8 = esteira(8); } catch (erro) { // a página sai mesmo se a esteira não responder
    return `<div class="panel"><p class="sub">A esteira não respondeu agora (${erro.message}).</p></div>`;
  }
  const ontem = menos(d2, d1), semana = menos(d8, d1);
  const de = maisDias(hoje, -7), ate = maisDias(hoje, -1);
  const partes = [
    `<div class="panel scroll"><h3>Ontem, ${ddmm(ate)}</h3>${tabelaEsteira(ontem)}` +
    `<p class="sub" style="margin-top:10px">${respostas(ontem)}</p></div>`,
    `<div class="panel scroll"><h3>Últimos 7 dias fechados, ${ddmm(de)} a ${ddmm(ate)}</h3>${tabelaEsteira(semana)}` +
    `<p class="sub" style="margin-top:10px">${respostas(semana)}</p></div>`,
  ];
  const novidades = path.join(AQUI, '..', 'novidades', 'envios.json');
  if (fs.existsSync(novidades)) {
    const reg = JSON.parse(fs.readFileSync(novidades, 'utf8'));
    const env = reg.filter(x => x.status === 'enviado');
    const enviados = new Set(env.map(x => x.id_user));
    const pulados = new Set(reg.filter(x => x.status !== 'enviado').map(x => x.id_user).filter(u => !enviados.has(u)));
    const porGrupo = g => env.filter(x => x.grupo === g).length;
    partes.push(
      '<div class="panel"><h3>E-mails de novidades (30/09 a 02/10)</h3><p class="sub">' +
      `Enviados: <b>${env.length}</b>, sendo <b>${porGrupo('A')}</b> para quem tem imóvel (fotos: capa, ordem e ` +
      `remover) e <b>${porGrupo('B')}</b> para quem tem link sem imóvel. Ainda não receberam: ` +
      `<b>${pulados.size}</b> (a esteira já tinha mandado e-mail no dia ou o teto do dia chegou; ` +
      'saem no lote seguinte).</p></div>');
  }
  return partes.join('\n  ');
}

const PAGO = new Set(['succeeded', 'paid']);
const SITUACAO = { refunded: 'devolvido', refunding: 'devolvendo' };
const FORMA = { card: 'cartão', pix: 'Pix', pix_automatico: 'Pix (C6)' };

function brl(v) {
  const [i, c] = v.toFixed(2).split('.');
  return 'R$ ' + i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + c;
}

// Vendas do Pro (backoffice /pro/vendas, api #116). {erro} se a rota não responder.
function vendas() {
  try { return JSON.parse(curl('https://api.matchhouse.com.br/backoffice/pro/vendas?dias=400')); } catch (erro) { return { erro: erro.message }; }
}

// id_user -> {nome, data} da primeira compra do Pro paga e não devolvida (sem renovações).
function compradores(d) {
  const out = {};
  for (const p of d.pagamentos || []) {
    if (INTERNOS[p.id_user] || !PAGO.has(p.status) || (p.valor || 0) <= 0) continue;
    const dt = dia(brt(p.em));
    if (!out[p.id_user] || dt < out[p.id_user].data) out[p.id_user] = { nome: (p.nome || '').split(' ')[0] || 'Sem nome', data: dt };
  }
  return out;
}

// Vendas do Pro (Mateus, 21/10: "as vendas podem entrar no funil diario e no funil").
function blocoVendas(hoje, idsFunil, d) {
  if (d.erro) return `<div class="panel"><p class="sub">As vendas não responderam agora (${d.erro}).</p></div>`;
  const ass = (d.assinantes || []).filter(a => !INTERNOS[a.id_user]);
  const pags = (d.pagamentos || []).filter(p => !INTERNOS[p.id_user]).map(p => ({ ...p, _dia: brt(p.em) }));
  pags.sort((a, b) => a._dia - b._dia);
  const mes = dia(hoje).slice(0, 7);
  const pagosMes = pags.filter(p => PAGO.has(p.status) && (p.valor || 0) > 0 && dia(p._dia).slice(0, 7) === mes);
  const receita = pagosMes.reduce((s, p) => s + p.valor, 0);
  const cancel = ass.filter(a => a.cancelamento_pedido_em);
  const nomeMes = MESES[hoje.getUTCMonth()].toLowerCase();
  const kpis = [
    [ass.length, 'Assinantes ativos', 'só corretores, sem contas internas'],
    [pagosMes.length, `Vendas em ${nomeMes}`, 'assinaturas e renovações pagas'],
    [brl(receita), `Receita de ${nomeMes}`, 'pago e não devolvido'],
    [cancel.length, 'Pediram para cancelar', 'o Pro vale até o fim do período pago'],
  ];
  const kp = kpis.map(([v, l, dsc]) => `<div class="kpi"><span class="v num">${v}</span><span class="l">${l}</span>` +
    `<span class="d">${dsc}</span></div>`).join('');
  const linhas = [], vistos = new Set();
  for (const p of pags) {
    let sit;
    if (PAGO.has(p.status) && (p.valor || 0) > 0) {
      const tipo = vistos.has(p.id_user) ? 'renovação' : 'assinou';
      vistos.add(p.id_user);
      const prazo = deDia(dia(maisDias(p._dia, 7)));
      sit = prazo >= hoje ? `${tipo}; pode desistir até ${ddmm(prazo)}` : tipo;
    } else {
      sit = SITUACAO[p.status] || 'não concluiu o pagamento';
    }
    const nome = (p.nome || '').split(' ')[0] || '(sem nome)';
    linhas.push(`<tr><td class="num">${ddmm(p._dia)} ${hhmm(p._dia)}</td><td>${nome} (${p.id_user})</td>` +
      `<td>${FORMA[p.metodo] || p.metodo || '—'}</td>` +
      `<td class="r num">${brl(p.valor || 0)}</td><td style="white-space:nowrap">${sit}</td></tr>`);
  }
  linhas.reverse();
  const tabela = '<table><thead><tr><th>Quando</th><th>Corretor</th><th>Forma</th><th class="r">Valor</th>' +
    `<th>Situação</th></tr></thead><tbody>${linhas.join('') || '<tr><td colspan=5>Nenhuma venda ainda.</td></tr>'}` +
    '</tbody></table>';
  const fora = [...ass].sort((a, b) => a.id_user - b.id_user).filter(a => !idsFunil.has(a.id_user))
    .map(a => `${(a.nome || '').split(' ')[0] || 'Sem nome'} (${a.id_user})`);
  const nota = fora.length === 1
    ? ` ${fora[0]} entrou antes de 1º/07, com uma conta do app antigo: não aparece nas etapas 1 a 4 abaixo, e na etapa 5 entra pela data da compra.`
    : fora.length
      ? ` ${fora.join(', ')} entraram antes de 1º/07, com contas do app antigo: não aparecem nas etapas 1 a 4 abaixo, e na etapa 5 entram pela data da compra.`
      : '';
  return `<div class="kpis">${kp}</div><div class="panel scroll">${tabela}` +
    `<p class="sub" style="margin-top:10px">Contas internas e de teste ficam fora.${nota}</p></div>`;
}

function main() {
  const agora = brt(new Date().toISOString());
  const hoje = deDia(dia(agora));

  const brutos = [];
  for (let ini = deDia(INICIO); ini <= hoje;) {
    const fimMes = new Date(Date.UTC(ini.getUTCFullYear(), ini.getUTCMonth() + 1, 0));
    const fim = fimMes < hoje ? fimMes : hoje;
    brutos.push(...buscar(dia(ini), dia(fim)));
    ini = maisDias(fim, 1);
  }

  let linhas = brutos.map(it => {
    const quando = brt(it.cadastro_em);
    return {
      id: it.id_user,
      nome: (it.nome || '').trim() || '(sem nome)',
      data: dia(quando),
      hora: hhmm(quando),
      mes: dia(quando).slice(0, 7),
      sms: Boolean(it.sms_verificado_em),
      slug: it.slug || null,
      imv: it.imoveis_total || 0,
      pub: it.publicados || 0,
      src: it.utm_source || '',
      cont: it.utm_content || '',
      canal: canal(it),
      etapa: etapa(it),
      interno: INTERNOS[it.id_user] ?? null,
      _ord: quando.toISOString(),
    };
  });
  // Etapa 5 (Mateus, 21/10: "depois do publicou agora, é o venda"): quem pagou o Pro.
  const dv = vendas();
  const pro = compradores(dv);
  for (const r of linhas) if (pro[r.id]) r.etapa = 5;
  const idsFunil = new Set(linhas.map(r => r.id));
  const proOrd = Object.entries(pro).map(([i, c]) => [Number(i), c]);
  const antigos = [...proOrd].sort((a, b) => a[0] - b[0]).filter(([i]) => !idsFunil.has(i)).map(([i, c]) => ({ id: i, nome: c.nome }));
  // A etapa 5 conta pela data da compra (Mateus, 21/10: "o enio deveria aparecer").
  const vendasPro = [...proOrd].sort((a, b) => a[1].data.localeCompare(b[1].data))
    .map(([i, c]) => ({ id: i, nome: c.nome, data: c.data, mes: c.data.slice(0, 7) }));
  linhas.sort((a, b) => b._ord.localeCompare(a._ord));
  linhas = linhas.map(({ _ord, ...r }) => r);

  const meses = [...new Set(linhas.map(r => r.mes))].sort();
  const months = meses.map(m => [m, MESES[Number(m.slice(5)) - 1], ABREV[Number(m.slice(5)) - 1]]);
  const semanas = Math.floor((hoje - deDia(SEMANA_ZERO)) / 86400e3 / 7) + 1;
  const diasUltima = ((hoje.getUTCDay() + 6) % 7) + 1; // segunda = 1
  const internos = linhas.filter(r => r.interno).length;
  const ultimoMes = MESES[hoje.getUTCMonth()].toLowerCase();
  const fechaHoje = maisDias(hoje, 1).getUTCMonth() !== hoje.getUTCMonth();

  const h1 = `Funil de cadastros de corretores, ${ABREV[Number(meses[0].slice(5)) - 1].toLowerCase()}–` +
    `${ABREV[Number(meses[meses.length - 1].slice(5)) - 1].toLowerCase()} ${hoje.getUTCFullYear()}`;
  const hojeTxt = `${ddmm(hoje)}/${hoje.getUTCFullYear()}`;
  const sub = `Todos os cadastros de 1º/07 a ${hojeTxt} (horário de Brasília), acompanhados até a ` +
    `publicação do primeiro imóvel. Dados de ${ddmm(hoje)} às ${p2(agora.getUTCHours())}h${p2(agora.getUTCMinutes())}` +
    `${fechaHoje ? '' : `; ${ultimoMes} ainda não fechou`}. ${internos} contas internas, de teste ` +
    'ou duplicadas ficaram fora dos números e estão listadas no fim da página.';
  const ultima = diasUltima === 7 ? '' : (diasUltima === 1 ? ' A última semana tem só um dia.' : ` A última semana tem só ${diasUltima} dias.`);
  const meta = { periodo: `1º/07 a ${ddmm(hoje)}`, semanas, parcial: diasUltima < 7 };

  let html = fs.readFileSync(path.join(AQUI, 'template.html'), 'utf8');
  const trocas = {
    __DATA__: JSON.stringify(linhas),
    __MONTHS__: JSON.stringify(months),
    __META__: JSON.stringify(meta),
    __H1__: h1,
    __SUB__: sub,
    __ULTIMA__: ultima,
    __MESES_NOTA__: months.length > 3 ? ' Mostra os três últimos meses.' : '',
    __MESES_OPT__: months.map(([m, n]) => `<option value="${m}">${n}</option>`).join(''),
    __ESTEIRA__: blocoEsteira(hoje),
    __VENDAS__: blocoVendas(hoje, idsFunil, dv),
    __PRO__: JSON.stringify({ antigos, vendas: vendasPro }),
  };
  for (const [chave, valor] of Object.entries(trocas)) {
    if (html.split(chave).length !== 2) throw new Error(`marcador ${chave} não aparece uma vez só no template`);
    html = html.replace(chave, () => valor);
  }
  fs.writeFileSync(path.join(AQUI, 'funil-smart-link.html'), html);

  const fora = linhas.filter(r => !r.interno);
  const conta = f => fora.filter(f).length;
  console.log(JSON.stringify({
    gerado: `${ddmm(agora)} ${hhmm(agora)}`,
    cadastros: linhas.length, fora: internos, contam: fora.length,
    link: conta(r => r.etapa >= 2),
    imovel: conta(r => r.etapa >= 3),
    publicou: conta(r => r.etapa >= 4),
    compraram: conta(r => r.etapa >= 5), compraram_conta_antiga: antigos.length,
    por_mes: Object.fromEntries(meses.map(m => [m, [conta(r => r.mes === m), conta(r => r.mes === m && r.etapa >= 4)]])),
  }));
}

main();
