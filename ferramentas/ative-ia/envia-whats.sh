#!/usr/bin/env bash
# WhatsApp "ponha a sua IA para trabalhar" (Mateus, 08/11), modelo mh_ative_ia_2 (com o passo do WhatsApp Business; antes
# mh_ative_ia_1): {{1}} primeiro nome, {{2}} "5 imóveis" ou "1 imóvel",
# {{3}} smartli.ink/<slug> e {{4}} <slug>?mh_src=whatsapp-ative-1 (o fim do
# botão para app.smartli.ink/bio/...). Vai só a quem recebeu o e-mail num dia
# anterior. No máximo LIMITE_DIA (30) por dia, somando as campanhas (regra de
# 22/10). DRY=1 faz só a prévia.
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

SID=$(curl -sS "$API/templates" | jq -r '.modelos[] | select(.nome == "mh_ative_ia_2" and (.status|ascii_downcase) == "approved") | .sid' | head -1)
[ -z "$SID" ] && { echo "mh_ative_ia_2 ainda não aprovado pela Meta: nada enviado"; exit 0; }

# quem recebeu o e-mail antes de hoje (dia de Brasília)
prontos=$(jq -sc --arg h "$HOJE" '[.[] | select(.status == "enviado") | select((.em | sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601 - 10800 | strftime("%Y-%m-%d")) < $h) | .id_user] | unique' "$EMAILS")

registra() { echo "$1" >> "$LOG"; echo "$1"; }
enviados_hoje() { jq -r 'select(.status == "enviado") | .em' "$LOG" 2>/dev/null | while read -r e; do TZ=America/Sao_Paulo date -d "$e" +%F; done | grep -c "^$HOJE$"; }

while read -r p; do
  if [ "$(enviados_hoje)" -ge "$LIMITE_DIA" ]; then echo "reserva: $LIMITE_DIA hoje; o resto fica para amanhã"; break; fi
  id=$(jq -r .id_user <<<"$p")
  grep -q "\"id_user\":$id,\"status\":\"\(enviado\|recusado\)\"" "$LOG" && continue
  jq -e --argjson id "$id" 'index($id) != null' >/dev/null <<<"$prontos" || continue
  nome=$(jq -r '.primeiro // ""' <<<"$p"); slug=$(jq -r '.slug // ""' <<<"$p"); im=$(jq -r .imoveis <<<"$p")
  [ -z "$slug" ] || [ -z "$nome" ] && continue
  [ "$im" = "1" ] && qtd="1 imóvel" || qtd="$im imóveis"
  body=$(jq -n --argjson id "$id" --arg sid "$SID" --arg n "$nome" --arg q "$qtd" --arg l "smartli.ink/$slug" --arg s "$slug?mh_src=whatsapp-ative-1" \
    '{id_user: $id, channel: "whatsapp", kind: "modelo", template_sid: $sid, variables: {"1": $n, "2": $q, "3": $l, "4": $s}}')
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
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "enviado", em: (now|todate)}')"
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
