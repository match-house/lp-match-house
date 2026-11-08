#!/usr/bin/env bash
# WhatsApp "Seu link de cara nova" (Mateus, 08/11: "avise aos que ja estao com
# link na bio [...] manda uma previa de como vai ficar e o que eles tem que
# fazer para colocar no ar"). Modelo mh_bio_cartao_1 (api #160): a imagem da
# prévia no topo, o passo de apagar e colar o link de novo e o botão
# "Atualizar meu link" (app.smartli.ink/bio/{{2}}). {{1}} primeiro nome, {{2}}
# <slug>?mh_src=whatsapp-bio-cartao-1. No máximo LIMITE_DIA (30) por dia,
# somando as campanhas (regra de 22/10): conta também o log da ative-ia.
# DRY=1 faz só a prévia. Uso: bash envia-whats.sh lista.json
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
LISTA=${1:?lista}
LOG=$D/enviados-whats.jsonl
OUTROS="$D/../ative-ia/enviados-whats.jsonl"
touch "$LOG"
LIMITE_DIA=${LIMITE_DIA:-30}
HOJE=$(TZ=America/Sao_Paulo date +%F)

SID=$(curl -sS "$API/templates" | jq -r '.modelos[]? | select(.nome == "mh_bio_cartao_1" and (.status|ascii_downcase) == "approved") | .sid' | head -1)
[ -z "$SID" ] && { echo "mh_bio_cartao_1 ainda não aprovado pela Meta: nada enviado"; exit 0; }

registra() { echo "$1" >> "$LOG"; echo "$1"; }
enviados_hoje() { cat "$LOG" "$OUTROS" 2>/dev/null | jq -r 'select(.status == "enviado") | .em' | while read -r e; do TZ=America/Sao_Paulo date -d "$e" +%F; done | grep -c "^$HOJE$"; }

while read -r p; do
  if [ "$(enviados_hoje)" -ge "$LIMITE_DIA" ]; then echo "reserva: $LIMITE_DIA hoje; o resto fica para amanhã"; break; fi
  id=$(jq -r .id_user <<<"$p")
  grep -q "\"id_user\":$id,\"status\":\"\(enviado\|recusado\)\"" "$LOG" && continue
  nome=$(jq -r '.primeiro // ""' <<<"$p"); slug=$(jq -r '.slug // ""' <<<"$p")
  [ -z "$slug" ] || [ -z "$nome" ] && continue
  body=$(jq -n --argjson id "$id" --arg sid "$SID" --arg n "$nome" --arg s "$slug?mh_src=whatsapp-bio-cartao-1" \
    '{id_user: $id, channel: "whatsapp", kind: "modelo", template_sid: $sid, variables: {"1": $n, "2": $s}}')
  for _t in 1 2 3; do
    pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
    grep -q "limite de chamadas por minuto" <<<"$pv" || break
    sleep 30
  done
  conf=$(jq -r '.confirmacao // empty' <<<"$pv" 2>/dev/null)
  if [ -z "$conf" ]; then
    m=$(jq -r '.message // .' <<<"$pv" 2>/dev/null | head -c 300)
    if [ "${DRY:-0}" = "1" ]; then echo "PRÉVIA RECUSADA $id: $m"; continue; fi
    registra "$(jq -nc --argjson id "$id" --arg m "$m" '{id_user: $id, status: "previa_recusada", motivo: $m, em: (now|todate)}')"
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
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "enviado", modelo: "mh_bio_cartao_1", em: (now|todate)}')"
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
