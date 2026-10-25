#!/usr/bin/env bash
# Custo AWS por dia (Cost Explorer), dos últimos N dias fechados.
# Versão em bash do aws_dias.py (25/10: sem python, para as rotinas não pedirem
# aprovação). Assina com o --aws-sigv4 do curl, usando as variáveis
# AWS_ACCESS_KEY_ID e AWS_SECRET_ACCESS_KEY do ambiente (credencial "AWS
# custos"); nenhuma chave fica aqui nem sai na tela.
#
# Uso: bash aws_dias.sh [N=3] [cambio=5.3478]
# Imprime JSON {"usd": {dia: valor}, "brl": {dia: valor}}. Uma chamada = US$ 0,01.
set -euo pipefail
n=${1:-3}
cambio=${2:-5.3478}
hoje=$(date -u -d '-3 hours' +%F)              # Brasília
inicio=$(date -u -d "$hoje -$n days" +%F)
corpo=$(jq -cn --arg s "$inicio" --arg e "$hoje" \
  '{TimePeriod: {Start: $s, End: $e}, Granularity: "DAILY", Metrics: ["UnblendedCost"]}')  # End exclusivo: hoje fica de fora
curl -sS --fail --max-time 40 \
  --aws-sigv4 "aws:amz:us-east-1:ce" \
  --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}" \
  -H 'Content-Type: application/x-amz-json-1.1' \
  -H 'X-Amz-Target: AWSInsightsIndexService.GetCostAndUsage' \
  --data "$corpo" https://ce.us-east-1.amazonaws.com/ |
jq -c --argjson c "$cambio" '
  [.ResultsByTime[] | {key: .TimePeriod.Start, value: (.Total.UnblendedCost.Amount | tonumber * 10000 | round / 10000)}] | from_entries as $u
  | {usd: $u, brl: ($u | map_values(. * $c * 100 | round / 100))}'
