#!/usr/bin/env bash
# Leads IA: conversas e leads da IA (EvaGPT) por corretor e por semana
# (segunda a domingo), nas duas últimas semanas, para a aba "Leads IA" do
# Painel do Funil PRO (rotina trig_011zZvcgNN73kVfWyPypb1dc, 06h47).
#
# Grava:
#   novas/linhas.json  linhas A:I da aba: semana (AAAA-MM-DD), id_usuario
#                      ('N, como texto), id_agent, slug, conversas,
#                      visitante_escreveu, ia_respondeu, leads, leads_unicos
#   novas/inicio.txt   a segunda-feira da semana anterior (AAAA-MM-DD)
# Sai com "INCOMPLETO" (código 2) se o backoffice não fechar a contagem.
#
# Lê uma semana por vez: o período inteiro para em 1.000 conversas.
# Usa só bash, curl e jq. Recriado em 13/10 depois que o servidor reiniciou
# do zero.
set -u
S=/tmp/claude-0/-home-user-lp-match-house/0de051d8-2c6b-51ea-afb4-9db8eff21ef6/scratchpad
D="$S/leads-ia"
B=https://api.matchhouse.com.br/backoffice
mkdir -p "$D/novas" "$D/brutos"
MAPA="$D/agent-user.tsv"   # id_agent<TAB>id_user (cache)
touch "$MAPA"

hoje=$(TZ=America/Sao_Paulo date +%F)
dow=$(TZ=America/Sao_Paulo date +%u)            # 1 = segunda
seg_atual=$(date -d "$hoje -$((dow - 1)) days" +%F)
inicio=$(date -d "$seg_atual -7 days" +%F)
ontem=$(date -d "$hoje -1 day" +%F)

# id_user do corretor, pelo backoffice (vazio se a conta não tem usuário).
id_user_de() {
  local a=$1 u
  u=$(awk -F'\t' -v a="$a" '$1 == a { print $2; f = 1 } END { if (!f) exit 1 }' "$MAPA") && { echo "$u"; return; }
  u=$(curl -s -m 30 "$B/agent?id_agent=$a" | jq -r '(.usuarios // [])[0].id_user // ""' 2>/dev/null)
  printf '%s\t%s\n' "$a" "$u" >> "$MAPA"
  echo "$u"
}

# Uma semana: até 3 tentativas (às vezes o backoffice responde 500 ou volta
# incompleto).
semana() {
  local de=$1 ate=$2 arq="$D/brutos/$1.json" t code
  for t in 1 2 3; do
    code=$(curl -s -m 180 -o "$arq" -w '%{http_code}' "$B/leads?from=$de&to=$ate")
    if [ "$code" = 200 ] && jq -e '(.resumo.incompleto | not) and (.por_corretor.incompleto | not)' "$arq" >/dev/null 2>&1; then
      return 0
    fi
  done
  return 1
}

linhas="[]"
s=$inicio
while [ "$(date -d "$s" +%s)" -le "$(date -d "$ontem" +%s)" ]; do
  dom=$(date -d "$s +6 days" +%F)
  ate=$dom
  [ "$(date -d "$ate" +%s)" -gt "$(date -d "$ontem" +%s)" ] && ate=$ontem
  if ! semana "$s" "$ate"; then
    echo "INCOMPLETO: semana de $s (até $ate)"
    exit 2
  fi
  # Uma linha por corretor, na ordem do id_agent.
  while IFS=$'\t' read -r a slug conv esc resp leads unicos; do
    u=$(id_user_de "$a")
    uid=""
    [ -n "$u" ] && uid="'$u"
    linhas=$(jq -c --arg s "$s" --arg uid "$uid" --argjson a "$a" --arg slug "$slug" \
      --argjson c "$conv" --argjson e "$esc" --argjson r "$resp" --argjson l "$leads" --argjson q "$unicos" \
      '. + [[$s, $uid, $a, $slug, $c, $e, $r, $l, $q]]' <<< "$linhas")
  done < <(jq -r '.por_corretor.contagem // [] | sort_by(.id_agent)[]
      | [.id_agent, (.slug // ""), .conversas, .visitante_escreveu, .ia_respondeu,
         .leads_qualificados, .leads_qualificados_unicos] | @tsv' "$D/brutos/$s.json")
  s=$(date -d "$s +7 days" +%F)
done

echo "$linhas" > "$D/novas/linhas.json"
echo "$inicio" > "$D/novas/inicio.txt"
echo "ok: $(jq length "$D/novas/linhas.json") linhas desde $inicio (até $ontem)"
