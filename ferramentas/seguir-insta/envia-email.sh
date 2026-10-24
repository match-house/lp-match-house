#!/usr/bin/env bash
# E-mail "Siga a Match House no Instagram" (Mateus, 22/10: "e podemos rodar
# para nossos cadastros um email para seguirem..." e "pode tudo"). Assinado
# "Match House", nunca com o nome do Mateus. Um por pessoa; quem já recebeu
# (enviados-email.jsonl) é pulado. O link de cada pessoa é o rastreado
# (/backoffice/links/seguir-instagram-1), para o WhatsApp ir só a quem não
# tocou. DRY=1 faz só a prévia. O teto de 150 e-mails por dia é da API.
# Desde 24/10 sai com arte (Mateus: "Ficou bom o email, pode fazer esse
# mesmo... nos envios"): imagem, título, botão "Seguir @matchhouse.br" com o
# link rastreado e o lembrete no quadro azul. Se a API ainda não aceitar o
# campo arte, cai sozinho no e-mail só texto de antes (texto_simples).
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
IMG=https://raw.githubusercontent.com/match-house/lp-match-house/af075797bdbef9f97e63a2a66b32500c2e133a83/anuncios/email/hero-siga.jpg
ARTE=${ARTE:-1}

lembrete() { # $1 slug
  if [ -n "$1" ]; then
    echo "Lembrete: o seu Smart Link é smartli.ink/$1. Coloque na bio do Instagram e nas suas redes (em Divulgar, botão \"Cole o link na bio do Instagram\"): a IA atende quem chega por ele."
  else
    echo "Lembrete: o seu Smart Link ainda não foi criado. Crie em https://app.smartli.ink e coloque o link na bio do Instagram: a IA atende quem chega por ele."
  fi
}

# Corpo com arte: o título leva a saudação, o lembrete vai no quadro e o
# rodapé "Match House · ..." é do template.
corpo_arte() { # $1 id, $2 primeiro, $3 slug, $4 link rastreado
  local titulo="Oi, $2. Siga a Match House no Instagram."
  [ -z "$2" ] && titulo="Siga a Match House no Instagram."
  jq -n --argjson id "$1" --arg s "$SUBJ" --arg img "$IMG" --arg h "$titulo" --arg u "$4" --arg n "$(lembrete "$3")" \
    --arg t $'Começamos a publicar no Instagram da Match House conteúdo feito para corretor: como usar o Smart Link no dia a dia, respostas prontas para os seus clientes, ideias para divulgar os seus imóveis (como o QR na placa) e as novidades do app.\n\nPor lá você também fala com a gente pelo Direct.' \
    '{id_user: $id, channel: "email", kind: "texto", subject: $s, text: $t,
      arte: {image_url: $img, headline: $h, cta_label: "Seguir @matchhouse.br", cta_url: $u, note: $n}}'
}

texto_simples() { # $1 primeiro nome, $2 slug (vazio = ainda sem link), $3 link rastreado
  local saud="Oi, $1." lembrete
  [ -z "$1" ] && saud="Oi."
  lembrete=$(lembrete "$2")
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
  simples=$(jq -n --argjson id "$id" --arg s "$SUBJ" --arg t "$(texto_simples "$nome" "$slug" "$url")" \
    '{id_user: $id, channel: "email", kind: "texto", subject: $s, text: $t}')
  if [ "$ARTE" = "1" ]; then body=$(corpo_arte "$id" "$nome" "$slug" "$url"); else body=$simples; fi
  pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
  if [ "$ARTE" = "1" ] && grep -q "campo desconhecido: arte" <<<"$pv"; then
    echo "API sem o e-mail com arte: seguindo só com texto"
    ARTE=0; body=$simples
    pv=$(curl -sS -X POST "$API/messages/preview" -H 'content-type: application/json' -d "$body")
  fi
  conf=$(jq -r '.confirmacao // empty' <<<"$pv" 2>/dev/null)
  if [ -z "$conf" ]; then
    registra "$(jq -nc --argjson id "$id" --arg m "$(jq -r '.message // .' <<<"$pv" 2>/dev/null | head -c 300)" '{id_user: $id, status: "previa_recusada", motivo: $m, em: (now|todate)}')"
    grep -q "teto diário" <<<"$pv" && break
    continue
  fi
  if [ "${DRY:-0}" = "1" ]; then
    echo "PRÉVIA $id: $(jq -c '{destinatario: .destinatario.nome, assunto, arte: (.arte != null), avisos}' <<<"$pv")"
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
