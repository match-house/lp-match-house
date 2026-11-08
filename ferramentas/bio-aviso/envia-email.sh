#!/usr/bin/env bash
# E-mail "Seu link de cara nova" (Mateus, 08/11: "avise aos que ja estao com
# link na bio, explica que fizemos atualizacao e manda uma previa de como vai
# ficar e o que eles tem que fazer para colocar no ar"). Arte: a prévia do
# cartão novo com o exemplo da Camila (bio-cartao-novo.jpg). O Instagram guarda
# a imagem antiga do link: o passo é apagar o link e colar de novo, com o
# título "Fale com a minha IA". O botão abre app.smartli.ink/bio/<slug>, com o
# link para copiar e os textos do WhatsApp Business. Assinado "Match House".
# Um por pessoa (enviados-email.jsonl). DRY=1 faz só a prévia.
# Uso: bash envia-email.sh lista.json
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
LISTA=${1:?lista}
LOG=$D/enviados-email.jsonl
touch "$LOG"
IMG="https://raw.githubusercontent.com/match-house/lp-match-house/$(cat "$D/img.commit")/anuncios/email/bio-cartao-novo.jpg"

corpo() { # $1 linha da lista (json)
  local id nome slug titulo assunto texto nota url
  id=$(jq -r .id_user <<<"$1"); nome=$(jq -r .primeiro <<<"$1"); slug=$(jq -r .slug <<<"$1")
  titulo="$nome, o seu Smart Link está de cara nova"
  assunto="$nome, o seu Smart Link está de cara nova"
  url="https://app.smartli.ink/bio/$slug?mh_src=email-bio-cartao-1"
  nota="Seu Smart Link: smartli.ink/$slug. Deixe ele como o primeiro link da bio: é o que aparece em destaque no seu perfil."
  texto="Atualizamos o seu Smart Link: agora, quando alguém vê o seu link no Instagram ou no WhatsApp, aparece a sua foto em destaque e o convite para falar com a sua IA. Veja o exemplo na imagem acima.

O Instagram guarda a imagem antiga do link. Para o cartão novo aparecer na sua bio, são 2 minutos:
1. Toque no botão abaixo e, na página, em “Copiar e abrir o Instagram”.
2. Em Editar perfil › Links, apague o link antigo e cole de novo, como o primeiro, com o título “Fale com a minha IA”.

Na mesma página estão os textos prontos para pôr o seu link na mensagem de saudação e na de ausência do WhatsApp Business. Assim, quem escreve para você já é atendido pela sua IA, mesmo quando você não pode responder."
  jq -n --argjson id "$id" --arg s "$assunto" --arg t "$texto" --arg img "$IMG" --arg h "$titulo" --arg u "$url" --arg n "$nota" \
    '{id_user: $id, channel: "email", kind: "texto", subject: $s, text: $t,
      arte: {image_url: $img, headline: $h, cta_label: "Atualizar meu link", cta_url: $u, note: $n}}'
}

registra() { echo "$1" >> "$LOG"; echo "$1"; }
while read -r p; do
  id=$(jq -r .id_user <<<"$p")
  grep -q "\"id_user\":$id,\"status\":\"\(enviado\|recusado\)\"" "$LOG" && continue
  [ -z "$(jq -r '.slug // ""' <<<"$p")" ] && continue
  body=$(corpo "$p")
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
    echo "PRÉVIA $id: $(jq -c '{destinatario: .destinatario.nome, assunto, arte: (.arte != null), avisos}' <<<"$pv")"
    continue
  fi
  code=$(curl -sS -o "$D/.resp" -w '%{http_code}' -X POST "$API/messages/send" -H 'content-type: application/json' \
    -d "$(jq -c --arg c "$conf" '. + {confirmacao: $c}' <<<"$body")")
  if [ "$code" = "429" ] && grep -q "limite de chamadas por minuto" "$D/.resp"; then sleep 30; continue; fi
  if [ "${code:0:1}" = "2" ]; then
    registra "$(jq -nc --argjson id "$id" '{id_user: $id, status: "enviado", em: (now|todate)}')"
  else
    registra "$(jq -nc --argjson id "$id" --arg c "$code" --arg m "$(jq -r '.message // .' "$D/.resp" 2>/dev/null | head -c 300)" '{id_user: $id, status: "recusado", http: $c, motivo: $m, em: (now|todate)}')"
    [ "$code" = "429" ] && break
  fi
  sleep 3
done < <(jq -c '.[]' "$LISTA")
