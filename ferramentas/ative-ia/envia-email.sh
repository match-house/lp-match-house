#!/usr/bin/env bash
# E-mail "Uma coisa alimenta a outra" (Mateus, 08/11: campanha aos corretores
# com imóvel no ar, "parabéns José, você já tem 5 imóveis" e "algo que
# convença mais... uma coisa alimenta a outra"). Arte do ciclo, título com o
# nome e o número de imóveis, o ciclo em 4 passos, os números do próprio
# corretor e o botão para app.smartli.ink/bio/<slug>, que copia o link e abre
# o Instagram. Assinado "Match House". Um por pessoa: quem já recebeu
# (enviados-email.jsonl) é pulado. LIMITE por rodada (padrão 100); o teto de
# 150 e-mails por dia é da API. DRY=1 faz só a prévia.
# Uso: bash envia-email.sh lista.json
set -u
D=$(cd "$(dirname "$0")" && pwd)
API=https://api.matchhouse.com.br/backoffice
LISTA=${1:?lista}
LOG=$D/enviados-email.jsonl
touch "$LOG"
LIMITE=${LIMITE:-100}
IMG="https://raw.githubusercontent.com/match-house/lp-match-house/$(cat "$D/../email-arte/hero-ciclo.commit")/anuncios/email/hero-ciclo.jpg"

plural() { [ "$1" = "1" ] && echo "1 $2" || echo "$1 $3"; }

# A frase com os números do próprio corretor (nunca número de outro).
numeros() { # $1 visitas 30 dias, $2 visitas pelo Instagram desde 17/10
  if [ "$2" -gt 0 ]; then
    echo "No último mês, o seu Smart Link teve $(plural "$1" visita visitas); $(plural "$2" "veio" "vieram") do Instagram (desde 17/10). Já funciona: agora é fechar o ciclo."
  elif [ "$1" -gt 0 ]; then
    echo "No último mês, o seu Smart Link teve $(plural "$1" visita visitas), nenhuma pelo Instagram (desde 17/10). Os seus seguidores ainda não chegam até ele."
  else
    echo "O seu Smart Link ainda não teve visitas no último mês. A bio do Instagram é o caminho mais curto até ele."
  fi
}

corpo() { # $1 linha da lista (json)
  local id nome slug im v30 ig titulo assunto texto nota url
  id=$(jq -r .id_user <<<"$1"); nome=$(jq -r .primeiro <<<"$1"); slug=$(jq -r .slug <<<"$1")
  im=$(jq -r .imoveis <<<"$1"); v30=$(jq -r .v30 <<<"$1"); ig=$(jq -r .ig <<<"$1")
  if [ "$im" = "1" ]; then
    titulo="Parabéns, $nome! 👏 Seu primeiro imóvel já está na Match House."
  else
    titulo="Parabéns, $nome! 👏 Você já tem $im imóveis na Match House."
  fi
  assunto="Parabéns, $nome! Agora ponha a sua IA para trabalhar"
  url="https://app.smartli.ink/bio/$slug?mh_src=email-ative-1"
  nota="Seu Smart Link: smartli.ink/$slug. Na bio, deixe ele como o primeiro link: é o que aparece em destaque no seu perfil."
  texto="O seu Instagram leva o cliente ao Smart Link, a sua IA atende na hora, e quem chega passa a seguir você.

$(numeros "$v30" "$ig")

São 2 passos, 1 minuto:
1. Toque no botão abaixo e cole o seu link como o 1º da bio do Instagram.
2. Em Redes, coloque o seu Instagram no Smart Link."
  jq -n --argjson id "$id" --arg s "$assunto" --arg t "$texto" --arg img "$IMG" --arg h "$titulo" --arg u "$url" --arg n "$nota" \
    '{id_user: $id, channel: "email", kind: "texto", subject: $s, text: $t,
      arte: {image_url: $img, headline: $h, cta_label: "Colar meu link na bio", cta_url: $u, note: $n}}'
}

registra() { echo "$1" >> "$LOG"; echo "$1"; }
n=0
while read -r p; do
  [ "$n" -ge "$LIMITE" ] && { echo "limite da rodada: $LIMITE"; break; }
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
    registra "$(jq -nc --argjson id "$id" --arg m "$(jq -r '.message // .' <<<"$pv" 2>/dev/null | head -c 300)" '{id_user: $id, status: "previa_recusada", motivo: $m, em: (now|todate)}')"
    grep -q "teto diário" <<<"$pv" && break
    continue
  fi
  if [ "${DRY:-0}" = "1" ]; then
    echo "PRÉVIA $id: $(jq -c '{destinatario: .destinatario.nome, assunto, arte: (.arte != null), avisos}' <<<"$pv")"
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
