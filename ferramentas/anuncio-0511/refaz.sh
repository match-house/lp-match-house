#!/usr/bin/env bash
# Refaz, um por vez, as consultas que falharam. Só grava resposta com id_agent.
cd "$(dirname "$0")"
falhas=0
while IFS= read -r s; do
  ok=""
  for t in 1 2 3 4; do
    r=$(curl -s -m 30 "https://api.matchhouse.com.br/backoffice/agent?slug=$s")
    l=$(printf '%s' "$r" | jq -c 'select(.id_agent != null) | {slug, nome, id_agent, usuarios: [(.usuarios // [])[] | {id_user, ativo, sms: (.sms_verificado_em != null)}]}' 2>/dev/null)
    if [ -n "$l" ]; then echo "$l" >> sem-imovel-ok.jsonl; ok=1; break; fi
    sleep $((t * 3))
  done
  [ -z "$ok" ] && { falhas=$((falhas+1)); echo "$s" >> slugs-falha.txt; printf '%s\n' "$r" | head -c 200 >> falhas-amostra.txt; echo >> falhas-amostra.txt; }
done < slugs-refazer.txt
echo "fim: ok=$(wc -l < sem-imovel-ok.jsonl) falhas=$falhas"
