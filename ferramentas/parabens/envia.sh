#!/usr/bin/env bash
# Parabéns a quem recebeu cliente pela IA (Mateus, 08/11: "Manda uma mensagem
# de parabéns para os 5"). Modelo mh_parabens_cliente_1: {{1}} nome, {{2}}
# smartli.ink/<slug>. DRY=1 só faz a prévia. Uso: bash envia.sh lista.json
set -u
D=$(cd "$(dirname "$0")" && pwd); API=https://api.matchhouse.com.br/backoffice; LOG=$D/enviados.jsonl; touch "$LOG"
SID=$(curl -sS "$API/templates" | jq -r '.modelos[] | select(.nome=="mh_parabens_cliente_1" and (.status|ascii_downcase)=="approved") | .sid' | head -1)
[ -z "$SID" ] && { echo "modelo ainda não aprovado"; exit 1; }
jq -c '.[]' "${1:?lista}" | while read -r p; do
  id=$(jq -r .id_user <<<"$p")
  grep -q "\"id_user\":$id,\"status\":\"enviado\"" "$LOG" && continue
  body=$(jq -c --arg sid "$SID" '{id_user, channel: "whatsapp", kind: "modelo", template_sid: $sid, variables: {"1": .nome, "2": .link}}' <<<"$p")
  pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
  conf=$(jq -r '.confirmacao // empty' <<<"$pv" 2>/dev/null)
  if [ -z "$conf" ]; then echo "{\"id_user\":$id,\"status\":\"previa_recusada\",\"motivo\":$(jq -c '.message // .' <<<"$pv" 2>/dev/null || echo null)}" | tee -a "$LOG"; continue; fi
  [ "${DRY:-0}" = "1" ] && { echo "PRÉVIA $id: $(jq -c '{d: .destinatario.nome, avisos}' <<<"$pv")"; continue; }
  r=$(curl -sS -X POST "$API/messages/send" -H 'content-type: application/json' -d "$(jq -c --arg c "$conf" '. + {confirmacao: $c}' <<<"$body")")
  if [ "$(jq -r '.status // empty' <<<"$r")" = "enviado" ]; then
    jq -nc --argjson id "$id" --argjson m "$(jq '.id_mensagem' <<<"$r")" '{id_user: $id, status: "enviado", id_mensagem: $m, em: (now|todate)}' | tee -a "$LOG"
  else echo "{\"id_user\":$id,\"status\":\"recusado\",\"resp\":$(jq -c . <<<"$r" 2>/dev/null || echo null)}" | tee -a "$LOG"; fi
  sleep 3
done
