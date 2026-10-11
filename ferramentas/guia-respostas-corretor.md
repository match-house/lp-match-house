# Guia para responder corretor: o que o app faz, com o nome de cada botão

Levantado no código do app (repo `app`, `main` em 2d4aca6, 29/09/2026).
Serve para responder no WhatsApp 6800 e por e-mail. **Só ensinar o que está
aqui.** Se a pessoa pedir algo que não está no guia, conferir no código antes
de responder. Não pode inventar botão nem prometer recurso.

Quando o app mudar (PR novo no `app`), atualizar este arquivo.

## 0. Nunca: número da empresa (Mateus, 06/10)

Em nenhuma resposta: quantos corretores, usuários, pagantes, ativos,
cadastros, imóveis ou leads a Match House tem, nem faturamento, custo ou
qualquer número geral. Também nada sobre outro corretor. Só o que é da própria
pessoa. Se perguntarem: "Esses números são internos da Match House, mas posso
te ajudar com o seu link" e seguir para a dúvida dela.

## 1. A regra de 29/09: toda resposta fala da bio e das redes

Em 29/09 o Mateus pediu: "em todas as mensagens falar para colocarem no link
da bio, do insta e das redes sociais. tirar dúvidas sobre todas as
funcionalidades, divulgar, as métricas, e tudo mais".

- Toda resposta a corretor **termina com o convite** para pôr o
  `smartli.ink/<slug>` na bio do Instagram e nas redes.
- Tirar a dúvida que ele trouxe vem **antes**. O convite fecha a mensagem.
- Se a dúvida abrir espaço para isso, pode sugerir o próximo passo (Divulgar,
  Métricas, IA & Leads). Uma sugestão por mensagem, não um manual inteiro.

Fecho padrão (trocar `<slug>`):

```
Uma dica: coloque o seu link smartli.ink/<slug> na bio do Instagram e nas suas redes. No app, em Divulgar, o botão "Cole o link na bio do Instagram" já copia o link e abre a tela certa do Instagram. Quem abrir o link é atendido pela sua IA, a qualquer hora.
```

Continuam valendo as regras de sempre:

- sem emoji;
- nunca "gratuito" nem "grátis";
- nunca `matchhouse.co`;
- o `smartli.ink/<slug>` vem antes de qualquer link `app.smartli.ink/...`;
- nunca o 27 99226-8000;
- limite de imóveis: "até 100 imóveis no ar";
- preço e planos só com o "pode" do Mateus.

## 2. Onde fica cada coisa

**Menu do celular** (barra de baixo), nesta ordem: "Visão", "Divulgar",
"Imóveis", "Redes", "Métricas", "IA & Leads".

**Menu do computador** (lateral), nesta ordem: "Visão geral", "Divulgar",
"Imóveis", "IA & Leads", "Redes sociais", "Métricas".

**No topo de todas as telas:**

- celular: botão **"Copiar link"** e um botão com seta que abre o Smart Link;
- computador: botão com o próprio `smartli.ink/<slug>`, que copia o link, e
  **"Ver meu Smart Link"**.

| O que ele quer | Onde | Link direto |
|---|---|---|
| Copiar o link / pôr na bio | Visão ou Divulgar → "Cole o link na bio do Instagram" | app.smartli.ink/dashboard/divulgar |
| Arte pronta para postar | Divulgar | app.smartli.ink/dashboard/divulgar |
| Cadastrar imóvel | Imóveis → "Cadastrar outro imóvel", ou Visão → "Publicar meu primeiro imóvel" | app.smartli.ink/dashboard/imoveis/novo |
| Corrigir um imóvel, pôr fotos | Imóveis → lápis, ou tocar no imóvel → "Editar imóvel" | app.smartli.ink/dashboard/imoveis/<id>/editar |
| QR para placa, panfleto, cartão (seção 10) | Imóveis → ícone de QR; Divulgar → "Ver QR code" | app.smartli.ink/dashboard/imoveis ou app.smartli.ink/dashboard/divulgar |
| Ver visitas e cliques | Métricas | app.smartli.ink/dashboard/metricas |
| Ver as conversas da IA | IA & Leads | app.smartli.ink/dashboard/ia |
| Instagram, Facebook, site etc. no perfil | Redes → "Adicionar rede social" | app.smartli.ink/dashboard/social |
| Foto, nome, CRECI, trocar o link | Visão → "Editar perfil" | app.smartli.ink/dashboard/editar-perfil |

## 3. Bio do Instagram e redes

- **Botão "Cole o link na bio do Instagram"**, com o subtítulo
  "Configurações → Editar perfil → Link":
  - Ao tocar, copia `smartli.ink/<slug>` e abre a tela de editar perfil do
    Instagram. Aí é só colar no campo de link e salvar.
  - Em Divulgar aparece sempre. Na Visão, só depois do primeiro imóvel
    publicado.
- **Em Divulgar, cartão "Legenda pronta"** → botão **"Copiar legenda"**. Copia
  este texto:
  "Meu atendimento agora é 24/7: imóveis selecionados, resposta na hora e
  visita agendada — tudo num único link. Fale com minha IA: smartli.ink/<slug>"
- **Em Divulgar, cartão "QR do seu Smart Link"** (desde 07/10) → botão
  **"Ver QR code"**. Fica entre "Legenda pronta" e o checklist. Detalhes na
  seção 10.
- **Em Divulgar, checklist "Onde seu link precisa estar":**
  - É o próprio corretor que marca cada item. O app não confere nada.
  - Os itens e os pontos: "Bio do Instagram" (+40), "Destaque dos Stories"
    (+30), "Status do WhatsApp" (+20), "Assinatura de e-mail" (+10).
  - Os níveis vão de "Invisível" a "Presença máxima".
  - É bom para sugerir o próximo lugar onde pôr o link.
- **Redes** (app.smartli.ink/dashboard/social):
  - "Adicionar rede social" → escolher Facebook, TikTok, Instagram, LinkedIn,
    YouTube ou Site → colar o link no campo "Link do <rede>" → "Adicionar".
  - Cabe um link por rede. Se a rede já existe, o botão vira "Atualizar".
  - No Instagram pode digitar só "@usuario", que o app completa.
  - O WhatsApp não aparece nessa lista.

## 4. Divulgar: arte pronta para postar

Em "Seu anúncio pronto para postar" há 4 estilos. O botão **"Surpreenda-me"**
sorteia outro.

| Estilo | Para quê | O que sai na arte |
|---|---|---|
| "Autoridade" | Marca | Nome grande, CRECI, estado, bairros, "Atendimento 24/7 com IA própria" e o link |
| "Acabou de entrar" | Novidade | Foto de capa do imóvel **mais recente**, bairro, link e "Valor no link" (o preço não aparece) |
| "Fora dos portais" | Exclusividade | "Off-market", endereço tarjado, "Só no link". **Único que deixa escolher o imóvel** |
| "A semana" | Bastidor | Visualizações, cliques e compartilhamentos dos últimos 7 dias |

Como exportar:

- No celular: **"Compartilhar imagem"**. Abre o compartilhar do celular; dá
  para salvar na galeria ou mandar direto para o Instagram.
- Nos outros casos: **"Baixar imagem"**.

Limites:

- Sai uma imagem só, no formato de post do feed (4:5).
- **Não existe:** formato de Stories, vídeo, carrossel.
- Os estilos com imóvel só usam imóvel publicado. Sem imóvel, pedem
  "Cadastrar imóvel".

## 5. Métricas (app.smartli.ink/dashboard/metricas)

- **Período:** "7d", "30d", "90d" ou "Tudo". Abre em "Tudo".
- **"Sobre o seu perfil":** "Visualizações do perfil", "Cliques" e
  "Compartilhamentos".
- **"Desempenho por anúncio":** os mesmos três números para cada imóvel ativo.
  Aparecem só como ícones: olho = visualizações, cursor = cliques, seta =
  compartilhamentos.
- **Não existe nesta tela:** número de conversas ou de leads (isso fica em
  IA & Leads) e gráfico.

## 6. IA & Leads (app.smartli.ink/dashboard/ia)

- **"Conversas no período"**, com o total. Período "7d/30d/90d/Tudo".
- **"Conversas recentes"**, 10 por página:
  - Cada linha mostra o nome do cliente ("Conversa com visitante" quando ele não
    disse o nome), a última mensagem e a hora.
  - **"Ver conversa"** abre a conversa inteira.
- **"Assumir conversa"** abre o WhatsApp do cliente com esta mensagem pronta:
  "Olá, <Nome>! Vi que você conversou com a nossa assistente e estou
  assumindo o atendimento. Como posso te ajudar?"
  - Só aparece quando o cliente deixou um celular válido.
  - O número não aparece escrito na tela; o botão é o caminho.
- **Não existe:**
  - responder pelo app;
  - exportar;
  - e-mail do cliente;
  - filtro por imóvel.

## 7. Imóveis

### Cadastrar (app.smartli.ink/dashboard/imoveis/novo)

**Primeiro imóvel (desde 01/10, PR app #106).** Quem acaba de escolher o link
cai direto nesta tela, e quem ainda não tem imóvel publicado vê uma caixa só:

- título "Seu link está no ar." / "Agora o primeiro imóvel — leva 1 minuto.";
- a caixa "Cole aqui o link do anúncio ou o texto do imóvel" e o botão
  **"Preencher com a IA"**: se for só um link, ele importa o anúncio; se for
  texto, organiza o texto;
- **"Prefiro mandar as fotos"**: o mesmo que "Subir fotos";
- **"Ver outras formas (PDF, arquivo do CRM)"**: abre os quatro jeitos abaixo.

Quem já tem imóvel publicado vê direto os quatro jeitos.

**Não cadastrar imóvel pelo corretor (decisão do Mateus, 01/10).** Quem
manda o link de um anúncio pede ajuda para publicar: a resposta ensina a
fazer no app ("Imóveis" → colar o link na caixa → "Preencher com a IA" →
conferir → "Publicar imóvel →"), não devolve cadastro pronto. Motivo dele:
"o corretor deve mandar direto na aplicação e já publicar.. assim ele
aprende e faz as próximas". O app aceita
`/dashboard/imoveis/novo?link=<anúncio codificado>` (PR #106), mas esse
link não é para mandar a corretor.

Há quatro jeitos. Em todos, a IA preenche e o corretor revisa antes de publicar.

1. **"Descrever em texto":** colar o que ele tem (WhatsApp, anotação), até
   5000 caracteres.
2. **"Importar de um link":** colar o link do anúncio (site dele ou portal) →
   "Importar e preencher →". Se o link não ler, a tela pede para colar o texto
   do anúncio.
3. **"Subir fotos":** a IA olha até 8 fotos e monta a descrição. As outras
   entram só na galeria.
4. **"Anexar PDF":** ficha do CRM, memorial ou matrícula, até 40 MB e 40
   páginas. PDF escaneado não funciona; aí o caminho é tirar foto das páginas
   e usar "Subir fotos".

**Carteira inteira** ("Carteira inteira de uma vez"):

- botão "Enviar XML do CRM" → "Importar carteira →";
- XML de até 4 MB, até 6 fotos por imóvel;
- os imóveis entram **como rascunho**: ele precisa revisar e publicar cada um.

### Revisar e editar (app.smartli.ink/dashboard/imoveis/<id>/editar)

**Seções:** "Essencial", "Localização", "Detalhes", "Valores", "Comodidades",
"Fotos e mídia", "Publicação". O que tem em cada uma:

- **"Essencial":**
  - "Finalidade": Venda ou Aluguel;
  - "Tipo", "Subtipo", "Nome", "Descrição".
  - "Subtipo" tem "Casa", "Apartamento" e, desde 09/10 (app #130),
    **"Loteamento"**. Com Loteamento marcado:
    - em "Detalhes", um campo só, **"Lotes a partir de (m²)"** (o menor
      lote); a faixa ("lotes de 450 a 900 m²") vai na "Descrição";
    - somem Quartos, Suítes, Banheiros, Vagas, Andar e "Mobiliado";
    - em "Valores", o rótulo vira **"Valor a partir de"** (o lote mais barato);
    - no site sai "Lotes a partir de 450 m²" e "A partir de R$ ...".
- **"Localização":** "Digite o CEP e o resto vem sozinho". Tem "Bairro",
  "Cidade" etc.
- **"Valores":**
  - "Valor de venda" (ou "Valor do aluguel");
  - "Condomínio (mensal)", "IPTU (anual)".
- **"Fotos e mídia":**
  - até 30 fotos (desde 08/10; antes 20); a primeira é a capa;
  - "Vídeo (YouTube ou link direto)" e "Tour virtual 360°".
- **"Publicação":** chaves "Anúncio ativo" e "Ocultar anúncio".

**Botões de baixo:**

- **"Salvar rascunho"**;
- **"Publicar imóvel →"**, que vira **"Salvar alterações →"** quando o imóvel
  já está publicado.

**IA nos textos:** na edição aparecem "Gerar nome com IA", "Gerar descrição
com IA" (ou "Reescrever com IA") e "Gerar com IA a partir do endereço". Só
aparecem se a conta tiver IA. **No cadastro novo não aparecem.**

**Fotos: como ensinar certo** (desde 30/09, PR app #103)

- **Pôr foto:** tocar num espaço vazio e escolher a foto do celular. Sempre
  sobra um espaço vazio para a próxima, até 30.
- Num imóvel sem foto, **a primeira foto escolhida vira a capa**, qualquer
  que seja o espaço tocado.
- **Embaixo de cada foto há botões:**
  - **"Tornar capa"**: leva a foto para o primeiro lugar. Não aparece na
    própria capa.
  - **setas ← →**: movem a foto uma posição para antes ou para depois.
  - **lixeira**: tira a foto.
- **Tocar na foto** troca por outra no mesmo lugar. Capa trocada continua capa.
- Nada disso vale antes de salvar: no fim, **"Salvar alterações →"** (ou
  "Publicar imóvel →" no cadastro novo).
- **Não existe arrastar**, nem no celular nem no computador; a ordem se muda
  pelos botões. Até 29/09 a tela dizia "Foto de capa — arraste aqui"; desde
  30/09 diz "Foto de capa — toque para escolher". Erramos isso com a Juceli em
  29/09.

Texto pronto para quem pergunta das fotos:

```
Para colocar as fotos: abra o imóvel, desça até "Fotos e mídia" e toque num espaço vazio para escolher cada foto do celular. Embaixo de cada foto tem "Tornar capa" para escolher a foto principal, as setas para mudar a ordem e a lixeira para tirar. No fim, toque em "Salvar alterações".
```

**Pegadinhas:**

- **"Salvar rascunho" num imóvel publicado tira ele do ar**: o imóvel volta
  para "Rascunhos". Para corrigir imóvel publicado, o botão certo é "Salvar
  alterações →".
- Desde 07/10 (PR app #122), o selo do topo mostra "● Publicado" quando o
  imóvel está no ar, e "● Rascunho" quando não está. Antes mostrava
  "● Rascunho" mesmo no ar.
- No topo de um imóvel publicado fica também o botão **"QR para placa"**
  (seção 10).
- Nada é obrigatório para publicar, mas quanto mais completo, melhor a IA
  responde. O app diz: "Quanto mais completo o cadastro, melhor sua IA atende
  e qualifica cada lead."

### Lista (app.smartli.ink/dashboard/imoveis)

- Os publicados aparecem com "● Ativo" e quatro ícones: QR (redondo, ciano,
  o primeiro; seção 10), compartilhar, lápis (editar) e lixeira. Imóvel sem
  nome não tem o ícone de QR.
- Tocar na foto ou no nome do imóvel abre a prévia do anúncio (como o
  cliente vê). Desde 01/10 (PR app #109) ela tem o botão **"Editar
  imóvel"** no rodapé, que leva à mesma tela do lápis. Antes não tinha, e
  o Alex Santos não achou onde editar o imóvel publicado.
- Os rascunhos aparecem em "Rascunhos", com o botão "Continuar".
- O compartilhar do imóvel manda o link `smartli.ink/<slug>/perfil/<id>`.

## 8. Editar perfil (app.smartli.ink/dashboard/editar-perfil)

- Dá para mudar:
  - "Foto de perfil" (PNG, JPEG, JPG ou WEBP);
  - "Nome";
  - "CRECI (opcional)" e "UF";
  - "Apelido", o `smartli.ink/<apelido>`;
- depois tocar em "Salvar alterações".
- **Trocar o "Apelido" muda o link público**, e o app não avisa isso. Antes de
  sugerir a troca para quem já divulgou o link, falar com o Mateus.
- **Não existe:** texto de bio, telefone, e-mail, foto de capa, cores.

## 9. Suporte dentro do app

- No painel não existe botão de ajuda. O WhatsApp só aparece no cadastro, na
  página não encontrada e na tela de erro.
- A frase que chega indica onde a pessoa travou (tabela no CLAUDE.md).
- Se o corretor não achar um botão, mandar o link direto da tela (tabela da
  seção 2), sempre depois do `smartli.ink/<slug>`.

## 10. QR code do imóvel e do Smart Link

No ar desde 07/10 (PR app #122, `main` em 1c0988f). Levantado no código.

**Para que serve:** o corretor imprime o QR na placa de "Vende-se" ou
"Aluga-se", no panfleto ou no cartão de visita. Quem aponta a câmera do
celular abre a página no smartli.ink e fala com a IA dele.

Há dois QRs:

| QR | Onde fica | Botão | Quem aponta a câmera cai em |
|---|---|---|---|
| Do imóvel | Imóveis → ícone redondo de QR; ou no topo da tela de editar o imóvel | "QR para placa" | a página daquele imóvel no Smart Link, com a IA |
| Do Smart Link | Divulgar → cartão "QR do seu Smart Link" | "Ver QR code" | o `smartli.ink/<slug>`, com todos os imóveis e a IA |

**Onde fica cada um:**

- **Lista de Imóveis:** o ícone de QR é redondo, ciano, e vem primeiro, antes
  de compartilhar, lápis e lixeira. O nome dele é "QR para placa" (no
  computador aparece ao passar o mouse).
- **Editar imóvel:** botão **"QR para placa"** no topo, ao lado do selo
  "● Publicado". No celular aparece só o ícone; no computador, ícone e texto.
- **Divulgar:** cartão "QR do seu Smart Link", entre "Legenda pronta" e "Onde
  seu link precisa estar". O texto do cartão: "Para o cartão de visita, o
  panfleto e a placa. Quem aponta a câmera do celular cai no seu link e fala
  com a sua IA." Botão **"Ver QR code"**.

**O QR do imóvel só aparece em imóvel publicado e visível:**

- "Anúncio ativo" ligado e "Ocultar anúncio" desligado;
- com nome. Imóvel sem nome ("Rascunho #N") não aparece no link, então não
  tem QR;
- rascunho não tem QR, nem em "Rascunhos" nem na edição;
- no cadastro novo o botão não aparece. Depois de publicar, o QR fica na lista
  de Imóveis.

Se ele não acha o QR de um imóvel, é uma dessas coisas: está em rascunho,
falta o nome, ou o anúncio está inativo ou oculto.

**A janela do QR:**

- Título "QR para placa" (com o nome do imóvel embaixo) ou "QR do seu Smart
  Link".
- O QR grande e, embaixo, a frase e o link curto. Saem iguais na imagem:
  - imóvel: "Aponte a câmera para ver o imóvel e falar com a IA";
  - Smart Link: "Aponte a câmera para ver os imóveis e falar com a IA";
  - nos dois, o `smartli.ink/<slug>` escrito, para quem não consegue ler o QR
    digitar. No QR do imóvel, o texto escrito também é o link do corretor, não
    o do imóvel.
- Botões:
  - **"Compartilhar"**: só aparece quando o celular deixa compartilhar
    imagem. Abre o compartilhar do celular: dá para mandar à gráfica pelo
    WhatsApp ou salvar. Depois aparece "Pronto. Mande para a gráfica ou
    guarde para imprimir."
  - **"Baixar imagem"**: salva a imagem. Depois aparece "Imagem salva nos
    downloads do aparelho." (celular) ou "Imagem salva na pasta de
    downloads." (computador).
  - Se der erro: "Não foi possível gerar o QR. Toque em "Tentar de novo"." e
    o botão **"Tentar de novo"**.
- O arquivo se chama `qr-imovel-<id>.png` ou `qr-smartlink-<slug>.png`.

**Tamanho para impressão:** PNG em alta resolução, perto de 1700 x 2000 px; o
QR sozinho tem uns 1500 px de lado. Dá para imprimir o QR com 12 cm de lado
em qualidade de gráfica, ou com até 25 cm numa placa. QR preto em fundo
branco. Quando não há "Compartilhar", a tela diz: "A imagem sai em alta
resolução, pronta para imprimir."

**Não existe (não prometer):**

- QR com logo, cor ou foto;
- impressão pelo app: o corretor baixa a imagem e leva à gráfica dele;
- QR de rascunho, de imóvel sem nome ou de imóvel oculto;
- contar no app quantas pessoas leram o QR: a tela Métricas não separa quem
  veio pelo QR;
- trocar o imóvel de um QR já impresso. Cada QR de imóvel é daquele imóvel.
  Para uma placa que vai servir a vários imóveis, o certo é o "QR do seu
  Smart Link".

Texto pronto para "como faço o QR do imóvel?" (trocar `<slug>`):

```
Para fazer o QR do imóvel: no app, abra "Imóveis" e toque no ícone redondo de QR, o primeiro ao lado do imóvel. Ou abra o imóvel para editar e toque no ícone de QR, no topo. Depois toque em "Baixar imagem", ou em "Compartilhar" para mandar direto para a gráfica. A imagem sai em alta resolução, pronta para a placa, o panfleto ou o cartão. Quem apontar a câmera do celular abre o imóvel e fala com a sua IA. O QR aparece em imóvel publicado e com nome.

Uma dica: coloque o seu link smartli.ink/<slug> na bio do Instagram e nas suas redes. No app, em Divulgar, o botão "Cole o link na bio do Instagram" já copia o link e abre a tela certa do Instagram. Quem abrir o link é atendido pela sua IA, a qualquer hora.
```
