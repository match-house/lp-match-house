#!/usr/bin/env bash
# E-mail do anúncio de 05/11, assinado "Match House" (texto aprovado pelo
# Mateus em 19/10; trecho do Indique e Ganhe aprovado em 20/10 ("Pode"); envios: "Pode começar amanha"). Um por pessoa; quem já
# recebeu (enviados-email.jsonl) é pulado. DRY=1 faz só a prévia.
# Uso: bash envia-email.sh [lista.json]
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
LISTA=${1:-$D/lista-dia1.json}
LOG=$D/enviados-email.jsonl
touch "$LOG"
SUBJ='Seu Smart Link: o que muda em 05/11, o Plano Pro e o Indique e Ganhe'

texto() { # $1 primeiro nome, $2 slug, $3 lista de espera (true/false)
  local extra="" saud="Oi, $1."
  [ -z "$1" ] && saud="Oi."
  [ "$3" = "true" ] && extra=$'\n\nVocê está na lista do Pro, então fica sabendo primeiro.'
  cat <<TXT
${saud}${extra}

Um aviso sobre o seu Smart Link (smartli.ink/$2).

A partir de 05/11, muda a forma como os contatos dos seus clientes aparecem no plano de entrada:
- o 1º cliente do mês continua chegando na hora, com nome e celular;
- do 2º em diante, o contato aparece 36 horas depois;
- as visitas desses clientes ficam para depois disso.

A IA continua atendendo todos os seus clientes na hora, de dia e de noite. Nenhum cliente fica sem resposta.

Para receber todos na hora, o Plano Pro já está disponível:
- todos os seus clientes com nome e celular, na hora;
- visitas marcadas pela IA a partir de 1 hora depois do contato;
- até 300 imóveis no ar (no plano de entrada, até 100).

O Pro custa R\$ 147 por mês, no cartão. Você cancela quando quiser, pelo app, e tem 7 dias para desistir com o valor de volta.

Novo: Indique e Ganhe. Cada colega corretor que criar o Smart Link pelo seu convite vale 10% de desconto no Pro, por 6 meses. Com 10 colegas valendo ao mesmo tempo, o Pro sai sem cobrança.

O colega passa a contar quando publica o primeiro imóvel e ele fica 7 dias no ar. E quem entra pelo seu convite também ganha 10% no Pro, por 6 meses.

Seu convite está no app, em Indique e Ganhe: https://app.smartli.ink/dashboard/indique

Até 04/11 nada muda: os dois planos recebem todos os clientes na hora.

Assinar o Pro: https://app.smartli.ink/dashboard/pro
Termos atualizados: https://www.matchhouse.com.br/politica-de-privacidade.html

Lembrete: a IA atende quem chega pelo seu link. Coloque o smartli.ink/$2 na bio do Instagram e nas suas redes (em Divulgar, botão "Cole o link na bio do Instagram").

Match House
TXT
}

registra() { echo "$1" >> "$LOG"; echo "$1"; }

while read -r p; do
  id=$(jq -r .id_user <<<"$p")
  if grep -q "\"id_user\":$id,\"status\":\"enviado\"" "$LOG"; then continue; fi
  nome=$(jq -r .primeiro <<<"$p"); slug=$(jq -r .slug <<<"$p"); espera=$(jq -r .espera <<<"$p")
  body=$(jq -n --argjson id "$id" --arg s "$SUBJ" --arg t "$(texto "$nome" "$slug" "$espera")" \
    '{id_user: $id, channel: "email", kind: "texto", subject: $s, text: $t}')
  pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
  conf=$(jq -r '.confirmacao // empty' <<<"$pv" 2>/dev/null)
  if [ -z "$conf" ]; then
    registra "$(jq -nc --argjson id "$id" --arg m "$(jq -r '.message // .' <<<"$pv" 2>/dev/null | head -c 300)" '{id_user: $id, status: "previa_recusada", motivo: $m, em: (now|todate)}')"
    continue
  fi
  if [ "${DRY:-0}" = "1" ]; then
    echo "PRÉVIA $id: $(jq -c '{destinatario: .destinatario.nome, assunto, avisos}' <<<"$pv")"
    continue
  fi
  code=$(curl -sS -o "$D/.resp" -w '%{http_code}' -X POST "$API/messages/send" -H 'content-type: application/json' \
    -d "$(jq -c --arg c "$conf" '. + {confirmacao: $c}' <<<"$body")")
  if [ "$code" = "429" ]; then
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "teto_do_dia", em: (now|todate)}')"
    break
  fi
  if [ "${code:0:1}" = "2" ]; then
    registra "$(jq -nc --argjson id "$id" --arg r "$(jq -c '{id: (.id // .id_mensagem // .mensagem.id // null), status: (.status // null)}' "$D/.resp" 2>/dev/null)" '{id_user: $id, status: "enviado", resposta: $r, em: (now|todate)}')"
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
