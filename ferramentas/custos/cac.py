#!/usr/bin/env python3
"""Cadastros por dia para o CAC da área de custos (pedido do Mateus em 30/09).

Uso: python3 cac.py 2026-09 [ate]   -> imprime {"funil": {...}} para o update do doc do mês.

- cadastros: contas criadas no dia (horário de Brasília), sem contas internas/teste;
- pagos: desses, os que vieram de anúncio (utm_source Meta ou Google);
- publicaram: desses, os que já publicaram imóvel HOJE (coorte do dia — o número
  de um dia antigo ainda cresce quando alguém publica depois);
- canais (Mateus, 21/10: custo por cadastro separado por canal): por canal
  (chatgpt, meta, google, sem_anuncio), contas, concluiram (passaram do código)
  e publicaram por dia. A Meta junta o app e a LP, porque o gasto gravado na
  área de custos é um só.
Fonte: /backoffice/signups (a credencial do ambiente põe o token sozinho).
"""
import json
import subprocess
import sys
from datetime import date, datetime, timedelta, timezone

BRT = timezone(timedelta(hours=-3))
# Mesma lista do Funil Smart Link (confirmada pelo Mateus em 29/09; 993 é teste pelo nome).
# Duplicadas, fora dos números pela regra de higiene da lista (Mateus): 1240, 1241, 1242 (10/10) e 836, 1103, 1128, 1187, 1196, 1238 (varredura de 11/10), 1373 (18/10; a principal é a 1351), 1372 (18/10; a principal é a 1317) e 1361 (17/10; a principal é a 1191).
# 39: conta interna (smartli.ink/matchhouse, confirmada pelo Mateus em 12/10: "sim, é nossa, pode tirar").
INTERNOS = {1011, 1014, 1033, 1095, 1096, 980, 941, 937, 999, 993, 3, 56, 39, 1240, 1241, 1242, 836, 1103, 1128, 1187, 1196, 1238, 1373, 1372, 1361}
PAGOS = {"meta", "ig", "fb", "facebook", "instagram", "google", "chatgpt", "openai"}
# Cadastros que chegaram sem utm, com a origem achada no Amplitude em 01/10
# (o utm aparece no auth_entry_viewed do mesmo aparelho, ou o clique veio com
# oppref do ChatGPT). Corrigidos aqui até o app guardar a origem sozinho.
ORIGEM_CORRIGIDA = {
    1101: "meta", 1119: "meta", 1127: "meta", 1132: "meta", 1147: "meta",
    1157: "chatgpt", 1159: "chatgpt", 1161: "chatgpt",
    # 04/10 23h10 UTC: viu a entrada com utm chatgpt, entrou pela Apple
    # (redirect) e a conta nasceu sem utm.
    1194: "chatgpt",
    # 05/10 19h28 UTC: in_app_browser_instagram com utm meta/6g-story-app,
    # entrou pela Apple (redirect) às 19h29 e a conta nasceu sem utm.
    1198: "meta",
    # 06/10 06h42 UTC: auth_clicked Apple com utm chatgpt (ad_6abe5b39...),
    # auth_completed redirect/onboarding 06:42:21 = cadastro da 1202 (Laerte),
    # que nasceu sem utm.
    1202: "chatgpt",
    # 07/10 12h47 UTC: auth_clicked Apple com utm chatgpt (ad_6abe5b39...),
    # auth_completed redirect/onboarding 12:48:10 = cadastro da 1219, sem utm.
    1219: "chatgpt",
    # 07/10 19h11 UTC: navegador do Instagram com utm meta/6g-story-app,
    # auth_completed redirect/onboarding 19:12:11 = cadastro da 1224, sem utm.
    1224: "meta",
    # 03/10 01h08 UTC: navegador do Instagram com utm meta/6g-story-app,
    # Apple (redirect/onboarding) às 01:09:10 = cadastro da 1185, que nasceu
    # sem utm. Achado em 08/10 na conferência da tabela por campanha.
    1185: "meta",
    # 08/10 (UTC), todas pela Apple em redirect, com utm chatgpt (ad_6abe5b39...)
    # no auth_clicked e conta nascida sem utm (achado em 09/10, Amplitude bruto):
    # 1227: auth_completed onboarding 03:55:18 (cadastro 03:55:20);
    # 1228: 2a tentativa, onboarding 06:02:17 (cadastro 06:02:17);
    # 1229: onboarding 09:02:16 (cadastro 09:02:16);
    # 1231: onboarding 10:36:07 (cadastro 10:36:07);
    # 1236: pela folha, onboarding 13:55:23 (cadastro 13:55:22).
    1227: "chatgpt", 1228: "chatgpt", 1229: "chatgpt", 1231: "chatgpt", 1236: "chatgpt",
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


def canal_de(origem: str) -> str:
    if origem in ("chatgpt", "openai"):
        return "chatgpt"
    if origem == "google":
        return "google"
    if origem in ("meta", "ig", "fb", "facebook", "instagram"):
        return "meta"
    return "sem_anuncio"


def main() -> None:
    mes = sys.argv[1]
    ano, m = map(int, mes.split("-"))
    inicio = date(ano, m, 1)
    fim_mes = (inicio.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
    ontem = datetime.now(BRT).date() - timedelta(days=1)
    ate = date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else min(fim_mes, ontem)

    cad, pagos, pub = {}, {}, {}
    canais = {c: {"contas": {}, "concluiram": {}, "publicaram": {}} for c in ("chatgpt", "meta", "google", "sem_anuncio")}
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
        # A correção à mão vem primeiro: uma conta antiga sem origem pode ganhar
        # uma depois, no login (o app preenche a que falta), e não é a do cadastro.
        origem = ORIGEM_CORRIGIDA.get(it["id_user"]) or (it.get("utm_source") or "").strip().lower()
        if origem in PAGOS:
            pagos[k] = pagos.get(k, 0) + 1
        if (it.get("publicados") or 0) > 0:
            pub[k] = pub.get(k, 0) + 1
        canal = canais[canal_de(origem)]
        canal["contas"][k] = canal["contas"].get(k, 0) + 1
        if it.get("sms_verificado_em"):
            canal["concluiram"][k] = canal["concluiram"].get(k, 0) + 1
        if (it.get("publicados") or 0) > 0:
            canal["publicaram"][k] = canal["publicaram"].get(k, 0) + 1

    print(json.dumps({"funil": {
        "cadastros": cad, "pagos": pagos, "publicaram": pub, "canais": canais,
        "fonte": "backoffice /signups; sem contas internas, de teste e duplicadas; publicaram = coorte do dia, contada no dia da atualização",
        "contado_em": datetime.now(BRT).isoformat(timespec="minutes"),
    }}, ensure_ascii=False))


if __name__ == "__main__":
    main()
