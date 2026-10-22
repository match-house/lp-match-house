"""De onde vêm os corretores (Mateus, 22/10/2026: "precisamos saber de onde
vem todos os corretores").

Uso: python3 origens.py <AAAA-MM-DD de ontem>
Imprime um JSON com ontem, 7 dias e o mês de ontem: por origem, as contas
criadas, quantas concluíram o cadastro (passaram do código) e quantas já
publicaram o 1º imóvel (contado hoje: os dias recentes ainda crescem). Fora:
as contas internas, de teste e duplicadas do cac.py.

Origens:
- ChatGPT, Meta app, Meta LP e Google: pelo utm_source (e a ORIGEM_CORRIGIDA
  do cac.py, para as contas que nasceram sem utm).
- Página de outro corretor: utm_source smartli.ink e utm_medium perfil (o
  botão "Crie seu Smart Link" na página de um corretor).
- Convite do Indique e Ganhe: utm_source smartli.ink e utm_medium indicacao.
  Antes de 22/10 o backoffice não mandava o utm_medium: sem ele, os dois
  ficam juntos em "Página de outro corretor ou convite".
- QR e cartão NFC: utm_source qr ou nfc.
- Sem origem: sem utm (direto, link copiado, utm perdido).
"""
import importlib.util
import json
import os
import sys
from collections import OrderedDict
from datetime import date, datetime, timedelta

_spec = importlib.util.spec_from_file_location(
    "cac", os.path.join(os.path.dirname(os.path.abspath(__file__)), "cac.py"))
cac = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cac)

META = {"meta", "ig", "fb", "facebook", "instagram"}
ORDEM = ["ChatGPT", "Meta app", "Meta LP", "Google", "Página de outro corretor",
         "Convite do Indique e Ganhe", "Página de outro corretor ou convite",
         "QR (placa ou cartão)", "Cartão NFC", "Sem origem"]
SEMPRE = ["Página de outro corretor", "Convite do Indique e Ganhe"]


def origem(it: dict) -> tuple:
    """(origem, quem trouxe: o slug do corretor, quando há)."""
    u = it["id_user"]
    src = (it.get("utm_source") or "").strip().lower() or cac.ORIGEM_CORRIGIDA.get(u, "")
    med = (it.get("utm_medium") or "").strip().lower()
    cont = (it.get("utm_content") or "").strip()
    if src in ("chatgpt", "openai"):
        return "ChatGPT", None
    if src == "google":
        return "Google", None
    if src in META:
        return ("Meta app" if (not cont or cont.endswith("-app")) else "Meta LP"), None
    if src == "smartli.ink":
        slug = cont[len("perfil-"):] if cont.startswith("perfil-") else None
        if med == "indicacao":
            return "Convite do Indique e Ganhe", slug
        if med == "perfil":
            return "Página de outro corretor", slug
        return "Página de outro corretor ou convite", slug
    if src == "qr":
        return "QR (placa ou cartão)", None
    if src == "nfc":
        return "Cartão NFC", None
    if not src or src in ("direto", "teste_manual"):
        return "Sem origem", None
    return f"Outra ({src})", None


def contar(itens: list, de: date, ate: date) -> OrderedDict:
    res = {}
    for it in itens:
        dia = datetime.fromisoformat(it["cadastro_em"].replace("Z", "+00:00")).astimezone(cac.BRT).date()
        if not (de <= dia <= ate):
            continue
        o, slug = origem(it)
        r = res.setdefault(o, {"contas": 0, "concluiram": 0, "publicaram": 0, "quem_trouxe": {}})
        r["contas"] += 1
        r["concluiram"] += 1 if it.get("sms_verificado_em") else 0
        r["publicaram"] += 1 if (it.get("publicados") or 0) > 0 else 0
        if slug:
            r["quem_trouxe"][slug] = r["quem_trouxe"].get(slug, 0) + 1
    # Pedido do Mateus (22/10): a página de outro corretor e o convite do
    # Indique e Ganhe aparecem sempre, mesmo com zero.
    for k in SEMPRE:
        res.setdefault(k, {"contas": 0, "concluiram": 0, "publicaram": 0, "quem_trouxe": {}})
    chaves = [k for k in ORDEM if k in res] + sorted(k for k in res if k not in ORDEM)
    out = OrderedDict()
    for k in chaves:
        if not res[k]["quem_trouxe"]:
            del res[k]["quem_trouxe"]
        out[k] = res[k]
    out["Total"] = {x: sum(v[x] for v in res.values()) for x in ("contas", "concluiram", "publicaram")}
    return out


def main() -> None:
    ontem = date.fromisoformat(sys.argv[1])
    inicio_mes = ontem.replace(day=1)
    de = min(inicio_mes, ontem - timedelta(days=6))
    vistos, itens = set(), []
    for it in cac.buscar(de, ontem):
        u = it["id_user"]
        if u in cac.INTERNOS or u in vistos:
            continue
        vistos.add(u)
        itens.append(it)
    print(json.dumps(OrderedDict([
        ("ontem", contar(itens, ontem, ontem)),
        ("7 dias", contar(itens, ontem - timedelta(days=6), ontem)),
        ("mês", contar(itens, inicio_mes, ontem)),
    ]), ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
