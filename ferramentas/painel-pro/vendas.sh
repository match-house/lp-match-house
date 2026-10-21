#!/usr/bin/env bash
# Vendas do Pro para a aba "Vendas Pro" do Painel do Funil PRO (rotina das
# 06h47, junto com a aba "Leads IA"). Uma linha por corretor que comprou,
# pela primeira compra paga; o Painel conta a etapa "7. Compraram o Pro"
# por essas linhas.
#
# Grava $S/painel-pro/vendas-linhas.json: as linhas A:I a partir de A3:
#   primeira compra (DD/MM/AAAA, Brasília), id_user, corretor, link, forma,
#   valor (R$), situação, conta desde (DD/MM/AAAA), na coorte do funil
#   (conta criada desde 14/07: sim/não).
# Fora: contas internas, de teste e duplicadas (as mesmas do Funil Smart
# Link). Pago = status paid/succeeded com valor > 0.
#
# Usa só bash, curl e jq. Sai com código 2 se o backoffice não responder.
set -u
S=/tmp/claude-0/-home-user-lp-match-house/0de051d8-2c6b-51ea-afb4-9db8eff21ef6/scratchpad
B=https://api.matchhouse.com.br/backoffice
D="$S/painel-pro"
mkdir -p "$D"
FORA='[1011,1014,1033,1095,1096,980,941,937,999,993,3,56,39,1240,1241,1242,836,1103,1128,1187,1196,1238,1373,1361,1372]'

code=$(curl -s -m 60 -o "$D/vendas-bruto.json" -w '%{http_code}' "$B/pro/vendas?dias=400")
if [ "$code" != 200 ] || ! jq -e '.pagamentos' "$D/vendas-bruto.json" >/dev/null 2>&1; then
  echo "SEM RESPOSTA: /pro/vendas ($code)"
  exit 2
fi
jq -e '.pagamentos_truncados != true' "$D/vendas-bruto.json" >/dev/null || echo "AVISO: pagamentos truncados (mais de 500)"

# Compradores: primeira compra paga de cada id_user de fora das listas.
jq --argjson fora "$FORA" '
  def brt: sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601 - 10800 | strftime("%d/%m/%Y");
  def forma: {"card":"cartão","pix":"Pix","pix_automatico":"Pix (C6)"}[.] // .;
  (.assinantes | map({key: (.id_user|tostring), value: .}) | from_entries) as $ass
  | [.pagamentos[]
      | select((.id_user as $u | $fora | index($u)) | not)
      | select((.status == "paid" or .status == "succeeded") and ((.valor // 0) > 0))]
  | group_by(.id_user)
  | map(sort_by(.em) | {p: .[0], devolvido: (map(.devolucao_status // "") | any(. == "refunded" or . == "devolvido"))})
  | sort_by(.p.em)
  | map(.p as $p | $ass[($p.id_user|tostring)] as $a | {
      em: ($p.em | brt), id_user: $p.id_user, nome: ($p.nome // ""), slug: ($p.slug // ""),
      forma: (($p.metodo // "") | forma), valor: $p.valor,
      situacao: (if .devolvido then "devolvido"
                 elif $a == null then "encerrado"
                 elif $a.cancelamento_pedido_em then "cancelou, vale até " + ($a.valido_ate | brt)
                 else "ativo, renova em " + ($a.valido_ate | brt) end)})
' "$D/vendas-bruto.json" > "$D/vendas-compradores.json" || exit 2

# Conta desde: o cadastro, pelo backoffice (para saber se está na coorte).
linhas="[]"
while read -r c; do
  slug=$(jq -r '.slug' <<<"$c"); u=$(jq -r '.id_user' <<<"$c")
  desde=$(curl -s -m 30 "$B/agent?slug=$slug" | jq -r --argjson u "$u" '[(.usuarios // [])[] | select(.id_user == $u) | .cadastro_em][0] // ""' 2>/dev/null)
  linhas=$(jq -c --argjson c "$c" --arg d "$desde" '. + [[
      $c.em, $c.id_user, $c.nome, (if $c.slug == "" then "" else "smartli.ink/" + $c.slug end),
      $c.forma, $c.valor, $c.situacao,
      (if $d == "" then "" else ($d | sub("\\.[0-9]+Z$"; "Z") | fromdateiso8601 - 10800 | strftime("%d/%m/%Y")) end),
      (if $d == "" then "" elif $d >= "2026-07-14T03:00:00Z" then "sim" else "não" end)
    ]]' <<<"$linhas")
done < <(jq -c '.[]' "$D/vendas-compradores.json")
printf '%s\n' "$linhas" > "$D/vendas-linhas.json"
echo "OK: $(jq length "$D/vendas-linhas.json") comprador(es)"
