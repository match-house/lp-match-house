# Anúncio da mudança de 05/11 (e-mail e WhatsApp)

Envios aprovados pelo Mateus em 19/10 ("Pode começar amanha"), a partir de
20/10, 9h. O e-mail assina só "Match House". O WhatsApp é o modelo
`mh_aviso_regra_clientes_1` (aprovado pela Meta, UTILITY).

- Os scripts rodam do scratchpad (`scratchpad/anuncio/`). As listas têm
  nome e link de corretor e NÃO vêm para o repositório (é público).
- `envia-email.sh [lista]`: até 150 por dia (teto do backoffice). Pula quem
  já recebeu (`enviados-email.jsonl`). Quem recebeu e-mail da esteira no dia
  é recusado e entra no dia seguinte.
- `envia-whats.sh [lista]`: até 50 por dia, só para quem confirmou o celular
  por SMS (`lista-whats.json`).
- `DRY=1` faz só a prévia.

Para refazer as listas se o scratchpad sumir:
1. `GET /backoffice/agents?page_size=100&page=N&order=imoveis` (todas as
   páginas) → `agents.json`; os com `publicados > 0`.
2. Para cada slug, `GET /backoffice/agent?slug=` → `usuarios[0].id_user` e
   `sms_verificado_em` → `com-imovel.jsonl`.
3. `GET /backoffice/signups?days=90` (páginas) → `signups.jsonl`.
4. `jq -n --argjson wait '[ids da lista de espera]' --slurpfile fora fora.json
   --slurpfile sg <(jq -s . signups.jsonl) --slurpfile ci <(jq -s
   'unique_by(.slug)' com-imovel.jsonl) -f monta.jq > lista-dia1.json`.
   A lista de espera sai de `GET /backoffice/pro/interesse`.
5. Tirar a conta 15 (do Mateus) e as de `fora.json` (testes, internas e
   duplicadas do CLAUDE.md).

## Dias 2 em diante (a partir de 21/10)

- `lista-resto-com-link.json`: quem tem link e nenhum imóvel no ar, sem os
  já enviados, `fora.json` e a conta 15. Celular confirmado primeiro.
  `lista-whats-resto.json`: os mesmos com celular confirmado e nome.
- Como montar:
  1. Os slugs com `publicados == 0` de `agents.json` → `slugs-sem-imovel.txt`.
  2. `refaz.sh` busca o `id_user` de cada um, **um por vez**. A API limita as
     chamadas por minuto (429): em 20/10, com 4 em paralelo, 671 de 787
     voltaram com erro sem avisar. O `refaz.sh` só grava resposta com
     `id_agent` e tenta de novo com espera.
  3. `jq -n -f monta-resto.jq --slurpfile si <(jq -s 'unique_by(.slug)'
     sem-imovel-ok.jsonl) --slurpfile sg <(jq -s . signups.jsonl)
     --slurpfile env <(jq -s . enviados-email.jsonl) --slurpfile fora
     fora.json > lista-resto.json`, e separar quem tem `slug`.
- As 119 contas sem link (cadastro sem Smart Link) ficaram de fora: o texto
  fala de "smartli.ink/<link>". Decisão do Mateus pendente em 20/10.
- Sem nome no cadastro, o e-mail diz só "Oi." e o WhatsApp não vai ({{1}}
  vazio seria recusado).
