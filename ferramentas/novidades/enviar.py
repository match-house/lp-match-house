#!/usr/bin/env python3
"""E-mails de novidades de 30/09 (aprovados pelo Mateus em 29/09 à noite: "Pode, vamos de email").

Uso:
  python3 enviar.py A --dry-run      lista quem recebe e faz UMA prévia (não envia)
  python3 enviar.py A                envia o e-mail A (quem tem imóvel)
  python3 enviar.py B --limite 40    envia o e-mail B (link sem imóvel), até 40 hoje

Regras: sai pelo backoffice (preview -> send com o código). A API recusa quem
descadastrou, quem recebeu e-mail da esteira hoje, quem já recebeu mensagem
hoje por e-mail e passa do teto diário de 50. Quem foi recusado fica para outro
dia. Registro em envios.json (quem recebeu não recebe de novo).
"""
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE = "https://api.matchhouse.com.br/backoffice"
AQUI = Path(__file__).parent
REGISTRO = AQUI / "envios.json"
TESTES = {1011, 1014, 1033, 1095, 1096, 980, 941, 937, 999, 993, 955}

ASSUNTO_A = "Novidade no seu Smart Link: você escolhe a capa das fotos"
TEXTO_A = """Oi, {nome}!

Novidade no seu Smart Link: agora você escolhe a foto de capa dos seus imóveis, muda a ordem e tira as fotos que não quiser. Embaixo de cada foto tem "Tornar capa", as setas e a lixeira. No fim, é só tocar em "Salvar alterações".

Seu link: smartli.ink/{slug}
Seus imóveis: app.smartli.ink/dashboard/imoveis

Uma dica: coloque o seu link smartli.ink/{slug} na bio do Instagram e nas suas redes. No app, em Divulgar, o botão "Cole o link na bio do Instagram" já copia o link e abre a tela certa do Instagram. Quem abrir o link é atendido pela sua IA, a qualquer hora.

Qualquer dúvida, é só responder este e-mail.

Mateus, da Match House"""

ASSUNTO_B = "Seu Smart Link está no ar, falta o primeiro imóvel"
TEXTO_B = """Oi, {nome}!

Seu link smartli.ink/{slug} já está no ar. Falta só o primeiro imóvel para a sua IA ter o que mostrar a quem abrir o link.

Ficou mais fácil cadastrar: cole o link de um anúncio seu (do seu site ou de um portal), um texto do WhatsApp, ou mande as fotos, e o app preenche o cadastro. Nas fotos, você escolhe a capa e a ordem.

Publicar o primeiro imóvel: app.smartli.ink/dashboard/imoveis/novo

Uma dica: depois de publicar, coloque o seu link smartli.ink/{slug} na bio do Instagram e nas suas redes. No app, em Divulgar, o botão "Cole o link na bio do Instagram" já copia o link e abre a tela certa do Instagram.

Qualquer dúvida, é só responder este e-mail.

Mateus, da Match House"""


def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read() or b"{}")
        except Exception:
            return e.code, {}


def signups():
    rows = {}
    page = 1
    while True:
        st, d = call("GET", f"/signups?days=90&page_size=100&page={page}")
        if st != 200:
            raise SystemExit(f"signups falhou: {st} {d}")
        for x in d.get("items", []):
            rows[x["id_user"]] = x
        if page >= (d.get("total_pages") or 1):
            return list(rows.values())
        page += 1


def primeiro_nome(x):
    """Primeiro nome só quando parece nome de gente; senão a saudação vai sem nome."""
    partes = (x.get("nome") or "").strip().split()
    if not partes:
        return ""
    nome = partes[0].capitalize()
    if (not nome.isalpha() or len(nome) < 3 or "imove" in nome.lower()
            or nome.lower() in {"new", "corretor", "corretora", "imobiliaria", "imobiliária"}):
        return ""
    return nome


def grupo(x):
    if x["id_user"] in TESTES or not x.get("slug"):
        return None
    return "A" if (x.get("imoveis_total") or 0) > 0 else "B"


def main():
    args = sys.argv[1:]
    alvo = args[0]
    dry = "--dry-run" in args
    limite = int(args[args.index("--limite") + 1]) if "--limite" in args else 50
    registro = json.loads(REGISTRO.read_text()) if REGISTRO.exists() else []
    ja = {r["id_user"] for r in registro if r.get("status") == "enviado"}

    todos = [x for x in signups() if grupo(x) == alvo and x["id_user"] not in ja]
    # Quem publicou primeiro; depois o cadastro mais recente.
    todos.sort(key=lambda x: (-(x.get("publicados") or 0), x.get("cadastro_em") or ""), reverse=False)
    print(f"grupo {alvo}: {len(todos)} a enviar (já enviados antes: {len(ja)})")
    assunto, texto = (ASSUNTO_A, TEXTO_A) if alvo == "A" else (ASSUNTO_B, TEXTO_B)

    enviados = 0
    for x in todos:
        if enviados >= limite:
            break
        nome = primeiro_nome(x)
        corpo = {"id_user": x["id_user"], "channel": "email", "kind": "texto",
                 "subject": assunto,
                 "text": texto.format(nome=nome or "tudo bem", slug=x["slug"]).replace("Oi, tudo bem!", "Oi, tudo bem?")}
        st, prev = call("POST", "/messages/preview", corpo)
        linha = {"id_user": x["id_user"], "slug": x["slug"], "grupo": alvo,
                 "quando": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
        if st != 200 or not prev.get("confirmacao"):
            linha.update(status="recusado_previa", motivo=prev.get("message") or prev)
            print(f"  pulei {x['slug']}: {linha['motivo']}")
            registro.append(linha)
            continue
        if dry:
            print(f"  prévia ok para {x['slug']} ({nome}); avisos: {prev.get('avisos') or prev.get('warnings')}")
            print(json.dumps({k: v for k, v in prev.items() if k != 'confirmacao'}, ensure_ascii=False)[:800])
            return
        st, env = call("POST", "/messages/send", {**corpo, "confirmacao": prev["confirmacao"]})
        if st in (200, 201):
            enviados += 1
            linha.update(status="enviado", id_mensagem=env.get("id_mensagem") or env.get("id"))
            print(f"  enviado {x['slug']} ({enviados})")
        else:
            linha.update(status="erro_envio", motivo=env.get("message") or env)
            print(f"  ERRO {x['slug']}: {linha['motivo']}")
            if st in (429, 503):
                registro.append(linha)
                break
        registro.append(linha)
        time.sleep(1)

    REGISTRO.write_text(json.dumps(registro, ensure_ascii=False, indent=1))
    print(f"fim: {enviados} enviados; registro em {REGISTRO}")


if __name__ == "__main__":
    main()
