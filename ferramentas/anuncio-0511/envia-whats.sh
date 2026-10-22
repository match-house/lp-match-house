#!/usr/bin/env bash
# WhatsApp do anúncio de 05/11 pelo 6800: modelo mh_aviso_regra_clientes_1
# (aprovado pela Meta, UTILITY), {{1}} primeiro nome e {{2}} "05/11". Envios
# com o "Pode começar amanha" do Mateus (19/10). Um por pessoa; o teto de 50
# por dia é do backoffice. DRY=1 faz só a prévia.
# Uso: bash envia-whats.sh [lista.json]
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
LISTA=${1:-$D/lista-dia1.json}
LOG=$D/enviados-whats.jsonl
touch "$LOG"
# 20/10: mh_aviso_regra_clientes_2, o mesmo aviso com o Indique e Ganhe
# (MARKETING). O _1 era HXedcf8b8e51a95963c3305bfca21387fe.
SID=HXc90bd14f65062296e4d6fe70abd7dd56

registra() { echo "$1" >> "$LOG"; echo "$1"; }

# 20/10: o teto de 50 WhatsApps por dia é o mesmo das respostas de atendimento.
# O aviso usa no máximo LIMITE_DIA (30) por dia, para sempre sobrar espaço
# para responder corretor pelo 6800.
LIMITE_DIA=${LIMITE_DIA:-30}
HOJE=$(TZ=America/Sao_Paulo date +%F)
enviados_hoje() { jq -r --arg d "$HOJE" 'select(.status == "enviado") | .em' "$LOG" 2>/dev/null | while read -r e; do TZ=America/Sao_Paulo date -d "$e" +%F; done | grep -c "^$HOJE$"; }
while read -r p; do
  if [ "$(enviados_hoje)" -ge "$LIMITE_DIA" ]; then echo "reserva: $LIMITE_DIA avisos hoje; o resto fica para amanhã"; break; fi
  id=$(jq -r .id_user <<<"$p")
  if grep -q "\"id_user\":$id,\"status\":\"enviado\"" "$LOG"; then continue; fi
  nome=$(jq -r .primeiro <<<"$p")
  body=$(jq -n --argjson id "$id" --arg sid "$SID" --arg n "$nome" \
    '{id_user: $id, channel: "whatsapp", kind: "modelo", template_sid: $sid, variables: {"1": $n, "2": "05/11"}}')
  pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
  conf=$(jq -r '.confirmacao // empty' <<<"$pv" 2>/dev/null)
  if [ -z "$conf" ]; then
    registra "$(jq -nc --argjson id "$id" --arg m "$(jq -r '.message // .' <<<"$pv" 2>/dev/null | head -c 300)" '{id_user: $id, status: "previa_recusada", motivo: $m, em: (now|todate)}')"
    # 20/10: no teto do dia, parar (o resto da lista sai amanhã).
    grep -q "teto diário" <<<"$pv" && break
    continue
  fi
  if [ "${DRY:-0}" = "1" ]; then
    echo "PRÉVIA $id: $(jq -c '{destinatario: .destinatario.nome, modelo_nome, variaveis, avisos}' <<<"$pv")"
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
