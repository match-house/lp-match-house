#!/usr/bin/env bash
# WhatsApp da fila "IA no seu WhatsApp" (Mateus, 13/11: "Pode fazer o 1 e o
# 2. preço normal"). Modelo mh_fila_ia_whatsapp_1, com o botão "Quero ser
# avisado": o toque chega ao webhook do 6800, grava a conta na fila e
# confirma na hora. {{1}} primeiro nome. Vai só a quem recebeu o e-mail num
# dia anterior e ainda não entrou na fila. No máximo LIMITE_DIA (30) por dia,
# somando as campanhas (regra de 22/10). DRY=1 faz só a prévia.
# Uso: bash envia-whats.sh lista.json
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
LISTA=${1:?lista}
EMAILS=$D/enviados-email.jsonl
LOG=$D/enviados-whats.jsonl
touch "$LOG" "$EMAILS"
LIMITE_DIA=${LIMITE_DIA:-30}
HOJE=$(TZ=America/Sao_Paulo date +%F)

SID=$(curl -sS "$API/templates" | jq -r '.modelos[]? | select(.nome == "mh_fila_ia_whatsapp_1" and (.status|ascii_downcase) == "approved") | .sid' | head -1)
[ -z "$SID" ] && { echo "mh_fila_ia_whatsapp_1 ainda não aprovado pela Meta: nada enviado"; exit 0; }
NA_FILA=$(curl -sS "$API/whatsapp-corretor/fila" | jq -c '[.itens[]?.id_user]')
prontos=$(jq -sc --arg h "$HOJE" '[.[] | select(.status == "enviado") | select((.em | sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601 - 10800 | strftime("%Y-%m-%d")) < $h) | .id_user] | unique' "$EMAILS")

registra() { echo "$1" >> "$LOG"; echo "$1"; }
enviados_hoje() { jq -r 'select(.status == "enviado") | .em' "$LOG" 2>/dev/null | while read -r e; do TZ=America/Sao_Paulo date -d "$e" +%F; done | grep -c "^$HOJE$"; }

while read -r p; do
  if [ "$(enviados_hoje)" -ge "$LIMITE_DIA" ]; then echo "reserva: $LIMITE_DIA hoje; o resto fica para amanhã"; break; fi
  # O teto de 30 por dia é de todas as campanhas juntas (regra de 22/10): o
  # backoffice conta os modelos de WhatsApp que saíram hoje, de qualquer script.
  tot=$(curl -sS -m 30 "$API/messages?page_size=1" | jq -r '.hoje.whatsapp_modelos // empty' 2>/dev/null)
  if [ -z "$tot" ]; then echo "não deu para ler o total do dia: parando por segurança"; break; fi
  if [ "$tot" -ge "$LIMITE_DIA" ]; then echo "teto do dia: $tot modelos de WhatsApp hoje, somando as campanhas"; break; fi
  id=$(jq -r .id_user <<<"$p")
  grep -q "\"id_user\":$id,\"status\":\"\(enviado\|recusado\)\"" "$LOG" && continue
  jq -e --argjson id "$id" 'index($id) != null' >/dev/null <<<"$prontos" || continue
  jq -e --argjson id "$id" 'index($id) != null' >/dev/null <<<"$NA_FILA" && continue
  nome=$(jq -r '.primeiro // ""' <<<"$p")
  [ -z "$nome" ] && continue
  body=$(jq -n --argjson id "$id" --arg sid "$SID" --arg n "$nome" \
    '{id_user: $id, channel: "whatsapp", kind: "modelo", template_sid: $sid, variables: {"1": $n}}')
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
  if [ "$code" = "429" ]; then registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "teto_do_dia", em: (now|todate)}')"; break; fi
  if [ "${code:0:1}" = "2" ]; then
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "enviado", modelo: "mh_fila_ia_whatsapp_1", em: (now|todate)}')"
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
