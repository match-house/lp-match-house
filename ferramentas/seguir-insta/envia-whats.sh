#!/usr/bin/env bash
# WhatsApp "Siga a Match House no Instagram" (Mateus, 22/10: "e depois um
# whatsapp para os que falterem" e "pode tudo"): modelo mh_seguir_instagram_1,
# {{1}} primeiro nome e {{2}} smartli.ink/<slug>. Vai só a quem recebeu o
# e-mail há 3 dias ou mais, não tocou no link e tem Smart Link. No máximo
# LIMITE_DIA (30) por dia, para sobrar espaço para o atendimento no 6800 (o
# teto de 50 é do backoffice). DRY=1 faz só a prévia.
# Uso: bash envia-whats.sh lista.json   (a mesma lista do e-mail)
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
CAMPANHA=seguir-instagram-1
LISTA=${1:?lista}
EMAILS=$D/enviados-email.jsonl
LOG=$D/enviados-whats.jsonl
touch "$LOG"
LIMITE_DIA=${LIMITE_DIA:-30}
HOJE=$(TZ=America/Sao_Paulo date +%F)
CORTE=$(date -u -d '3 days ago' +%FT%TZ)

SID=$(curl -sS "$API/templates" | jq -r '.modelos[] | select(.nome == "mh_seguir_instagram_1" and (.status|ascii_downcase) == "approved") | .sid' | head -1)
[ -z "$SID" ] && { echo "mh_seguir_instagram_1 ainda não aprovado pela Meta: nada enviado"; exit 0; }

tocaram=$(curl -sS "$API/links/$CAMPANHA?clicou=1" | jq -c '[.itens[].id_user]')
[ "$tocaram" = "null" ] || [ -z "$tocaram" ] && { echo "não deu para ler quem tocou: nada enviado"; exit 1; }
# quem recebeu o e-mail antes do corte (3 dias)
prontos=$(jq -sc --arg c "$CORTE" '[.[] | select(.status == "enviado" and .em <= $c) | .id_user] | unique' "$EMAILS")

registra() { echo "$1" >> "$LOG"; echo "$1"; }
enviados_hoje() { jq -r 'select(.status == "enviado") | .em' "$LOG" 2>/dev/null | while read -r e; do TZ=America/Sao_Paulo date -d "$e" +%F; done | grep -c "^$HOJE$"; }

while read -r p; do
  if [ "$(enviados_hoje)" -ge "$LIMITE_DIA" ]; then echo "reserva: $LIMITE_DIA hoje; o resto fica para amanhã"; break; fi
  id=$(jq -r .id_user <<<"$p")
  grep -q "\"id_user\":$id,\"status\":\"\(enviado\|recusado\)\"" "$LOG" && continue
  jq -e --argjson id "$id" 'index($id) != null' >/dev/null <<<"$prontos" || continue
  jq -e --argjson id "$id" 'index($id) != null' >/dev/null <<<"$tocaram" && continue
  nome=$(jq -r '.primeiro // ""' <<<"$p"); slug=$(jq -r '.slug // ""' <<<"$p")
  [ -z "$slug" ] || [ -z "$nome" ] && continue
  body=$(jq -n --argjson id "$id" --arg sid "$SID" --arg n "$nome" --arg l "smartli.ink/$slug" \
    '{id_user: $id, channel: "whatsapp", kind: "modelo", template_sid: $sid, variables: {"1": $n, "2": $l}}')
  # 29/10: o backoffice tem limite de chamadas por minuto; esperar e tentar de novo (3x), em vez de pular a pessoa
  for _t in 1 2 3; do
    pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
    grep -q "limite de chamadas por minuto" <<<"$pv" || break
    sleep 30
  done
  conf=$(jq -r '.confirmacao // empty' <<<"$pv" 2>/dev/null)
  if [ -z "$conf" ]; then
    registra "$(jq -nc --argjson id "$id" --arg m "$(jq -r '.message // .' <<<"$pv" 2>/dev/null | head -c 300)" '{id_user: $id, status: "previa_recusada", motivo: $m, em: (now|todate)}')"
    grep -q "teto diário" <<<"$pv" && break
    continue
  fi
  if [ "${DRY:-0}" = "1" ]; then
    echo "PRÉVIA $id: $(jq -c '{destinatario: .destinatario.nome, modelo_nome, variaveis, avisos}' <<<"$pv")"
    continue
  fi
  code=$(curl -sS -o "$D/.resp" -w '%{http_code}' -X POST "$API/messages/send" -H 'content-type: application/json' \
    -d "$(jq -c --arg c "$conf" '. + {confirmacao: $c}' <<<"$body")")
  if [ "$code" = "429" ] && grep -q "limite de chamadas por minuto" "$D/.resp"; then sleep 30; continue; fi
  if [ "$code" = "429" ]; then
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "teto_do_dia", em: (now|todate)}')"
    break
  fi
  if [ "${code:0:1}" = "2" ]; then
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "enviado", em: (now|todate)}')"
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
