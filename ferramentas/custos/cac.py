#!/usr/bin/env python3
"""Cadastros por dia para o CAC da área de custos (pedido do Mateus em 30/09).

Uso: python3 cac.py 2026-09 [ate]   -> imprime {"funil": {...}} para o update do doc do mês.

- cadastros: contas criadas no dia (horário de Brasília), sem contas internas/teste;
- pagos: desses, os que vieram de anúncio (utm_source Meta ou Google);
- publicaram: desses, os que já publicaram imóvel HOJE (coorte do dia — o número
  de um dia antigo ainda cresce quando alguém publica depois).
Fonte: /backoffice/signups (a credencial do ambiente põe o token sozinho).
"""
import json
import subprocess
import sys
from datetime import date, datetime, timedelta, timezone

BRT = timezone(timedelta(hours=-3))
# Mesma lista do Funil Smart Link (confirmada pelo Mateus em 29/09; 993 é teste pelo nome).
INTERNOS = {1011, 1014, 1033, 1095, 1096, 980, 941, 937, 999, 993}
PAGOS = {"meta", "ig", "fb", "facebook", "instagram", "google", "chatgpt", "openai"}
# Cadastros que chegaram sem utm, com a origem achada no Amplitude em 01/10
# (o utm aparece no auth_entry_viewed do mesmo aparelho, ou o clique veio com
# oppref do ChatGPT). Corrigidos aqui até o app guardar a origem sozinho.
ORIGEM_CORRIGIDA = {
    1101: "meta", 1119: "meta", 1127: "meta", 1132: "meta", 1147: "meta",
    1157: "chatgpt", 1159: "chatgpt", 1161: "chatgpt",
}


def buscar(de: date, ate: date) -> list:
    itens, pagina = [], 1
    while True:
        url = (f"https://api.matchhouse.com.br/backoffice/signups?from={de}&to={ate}"
               f"&page={pagina}&page_size=100")
        bruto = subprocess.run(["curl", "-sS", "--fail", "--max-time", "40", url],
                               capture_output=True, text=True, check=True).stdout
        d = json.loads(bruto)
        itens += d["items"]
        if pagina >= d["total_pages"]:
            return itens
        pagina += 1


def main() -> None:
    mes = sys.argv[1]
    ano, m = map(int, mes.split("-"))
    inicio = date(ano, m, 1)
    fim_mes = (inicio.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
    ontem = datetime.now(BRT).date() - timedelta(days=1)
    ate = date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else min(fim_mes, ontem)

    cad, pagos, pub = {}, {}, {}
    vistos = set()
    for it in buscar(inicio, ate):
        if it["id_user"] in INTERNOS or it["id_user"] in vistos:
            continue
        vistos.add(it["id_user"])
        dia = datetime.fromisoformat(it["cadastro_em"].replace("Z", "+00:00")).astimezone(BRT).date()
        if not (inicio <= dia <= ate):
            continue
        k = dia.isoformat()
        cad[k] = cad.get(k, 0) + 1
        origem = (it.get("utm_source") or "").strip().lower() or ORIGEM_CORRIGIDA.get(it["id_user"], "")
        if origem in PAGOS:
            pagos[k] = pagos.get(k, 0) + 1
        if (it.get("publicados") or 0) > 0:
            pub[k] = pub.get(k, 0) + 1

    print(json.dumps({"funil": {
        "cadastros": cad, "pagos": pagos, "publicaram": pub,
        "fonte": "backoffice /signups; sem contas internas e de teste; publicaram = coorte do dia, contada no dia da atualização",
        "contado_em": datetime.now(BRT).isoformat(timespec="minutes"),
    }}, ensure_ascii=False))


if __name__ == "__main__":
    main()
