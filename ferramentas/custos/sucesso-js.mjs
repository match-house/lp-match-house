// Constante SUCESSO do funil diário, a partir da saída do sucesso.mjs.
// Uso: node custos/sucesso-js.mjs sucesso.json > d1108/sucesso-const.js
import fs from 'fs';
const s = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const dia = s.atualizado.split('-').reverse().slice(0, 2).join('/');
s.nota = `Até ${dia}, contando hoje. Base: corretores com pelo menos 1 imóvel no ar, sem contas internas, de teste e duplicadas. ` +
  `Cliente é um celular diferente do celular do próprio corretor, deixado na conversa com a IA do Smart Link (o corretor testando com o próprio número não conta). ` +
  `A origem das visitas é gravada desde 22/10, então os 30 dias ainda contam só a parte a partir daí. ` +
  `"Link na bio" junta quem tocou em "colei o link" no app (${s.bio - s.bio_confirmada}) e quem já recebeu visita pelo navegador do Instagram desde 17/10 (${s.bio_confirmada}). ` +
  `Fontes: backoffice (visitas/origens, leads e relatorio-pro) e o ranking dos corretores.` +
  (s.d7.conversas_incompletas || s.d30.conversas_incompletas ? ' Atenção: a leitura das conversas veio incompleta.' : '');
console.log('  /* Sucesso do cliente (Mateus, 08/11: "Pode colocar no funil diário"): trocar todo dia com custos/sucesso.mjs. */\n  const SUCESSO = ' +
  JSON.stringify(s, null, 2).split('\n').map((l, i) => i ? '  ' + l : l).join('\n') + ';');
