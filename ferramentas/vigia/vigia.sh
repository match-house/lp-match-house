#!/usr/bin/env bash
# Vigia das mensagens (Mateus, 05/10: "de hora em hora é mt longo").
# Confere o Direct e o 6800 a cada 60 s e SAI quando chega mensagem nova,
# para a conversa acordar e responder. Sem novidade, sai em ~110 min.
# Recriada em 13/10 depois que o servidor reiniciou do zero.
S=/tmp/claude-0/-home-user-lp-match-house/0de051d8-2c6b-51ea-afb4-9db8eff21ef6/scratchpad
B=https://api.matchhouse.com.br/backoffice
VISTOS="$S/vigia-vistos.txt"
HB="$S/vigia.heartbeat"
touch "$VISTOS"
fim=$(( $(date +%s) + 110 * 60 ))

while [ "$(date +%s)" -lt "$fim" ]; do
  touch "$HB"
  wa=$(curl -s -m 30 "$B/messages/received?com_cadastro=1" \
    | jq -r '.. | objects | select(has("id_inbound")) | "wa:\(.id_inbound) id_user=\(.id_user // "sem") \(.tipo // "")"' 2>/dev/null)
  ig=$(curl -s -m 30 "$B/instagram/received" \
    | jq -r '.. | objects | select(has("id_instagram")) | "ig:\(.id_instagram) @\(.usuario // .username // "?")"' 2>/dev/null)
  novas=""
  while IFS= read -r l; do
    [ -z "$l" ] && continue
    k=${l%% *}
    if ! grep -qxF "$k" "$VISTOS"; then
      novas="${novas}${l}"$'\n'
      echo "$k" >> "$VISTOS"
    fi
  done <<< "$wa"$'\n'"$ig"
  if [ -n "$novas" ]; then
    echo "NOVAS MENSAGENS ($(date -u +%H:%MZ)):"
    printf '%s' "$novas"
    exit 0
  fi
  sleep 60
done
echo "vigia: sem novidade em ~110 min; religar"
