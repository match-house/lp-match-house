"""Gera funil-smart-link.html (formato do relatório "Funil Smart Link Q3").

Fonte: backoffice da API (a credencial do ambiente põe o token sozinho).
Uso: python3 gerar.py   -> escreve funil-smart-link.html ao lado deste arquivo.
Telefone e e-mail não entram na página.
"""
import json
import os
import subprocess
from datetime import date, datetime, timedelta, timezone

AQUI = os.path.dirname(os.path.abspath(__file__))
BRT = timezone(timedelta(hours=-3))
INICIO = date(2026, 7, 1)
SEMANA_ZERO = date(2026, 6, 29)  # segunda-feira antes de 1º/07

# Lista confirmada pelo Mateus em 29/09 (993 segue a confirmar, mas o nome é de teste).
INTERNOS = {
    1011: "teste manual (utm teste_manual)",
    1014: "teste (natalia perim)",
    1033: "teste (Fred Perim)",
    1095: "teste (Izis Perim)",
    1096: "teste (Matheus Costa)",
    980: "equipe (Leo Zeferino)",
    941: "teste (slug testematheus)",
    937: "teste (e-mail @matchhouse)",
    999: "conta própria (INMC Patrimonial)",
    993: "teste (nome \"yuri teste\"), a confirmar",
    3: "conta interna (Admin, admin-1; confirmada pelo Mateus em 06/10)",
    56: "conta interna (Match House, match-house-27; confirmada pelo Mateus em 06/10)",
    39: "conta interna (smartli.ink/matchhouse, confirmada pelo Mateus em 12/10)",
    # Duplicadas, fora dos números pela regra de higiene da lista (Mateus): 1240, 1241, 1242 (10/10) e 836, 1103, 1128, 1187, 1196, 1238 (varredura de 11/10), 1373 e 1372 (18/10), 1361 (17/10).
    1240: "conta duplicada (2ª conta; a principal é a 196)",
    1241: "conta duplicada (2ª conta; a principal é a 1226)",
    1242: "conta duplicada (3ª conta; a principal é a 1226)",
    836: "conta duplicada (a principal é a 722)",
    1103: "conta duplicada (1ª tentativa; a principal é a 1104)",
    1128: "conta duplicada (2ª conta; a principal é a 1126)",
    1187: "conta duplicada (2ª conta; a principal é a 1137)",
    1196: "conta duplicada (2ª conta; a principal é a 560)",
    1238: "conta duplicada (2ª conta; a principal é a 756)",
    1373: "conta duplicada (2ª conta; a principal é a 1351)",
    1361: "conta duplicada (2ª conta; a principal é a 1191)",
    1372: "conta duplicada (2ª conta; a principal é a 1317)",
}

MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
         "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
META_SRC = {"meta", "ig", "fb", "facebook", "instagram"}


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


def canal(src: str) -> str:
    s = (src or "").strip().lower()
    if not s:
        return "Sem UTM"
    if s in META_SRC:
        return "Meta"
    if s == "google":
        return "Google"
    return "Outros"


def etapa(it: dict) -> int:
    if not it.get("slug"):
        return 1
    if not it.get("imoveis_total"):
        return 2
    if not it.get("publicados"):
        return 3
    return 4


ETAPAS = [
    ("login_pendente", "Entrou e não confirmou o celular"),
    ("link_vazio", "Link no ar, sem imóvel"),
    ("rascunho", "Imóvel em rascunho"),
    ("publicado", "Publicou imóvel"),
    ("ia_respondeu", "A IA já atendeu um cliente"),
]


def esteira(dias: int) -> dict:
    url = f"https://api.matchhouse.com.br/backoffice/activation/whatsapp?days={dias}"
    bruto = subprocess.run(["curl", "-sS", "--fail", "--max-time", "40", url],
                           capture_output=True, text=True, check=True).stdout
    return json.loads(bruto)


def menos(a, b):
    """a - b em cada número: days=N conta de N-1 dias atrás até agora."""
    if isinstance(a, dict):
        return {k: menos(v, (b or {}).get(k) if isinstance(b, dict) else None) for k, v in a.items()}
    if isinstance(a, (int, float)) and not isinstance(a, bool):
        return a - (b if isinstance(b, (int, float)) and not isinstance(b, bool) else 0)
    return a


def tabela_esteira(d: dict) -> str:
    em, wa = d["emails"], d["whatsapp"]
    head = ('<thead><tr><th>Etapa</th><th class="r">E-mails</th><th class="r">Erro</th>'
            '<th class="r">WhatsApp</th><th class="r">Entregues</th><th class="r">Lidos</th>'
            '<th class="r">Falhou</th></tr></thead>')
    linhas = []
    for chave, nome in ETAPAS + [("total", "Total")]:
        e = em["total"] if chave == "total" else em["por_etapa"].get(chave, {})
        w = wa["total"] if chave == "total" else wa["por_etapa"].get(chave, {})
        falhou = (w.get("falhou", 0) or 0) + (w.get("erro", 0) or 0)
        b = ("<b>", "</b>") if chave == "total" else ("", "")
        linhas.append(
            f'<tr><td>{b[0]}{nome}{b[1]}</td><td class="r num">{b[0]}{e.get("enviados", 0)}{b[1]}</td>'
            f'<td class="r num">{e.get("erro", 0)}</td><td class="r num">{b[0]}{w.get("enviados", 0)}{b[1]}</td>'
            f'<td class="r num">{w.get("entregues", 0)}</td><td class="r num">{w.get("lidos", 0)}</td>'
            f'<td class="r num">{falhou}</td></tr>')
    return f'<table>{head}<tbody>{"".join(linhas)}</tbody></table>'


def respostas(d: dict) -> str:
    r = d.get("respostas", {})
    pausa = d.get("pausa_automatica", {}).get("houve")
    return (f'Mensagens recebidas no WhatsApp: <b>{r.get("mensagens_recebidas", 0)}</b> · '
            f'pediram SAIR: <b>{r.get("sair", 0)}</b> · VOLTAR: <b>{r.get("voltar", 0)}</b> · '
            f'autorizaram pelo link: <b>{r.get("autorizaram_pelo_link", 0)}</b> · '
            f'pausa automática: <b>{"sim" if pausa else "não"}</b>')


def bloco_esteira(hoje: date) -> str:
    try:
        d1, d2, d8 = esteira(1), esteira(2), esteira(8)
    except Exception as erro:  # a página sai mesmo se a esteira não responder
        return f'<div class="panel"><p class="sub">A esteira não respondeu agora ({erro}).</p></div>'
    ontem = menos(d2, d1)
    semana = menos(d8, d1)
    de, ate = hoje - timedelta(days=7), hoje - timedelta(days=1)
    partes = [
        f'<div class="panel scroll"><h3>Ontem, {ate:%d/%m}</h3>{tabela_esteira(ontem)}'
        f'<p class="sub" style="margin-top:10px">{respostas(ontem)}</p></div>',
        f'<div class="panel scroll"><h3>Últimos 7 dias fechados, {de:%d/%m} a {ate:%d/%m}</h3>{tabela_esteira(semana)}'
        f'<p class="sub" style="margin-top:10px">{respostas(semana)}</p></div>',
    ]
    novidades = os.path.join(AQUI, "..", "novidades", "envios.json")
    if os.path.exists(novidades):
        reg = json.load(open(novidades))
        env = [x for x in reg if x.get("status") == "enviado"]
        pulados = {x["id_user"] for x in reg if x.get("status") != "enviado"} - {x["id_user"] for x in env}
        por_grupo = {g: sum(1 for x in env if x.get("grupo") == g) for g in ("A", "B")}
        partes.append(
            '<div class="panel"><h3>E-mails de novidades (30/09 a 02/10)</h3><p class="sub">'
            f'Enviados: <b>{len(env)}</b>, sendo <b>{por_grupo["A"]}</b> para quem tem imóvel (fotos: capa, ordem e '
            f'remover) e <b>{por_grupo["B"]}</b> para quem tem link sem imóvel. Ainda não receberam: '
            f'<b>{len(pulados)}</b> (a esteira já tinha mandado e-mail no dia ou o teto do dia chegou; '
            'saem no lote seguinte).</p></div>')
    return "\n  ".join(partes)


PAGO = {"succeeded", "paid"}
SITUACAO = {"refunded": "devolvido", "refunding": "devolvendo"}
FORMA = {"card": "cartão", "pix": "Pix", "pix_automatico": "Pix (C6)"}


def brl(v: float) -> str:
    return "R$ " + f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def vendas():
    """Vendas do Pro (backoffice /pro/vendas, api #116). None se a rota não responder."""
    url = "https://api.matchhouse.com.br/backoffice/pro/vendas?dias=400"
    try:
        return json.loads(subprocess.run(["curl", "-sS", "--fail", "--max-time", "40", url],
                                         capture_output=True, text=True, check=True).stdout)
    except Exception as erro:  # a página sai mesmo se a rota não responder
        return {"erro": str(erro)}


def compradores(d: dict) -> dict:
    """id_user -> {nome, data} da primeira compra do Pro paga e não devolvida (sem renovações)."""
    out = {}
    for p in d.get("pagamentos", []):
        if p["id_user"] in INTERNOS or p["status"] not in PAGO or (p.get("valor") or 0) <= 0:
            continue
        dia = datetime.fromisoformat(p["em"].replace("Z", "+00:00")).astimezone(BRT).strftime("%Y-%m-%d")
        if p["id_user"] not in out or dia < out[p["id_user"]]["data"]:
            out[p["id_user"]] = {"nome": (p.get("nome") or "").split(" ")[0] or "Sem nome", "data": dia}
    return out


def bloco_vendas(hoje: date, ids_funil: set, d: dict) -> str:
    """Vendas do Pro (Mateus, 21/10: "as vendas podem entrar no funil diario e no funil")."""
    if "erro" in d:
        return f'<div class="panel"><p class="sub">As vendas não responderam agora ({d["erro"]}).</p></div>'
    ass = [a for a in d.get("assinantes", []) if a["id_user"] not in INTERNOS]
    pags = [p for p in d.get("pagamentos", []) if p["id_user"] not in INTERNOS]
    for p in pags:
        p["_dia"] = datetime.fromisoformat(p["em"].replace("Z", "+00:00")).astimezone(BRT)
    pags.sort(key=lambda p: p["_dia"])
    mes = hoje.strftime("%Y-%m")
    pagos_mes = [p for p in pags if p["status"] in PAGO and (p.get("valor") or 0) > 0
                 and p["_dia"].strftime("%Y-%m") == mes]
    receita = sum(p["valor"] for p in pagos_mes)
    cancel = [a for a in ass if a.get("cancelamento_pedido_em")]
    kpis = [
        (len(ass), "Assinantes ativos", "só corretores, sem contas internas"),
        (len(pagos_mes), f"Vendas em {MESES[hoje.month - 1].lower()}", "assinaturas e renovações pagas"),
        (brl(receita), f"Receita de {MESES[hoje.month - 1].lower()}", "pago e não devolvido"),
        (len(cancel), "Pediram para cancelar", "o Pro vale até o fim do período pago"),
    ]
    kp = "".join(f'<div class="kpi"><span class="v num">{v}</span><span class="l">{l}</span>'
                 f'<span class="d">{dsc}</span></div>' for v, l, dsc in kpis)
    linhas, vistos = [], set()
    for p in pags:
        if p["status"] in PAGO and (p.get("valor") or 0) > 0:
            tipo = "renovação" if p["id_user"] in vistos else "assinou"
            vistos.add(p["id_user"])
            prazo = (p["_dia"] + timedelta(days=7)).date()
            sit = f"{tipo}; pode desistir até {prazo:%d/%m}" if prazo >= hoje else tipo
        else:
            sit = SITUACAO.get(p["status"], "não concluiu o pagamento")
        nome = (p.get("nome") or "").split(" ")[0] or "(sem nome)"
        linhas.append(f'<tr><td class="num">{p["_dia"]:%d/%m %H:%M}</td><td>{nome} ({p["id_user"]})</td>'
                      f'<td>{FORMA.get(p.get("metodo"), p.get("metodo") or "—")}</td>'
                      f'<td class="r num">{brl(p.get("valor") or 0)}</td><td style="white-space:nowrap">{sit}</td></tr>')
    linhas.reverse()
    tabela = ('<table><thead><tr><th>Quando</th><th>Corretor</th><th>Forma</th><th class="r">Valor</th>'
              f'<th>Situação</th></tr></thead><tbody>{"".join(linhas) or "<tr><td colspan=5>Nenhuma venda ainda.</td></tr>"}'
              '</tbody></table>')
    fora = [f'{(a.get("nome") or "").split(" ")[0] or "Sem nome"} ({a["id_user"]})'
            for a in sorted(ass, key=lambda a: a["id_user"]) if a["id_user"] not in ids_funil]
    nota = (f' {fora[0]} entrou antes de 1º/07, com uma conta do app antigo: não aparece nas etapas 1 a 4 '
            'abaixo, e na etapa 5 entra pela data da compra.' if len(fora) == 1 else
            f' {", ".join(fora)} entraram antes de 1º/07, com contas do app antigo: não aparecem nas etapas 1 a 4 '
            'abaixo, e na etapa 5 entram pela data da compra.' if fora else '')
    return (f'<div class="kpis">{kp}</div><div class="panel scroll">{tabela}'
            f'<p class="sub" style="margin-top:10px">Contas internas e de teste ficam fora.{nota}</p></div>')


def main() -> None:
    agora = datetime.now(BRT)
    hoje = agora.date()

    brutos, ini = [], INICIO
    while ini <= hoje:
        fim = min((ini.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1), hoje)
        brutos += buscar(ini, fim)
        ini = fim + timedelta(days=1)

    linhas = []
    for it in brutos:
        quando = datetime.fromisoformat(it["cadastro_em"].replace("Z", "+00:00")).astimezone(BRT)
        linhas.append({
            "id": it["id_user"],
            "nome": (it.get("nome") or "").strip() or "(sem nome)",
            "data": quando.strftime("%Y-%m-%d"),
            "hora": quando.strftime("%H:%M"),
            "mes": quando.strftime("%Y-%m"),
            "sms": bool(it.get("sms_verificado_em")),
            "slug": it.get("slug") or None,
            "imv": it.get("imoveis_total") or 0,
            "pub": it.get("publicados") or 0,
            "src": it.get("utm_source") or "",
            "cont": it.get("utm_content") or "",
            "canal": canal(it.get("utm_source")),
            "etapa": etapa(it),
            "interno": INTERNOS.get(it["id_user"]),
            "_ord": quando.isoformat(),
        })
    # Etapa 5 (Mateus, 21/10: "depois do publicou agora, é o venda"): quem pagou o Pro.
    dv = vendas()
    pro = compradores(dv)
    for r in linhas:
        if r["id"] in pro:
            r["etapa"] = 5
    ids_funil = {r["id"] for r in linhas}
    antigos = [{"id": i, "nome": c["nome"]} for i, c in sorted(pro.items()) if i not in ids_funil]
    # A etapa 5 conta pela data da compra (Mateus, 21/10: "o enio deveria aparecer"), e
    # assim entram também as contas de antes de 1º/07.
    vendas_pro = [{"id": i, "nome": c["nome"], "data": c["data"], "mes": c["data"][:7]}
                  for i, c in sorted(pro.items(), key=lambda x: x[1]["data"])]
    linhas.sort(key=lambda r: r["_ord"], reverse=True)
    for r in linhas:
        del r["_ord"]

    meses = sorted({r["mes"] for r in linhas})
    months = [[m, MESES[int(m[5:]) - 1], ABREV[int(m[5:]) - 1]] for m in meses]
    semanas = (hoje - SEMANA_ZERO).days // 7 + 1
    dias_ultima = hoje.weekday() + 1
    internos = sum(1 for r in linhas if r["interno"])
    ultimo_mes = MESES[hoje.month - 1].lower()
    fecha_hoje = (hoje + timedelta(days=1)).month != hoje.month

    h1 = (f"Funil de cadastros de corretores, {ABREV[int(meses[0][5:]) - 1].lower()}–"
          f"{ABREV[int(meses[-1][5:]) - 1].lower()} {hoje.year}")
    sub = (f"Todos os cadastros de 1º/07 a {hoje:%d/%m/%Y} (horário de Brasília), acompanhados até a "
           f"publicação do primeiro imóvel. Dados de {hoje:%d/%m} às {agora:%Hh%M}"
           f"{'' if fecha_hoje else f'; {ultimo_mes} ainda não fechou'}. {internos} contas internas, de teste "
           f"ou duplicadas ficaram fora dos números e estão listadas no fim da página.")
    ultima = "" if dias_ultima == 7 else (
        " A última semana tem só um dia." if dias_ultima == 1 else f" A última semana tem só {dias_ultima} dias.")
    meta = {"periodo": f"1º/07 a {hoje:%d/%m}", "semanas": semanas, "parcial": dias_ultima < 7}

    html = open(os.path.join(AQUI, "template.html")).read()
    trocas = {
        "__DATA__": json.dumps(linhas, ensure_ascii=False),
        "__MONTHS__": json.dumps(months, ensure_ascii=False),
        "__META__": json.dumps(meta, ensure_ascii=False),
        "__H1__": h1,
        "__SUB__": sub,
        "__ULTIMA__": ultima,
        "__MESES_NOTA__": " Mostra os três últimos meses." if len(months) > 3 else "",
        "__MESES_OPT__": "".join(f'<option value="{m}">{n}</option>' for m, n, _ in months),
        "__ESTEIRA__": bloco_esteira(hoje),
        "__VENDAS__": bloco_vendas(hoje, ids_funil, dv),
        "__PRO__": json.dumps({"antigos": antigos, "vendas": vendas_pro}, ensure_ascii=False),
    }
    for chave, valor in trocas.items():
        assert html.count(chave) == 1, chave
        html = html.replace(chave, valor)
    open(os.path.join(AQUI, "funil-smart-link.html"), "w").write(html)

    fora = [r for r in linhas if not r["interno"]]
    print(json.dumps({
        "gerado": agora.strftime("%d/%m %H:%M"),
        "cadastros": len(linhas), "fora": internos, "contam": len(fora),
        "link": sum(r["etapa"] >= 2 for r in fora),
        "imovel": sum(r["etapa"] >= 3 for r in fora),
        "publicou": sum(r["etapa"] >= 4 for r in fora),
        "compraram": sum(r["etapa"] >= 5 for r in fora), "compraram_conta_antiga": len(antigos),
        "por_mes": {m: [sum(1 for r in fora if r["mes"] == m),
                        sum(1 for r in fora if r["mes"] == m and r["etapa"] >= 4)] for m in meses},
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
