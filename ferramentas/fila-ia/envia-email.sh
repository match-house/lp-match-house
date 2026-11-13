#!/usr/bin/env bash
# E-mail da fila "IA no seu WhatsApp" (Mateus, 13/11: "Pode fazer o 1 e o 2.
# preço normal"). Sem data e sem preço: só que vai ser do Plano Pro. O link
# abre a tela do app com ?quero=1, que põe a conta na fila ao abrir (com o
# login). Quem teve cliente escrevendo recebe a frase com o número dele (só
# o dele). Um por pessoa (enviados-email.jsonl). LIMITE por rodada (padrão
# 100); o teto de 150 e-mails por dia é da API. DRY=1 faz só a prévia.
# Uso: bash envia-email.sh lista.json
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
LISTA=${1:?lista}
LOG=$D/enviados-email.jsonl
touch "$LOG"
LIMITE=${LIMITE:-100}
LINK="https://app.smartli.ink/dashboard/whatsapp?quero=1&mh_src=email-fila-ia-1"

corpo() { # $1 linha da lista (json)
  local id nome conv assunto frase texto
  id=$(jq -r .id_user <<<"$1"); nome=$(jq -r .primeiro <<<"$1"); conv=$(jq -r .conversas30d <<<"$1")
  assunto="$nome, a sua IA vai atender também no seu WhatsApp"
  frase=""
  if [ "$conv" -gt 1 ]; then
    frase="
No último mês, a IA do seu Smart Link já atendeu $conv conversas com quem chegou pelo link. No WhatsApp, ela vai atender também quem te chama direto.
"
  elif [ "$conv" = "1" ]; then
    frase="
No último mês, a IA do seu Smart Link já atendeu uma conversa com quem chegou pelo link. No WhatsApp, ela vai atender também quem te chama direto.
"
  fi
  texto="Oi, $nome! Aqui é a Match House.

Vem novidade: a IA do seu Smart Link vai poder atender os clientes também no seu próprio WhatsApp.
$frase
Quando você não consegue responder (à noite, no fim de semana, no meio de uma visita), ela responde na hora, com os seus imóveis, e já marca a visita. Quando você mesmo responde, ela fica quieta naquela conversa. Você continua usando o seu WhatsApp Business normalmente.

Vai ser um recurso do Plano Pro. Quer estar entre os primeiros? Toque no link abaixo e você entra na lista. A gente te avisa assim que liberar:
$LINK

Para já deixar pronto: o número que você usa com os clientes precisa estar no WhatsApp Business (o app com o B no ícone).

Match House"
  jq -n --argjson id "$id" --arg s "$assunto" --arg t "$texto" \
    '{id_user: $id, channel: "email", kind: "texto", subject: $s, text: $t}'
}

registra() { echo "$1" >> "$LOG"; echo "$1"; }
n=0
while read -r p; do
  [ "$n" -ge "$LIMITE" ] && { echo "limite da rodada: $LIMITE"; break; }
  id=$(jq -r .id_user <<<"$p")
  grep -q "\"id_user\":$id,\"status\":\"\(enviado\|recusado\)\"" "$LOG" && continue
  [ -z "$(jq -r '.primeiro // ""' <<<"$p")" ] && continue
  body=$(corpo "$p")
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
    echo "PRÉVIA $id: $(jq -c '{destinatario: .destinatario.nome, assunto, avisos}' <<<"$pv")"
    n=$((n+1)); continue
  fi
  code=$(curl -sS -o "$D/.resp" -w '%{http_code}' -X POST "$API/messages/send" -H 'content-type: application/json' \
    -d "$(jq -c --arg c "$conf" '. + {confirmacao: $c}' <<<"$body")")
  if [ "$code" = "429" ] && grep -q "limite de chamadas por minuto" "$D/.resp"; then sleep 30; continue; fi
  if [ "${code:0:1}" = "2" ]; then
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "enviado", em: (now|todate)}')"
    n=$((n+1))
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
    [ "$code" = "429" ] && break
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
