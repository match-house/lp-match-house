"""Ranking dos corretores (Mateus, 22/10/2026: "queria ter um ranking de
corretores, os que mais colocaram imoveis, link na bio, receberam visitas,
indicaram, geraram novos usuarios pelos seus links").

Uso: python3 gerar.py <visitas-corretores-ACUMULADO.csv>
Escreve corretores.json (uma linha por corretor com Smart Link) ao lado deste
arquivo e imprime os totais. O CSV de visitas vem da exportação diária do
funil (Drive); sem ele, as colunas de visitas saem vazias.

Fontes:
- imóveis no ar, nome e link: /backoffice/signups (todas as contas);
- link na bio: /backoffice/instagram/visitas?days=90 (visitas abertas no
  navegador do Instagram, gravadas desde 17/10) e "colei o link" marcado;
- visitas ao Smart Link: o CSV de visitas (tabela agent_metrics do site);
- indicações: /backoffice/indicacao/indicacoes (aprovadas e a conferir);
- cadastros trazidos: contas novas com utm_source smartli.ink e
  utm_content perfil-<slug> (o botão "Crie seu Smart Link" do site e o
  convite do Indique e Ganhe), sem as contas internas, de teste e duplicadas.
Fora do ranking: as mesmas contas internas, de teste e duplicadas do cac.py.
"""
import csv
import importlib.util
import json
import os
import subprocess
import sys
from datetime import date, datetime, timedelta

AQUI = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("cac", os.path.join(AQUI, "..", "custos", "cac.py"))
cac = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cac)

API = "https://api.matchhouse.com.br/backoffice"


def get(path: str) -> dict:
    bruto = subprocess.run(["curl", "-sS", "--fail", "--max-time", "60", API + path],
                           capture_output=True, text=True, check=True).stdout
    return json.loads(bruto)


def todas_as_contas() -> list:
    itens, d, hoje = [], date(2023, 1, 1), datetime.now(cac.BRT).date()
    while d <= hoje:
        f = min(d + timedelta(days=89), hoje)
        itens += cac.buscar(d, f)
        d = f + timedelta(days=1)
    vistos, unicos = set(), []
    for it in itens:
        if it["id_user"] not in vistos:
            vistos.add(it["id_user"])
            unicos.append(it)
    return unicos


def indicacoes() -> list:
    out, pagina = [], 1
    while True:
        d = get(f"/indicacao/indicacoes?page={pagina}&page_size=100")
        out += d["indicacoes"]
        if pagina >= d["total_pages"]:
            return out
        pagina += 1


def visitas_do_site(caminho: str) -> dict:
    if not caminho or not os.path.exists(caminho):
        return {}
    with open(caminho, encoding="utf-8-sig") as f:
        return {int(r["id_agent"]): r for r in csv.DictReader(f)}


def main() -> None:
    csv_visitas = sys.argv[1] if len(sys.argv) > 1 else ""
    contas = todas_as_contas()
    fora = cac.INTERNOS

    # Cadastros trazidos pelo link de cada corretor (utm_content perfil-<slug>).
    trazidos, trazidos_pub = {}, {}
    for it in contas:
        if it["id_user"] in fora:
            continue
        if (it.get("utm_source") or "").strip().lower() != "smartli.ink":
            continue
        cont = (it.get("utm_content") or "").strip()
        if not cont.startswith("perfil-"):
            continue
        slug = cont[len("perfil-"):]
        if slug == (it.get("slug") or ""):
            continue  # o próprio perfil
        trazidos[slug] = trazidos.get(slug, 0) + 1
        if (it.get("publicados") or 0) > 0:
            trazidos_pub[slug] = trazidos_pub.get(slug, 0) + 1

    ind_aprov, ind_pend = {}, {}
    for i in indicacoes():
        quem = (i.get("indicador") or {}).get("id_user")
        indicado = (i.get("indicado") or {}).get("id_user")
        if quem is None or quem in fora or indicado in fora:
            continue
        if i.get("status") == "APPROVED":
            ind_aprov[quem] = ind_aprov.get(quem, 0) + 1
        elif i.get("status") == "PENDING":
            ind_pend[quem] = ind_pend.get(quem, 0) + 1

    ig = get("/instagram/visitas?days=90")
    ig_por_agente = {c["id_agent"]: c for c in ig.get("corretores", [])}
    bio_marcada = {b["id_agent"] for b in ig.get("bio_marcada", [])}
    site = visitas_do_site(csv_visitas)

    linhas = []
    for it in contas:
        u, slug, agente = it["id_user"], it.get("slug"), it.get("id_agent")
        if u in fora or not slug or agente is None:
            continue
        g = ig_por_agente.get(agente) or {}
        s = site.get(agente) or {}
        ig_total = g.get("visitas_total", 0)
        marcou = agente in bio_marcada or bool(g.get("bio_marcada"))
        linhas.append({
            "id_user": u,
            "corretor": (it.get("nome") or slug).strip(),
            "link": f"smartli.ink/{slug}",
            "cadastro": it["cadastro_em"][:10],
            "imoveis_no_ar": it.get("publicados") or 0,
            "imoveis_total": it.get("imoveis_total") or 0,
            "bio": "Confirmada" if ig_total > 0 else ("Marcou" if marcou else "Não"),
            "visitas_instagram": ig_total,
            "visitas_instagram_7d": 0,
            "visitas_site": int(s["visitas_total"]) if s else None,
            "visitas_site_30d": int(s["visitas_30d"]) if s else None,
            "indicacoes_aprovadas": ind_aprov.get(u, 0),
            "indicacoes_a_conferir": ind_pend.get(u, 0),
            "cadastros_trazidos": trazidos.get(slug, 0),
            "trazidos_que_publicaram": trazidos_pub.get(slug, 0),
        })

    # visitas pelo Instagram nos últimos 7 dias, da mesma rota
    ig7 = get("/instagram/visitas?days=7")
    por7 = {c["id_agent"]: c["visitas_periodo"] for c in ig7.get("corretores", [])}
    agente_de = {it["id_user"]: it.get("id_agent") for it in contas}
    for l in linhas:
        l["visitas_instagram_7d"] = por7.get(agente_de.get(l["id_user"]), 0)

    linhas.sort(key=lambda l: (-l["imoveis_no_ar"], l["corretor"]))
    with open(os.path.join(AQUI, "corretores.json"), "w", encoding="utf-8") as f:
        json.dump(linhas, f, ensure_ascii=False)
    print(json.dumps({
        "corretores_com_link": len(linhas),
        "com_imovel_no_ar": sum(1 for l in linhas if l["imoveis_no_ar"] > 0),
        "bio_confirmada": sum(1 for l in linhas if l["bio"] == "Confirmada"),
        "bio_marcou": sum(1 for l in linhas if l["bio"] == "Marcou"),
        "com_visitas_site": sum(1 for l in linhas if (l["visitas_site"] or 0) > 0),
        "indicaram": sum(1 for l in linhas if l["indicacoes_aprovadas"] + l["indicacoes_a_conferir"] > 0),
        "trouxeram_cadastro": sum(1 for l in linhas if l["cadastros_trazidos"] > 0),
        "csv_visitas": bool(site),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
