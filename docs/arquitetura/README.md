# Documento de arquitetura

PDF de apresentação da arquitetura da Match House (camada de aquisição:
landing page, medição/atribuição e deploy).

- `arquitetura.html` — o fonte. Abre direto no navegador; usa as fontes e o
  logo do próprio repositório por caminho relativo.
- `Match-House-Arquitetura.pdf` — a saída, A4, 7 páginas.

## Regerar o PDF

```sh
sh docs/arquitetura/build.sh
```

Precisa de um Chromium/Chrome no PATH (ou em `CHROME=`). O passo de metadados
é opcional e só roda se o `pypdf` estiver instalado.

> Nota: esta pasta **não** faz parte do site. Se um dia for para a `main`, o
> arquivo passa a ficar acessível publicamente em
> `matchhouse.com.br/docs/arquitetura/…`, porque a Vercel serve o repositório
> inteiro.
