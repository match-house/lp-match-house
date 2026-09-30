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
           f"{'' if fecha_hoje else f'; {ultimo_mes} ainda não fechou'}. {internos} contas internas ou de "
           f"teste ficaram fora dos números e estão listadas no fim da página.")
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
        "por_mes": {m: [sum(1 for r in fora if r["mes"] == m),
                        sum(1 for r in fora if r["mes"] == m and r["etapa"] >= 4)] for m in meses},
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
