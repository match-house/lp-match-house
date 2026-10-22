#!/usr/bin/env bash
# E-mail "Siga a Match House no Instagram" (Mateus, 22/10: "e podemos rodar
# para nossos cadastros um email para seguirem..." e "pode tudo"). Assinado
# "Match House", nunca com o nome do Mateus. Um por pessoa; quem já recebeu
# (enviados-email.jsonl) é pulado. O link de cada pessoa é o rastreado
# (/backoffice/links/seguir-instagram-1), para o WhatsApp ir só a quem não
# tocou. DRY=1 faz só a prévia. O teto de 150 e-mails por dia é da API.
# Uso: bash envia-email.sh lista.json   (lista: [{id_user, primeiro, slug}])
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
CAMPANHA=seguir-instagram-1
LISTA=${1:?lista}
LOG=$D/enviados-email.jsonl
LINKS=$D/links.json
touch "$LOG"; [ -s "$LINKS" ] || echo '{}' > "$LINKS"
SUBJ='Siga a Match House no Instagram: dicas para o seu Smart Link'

texto() { # $1 primeiro nome, $2 slug (vazio = ainda sem link), $3 link rastreado
  local saud="Oi, $1." lembrete
  [ -z "$1" ] && saud="Oi."
  if [ -n "$2" ]; then
    lembrete="Lembrete: o seu Smart Link é smartli.ink/$2. Coloque na bio do Instagram e nas suas redes (em Divulgar, botão \"Cole o link na bio do Instagram\"): a IA atende quem chega por ele."
  else
    lembrete="Lembrete: o seu Smart Link ainda não foi criado. Crie em https://app.smartli.ink e coloque o link na bio do Instagram: a IA atende quem chega por ele."
  fi
  cat <<TXT
${saud}

Começamos a publicar no Instagram da Match House conteúdo feito para corretor: como usar o Smart Link no dia a dia, respostas prontas para os seus clientes, ideias para divulgar os seus imóveis (como o QR na placa) e as novidades do app.

Siga: $3

Por lá você também fala com a gente pelo Direct.

${lembrete}

Match House
TXT
}

registra() { echo "$1" >> "$LOG"; echo "$1"; }

# Links de quem ainda não tem, em lotes de 200 (a API devolve o mesmo link se pedir de novo).
faltam=$(jq -c --slurpfile L "$LINKS" '[.[] | .id_user | select(($L[0][tostring]) == null)]' "$LISTA")
for lote in $(jq -c '[_nwise(200)][]' <<<"$faltam"); do
  r=$(curl -sS -X POST "$API/links/$CAMPANHA" -H 'content-type: application/json' -d "$(jq -nc --argjson ids "$lote" '{ids_user: $ids}')")
  jq -e '.itens' >/dev/null 2>&1 <<<"$r" || { echo "links: erro: $(head -c 300 <<<"$r")"; exit 1; }
  jq --argjson r "$r" '. + ([$r.itens[] | {key: (.id_user|tostring), value: .url}] | from_entries)' "$LINKS" > "$LINKS.tmp" && mv "$LINKS.tmp" "$LINKS"
done

while read -r p; do
  id=$(jq -r .id_user <<<"$p")
  if grep -q "\"id_user\":$id,\"status\":\"enviado\"" "$LOG"; then continue; fi
  url=$(jq -r --arg k "$id" '.[$k] // empty' "$LINKS")
  [ -z "$url" ] && { registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "sem_link_rastreado", em: (now|todate)}')"; continue; }
  nome=$(jq -r '.primeiro // ""' <<<"$p"); slug=$(jq -r '.slug // ""' <<<"$p")
  body=$(jq -n --argjson id "$id" --arg s "$SUBJ" --arg t "$(texto "$nome" "$slug" "$url")" \
    '{id_user: $id, channel: "email", kind: "texto", subject: $s, text: $t}')
  pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
  conf=$(jq -r '.confirmacao // empty' <<<"$pv" 2>/dev/null)
  if [ -z "$conf" ]; then
    registra "$(jq -nc --argjson id "$id" --arg m "$(jq -r '.message // .' <<<"$pv" 2>/dev/null | head -c 300)" '{id_user: $id, status: "previa_recusada", motivo: $m, em: (now|todate)}')"
    grep -q "teto diário" <<<"$pv" && break
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
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "enviado", em: (now|todate)}')"
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
