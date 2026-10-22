#!/usr/bin/env bash
# Lista do e-mail "Siga a Match House": os cadastros do aviso de 05/11 (que já
# saíram sem as contas de teste, internas e duplicadas), mais os novos
# (novos.json, opcional: [{id_user, primeiro, slug}]). Ordem: quem tem imóvel
# no ar, depois quem tem link, depois quem ainda não tem link.
set -eu
D=$(cd "$(dirname "$0")" && pwd)
A=$D/../anuncio
NOVOS=${1:-}
jq -n \
  --slurpfile d1 "$A/lista-dia1.json" --slurpfile r "$A/lista-resto-com-link.json" \
  --slurpfile s "$A/lista-sem-link.json" --slurpfile fora "$A/fora.json" \
  --slurpfile ci <(jq -s '[.[] | .usuarios[]?.id_user]' "$A/com-imovel.jsonl") \
  --slurpfile n <( [ -n "$NOVOS" ] && cat "$NOVOS" || echo '[]') '
  ($d1[0] + $r[0] + $s[0] + $n[0])
  | map({id_user, primeiro: (.primeiro // ""), slug: (.slug // null)})
  | map(select(.id_user as $i | ($fora[0] | index($i)) == null))
  | unique_by(.id_user)
  | map(. + {com_imovel: (.id_user as $i | ($ci[0] | index($i)) != null)})
  | sort_by((if .com_imovel then 0 elif .slug then 1 else 2 end), .id_user)' > "$D/lista.json"
jq -r '"lista: \(length) | com imóvel: \([.[]|select(.com_imovel)]|length) | com link: \([.[]|select(.slug)]|length) | sem link: \([.[]|select(.slug|not)]|length)"' "$D/lista.json"
