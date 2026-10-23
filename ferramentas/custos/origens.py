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
- Página de outro corretor: utm_source smartli.ink, do botão "Crie seu Smart
  Link" que o site põe no perfil de todo corretor (utm_medium perfil), em cada
  imóvel dele (imovel) e no rodapé (sem utm_medium). O utm_content
  perfil-<slug> diz qual corretor trouxe.
- Convite do Indique e Ganhe: utm_source smartli.ink e utm_medium indicacao.
- Digitou smartli.ink: utm_source smartli.ink e utm_medium direto (a raiz do
  domínio leva ao cadastro, com utm_content raiz).
- Instagram sem anúncio: utm_source org-instagram. A LP marca assim quem
  chega do Instagram sem anúncio (desde 01/10); com utm_content bio, é o link
  da bio do @matchhouse.br (Mateus, 22/10: "Os sem origem podem ter vindo do
  instagram, la tem o site d a LP e o app").
- Busca no Google, WhatsApp e outro site: org-google, org-whatsapp e os
  outros org-*, que a LP manda para quem chega sem anúncio.
- QR e cartão NFC: utm_source qr ou nfc.
- Sem origem: sem utm, ou "direto" (entrou na LP sem site de origem: digitou
  o endereço ou abriu de um app que não diz de onde veio).
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
         "Convite do Indique e Ganhe", "Instagram sem anúncio", "Busca no Google",
         "WhatsApp", "Outro site", "Digitou smartli.ink", "QR (placa ou cartão)",
         "Cartão NFC", "Sem origem"]
SEMPRE = ["Página de outro corretor", "Convite do Indique e Ganhe", "Instagram sem anúncio"]


# Contas sem utm cuja origem foi achada no Amplitude, olhando a página de
# antes da tela de entrada no mesmo aparelho.
ORIGEM_ACHADA = {
    # 22/10: abriu o link de um WhatsApp da esteira (mh_src=whatsapp-link_vazio)
    # que tinha ido para outra conta, no mesmo celular, e criou conta nova.
    1441: ("WhatsApp da esteira", None),
}


def origem(it: dict) -> tuple:
    """(origem, quem trouxe: o slug do corretor, quando há)."""
    u = it["id_user"]
    if u in ORIGEM_ACHADA:
        return ORIGEM_ACHADA[u]
    # A correção à mão vem primeiro (ver cac.py).
    src = cac.ORIGEM_CORRIGIDA.get(u) or (it.get("utm_source") or "").strip().lower()
    med = (it.get("utm_medium") or "").strip().lower()
    cont = (it.get("utm_content") or "").strip()
    if src in ("chatgpt", "openai"):
        return "ChatGPT", None
    if src == "chatgpt.com":
        # O ChatGPT marca assim os links das respostas dele: é o smartli.ink
        # citado numa resposta, sem anúncio.
        return "ChatGPT sem anúncio (resposta)", None
    if src == "google":
        return "Google", None
    if src in META:
        return ("Meta app" if (not cont or cont.endswith("-app")) else "Meta LP"), None
    if src == "smartli.ink":
        slug = cont[len("perfil-"):] if cont.startswith("perfil-") else None
        if med == "indicacao":
            return "Convite do Indique e Ganhe", slug
        if med == "direto":
            return "Digitou smartli.ink", None
        return "Página de outro corretor", slug
    if src == "org-instagram":
        return "Instagram sem anúncio", ("bio do @matchhouse.br" if cont == "bio" else None)
    if src in ("org-google", "org-busca"):
        return "Busca no Google", None
    if src == "org-whatsapp":
        return "WhatsApp", None
    if src.startswith("org-"):
        return "Outro site", src[len("org-"):]
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
