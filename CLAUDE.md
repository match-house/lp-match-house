# Match House — Landing Page (lp-match-house)

Notas do projeto para agentes. Ler antes de mexer.

## Fluxo de trabalho padrão (o agente faz tudo)

- O usuário **não é técnico** e espera que o agente **execute o processo inteiro**, do começo ao fim, sem pedir para ele mexer em git/GitHub.
- Priorizar sempre o caminho **mais prático e rápido**. Para uma correção/ajuste pequeno e de baixo risco:
  1. Fazer a alteração e commitar.
  2. **Levar direto para a `main`** — pode commitar/pushar na `main` (foi assim nos "publiques" anteriores) ou, se estiver numa branch, abrir o PR **e já dar o merge você mesmo**. Não deixar esperando aprovação para tarefas simples.
  3. Confirmar que a mudança chegou na `main` (é o que "publica" o site).
  4. Avisar o usuário que está no ar e lembrar do **hard refresh (Ctrl+Shift+R)** por causa do cache.
- Só parar para perguntar quando a mudança for **ambígua, grande ou arriscada** (ex.: reescrita, mudança de conteúdo/preço, algo que afete conversão). Ajuste visual/layout/cópia pequena: executar direto.
- Ao mexer em algo, **não regredir o que já estava corrigido** (ex.: não alterar a velocidade de digitação da conversa — `velocidadeDigitacao`, hoje 65ms — nem quebrar os grids responsivos de mobile).

## Deploy / Publicação (IMPORTANTE)

- O site em produção — **https://www.matchhouse.com.br** — é servido a partir da branch **`main`**.
- **Toda alteração que precisa ir ao ar tem que chegar na `main`.** Commitar só numa branch de feature NÃO muda o site publicado.
- Depois do push na `main`, se a publicação não for automática, é preciso acionar o "publish" do site para a versão nova subir.
- Cache é agressivo (principalmente favicon). Depois de publicar, testar com hard refresh (Ctrl+Shift+R).

## Estrutura

- `index.html` — LP principal (a que está no ar). É um "design doc" (`<x-dc>` + `support.js`); o `<helmet>` é processado por JS.
  - **Desde 08/10 a página voltou à "LP0", a de antes de 28/09** (Mateus:
    "quero voltar a LP para o modelo anterior" e depois "1 versao anterior a
    essa ainda.."). O topo é a própria conversa ("Oi. Eu sou a Match — e esta
    página é uma conversa…") com o botão logo abaixo. O `index.html` é o do
    commit 3ee0753 (LP0, já sem números e prazos que não dá para comprovar)
    com a correção de 35c9b0f: a conversa oferece "Como funciona?" e não fala
    de preço. Sem `mh_v` nos links (ele nasceu com a LP1).
  - As outras versões, se ele quiser de volta:
    - "LP1" (28/09 a 02/10): título "A pergunta chegou às 23h47. Sua IA
      respondeu na hora."; `index.html` do commit 35c9b0f; `mh_v=lp1`.
    - "LP2" (02/10 a 08/10): título "Acorde com visitas marcadas.", um exemplo
      só e botão fixo no rodapé do celular; commits 84adc65 e 9801315;
      `mh_v=lp2`.
  - **Leitura de 07/10: não deu para concluir.**
    - Pelos anúncios da Meta, a LP1 trouxe 21 cadastros (16/09 a 01/10) e a
      LP2 trouxe 2 (02 a 06/10).
    - Visita → cadastro: 4,1% na LP1 e 2,4% na LP2. A diferença cabe no acaso.
    - Nas duas versões, cerca de 1 em cada 5 visitantes da Meta chega ao app.
    - A LP foi pausada em 07/10 pelo custo por corretor que publicou: R$ 448
      com imposto na LP1.
    - O detalhe está em `scratchpad/teste-lp/leitura.md`, nos arquivos desta
      conversa.
    - O `mh_v` não fica gravado no cadastro: a API só guarda utm, fbclid e
      gclid. Ele aparece só no GA4, na URL de chegada ao app.
- `concept-a/b/c/d.html` — rascunhos de conceito, não são a página publicada.
- `diagnostico/`, `politica-de-privacidade.html` — páginas auxiliares.
- `favicon.png` — o "M" da marca (64×64). `logo.png`, `assets/logo-*.png` — logos.

## Favicon / aba do navegador

- Favicon e `<title>` devem ficar no **`<head>` estático real** (linhas do topo do arquivo, antes de `<script src="./support.js">`), **não** dentro do `<helmet>`.
  - Motivo: o `<helmet>` só injeta as tags via JS depois do load, e o navegador não atualiza o favicon de forma confiável nesse caso.
- Padrão usado no `index.html`:
  ```html
  <title>Match House · Smart Link para Bio de Corretores de Imóveis</title>
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="apple-touch-icon" href="favicon.png">
  ```

## Meta Ads — regras fixas do usuário

- **NUNCA ligar a expansão de público (Advantage+ audience / `advantage_audience`)** em nenhum conjunto de anúncios. Decisão explícita do usuário em 17/08/2026: a segmentação é sempre manual. Não propor de novo, não ligar "para testar".
- **Não renomear o evento `Lead`** do pixel (1159381878670820) — a campanha otimiza por ele e renomear zera o aprendizado (aviso também no `tracking.js`).
- **Autonomia desde 29/09**, nas palavras do Mateus: "te dei autonomia no MCP para controlar a campanha, distribuir recursos, alterar LP, fazer novos criativos". Com dois limites que ele escolheu no mesmo dia:
  - **Teto de R$ 125/dia no Meta** somando as campanhas. Desde 02/10, às 9h30,
    com o "pode" do Mateus: **LP R$ 20 + app R$ 105** (antes LP 35 + app 90).
    Motivo: de 16/09 a 01/10, R$ 131 por corretor que publicou pelo app contra
    R$ 448 pela LP. Isto vale acima dos números antigos da rotina do
    relatório diário. Redistribuir entre campanhas e anúncios pode; passar
    do total, não.
  - **Desde 07/10, às 9h35 (decisão do Mateus): LP pausada e app em R$ 100.**
    Nas palavras dele: "pausa a LP, vamos manter o google mais esse mes,
    coloca a campanha do app no meta em 100,00. Vou hj plugar e aumentar a
    verba do chatgpt".
    - Motivo, de 01 a 06/10:
      - ChatGPT: R$ 316 em faturas, 29 cadastros e 6 publicaram (R$ 53 por
        corretor que publicou).
      - Meta app: cerca de R$ 600 com imposto, 16 cadastros e 4 publicaram.
      - LP: cerca de R$ 150, 2 cadastros e nenhum publicou.
    - Pausados o conjunto da LP (120251646674340445) e os anúncios 5a e 7b.
      Os anúncios ficam pausados porque a regra noturna religa os conjuntos
      às 07h13. Não religar a LP sem o Mateus.
    - Google segue até o fim de outubro. A verba do ChatGPT sobe pelo painel
      dele.
    - **07/10, ~10h50:** o Mateus subiu o ChatGPT ("Smart Link - Registro
      completo") para **R$ 75/dia**. Antes era cerca de R$ 53/dia, pela média
      das faturas.
    - No mesmo dia ele ligou o conector `openai_ads` no Windsor (conta 976,
      "Match House GPT") e tirou o GA4. O gasto do Google por dia não vem
      mais: ele passa o número uma vez por semana.
  - **Só UMA conversa mexe na campanha, na LP e nos criativos**: a sessão `session_01AcwN8eqkNLzNHMM46binBv`. Se você é outra conversa, não pause, não ligue, não crie anúncio e não mude verba; leia os números e, se achar que algo precisa mudar, diga ao Mateus. Em 28/09 duas conversas mexeram ao mesmo tempo (7a e 7b pausados, 10g e 10a criados, pausa das 23h13 perdida) e uma não sabia o que a outra tinha feito.
    Em 02/10 aconteceu de novo: outra conversa religou o anúncio 7a, que esta
    tinha pausado pelo critério. O Mateus mandou pausar e reafirmou: "Agora
    fica somente vc gerindo a campanha".
- Toda mudança feita com essa autonomia sai no relatório diário com o motivo e o número que a justificou.
- Pausa noturna: os dois conjuntos param às 23h13 e voltam às 07h13 (Brasília).
  De 29/09 a 01/10 isso foi feito por rotina desta conversa, porque a regra
  automática do Meta parou de funcionar em 28/09 e o MCP não mexe em regras.
  **Em 01/10, às 20h50, o Mateus refez a regra no Gerenciador.** As rotinas
  `trig_01GNLbMWdWC3DBgkeXWCuWzt` (pausa) e `trig_013D2UoHoJwwzqVjQLHzcuZZ`
  (religar) foram desligadas, não apagadas, para não haver dois controles.
  Se a regra falhar de novo, religar as duas rotinas e avisar o Mateus.
- Google Ads não está conectado no MCP: dá para ler (via GA4), não para mudar.
- **ChatGPT (OpenAI Ads)**, fora do MCP e fora do teto do Meta; quem mexe é o
  Mateus, no painel dele. Em 02/10 a conta mostrou que todos os 4 cadastros
  completos (1166 a 1169) vieram da campanha "Smart Link - Registro completo"
  (utm_campaign `chatgpt-registro-completo`): R$ 37,99, 12 cliques, R$ 9,50 por
  cadastro. A "Campanha Smartlink", por clique, gastou R$ 227,97 com 81
  cliques e 0 cadastros completos. Com o "concordo" dele, a verba passou para
  a "Registro completo" e a campanha por clique foi pausada (feito por ele).
  **Resolvido em 07/10:** o painel e o Windsor marcam 22 conversões até
  06/10, o mesmo número de cadastros concluídos do ChatGPT no backoffice.
  O pixel chega.
  - Gasto real pelo conector, de 30/09 a 06/10: R$ 538,04. As faturas somam
    R$ 476,32, e faltava faturar R$ 61,72.
  - "Registro completo": R$ 310, 28 cadastros, 22 concluídos e 6 publicaram
    (R$ 11 por cadastro, R$ 52 por corretor que publicou).
  - "Campanha Smartlink" (por clique, pausada em 02/10): R$ 228, com 3
    cadastros e nenhum concluído.
  - Detalhe em `scratchpad/openai-ads/resumo.md`.

## Contas de teste e internas — fora de qualquer número (confirmado em 29/09)

Tirar do funil, dos relatórios e de custo por cadastro (id_user):

- Testes: 1011, 1014, 1033, 1095, 1096.
- Internas: 980 (Leo Zeferino, equipe), 941 (testematheus), 937 (e-mail
  @matchhouse), 999 (INMC Patrimonial, conta própria), 3 (Admin, admin-1)
  e 56 (Match House, match-house-27). As duas últimas foram confirmadas
  pelo Mateus em 06/10: "sim sao nossas".
- Ainda não confirmadas: 955 e 993. Perguntar uma vez, sem insistir.

Em 29/09 um relatório de funil saiu sem tirar 1014, 1033, 1095 e 1096: deu
161 cadastros de julho a setembro em vez de 157.

## Backoffice da API — como ler

`https://api.matchhouse.com.br/backoffice/...` responde nas sessões do
ambiente Default: a credencial "Backoffice Match House" do ambiente põe o
cabeçalho `x-backoffice-token` sozinho. Não peça o token e não o escreva em
lugar nenhum. As rotas estão em `api/src/modules/backoffice/*.controller.ts`.
Leitura é livre; `POST /backoffice/messages/send` só com o "pode" do Mateus
para aquela mensagem.

- **Excluir conta a pedido do titular** (api #73, 06/10). Só com o "pode"
  do Mateus para aquela conta.
  - Primeiro o e-mail de confirmação, porque a exclusão apaga o endereço.
    Sem convite da bio.
  - Depois `POST /backoffice/conta/excluir/preview` `{id_user}`, e
    `POST /backoffice/conta/excluir` com o mesmo corpo + `confirmacao`.
  - O que a exclusão faz:
    - cancela o Stripe;
    - anonimiza o cadastro;
    - troca o link por `excluido-<id_agent>`;
    - apaga foto (também no S3), redes, sessões e leads;
    - derruba o login (401).
  - Pagamento e nota fiscal ficam, sem nome.
  - Depois, tirar a pessoa das nossas listas locais.
  - Primeira: a conta 561, em 06/10.
- **Responder corretor pelo WhatsApp da esteira (27 99854-6800).** Ligado
  em 29/09 (`BACKOFFICE_SEND_ENABLED=true` na revisão `matchhouse-back:17`
  do ECS). Quem escreve no 6800 chega por e-mail ("WhatsApp de <nome>") e a
  resposta sai do próprio 6800: primeiro `POST /backoffice/messages/preview`
  (`{id_user, channel: "whatsapp", kind: "texto", text}`), que devolve um
  código `confirmacao`; depois `POST /backoffice/messages/send` com o mesmo
  corpo + `confirmacao`. Texto livre só até 24 h depois da última mensagem
  da pessoa. Não mandar a pessoa para outro número.
  - Em 08/10 o Mateus trocou o nome "Match House Twilio" da conta do
    WhatsApp do 6800 (WABA 28349208018063806, Configurações do negócio >
    Contas do WhatsApp) para "Match House". A Twilio usa o id da conta, não
    o nome. Na mesma lista já havia outra conta chamada "Match House" (a do
    aplicativo WhatsApp Business): a do 6800 é a de id 28349208018063806.
- **Código de cadastro pelo WhatsApp** (ligado em 30/09, 16h). Na tela do
  código o corretor pode escolher "Receber por WhatsApp", e o código sai do
  6800 como "Match House AI". O caminho é:
  - Twilio: o Verify "Match House" usa o Messaging Service "Match House
    WhatsApp", que tem o 6800 e "Defer to sender's webhook". Não trocar essa
    opção: é ela que mantém as respostas dos corretores chegando.
  - Meta: aprovou os modelos `verify_auto_created` em vários idiomas, com
    português (BR).
  - ECS: `TWILIO_VERIFY_WHATSAPP=true` na revisão `matchhouse-back:18`.
  - Testado em 30/09 num número de fora da equipe; chegou em português em
    menos de 1 minuto.
  - Pela regra de sempre, o 27 99226-8000 não entra em teste de Twilio nem de
    Meta.
  - Medir no Amplitude pelo `otp_channel` com `channel=whatsapp`.

## Limite de imóveis no ar: 100 (desde 29/09/2026)

- Em 29/09, às 10h29, o Mateus subiu para 100 o limite do plano de entrada
  (id 1), que é o plano que todo cadastro recebe. Antes era 30, segundo a ata
  de 23/07; o banco não guarda o valor antigo. A API lê o limite do plano na
  hora de publicar, então os 100 valem para contas antigas e novas desse plano.
- Em tudo que vai para cliente (LP, mensagens, modelos, roteiros de venda):
  "até 100 imóveis no ar". Não escrever mais 30.
- Exceção: quem ainda paga um plano antigo, já desativado, fica com o número
  daquele plano até a assinatura acabar (10, 25, 30, 50 ou 60). Se um
  corretor disser que travou antes de 100, é isso: confirmar com o Mateus
  antes de responder.
- Achado de 29/09: publicar pelo app.smartli.ink hoje não confere o limite
  (a mutation enableProperty da API liga o anúncio sem checar). Corrigir é
  decisão do Mateus, porque passa a barrar quem está em plano menor.

## Custos da empresa — o que não entra mais

- **Globalsys (House027) é passado** (Mateus, 29/09): não existe mais esse
  custo. Não somar em custo mensal, ponto de equilíbrio, CAC nem projeção, e
  não citar nem como "saindo". Já saiu da área de custos.
- Conferido com o Mateus em 07/10:
  - **HostGator** (plano P, R$ 438,79 por ano) continua em uso: a LP
    matchhouse.com.br está lá. Migrar é ideia para depois, não agora.
  - **Claude Max 5x** (R$ 550 por mês) já era pago em julho.
  - A NF 734 da Intelliway (agosto) foi paga.

## Planos por lead qualificado (decidido pelo Mateus em 29/09, ainda não lançado)

- Cobra-se pelos leads que a IA qualifica (nome + celular), não por imóvel.
  Imóvel fica em até 100 em todos os planos: são os imóveis que enchem as
  páginas públicas que trazem outros corretores.
- **Plano de entrada, sem cobrança:** link, até 100 imóveis, IA atendendo e
  os **3 primeiros leads do mês** com nome e celular à mostra. Do 4º em
  diante a IA continua atendendo (o cliente do corretor nunca fica sem
  resposta); só o contato fica bloqueado até assinar.
- **Pro, R$ 147/mês:** até **30 leads qualificados** por mês e 100 imóveis.
- Ordem: primeiro contar os leads direito (conserto na API, 29/09), medir 30
  dias de leads por corretor, depois ligar a cobrança. Nada de preço na LP
  nem em mensagem para corretor até o Mateus liberar.
- Nunca escrever "gratuito" ou "grátis": é "plano de entrada".
- **Quem volta do Pro ao plano de entrada no meio do mês** (decisão do Mateus,
  06/10) **não ganha mais 3 leads naquele mês**.
  - Os 3 são "os 3 primeiros do mês", e os leads recebidos como Pro também
    contam.
  - O que ele já recebeu continua com o contato à mostra.
  - No mês seguinte ele volta a ter os 3.
  - Está registrado como decisão 6 em `api/docs/cobranca-pro.md`.
- **Plano Pro criado** no backoffice em 01/10, às 19h57 (id_plan 21, ativo,
  R$ 147 a cada 30 dias; o preço no Stripe foi criado depois do PR api #43,
  que faz plano de 30 dias virar mensal). Criar o plano não cobra
  ninguém: a cobrança (renovação, falha de pagamento, Pix) ainda está por fazer.
- **Pix Automático pelo C6: pronto e desligado** (06/10, api #65 e app #120,
  com o "pode!" do Mateus). O corretor paga o 1º mês num QR que já autoriza
  o débito dos meses seguintes, sem Stripe.
  - Só liga com `C6_PIX_AUTOMATICO=on` no ECS. Mesmo ligado, vale a trava de
    sempre: só a conta 999 até `BILLING_MODE=on`.
  - Falta o C6 liberar o Pix Automático na chave da API (pedido do Mateus
    em 05/10).
  - **07/10, 17h36: o C6 validou o roteiro de testes** (caso 202699692292,
    e-mail de homologacaoapi@c6bank.com). O time deles vai ligar ou chamar
    no WhatsApp do Mateus para seguir com a liberação.
  - Depois disso, ele põe no ECS a chave nova, `C6_CONTA` e `C6_AGENCIA`.
    Os passos estão no Apêndice A de `api/docs/cobranca-pro.md`.
  - Até 09/10 o C6 ainda não tinha ligado. Nesse dia o Mateus reabriu o
    e-mail de 07/10 e recebeu a lista do que pedir na ligação:
    1. escopos do Pix Automático na chave de produção (`rec.write`,
       `cobr.write`, `payloadlocationrec.write`, `webhookrec.write`,
       `webhookcobr.write`);
    2. credenciais e certificado de produção, com o certificado atual
       revogado (vão direto para o ECS, nunca pelo chat);
    3. a antecedência da cobrança do mês (usamos 8 dias; pode ser de 2 a 10);
    4. tarifas;
    5. conta e agência.
  - **Lembrete na quarta, 14/10, às 9h30** (`trig_012FxwNJL9vW28JpSEnyAP9r`).
    Ele disse: "se chegar na terça te aviso". Em 09/10 ele já tinha chamado
    o gerente do C6 ("Ja chamei.. rs").
- **Pix Automático: parte da API no ar em 02/10 (PR api #47), desligada.**
  - O que entrou:
    - `assinaturaPro` / `assinarPro(metodo: pix|card)`, com login;
    - assinatura no Stripe com débito mensal autorizado até R$ 147, na API
      `dahlia` só nessa chamada;
    - renovação (`subscription_cycle`) estende o plano até o fim do período
      + 10 dias de folga;
    - `invoice.payment_failed` vai para o log.
  - Quem assina: só os `id_user` de `BILLING_TEST_USER_IDS` (variável no
    ECS, hoje vazia). Com `BILLING_MODE=on`, todos. Ligar `on` só com o
    "pode" do Mateus.
  - O aviso antes de cada débito do Pix é do banco do corretor, 3 dias antes.
    Não é nosso.
  - **Tela no ar em 02/10 (app #110), aprovada pelo Mateus ("perfeito agora!").**
    - Rota `/dashboard/pro`, com "Plano Pro" no menu e na visão geral, só
      para quem a API libera.
    - Copy aprovada:
      - título "Libere até 30 clientes por mês.";
      - benefícios: 30 clientes com nome e celular, IA que atende e marca
        visitas, Smart Link com até 100 imóveis, redes sociais num só link.
    - Pix no celular = "Copiar código Pix" (Copia e Cola); no computador, o QR.
    - O código Pix vale **10 minutos** (pedido dele): tem contagem na tela e,
      quando vence, o botão "Gerar novo código".
    - A chave publicável do Stripe (pública, passada por ele) está no código
      do app.
  - **Quem assina: só a conta interna 999 (INMC)**, padrão da API desde a
    api #49, sem mexer no ECS. Corretores não veem nada até `BILLING_MODE=on`.
  - **Teste de 02/10, 16h30: o Stripe recusou o Pix na assinatura.**
    - O Mateus ativou o Pix na configuração "Default" (Sua conta).
    - Mesmo assim, ao tocar em "Assinar com Pix", o Stripe respondeu "The
      payment method type `pix` is invalid ... enabled for any preview
      features".
    - Motivo, no painel: o PIX da conta mostra "Pagamentos recorrentes:
      Não". A conta aceita Pix avulso (R$ 0,50 a R$ 15.674,85), mas não o
      Pix Automático. Pela documentação do Stripe, Pix para empresa no Brasil
      é por convite.
    - **02/10: conta brasileira só aceita Pix avulso; o Pix Automático não
      existe para contas do Brasil.** Quem respondeu foi o assistente de IA
      do painel do Stripe, não o suporte humano. Bate com o "Pagamentos
      recorrentes: Não" do painel. Decisão do Mateus no mesmo dia: o Pix vai
      pelo C6 (apêndice A de `api/docs/cobranca-pro.md`); a mensagem com as
      perguntas foi dada a ele para mandar ao C6.
    - Causa do imóvel fora do ar no teste do cartão: a INMC tinha uma
      assinatura antiga "Plano Gratuito" no Stripe (a cada 180 dias), que foi
      cancelada às 16h32 quando o Pro ficou ativo.
    - Cartão: testado na conta 999 em 02/10, 16h32. Passou e o Pro ligou
      ("Válido até 01/11"). Na mesma hora o imóvel 888 da INMC saiu do ar
      (disable_ad): investigar antes de abrir a cobrança.
    - Plano B, só com o "pode" dele: cobrar o Pix avulso todo mês por fatura
      (o corretor paga a cada mês; não é débito automático).
    - Não ativar o Pix na configuração "Billing Payments" nem mexer nas
      configurações "LeadConnector conta", que são de outro sistema.
  - **Cobrança continua desligada (decisão do Mateus, 02/10).** Motivo: em
    setembro, 49 corretores com conversa somaram só 3 leads com nome e
    celular, e nenhum passou de 3 no mês. O limite do plano de entrada nem
    existe ainda. Ordem: leads da Intelliway chegando, medir 2 a 4 semanas,
    depois o limite de 3 e o Pro juntos.
  - **Lista de espera do Pro no ar desde 02/10, à noite** (api #51, app #112),
    com o "pode" dele:
    - na visão geral, quem ainda não pode assinar vê "Plano Pro · Em breve",
      "Libere até 30 clientes por mês e outros benefícios." e "Quem está na
      lista fica sabendo primeiro. R$ 147 por mês." (texto pedido por ele,
      app #113), com o botão "Quero ser avisado";
    - **desde 08/10 (app #127, pedido dele: "retirar a menção a leads e a
      quantidade.. deixar so um isca para curiosidade")** a frase grande é
      "O próximo nível do seu Smart Link está chegando." O resto fica igual,
      com o preço. No cartão não se fala em lead, cliente nem número além do
      preço. A página /dashboard/pro continua dizendo o que o plano inclui;
    - **desde 09/10 o cartão não mostra o preço** (app #135; Mateus viu "R$ 147
      por mês" na conta pessoal dele e pediu: "checa se nao está aparecendo
      preço do plano pro"). Nenhum preço do Pro aparece para corretor; só a
      tela de assinar, de quem a API libera (hoje a 999), mostra o valor;
    - a lista sai em `GET /backoffice/pro/interesse`, e o toque vira o evento
      `pro_waitlist_joined` no Amplitude;
    - é para quem está nessa lista que se avisa primeiro quando o Pro abrir.
  - Segunda, 05/10 (combinado com ele): Pix Automático do C6, cancelar o Pro
    pelo app (voltando ao plano de entrada) e nota fiscal automática com a
    prefeitura de Vitória.
  - Falta:
    1. Pix pelo C6: em 21/09 o C6 tinha cancelado a homologação antiga
       (o roteiro de testes não foi enviado). Em 03/10 o Mateus refez o
       cadastro no portal developers.c6bank.com.br e na segunda, 05/10, liga
       para o gerente (pelo WhatsApp) para saber o retorno. Esperar essa
       resposta (homologação e escopos) antes de montar;
    2. teste real com a conta 999, depois estorno e cancelamento;
    3. voltar ao plano de entrada quando o Pro for cancelado;
    4. textos dos avisos de pagamento.

## Nota fiscal (NFS-e) automática: emissão direta no Emissor Nacional (06/10)

- **Decisão do Mateus (06/10):** emitir direto pela API do sistema nacional,
  sem fornecedor pago ("precisamos estar enxutos no custo"). Quem constrói é
  esta conversa; os devs dele não estão fazendo.
- **O que a Contabilizei confirmou em 06/10:**
  - Serviço: item 01.03 da LC 116 (processamento, armazenamento ou
    hospedagem), CNAE 6311-9/00.
  - Código de Tributação Nacional: 010301 (ou 010302). O 01.05 não está no
    cadastro; usar exigiria alteração contratual.
  - Tributação pelo Simples Nacional, ISS de 2,01% informado na nota.
    Anexo III (Fator R), alíquota efetiva do DAS de 6,00%. Sem retenção de
    ISS nem de tributos federais, para pessoa física ou jurídica.
  - Inscrição municipal em Vitória: 1306713, ativa. A API autentica pelo
    e-CNPJ A1, sem cadastro prévio na prefeitura.
  - Pode emitir na data de cada pagamento.
  - Descrição: "Disponibilização e acesso à plataforma de software de gestão
    imobiliária Match House (SaaS), referente à assinatura mensal do plano.
    Competência: [Mês/Ano]. Pagamento via [Cartão/Pix]."
  - Certificado e-CNPJ A1: vem no plano da Contabilizei (Certisign), válido
    até 29/11/2026. A renovação abre 30 dias antes, de graça, na plataforma
    deles. Ao renovar, trocar o certificado no servidor (ECS).
- **Todo mês, até o dia 5:** a Contabilizei não tem integração com a nossa
  emissão. O Mateus confere na plataforma deles se todas as notas do mês
  anterior foram importadas, para o DAS sair certo. Mandar a ele a lista das
  notas do mês antes do dia 5.
- O certificado nunca passa pelo chat: vai direto para o ECS.
- **Segunda resposta da Contabilizei (06/10), a duas das três perguntas:**
  - **Alíquota:** para eles, mesmo sem retenção a alíquota vai na nota. Só
    que a validação da Sefin (regra E0625) recusa `pAliq` no nosso caso:
    ME/EPP, ISS pelo Simples, Vitória conveniada, sem retenção. Quem decide
    é o teste 6 na produção restrita (`aliq: 2.01`).
    - Se a Sefin aceitar, a alíquota passa a ir na nota (mudança pequena).
    - Se recusar, mandar a resposta da Sefin à Contabilizei.
  - **Sem CPF:** pode sair como consumidor não identificado. Isso já existe:
    `NFSE_SEM_CPF=sem_tomador`. Ligar só depois do teste 7 (Vitória aceita)
    e do 11a (dá para cancelar nota sem tomador). Com CPF continua sendo o
    melhor: no Pix do C6 ele é obrigatório; no cartão, é opcional.
  - **Série 900: aprovada pela Contabilizei (06/10)** para a API, separada
    das notas que eles emitem pelo portal. Não trocar.
- **Certificado no servidor e testes na restrita (06/10)**:
  - O A1 está em `s3://matchhouse-segredos/nfse/ecnpj.pfx`. Só a função da
    tarefa lê (política `nfse-certificado-leitura`).
  - Revisão 21 da `matchhouse-back`, com `NFSE_EMISSAO=restrita`, a senha e
    `NFSE_EMAIL_DONO`. Nenhuma nota real sai.
  - A API lê: MATCH HOUSE TECHNOLOGY LTDA, válido até 29/11/2026.
  - Resultado dos testes, em `api/docs/nfse.md` (seção 6, api #74):
    - os 2,01% são recusados pela Sefin (E0625), como previsto;
    - nota sem CPF sai e cancela;
    - na restrita a inscrição municipal não pode ir (E0120). Na primeira nota
      de produção, conferir E0116/E0120.
  - CPF dos testes: o do Mateus, com o aval dele. Nunca usar CPF de corretor.
  - Lembrete da renovação: Google Agenda e esta conversa, em 30/10.
  - **A Contabilizei aprovou tudo em 06/10:**
    - 01.03 / 010301, ligado ao CNAE 6311-9/00;
    - ME/EPP pelo Simples, sem retenção e sem alíquota na nota (E0625 ok:
      o ISS vai no DAS);
    - 6,00% no Anexo III (3,99% + 2,01% de ISS);
    - série 900;
    - nota sem CPF permitida em Vitória.
  - Texto do e-mail ao corretor: aprovado em 06/10, com a menção ao Smart
    Link (api #75). Liga com `NFSE_EMAIL_CORRETOR=on`, só em produção.
  - **Todo plano pago gera nota sozinho** (Mateus, 06/10: "sim, pode
    fazer" e "nao tem planos antigos. todos ja acabaram"; api #76 e #77).
    - Criou um plano pago, a nota sai. Plano sem cobrança, não.
    - Se uma assinatura antiga renovar no cartão, também sai nota.
    - **Planos antigos zerados em 06/10** (api #78, com o "pode" do Mateus).
      - As 5 contas que ainda tinham plano antigo marcado passaram para o
        plano de entrada, sem tirar imóvel do ar: 3, 56, 741, 786 (9 imóveis)
        e 920.
      - Rotas: `GET /backoffice/plans/antigos` (lista) e
        `POST /backoffice/plans/antigos/<id_user>/para-entrada`.
    - A nota e o e-mail dizem "mensal", "anual" etc. pela duração do plano.
    - Pix Automático do C6 só existe para o Pro: plano novo no Pix precisa
      de código.
  - Para ligar `producao`, falta:
    - o "pode" do Mateus para a data;
    - `charge.refunded` no webhook do Stripe;
    - no ECS: `NFSE_EMISSAO=producao`, `NFSE_DESDE` = a data,
      `NFSE_SEM_CPF=sem_tomador` e `NFSE_EMAIL_CORRETOR=on`. Também
      acrescentar `3,56` em `NFSE_SEM_NOTA_USER_IDS`: as contas internas
      confirmadas em 06/10.
    - Na primeira nota real, conferir a inscrição municipal (E0116/E0120).

## Ideia para depois: leads da IA como "matches" e prêmios da indicação (Mateus, 01/10; NÃO é para agora)

Ideia dele: aproveitar os matches que a API já tem (vêm do app antigo).
Cada lead liberado gastaria um match. O plano daria os matches do mês. A
indicação daria matches bônus a quem indicar. Só puxar o assunto quando ele
retomar, ou quando chegar a hora de limitar os leads por plano (passo 2 de
`api/docs/cobranca-pro.md`). Nesse caso, a ideia entra no lugar de criar um
campo novo.

O que já existe na API (conferido no código em 01/10):

- No plano: `initial_amount_match`, `initial_amount_match_bonus` e
  `duration_match`. Hoje valem 0 no Pro e no plano de entrada.
- O saldo fica em `MatchRecharge`, por assinatura: `amount_match` mais
  `amount_match_bonus`, com data de validade.
  - `reduceMatchCount` gasta 1 match, primeiro do saldo normal e depois do bônus.
  - `BenefitAwareMatchLimitGuard` bloqueia quando o saldo chega a 0.
- Na indicação, quando ela é aprovada, o corretor sobe de nível e recebe os
  benefícios do nível. Os benefícios `matches_extra` e `matches_bonus_extra`
  criam uma recarga de 30 dias. O campo `IndicationLevel.matches_bonus`
  existe, mas hoje só aparece na exportação: o bônus vem dos benefícios.

O que falta construir:

- Ligar o gasto ao lead. Hoje o match só é gasto quando o corretor aceita o
  "like" de um comprador no app antigo (`agentLike`). O lead da IA, que
  chega pelo `POST /external/leads`, não gasta nada.
- Recarga mensal. Hoje a recarga só nasce quando alguém paga ou troca de
  plano. Como o plano de entrada não paga, ele precisaria de uma rotina que
  recarregue os 3 leads todo mês.
- Consertar um defeito antes de usar indicação com imóveis.
  `addExtraProperties` (o benefício de imóveis extras) soma no **plano**,
  não no corretor: daria imóveis extras a todo mundo do mesmo plano.

**08/10:** o benefício "Ganhe 5 imóveis adicionais" (id_benefit 7) saiu dos
níveis Green · 10% (4) e Blue · 50% (5), pela rota nova do backoffice
`POST /backoffice/indicacao/niveis/beneficios/desvincular` (prévia +
confirmação, api #83). Nada mais mudou nos níveis; o benefício continua
cadastrado. Nomes dos níveis mantidos: Green, Blue e Partner.

### Indicação com três prêmios: + imóveis, + matches (leads) e desconto (Mateus, 01/10)

Ele quer estudar o plano de indicações dando três coisas: mais imóveis,
mais matches (leads) e desconto na mensalidade. Também não é para agora.
Ele achava que o desconto teria de ser construído; não precisa.

**Decisão dele no mesmo dia:** a indicação começa só com **desconto + leads**,
"que é o q move os negócios mesmo... e o corretor gosta". Imóvel extra é o
menos importante e fica de fora do começo; não propor junto.

Conferido no código em 01/10:

- **Desconto na mensalidade: já existe.**
  - Cada nível de indicação tem um `discount_percentage`.
  - Quando o corretor sobe de nível, `applyIndicationDiscountCarryAfterLevelChange`
    grava o percentual em `users.indication_discount_carry`.
  - Na mesma hora, `syncIndicationStripeDiscountsForUser` põe o cupom
    "Indicação X%" (id `mh_ind_pct_<X>`, para sempre) em todas as assinaturas
    ativas dele no Stripe.
  - Na compra, `resolveCheckoutDiscount` já cobra com o desconto.
  - Falta só testar com o Pro e com o Pix Automático, quando a cobrança
    existir.
- **Mais matches (leads):** existe, como descrito acima. Falta ligar o gasto
  ao lead da IA.
- **Mais imóveis: é o que mais falta.**
  - O nível tem `properties_bonus`, e o benefício `properties_extra` existe.
  - Mas o bônus soma no plano inteiro: é o defeito de `addExtraProperties`.
  - A regra que somaria o bônus por corretor (`BenefitAwarePropertyLimitGuard`)
    está escrita, mas não é usada em lugar nenhum.
  - O app novo não confere o limite ao publicar (achado de 29/09).
  - Com todos em até 100 imóveis, esse prêmio vale pouco hoje.

## Ideia para depois: o corretor escolhe a IA e paga pelo modelo (Mateus, 01/10; só ideia)

Pergunta dele: manter a mensalidade e deixar o corretor escolher o modelo de
IA, pagando o preço de cada um, como uma revenda de tokens.

Dá para fazer? Conferido em 01/10:

- **IA do app (BFF):** já roda pelo OpenRouter, com o modelo padrão
  `openai/gpt-4o-mini` em `OPENROUTER_MODEL`. O provider já aceita um modelo
  por pedido (`req.model`). Por isso, a parte técnica de trocar de modelo por
  corretor é pequena.
- **IA que atende o cliente no smartli.ink:** é da Intelliway (EvaGPT), não
  nossa. Escolher o modelo ali depende deles, ou de levar o atendimento para
  o nosso lado.

O que eu disse a ele: é possível, mas não vale como "revenda de token". Os
motivos:

- O corretor compra cliente, não token. Já decidimos cobrar por lead
  qualificado.
- Cobrança por uso pede saldo e recarga, e a conta muda todo mês. Isso gera
  suporte e cancelamento.
- A margem é pequena: o OpenRouter já tem a taxa dele, e o corretor compara
  com o preço do ChatGPT.
- Os termos dos provedores tratam de forma diferente usar o modelo dentro do
  produto e revender o acesso ao modelo. Conferir antes.

A versão que faz sentido: um **nível de IA dentro do plano** (o Pro, ou um
complemento "IA avançada" a preço fixo). Nós escolhemos o modelo e ficamos
com a margem. Antes, medir quanto custa cada conversa e cada lead.

**Mateus concordou (01/10):** nada de revenda de token. Se vier, é um nível de
IA dentro do plano, a preço fixo.

## Dado da empresa é sigiloso: nunca em mensagem nem e-mail (Mateus, 06/10)

- Nas palavras dele: "informações da empresa, numero de usuários pagantes,
  ativos ou qualquer informação em massa ou que nao seja do proprio usuário
  nunca deve ser fornecida nos emails e mensagens. Sao sigilosas da empresa e
  concorrentes ou curiosos podem perguntar."
- Em resposta a corretor, cliente, parceiro ou qualquer pessoa de fora
  (WhatsApp 6800, Direct, e-mail, chamado):
  - nunca dizer quantos corretores, usuários, pagantes, ativos, cadastros,
    imóveis, leads ou conversas a Match House tem;
  - nunca dar faturamento, custo, CAC, verba de anúncio, conversão ou
    qualquer número agregado;
  - nunca falar de outro corretor ou cliente.
- Só se fala do que é da própria pessoa: o link dela, os imóveis dela, as
  conversas e os leads dela.
- Se perguntarem, responder com educação que esses números são internos e
  voltar para o que a pessoa precisa.
- Os relatórios, a área de custos e os funis são só para o Mateus e não saem
  daqui.

## Falar com corretor — que link mandar (regras de 24/09)

Errei os três na mesma manhã. Ficam escritas para não repetir.

- **Nunca mandar `matchhouse.co` para corretor.** A vitrine é a listagem geral,
  não é onde ele conserta nada e não é o que ele deve receber. Para corrigir um
  imóvel, o link é `app.smartli.ink/dashboard/imoveis/<id>/editar`, que abre
  direto na tela de edição daquele imóvel.
- **O primeiro link da mensagem é o que vira o card do WhatsApp.** Se a
  mensagem começa por `app.smartli.ink`, o preview sai como "Crie seu Smart
  Link" — o card de captação, mostrado para quem já é cliente. Então o link
  público do corretor (`smartli.ink/<slug>`) vem **antes** do link do painel:
  aí o card é o dele, com a foto e a IA dele. Confirmado na prática em 24/09.
- **"Crie seu Smart Link" no perfil do corretor NÃO se tira.** A página de um
  corretor é vista por outros corretores e é a porta de entrada mais barata que
  existe — decisão do Mateus: "o objetivo é que outros corretores vejam e
  baixem". Ela leva ao cadastro, marcada com `utm_source=smartli.ink` e
  `utm_content=perfil-<slug>`, que é como se sabe qual corretor trouxe quem.
- Telefone e e-mail de corretor saem do `contatos-ativacao-ACUMULADO.csv` no
  Drive; imóvel, valor e corretor saem do `vitrine-imoveis-ACUMULADO.csv`, que
  o export diário atualiza sozinho. Não levantar isso a print de novo.
- A esteira de ativação manda **um e-mail por corretor por dia, 8h–21h**.
  Disparo manual no mesmo dia pode dobrar na caixa de alguém.

## Como entregar mensagem pronta para o Mateus (regra dele, 24/09)

- **Toda mensagem que ele vai enviar — WhatsApp, e-mail, chamado — sai em
  BLOCO DE CÓDIGO (crase tripla) aqui no chat.** É o bloco de código que faz o
  app desenhar o ícone de copiar; citação com `>` NÃO desenha, e foi
  exatamente o que ele cobrou em 24/09: "cadê o ícone de copiar que te pedi?".
  Nada de texto solto e nada de citação para mensagem que ele vai mandar.
- Pedido original: "sempre que me mandar uma mensagem deixar o botão de copiar
  me ajuda muito". Selecionar texto à mão no celular, no meio de dez conversas
  abertas, trava o trabalho dele.
- O formato que funcionou em 24/09 é um artifact: um cartão por destinatário,
  com nome, o que está errado, a mensagem inteira visível, botão "Copiar" e,
  quando for WhatsApp, um botão verde que abre a conversa da pessoa já com o
  texto dentro (`https://wa.me/55DDDNUMERO?text=` + texto codificado).
- Telefone e e-mail saem do `contatos-ativacao-ACUMULADO.csv` no Drive.
- **Toda mensagem pronta vai com os links (Mateus, 03/10: "O link, lembra?
  Salva isso").** Em 03/10 entreguei respostas sem link e ele cobrou duas vezes.
  - **Dentro da mensagem, o link que a pessoa precisa.** Quem ainda não tem
    cadastro recebe `https://app.smartli.ink` (o card do WhatsApp sai "Crie seu
    Smart Link", que é o certo para ela). Quem já tem recebe primeiro o
    `smartli.ink/<slug>` e depois o link do painel.
  - **Fora da mensagem, para ele, o link de enviar:**
    `https://wa.me/55DDDNUMERO?text=` + o texto codificado, um por pessoa. Ele
    toca, abre a conversa dela com o texto pronto e só envia.
  - Codificar com `jq -Rrs @uri arquivo.txt`. Não usar python para isso:
    python pede aprovação a ele a cada vez.

## O que dizer ao corretor — bio em toda resposta (regra do Mateus, 29/09)

- Pedido dele: "em todas as mensagens falar para colocarem no link da bio, do
  insta e das redes sociais. tirar duvidas sobre todas as funcionalidades,
  divulgar, as métricas, e tudo mais".
- **Toda resposta a corretor termina com o convite** para pôr o
  `smartli.ink/<slug>` na bio do Instagram e nas redes. O caminho no app é o
  botão "Cole o link na bio do Instagram", em Divulgar. Primeiro resolver a
  dúvida dele; o convite fecha a mensagem.
- Dúvida sobre qualquer tela do app (Divulgar, Métricas, IA & Leads, Imóveis,
  Redes, Editar perfil) se responde pelo guia
  **`ferramentas/guia-respostas-corretor.md`**. Ele foi levantado no código do
  app, com o nome exato de cada botão, e traz o fecho padrão pronto.
- **Não ensinar o que não está no guia sem conferir no código.** Em 29/09
  dissemos à Juceli que dava para mudar a ordem das fotos arrastando. O app
  nunca teve arrastar; a tela dizia "arraste aqui" até 29/09. Desde 30/09 a
  ordem se muda pelos botões "Tornar capa", setas e lixeira embaixo de cada
  foto (PR app #103).
- **Padrão da Match House: IA com acompanhamento da equipe** (Mateus, 06/10:
  "a verdade sempre.. IA com acompanhamento da equipe Match House pode tornar
  nosso padrão"). Quando a gente se apresenta ou alguém pergunta se é IA:
  "Aqui é o atendimento da Match House: as respostas por aqui são feitas com a
  ajuda de IA, e a nossa equipe acompanha cada conversa". Nunca negar que é IA
  e nunca fingir ser uma pessoa. Primeira vez: resposta ao Laerte (1202).
  Forma curta (Mateus, 06/10: "com acompanhamento de cada conversa"):
  "IA com acompanhamento da equipe Match House em cada conversa". O
  "cada conversa" não sai.
- Isto muda o conteúdo das respostas, não quem envia: cada envio pelo 6800
  continua precisando do "pode" até ele decidir sobre a autonomia (10 envios
  limpos).

## Follow-up: um "conseguiu?" antes de a janela fechar (regra do Mateus, 06/10)

- Pedido dele: "torne isso regra de folow up", depois do "conseguiu subir o
  imóvel?" ao Guilherme.
- Quem nos escreveu travado ou com um problema (Direct ou 6800) e ficou em
  silêncio depois da nossa resposta recebe **um** follow-up curto, quando
  faltarem 8 h ou menos para fechar a janela de 24 h. Sempre entre 8h e 21h.
- Antes, conferir no backoffice se já resolveu sozinho. Se resolveu, não mandar.
- Só um por problema; sem resposta, não insistir. Robô (resposta automática
  do WhatsApp Business), SAIR/PARAR e teste interno ficam de fora.
- Direct: autonomia total. 6800: dúvida de uso fica na autonomia (manda e
  avisa); o que já precisava do "pode" continua precisando.
- O passo a passo está na rotina de hora em hora
  (`trig_011xbCpFRdmNvYVj7cDrs1Xc`), e o registro em `mensagens-vistas.json`.

## Nome do imóvel: até 255 caracteres (desde 08/10)

- Em 07/10 o corretor 1218 (Rodrigo) tentou publicar 8 vezes um imóvel com
  nome de 88 caracteres e só via erro. A coluna `property.name` era
  VARCHAR(80); o app e a IA deixavam 100. Desde 17/09 foram 17 erros iguais.
- Decisão do Mateus (08/10): "Pode fazer com 255 caracteres e na mensagem tb".
  No ar em 08/10: api #82 (coluna em 255, erro `PROPERTY_NAME_TOO_LONG_ERROR`
  antes do banco, P2000 vira `VALUE_TOO_LONG_ERROR`) e app #123 (campo,
  contador e importação em 255; mensagem "O nome do imóvel pode ter no máximo
  255 caracteres."). O "Gerar nome com IA" continua em 100.
- A migration tenta de novo se a tabela estiver presa (4 vezes de 5 s). Se um
  dia falhar, nenhum container novo da API sobe até rodar, numa task avulsa
  do ECS: `npx prisma migrate resolve --rolled-back <nome da migration>`.
- O backoffice antigo (`backoficce`) ainda limita o nome a 80 na digitação.

**Fotos: até 30 por imóvel (desde 08/10, app #126; antes 20).** O 20 não tinha
motivo técnico. Com o "pode" do Mateus subiu para 30, que é o que a importação
por link já traz. No mesmo dia: a importação deixou de trazer a mesma foto em
vários tamanhos (BFF #8) e o aviso parou de dizer que "o site não liberou"
quando quem cortou foi o nosso limite (app #125).

## Autonomia nos atendimentos (Mateus, 08/10)

- Nas palavras dele: "Pode enviar, vc já tem autonomia para os atendimentos".
  Respondo os atendimentos (6800 e Direct) sem pedir "pode" e mostro a ele a
  mensagem enviada ("mas me mostre a mensagem").
- Primeiro caso: Enio Volmar (id_user 196). A conta antiga dele tem e-mail
  Yahoo, e o app só entra por Google ou Apple. Ele criou a 1240 com Gmail, e o
  telefone barrou. Respondido em 08/10 (mensagem 676), com a promessa de ligar
  o Gmail à conta antiga.
- Falta para cumprir: criar uma rota no backoffice para trocar o e-mail da
  196 e excluir a 1240. Outras contas antigas com Yahoo ou Hotmail devem ter o
  mesmo problema.

## Pendente para sábado ou sexta à noite, com o Mateus (08/10)

- **QR no Divulgar + "Powered by Match House": no ar desde 08/10 à noite (app #124, merge 62d204a, com o "pode" do Mateus).**
  - Arte azul v5: QR menor (quadro em 52% da largura), mais respiro, nome do
    corretor menor (4,7cqw), sem logo e sem "Atendimento 24/7".
  - Imagens brancas (QR do Smart Link e do imóvel): frase "Aponte a câmera…" e
    smartli.ink/<slug> em azul escuro #000f90 (pedido dele: contraste no papel).
  - Junto: as 5 artes do Divulgar baixadas no celular agora saem na Poppins
    (antes saíam na fonte de reserva do aparelho). Falta conferir num iPhone.
- **Prontos, esperando o "pode" do Mateus (09/10 de madrugada), todos com a main
  (loteamento) já dentro e verificados juntos:**
  - **Tela de publicar, app #128** (head 42002c1): Parar; "Tentar de novo" só
    com a subida presa (25 s sem bytes, por XHR); "Sua internet está lenta"
    quando anda devagar; 3 fotos por vez; rascunho reaproveitado sem
    duplicar; reparo só da capa; título 40% menor. Prints em
    scratchpad/d1008/prints-publicar.
  - **Comodidades:** API #84 (efc36bd; migration 20261009200000, coluna
    amenities.id_agent + índice único parcial; grafia EXATA por corretor, um
    imóvel nunca muda o nome no outro), app #129 (62ec336; campo "Escreva
    aqui" em cada grupo, títulos em ciano com "N marcadas", aviso de erro
    visível no celular, XML só liga catálogo) e site #225 (d8c287b; lista
    única sem repetidos, melhor grafia, nome longo não estoura). O site NÃO
    divide por grupo: o app antigo gravou muitos itens no grupo errado.
  - **Ordem:** #128 → API #84 (conferir a migration no deploy) → novo merge da
    main no #129 (conflito em usePropertyRegistrationFlow.ts e no tipo
    SavePropertyParams; no saveProperty a ordem é trava do Loteamento,
    depois createAgentAmenities, depois throwIfStopped/rascunho) → app #129
    → site #225 a qualquer momento.
- **Menores anotados (não urgentes):** o aviso "Não foi possível gravar o
  Loteamento" fica no pé do formulário (igual aos outros erros); a 320 px o
  card do loteamento corta "A partir de R$ 600.000…" e "Novo imóvel" cobre o
  selo "RASCUNHO"; "Terreno" sem subtipo grava imóvel sem tipo (974).
- **Importação da Pirâmide SJC:** corrigida em 08/10 (BFF #10). A página
  real (Next.js, da Arbo) não põe a galeria em <img>: ela vem no
  __NEXT_DATA__, e as <img> são de outros imóveis. Fotos agora pelo código
  do anúncio no endereço (AP13251_PIRQ). Testado pelo Mateus na INMC em
  08/10 ("Ficou certo agora!"): 17 fotos, todas do anúncio. Ele avisou o
  José Luiz (1195) do WhatsApp dele; ver no relatório se o José publicou.

## Fila de 09/10 (manhã)

- **Mensagens do Instagram "como utilitário"** (Mateus, 08/10 à noite: "vamos
  depois colocar as mensagens no insta como utilitário.. coloca na fila para
  amanha de manha"). Confirmar com ele o que quer dizer: responder no Direct
  depois das 24 h (etiqueta HUMAN_AGENT da Meta, até 7 dias) ou mensagens de
  categoria utilitário, como os modelos do WhatsApp. Lembrete marcado para
  09/10, 8h40.
  - **Pesquisa feita em 09/10.** No Instagram não existe "utilitário". Não há
    modelos, e a empresa só responde até 24 h depois da última mensagem da
    pessoa. HUMAN_AGENT (até 7 dias) exige texto escrito por pessoa e a
    revisão do app pela Meta. Não serve para respostas da IA.
  - Perguntado a ele qual das três:
    1. passar para "utilidade" 2 avisos da esteira do WhatsApp (publicou;
       a IA atendeu), uns R$ 25 por mês a menos (recomendado);
    2. avisos pelo Direct (não dá);
    3. mensagem no Direct para quem comenta no anúncio (1 por comentário,
       até 7 dias; testar antes se o comentário de anúncio chega na API).
  - A esteira inteira hoje é MARKETING. `mh_alerta_atendimento_v2` foi
    declarado UTILITY e a Meta reclassificou para MARKETING.
- **Loteamento: no ar desde 09/10, 0h15 (Brasília).** API #85 (subtipo 25
  "Loteamento" em Residencial, migration que nunca trava o deploy, GET
  /backoffice/catalogo), app #130, site #224 e BFF #11.
  - Em produção os tipos são 3 Comercial, 4 Residencial e 5 Rural, e não
    "Imovel"/"Terreno" como o app mostra. Quem escolhe "Terreno" sem subtipo
    grava o imóvel sem tipo (caso do 974): defeito antigo, na fila.
  - Aviso à Bárbara (1226, imóvel 988) marcado para 09/10, 8h05, pelo 6800
    (texto em scratchpad/msgs/barbara-1226-e.txt).
  - Falta o Mateus mandar à Intelliway o aviso de que existe o subtipo
    "Loteamento" (texto pronto no relatório do loteamento).

## Tipo do imóvel: Residencial, Comercial e Rural (decisões do Mateus, 09/10)

- Pedido dele: "podemos usar o residencial, comercial e rural … como era no
  app antigo". O banco já tem esse catálogo (3 Comercial, 4 Residencial,
  5 Rural); só a tela do app novo mostra "Imóvel | Terreno".
- Defeito achado na avaliação: editar e salvar um dos 23 imóveis Comercial ou
  Rural (todos do app antigo) os gravava como Residencial, sem aviso. A
  correção (PR A do app) guarda os ids gravados e os devolve quando o
  corretor não troca o Tipo nem o Subtipo.
- As 3 respostas dele, no mesmo dia:
  1. **Lançamento, Em Construção e Pronto para morar ficam.** Nas palavras
     dele: "o lancamento pode estar em fase de construcao ou pronto para
     morar depois de entregue sera um imovel novo, e pode ser lancamento de
     casas, lotes, apartemento, galpões, etc". Não propor tirar de novo.
  2. **Subtipo obrigatório para publicar: "vamos testar exigir".** Medir no
     Amplitude quantos param nessa trava.
  3. **Não corrigir o banco.** Os corretores ajustam: primeiro e-mail; se não
     resolver, WhatsApp. Só mandar depois que a tela nova estiver no ar
     (antes disso não há como escolher Comercial ou Rural).
- Ideia dele para avaliar: uma caixa de conversa sempre aberta, com um "+",
  onde o corretor manda tudo (links, fotos, texto) e a IA prepara o anúncio
  para ele revisar.
  - Avaliação entregue em 09/10. Ele pediu para conversar na **quarta, 14/10**;
    há um lembrete marcado para as 9h (`trig_012YZ4KGTXzf1CSLVD7aUFVw`).
  - Custo de hoje, pelo print do OpenRouter dele (semana de 09/10): tudo no
    GPT-4o-mini, US$ 0,04 com 59 pedidos e 234,2 mil tokens. Levar na quarta
    o custo por anúncio feito pela caixa, com fotos e PDF.
- **Fase do imóvel (09/10):** Lançamento, Em construção e Pronto viram um
  campo "Fase", opcional e separado do Subtipo. Duas respostas dele no mesmo
  dia:
  - o rótulo é só **"Pronto"**, em todos os tipos. Não usar "Pronto para
    morar" na Fase;
  - a Fase aparece **também no Rural**.
  - A ordem é API (coluna `construction_phase`, sobe à noite), depois site,
    app (depois do PR dos tipos) e BFF.
  - **API no ar desde 09/10, 16h48 (Brasília)** (api #86, merge 67ae2d0),
    com o "pode subir agora" do Mateus e ele por perto. A migration entrou
    sem travar.
    - Conferido depois do deploy:
      - `fase` no backoffice (agente 640: 677, 678, 681 e 682 "Em
        construção"; 679 e 680 "Lançamento");
      - `construction_phase` na busca externa (agente 427: 472, 474, 476 e
        485 "lancamento"; sem fase sai "", nunca null);
      - o filtro `construction_phase: "em_construcao"` (640: só os 4).
    - **Aviso à Intelliway: só quando a Fase estiver no app** (Mateus, 09/10:
      "acho q nao deverá ter alterações com a Inteliway"). Nada quebra, e
      hoje o lançamento antigo ainda está no subtipo, que a IA já lê. O texto
      está no PR api #86.
    - Não voltar a API para uma imagem anterior depois que site, app ou
      Intelliway pedirem o campo.
  - **Site, BFF e app no ar em 09/10 à noite**, com o "Pode colocar a fase"
    do Mateus:
    - **BFF #12**, às 20h30. A IA de importação (link, fotos, PDF e texto) e
      o XML preenchem a fase só para imóvel novo de construtora. "Pronto
      para morar" sozinho não conta, porque revenda usa a frase.
      - A mensagem à IA começa com "DATA DE HOJE".
      - O texto colado vai sob "TEXTO DO CORRETOR:".
      - Os prompts novos não foram rodados contra o modelo de verdade:
        acompanhar as importações.
    - **Site #227**, às 20h33. Selo da fase no card do Smart Link e da
      vitrine, e etiqueta no detalhe: "VENDA · RESIDENCIAL · APARTAMENTO ·
      LANÇAMENTO".
      - Junto entrou o conserto de um defeito que estava no ar desde 11/08:
        a lista "Imóveis selecionados" não tinha altura. Com 5 imóveis ou
        mais, o título e o "Fechar" ficavam fora da tela, sem rolagem.
      - Agora a altura é teto (92% no celular): lista curta continua
        compacta, lista longa rola.
    - **App #136**, às 21h09. A linha "Fase (opcional)" fica logo abaixo do
      Subtipo.
      - O imóvel antigo de fase abre com a Fase marcada, o Subtipo em
        branco e o aviso "“Lançamento” agora fica na Fase, abaixo. Escolha
        aqui o que o imóvel é.".
      - O lembrete de completar passou a cobrar "subtipo".
      - `property_publish_blocked` e `property_persist_completed` levam
        `fase`.
    - Se a API recusar o campo, site e app repetem a consulta sem ele.
  - Próximos, com o "pode" dele:
    - o aviso à Intelliway (texto entregue no chat em 09/10);
    - as mensagens aos corretores dos imóveis antigos de fase (12
      corretores, 19 publicados), juntando com a dos tipos errados quando
      for o mesmo corretor.
    - Nas revendas gravadas como "Pronto para morar" (388, 396, 397),
      sugerir deixar a fase vazia.
- **Tela nova dos tipos: no ar desde 09/10, 12h20 (Brasília)**, com o "pode"
  do Mateus (app #134, merge 10cf8af; site #226, merge 16a7d67).
  - Residencial, Comercial e Rural, com os subtipos de cada um.
  - O subtipo é obrigatório para publicar (medir `property_publish_blocked`).
  - O site esconde "Andar 0" e "Mobiliado" de Terreno e Área.
  - Depois de publicada, saem as mensagens aos corretores dos imóveis com
    tipo errado, primeiro por e-mail.

## Entrar no app pelo Instagram no iPhone (decisões do Mateus, 09/10)

- Números de 02 a 08/10: 36 pessoas abriram o app dentro do Instagram no
  iPhone. 10 tocaram para entrar: 5 entraram pela Apple ali mesmo e 5
  falharam. Ninguém chegou a 2 falhas, então o socorro (o gesto do ··· e o
  botão do WhatsApp) não apareceu para ninguém.
- "Pode fazer o 2 e o 3", com um ajuste dele no 3:
  - **Item 2:** quem volta da Apple sem entrar vê "A Apple não confirmou o
    login. Toque de novo para concluir.", com o botão da Apple em destaque, e
    a falha conta na hora (antes só contava no toque seguinte).
  - **Item 3:** o socorro aparece depois da **primeira** falha (antes, da
    segunda). Não aparece logo de cara, porque atrapalharia quem entra
    direto pela Apple.
  - **No ar desde 09/10, 11h (Brasília)** (app #133, merge 65a25b6). A
    frase espera 2 s depois da volta (`APPLE_RETURN_GRACE_MS`) e não apaga a
    ida, para um login que deu certo ainda entrar.
  - Medir no `auth_completed` (`mode: "redirect"`):
    - `detectado: "foco"` ou `"toque"`;
    - `pagina_saiu`;
    - `apos_falha_no_foco: true`, o alarme falso: se aparecer, subir os 2 s
      para 3 ou 4;
    - `ja_contada_no_foco`: tirar das falhas.
  - Falta o teste num iPhone de verdade (pedido ao Mateus): fechar a folha
    sem entrar, e entrar com Face ID no 4G sem a frase piscar.
- O login só pelo telefone (item 5) não foi aprovado ainda: ele não falou
  dele.
- **Origem no Safari do iPhone: conserto no ar desde 09/10, 9h30 (Brasília)**
  (app #132, merge 3fd0294).
  - O Safari do iOS 26 apagava o localStorage e o cookie `mh_attr` antes do
    primeiro toque, e a conta Apple nascia sem utm. Foram 11 contas, corrigidas
    à mão no `cac.py`.
  - Agora a campanha fica também na memória da página, e a ida à Apple a leva.
    A memória não regrava o armazenamento.
  - Quando é a memória que salva a campanha, os eventos levam `attr_memoria`.
  - Conferir nos próximos dias se as contas Apple de anúncio chegam com utm.
    Se a campanha sumir sem `attr_memoria`, a perda foi um recarregamento ou
    uma página nova, que a memória não cobre.

## Imóvel é o corretor que publica (decisão do Mateus, 01/10)

- Não cadastrar imóvel pelo corretor nem mandar cadastro pronto. Nas
  palavras dele: "o corretor ao invés de mandar o link para a gente deve
  mandar direto na aplicação e já publicar.. assim ele aprende e faz as
  próximas.. curva de aprendizado".
- Quem pede ajuda para publicar recebe o caminho no app: depois de criar o
  link ele já cai na tela do primeiro imóvel (PR app #106); cola o link do
  anúncio ou o texto, toca em "Preencher com a IA", confere e publica.
- O app aceita `/dashboard/imoveis/novo?link=...` (link pronto), mas ele não
  é para mandar a corretor.

## QR code por imóvel (no ar desde 07/10)

- PR app #122 (merge 1c0988f). O corretor gera um QR para imprimir na placa
  de "Vende-se" ou "Aluga-se", no panfleto e no cartão de visita. Quem aponta
  a câmera do celular abre a página no smartli.ink e fala com a IA dele.
- Dois QRs:
  - **do imóvel:** ícone redondo de QR (ciano), o primeiro da linha em
    Imóveis, e botão "QR para placa" no topo da tela de editar. Só em imóvel
    publicado, visível e com nome;
  - **do Smart Link:** cartão "QR do seu Smart Link" em Divulgar, botão
    "Ver QR code".
- Na janela: "Compartilhar" (quando o celular deixa) e "Baixar imagem".
- Tudo o que ensinar ao corretor (condições, mensagens da tela, tamanho para
  imprimir, o que não existe, texto pronto) está na **seção 10 do
  `ferramentas/guia-respostas-corretor.md`**.
- Endereços (`app/src/shared/utils/qr-code.utils.ts`):
  - imóvel: `smartli.ink/<slug>/<id>?utm_source=qr&utm_medium=placa&utm_content=imovel-<id>`.
    Sem o `/perfil`; o botão de compartilhar continua com `/perfil/<id>`;
  - Smart Link: `smartli.ink/<slug>?utm_source=qr&utm_medium=cartao`.
  - Quem chegou pelo QR aparece no site com `utm_source=qr`. É isso que mostra
    que o QR foi impresso e lido.
- Eventos no Amplitude (e no GA4), em `app/src/lib/analytics.ts`:
  - `qr_aberto`: `tipo` (imovel ou link), `onde` (lista, edicao ou
    divulgar) e `id_imovel`;
  - `qr_baixado`: os mesmos, mais `acao` (baixou ou compartilhou) e
    `fallback` (unsupported ou blocked), quando o compartilhar não abriu e a
    imagem foi baixada.
- No mesmo PR, o selo do topo da edição passou a mostrar "● Publicado" com o
  imóvel no ar. Antes mostrava "● Rascunho" mesmo no ar.
- **Regra: em comunicado e resposta a corretor, citar o QR como mais um
  benefício** (placa, panfleto, cartão de visita). Só o que o app faz hoje.
  - Texto livre muda direto: respostas no 6800 e no Direct, e-mail da
    reativação.
  - Modelo de WhatsApp já aprovado (`mh_reativacao_1`, os `mh_*` da esteira)
    não muda de texto: pôr o QR pede nome novo e nova aprovação da Meta.
  - E-mails da esteira: o PR api #80 põe o QR em rascunho 1, publicado 1,
    ia_respondeu e link_vazio 2. É exceção à regra de o e-mail andar junto
    com o modelo do mesmo passo: o WhatsApp desses passos fica sem o QR.

## Visita marcada pela IA: na API desde 02/10, agenda desde 05/10; falta a Intelliway

**Decisão do Mateus em 02/10 (opção "a"):** a LP2 continua com "A IA tira as
dúvidas e já marca a visita". A promessa fica de pé, e o passo 1 foi feito
rápido para torná-la verdade.

**Antes de 02/10 a visita não chegava a lugar nenhum** (conferido no código
dos cinco repositórios e nos e-mails):

- Nada fala com o Google Agenda.
- O `Schedule` do app antigo está preso ao `Match` comprador↔corretor. A
  consulta `findAllScheduleByIdAgentExternal`, da Globalsys (dez/2025), só
  lê essa agenda e nunca foi ligada.
- A Intelliway só tratou de agenda na reunião de 02/04/2025, sem entrega.
- Não confundir com o GoHighLevel ("Novo compromisso … agendado!", abr/2025)
  nem com o `calendar.app.google/…` de 19/02/2025. Nenhum dos dois é visita
  de cliente.

**O passo 1, no ar desde o PR api #45** (`api/docs/visita-marcada.md`):

- **O que muda no lead:** o `POST /external/leads` aceita `visit_at`, no
  formato `AAAA-MM-DDTHH:MM` do horário de Brasília. Fica gravado em
  `lead.visit_at`.
- **Aviso ao corretor:**
  - **e-mail** com o WhatsApp do cliente, o botão "Adicionar ao Google
    Agenda" e o `visita.ics` anexo, para o iPhone e o Outlook;
  - **WhatsApp** pelo 6800, com o modelo `mh_visita_marcada`. Até a Meta
    aprovar, o aviso sai só por e-mail.
  - Sai um aviso por visita. Se a data muda, sai "Visita remarcada".
- **No backoffice:** `leads_recebidos` mostra `visita_em` e
  `corretor_avisado_da_visita`.
- **Pendências:**
  1. A Intelliway ainda precisa mandar o lead e o `visit_at`. **O Mateus
     enviou o pedido no chamado #1427 em 02/10.** O teste é na conta interna
     `inmcpatrimonial` (id_agent 804). Quando ela responder, conferir o aviso
     chegando nessa conta.
     **Em 06/10 a Glaucia pediu a chave da API (14h10) e o Mateus mandou**
     pelo WhatsApp, no privado. Antes da chave, ele mandou um texto com as
     duas rotas e a conta de teste.
     - A chave é o `x-api-key` das duas rotas, o mesmo valor de
       `EXTERNAL_LEADS_TOKEN` no ECS (ele copiou da aba JSON da revisão 20).
     - A chave nunca passa por esta conversa.
     **Em 07/10 a Glaucia confirmou:** "Deu sim! Estamos trabalhando nessa
     demanda. O prazo de entrega é até o dia 13/10." Em 13/10, conferir na
     conta 804 se o lead e a visita chegaram e se o e-mail de visita saiu
     (lembrete marcado).
     - Próximo passo: ela testar e eu conferir o lead e o aviso de visita.
     **Em 08/10, às 17h57, a Glaucia avisou que concluiu** (chamado #1427
     solucionado às 17h54).
     - Testes na conta 804: 3 leads com visita. Só 1 tinha celular válido, e
       só ele gerou o aviso (visita 13/10, 9h, imóvel 975). O Mateus
       encaminhou o e-mail em 09/10. Os outros 2 não geraram aviso por regra
       (`lead-visit.service.ts`: sem nome e celular válidos, não avisa).
     - Às 18h03 o Mateus perguntou se o agente consulta a agenda livre antes
       de oferecer horário e se está ligado para todos os corretores ou só na
       INMC. Às 18h13 ela respondeu só "Sim!". A segunda pergunta ficou sem
       resposta clara; em 09/10 dei a ele um texto para confirmar.
     - A API não registra as consultas à agenda livre. O sinal de que está
       ligado para todos é a primeira visita de um corretor de verdade em
       `/backoffice/leads`.
  2. **Guardado para depois (Mateus, 02/10: "guarde para fazermos depois a
     mensagem no whatsapp"):** criar o modelo `mh_visita_marcada` na Twilio,
     rodando `npm run modelos` em `api/mcp-backoffice` no computador dele.
     Depois a Meta precisa aprovar. Até lá, o aviso sai só por e-mail. Puxar
     o assunto quando a Intelliway confirmar o envio da visita. **Puxado em
     09/10**, depois da entrega da Intelliway; a decisão é dele.
- **Agenda v1, no ar desde 05/10** (api #61 e app #117; Mateus: "Pode
  construir assim"). Pergunta da Glaucia (Intelliway): "vai ter validação
  se o horário está livre?". Agora tem:
  - visitas de 1 hora, de hora em hora, das 8h às 19h (Brasília), com 1 hora
    de antecedência; ocupado = outra visita do corretor a menos de 1 hora;
  - `GET /external/agenda/livre?slug=|id_agent=&dia=|dias=` (mesma chave
    dos leads): a IA consulta antes de oferecer;
  - o `POST /external/leads` recusa horário ocupado: o lead entra, a visita
    não, e a resposta traz até 3 `sugestoes`. O mesmo cliente remarcando
    não esbarra na própria visita;
  - no app, aba **Visitas** (`/dashboard/visitas`; no celular, pela entrada
    em IA & Leads): lista por dia, "Chamar no WhatsApp" e "Cancelar visita",
    que libera o horário (`lead.visit_cancelled_at`). O cliente não é
    avisado pela API; a tela lembra o corretor de avisar.
  - Fica de fora da v1: Google Agenda do corretor, horário de atendimento
    de cada um ("Meus horários").
  - Falta a Intelliway usar a consulta. Especificação em
    `api/docs/visita-marcada.md`, seção "Agenda".

## Amplitude: achar a sessão de um corretor (para a semana de 13/10)

- O app grava 100% das sessões (Session Replay, `sampleRate: 1` em
  `app/src/lib/amplitude.ts`). Elas ficam em "Repetições e Zoneamento".
- A lista mostra só as mais recentes. Para chegar nas outras: data no topo,
  "+ Filtro" > Evento (ex.: `support_click`) ou, num funil, clicar na etapa >
  "Ver repetições de sessão".
- **Falta, guardado para a semana de 13/10** (Mateus, 08/10: "Guarde para
  fazermos depois o Amplitude.. na proxima semana"): o app não manda o id do
  corretor ao Amplitude (`setUserId`). Por isso não dá para buscar a sessão
  pelo id_user. Lembrete marcado para terça, 13/10.

## Mensagens de ajuda do app — elas dizem onde a pessoa travou

`SUPPORT_MESSAGES` em `app/src/constants.ts` preenche o WhatsApp com uma frase
escrita na voz da PESSOA, diferente por passo. Quem recebe sabe onde ela está
sem precisar perguntar:

| Frase que chega | Onde ela travou |
|---|---|
| "Estou criando meu Smart Link…" | primeira tela, criando a conta |
| "Estou no passo do código por SMS…" | verificação por SMS |
| "Estou escolhendo o meu link…" | escolhendo o slug |
| "Meu telefone já está em outra conta…" | conta duplicada |
| "Caí num link do Match House que não abre…" | link quebrado |

O clique é medido como `support_click` (com `step`) no Amplitude.

### Desde 04/10 o botão de ajuda vai para o 6800, e eu respondo

- O botão verde de ajuda do app abre o **6800** (+55 27 99854-6800), não mais o
  WhatsApp pessoal do Mateus. O rótulo passou a ser "Fale com a Match House"
  (app #115).
- **Resposta automática na hora** (api #52): cada frase da tabela acima recebe
  do 6800, no mesmo segundo, o caminho daquela tela e o link
  https://app.smartli.ink. Os 5 textos foram aprovados pelo Mateus em 04/10 e
  ficam em `api/src/modules/activation/whatsapp-webhook.service.ts`. Vale a
  trava de 1 resposta automática a cada 24 h por telefone. O e-mail "WhatsApp
  de…" ganha a linha "Resposta automática enviada: <passo>".
- **Autonomia nas conversas de ajuda** (Mateus, 04/10: "sim pode responder e me
  avisa"): quando a pessoa continua a conversa com uma dúvida de uso ou de
  cadastro, eu respondo pelo 6800 SEM pedir "pode" e aviso o Mateus depois,
  com o que ela disse e o que eu respondi. Continuam precisando do "pode":
  preço e planos, reclamação, cancelamento, promessa em nome da Match House e
  qualquer mensagem fora da janela de 24 h.
- **Quem ainda não tem conta** responde-se por `id_inbound`: POST
  `/backoffice/messages/preview` e depois `/send` com
  `{id_inbound, channel: "whatsapp", kind: "texto", text}` (+ `confirmacao` no
  send). As mensagens recebidas sem cadastro estão em
  `GET /backoffice/messages/received`, e o e-mail traz "Para responder pelo
  backoffice: id_inbound <n>". Uma resposta por mensagem recebida, só até 24 h
  depois dela. O telefone fica na API só essas 24 h.
- O "Tenho interesse" de imóvel cujo corretor não tem telefone também cai no
  6800: é um COMPRADOR, não corretor. Avisar o Mateus na hora.

## Direct do Instagram (@matchhouse.br) — automação nativa desde 04/10

- Corretor também escreve no Direct da Match House. Em 02/10 a Luciene Matos
  (corretoralucienematos) pediu "atendimento para entender como funciona" e
  ficou 2 dias sem resposta: chegou como solicitação de mensagem.
- Em 04/10 o Mateus ligou no Meta Business Suite (Caixa de entrada >
  Automações), para Instagram e Messenger:
  - **Resposta automática** (primeira mensagem de cada pessoa): quem somos, o
    link `https://app.smartli.ink` e "escreva aqui que a gente responde".
    Limite do campo: 500 caracteres.
  - **Perguntas frequentes**, nesta ordem: "Como funciona o Smart Link?",
    "Como eu crio o meu link?", "Não consegui entrar, e agora?" (Android:
    Continuar no Chrome > CONTINUAR; código: "Receber por WhatsApp"; manda para
    o 6800) e "Tenho outra dúvida". O Instagram aceita no máximo 4. Antes
    estavam as 4 perguntas padrão da Meta (serviços, hora marcada, escritório,
    horário), sem resposta.
    - As perguntas frequentes valem só para o Instagram: na automação, a
      caixinha do Messenger fica desmarcada e a aba Messenger não tem
      perguntas (conferido pelo Mateus em 08/10). Não precisa preencher.
    - Em 08/10 o Mateus trocou a resposta de "Como funciona o Smart Link?"
      pela versão com o parágrafo do QR por imóvel ("Cada imóvel publicado
      ganha também um QR code para a placa de Vende-se ou Aluga-se..."). A
      resposta automática (primeira mensagem) não mudou.
    - Caminho: Meta Business Suite > Caixa de entrada > ícone das Automações
      na barra de cima (à direita de "Criar anúncio de mensagens") >
      Perguntas frequentes > aba Instagram.
- **Desde 04/10, 12h44, o Direct chega na API e eu respondo (api #53)**, como
  no 6800:
  - Cada mensagem vira o e-mail "Instagram de @usuario" para a caixa, com o
    perfil (seguidores, se segue a Match House), o cadastro do Smart Link
    quando o @ bate com o link de Instagram de alguém, o texto e o
    `id_instagram`.
  - Responder: `POST /backoffice/instagram/preview` com
    `{id_instagram, text}`, depois `/backoffice/instagram/send` com o mesmo
    corpo + `confirmacao`. Uma resposta por mensagem, só até 24 h.
  - `GET /backoffice/instagram/received` lista as das últimas 24 h.
    `respondida_pela_conta_em` com data = alguém já respondeu pelo app: não
    responder de novo.
  - **Autonomia total no Direct desde 05/10.** Nas palavras do Mateus: "vc
    pode responder tudo e so me notificar por aqui o que foi resolvido nos
    relatorios diários". Respondo tudo no Direct, sem pedir "pode" e sem
    avisar na hora. Cada envio é anotado em `envios_instagram`
    (`scratchpad/mensagens-vistas.json`), com o que ficou resolvido, e o
    relatório diário mostra isso no bloco "Mensagens".
    - As regras de conteúdo continuam: nada de preço do Pro (falar em plano
      de entrada), nunca prometer recurso que não existe, sem "grátis" e
      convite da bio no fim.
    - No 6800 nada mudou: preço, reclamação, cancelamento e promessa ainda
      pedem o "pode".
    - Primeiro envio nessa regra: o @guilhermepicorelli (id_instagram 5), em
      05/10.
  - A rotina de hora em hora já lê esses e-mails.
  - **Vigia em tempo real desde 05/10.** O Mateus disse: "de hora em hora é mt
    longo". Funciona assim:
    - O `scratchpad/vigia.sh` roda em segundo plano nesta conversa e confere
      a cada 60 s:
      - o Direct, em `/backoffice/instagram/received`;
      - o 6800, em `/backoffice/messages/received?com_cadastro=1` (api #56).
        Essa rota lista também quem já tem conta.
    - Quando chega mensagem nova, a vigia sai e a conversa acorda e responde
      na hora. Sem novidade, sai sozinha em ~110 min.
    - Reinício do servidor da conversa mata a vigia. A rotina de hora em hora
      confere o batimento (`scratchpad/vigia.heartbeat`) e religa.
    - Depois de responder, religar a vigia.
- Como está montado (para não desmontar sem querer):
  - App "Match House Direct" na Meta (id 2118385825737092, portfólio Match
    House, publicado). Caso de uso do Instagram, "Configuração da API com
    login do Instagram". O @matchhouse.br é testador do Instagram no app.
  - Webhook: `https://api.matchhouse.com.br/webhook/instagram`, verificar token
    `matchhouse-direct`, campo `messages` assinado e a chave "Assinatura do
    webhook" do @matchhouse.br LIGADA. Foi ela, desligada, que segurou o
    primeiro teste.
  - Servidor: `INSTAGRAM_APP_SECRET` (a "Chave secreta do app do
    Instagram", não a do app da Meta) e `INSTAGRAM_ACCESS_TOKEN` na revisão
    `matchhouse-back:20` do ECS. Colados pelo Mateus direto na AWS; nunca
    passam pelo chat.
  - O token vale 60 dias e a API renova sozinha toda semana (tabela
    `integration_token`). Se o envio der "token vencido", gerar outro no item 2
    e trocar na AWS.
- **Mensagem no Direct: no máximo 1.000 caracteres** (o Instagram recusa com
  "A mensagem é muito longa"). Resposta pronta para o Mateus colar no Direct
  sai abaixo disso.
- Não escrever "falar com uma pessoa": quem responde é a Match House (eu e o
  Mateus). Ele pediu para trocar por "Tenho outra dúvida".
- Link no Direct que trava numa tela branca do l.instagram.com é o Instagram
  segurando o link (aconteceu até com google.com, num celular de login novo).
  A saída: os três pontinhos (⋮) > "Abrir no Chrome".

## Indique e Ganhe, cartão Smart Link e QR por imóvel (decisões de 07/10)

- **Indique e Ganhe: autonomia total do agente.** Nas palavras do Mateus:
  "mesmo estando no backoffice, prefiro que vc gerencie pq vamos evoluir
  juntos muito nisso ainda e senao vc fica travado, quero que vc tenha muita
  autonomia".
  - Quem configura os níveis e acompanha as indicações é o agente.
  - A configuração é feita por rotas do backoffice REST, no ar desde 07/10
    (PR api #79). Ver "API da fase 1", abaixo.
- **Estrutura fechada com o Mateus em 07/10** ("Esta mt bom assim mesmo. 1 e
  2 OK!"):
  - **Agora, sem cobrança, o prêmio é o cartão.**
    - O 1º colega que publicar dá o cartão Smart Link de presente (o Green,
      de PVC, com nome, CRECI e QR).
    - Os 10 imóveis no ar também dão o cartão: dois caminhos, um cartão por
      corretor.
    - Cada colega soma 10% de **desconto guardado**, até 100%. Começa a
      contar já e vale até 90 dias depois que o Pro abrir.
    - Com 5 colegas o cartão passa a ser o Blue (desde 07/10, 16h47).
    - Quem passa de 10 colegas vira **Parceiro Match House**: cartão Blue
      com "PARTNER" impresso, selo e destaque. Não é mais de metal: o
      fornecedor não faz (ver "Cartão por nível e fornecedor").
  - **Depois, com o Pro: desconto + cartão.**
    - Cada colega vale 10% por 6 meses, até 100%.
    - O cartão continua sendo o 1º prêmio de quem entra.
  - **Para o corretor, sempre em %, nunca em R$**: em reais, o preço do Pro
    apareceria (10% = R$ 14,70).
  - **A tela no app mostra:** "Seu cartão: falta 1 colega", "Desconto
    guardado: 30%" e "Faltam 7 colegas para virar Parceiro".
- **Desconto progressivo** (ideia dele: 1 colega = 10%, até 100%):
  - recomendação: 10% por colega, até 100%, cada 10% válido por 6 meses;
  - o colega indicado também ganha 10% por 6 meses;
  - o desconto fica guardado até o Pro abrir e vale até 90 dias depois disso;
  - o prazo final (6 meses ou 1 ano) ainda está com ele.
  - Simulador: https://claude.ai/artifact/NLLZNoAwAEm7yNZSbwujMY
  - Só conta colega com conta nova, celular verificado e 1º imóvel publicado
    há 7 dias.
  - Não há limite de quantos colegas o corretor indica.
  - Até 5 aprovações por mês valem sozinhas. A partir do 6º colega no mês, a
    indicação fica "a conferir": o agente aprova se for real e não conta se
    for conta falsa. O corretor não vê bloqueio.
  - Decisão do Mateus, 07/10: "o 10 já é o máximo, então faz sentido o 5".
    O 10 é o teto do desconto (10 colegas ativos = 100%); o 5 é só o ponto
    de conferência por mês. Ele chegou a pedir 11 e voltou para o 5.
  - **Parceiro Match House** (ideia aprovada por ele em 07/10): quem passar de
    10 colegas no total (não por mês) ganha o selo de parceiro no Smart Link,
    destaque e o cartão Blue com "PARTNER" impresso. O selo e o destaque
    ainda vão ser desenhados.
  - Desde o PR api #79 a indicação só é aprovada com a ativação do colega.
    O desconto "para sempre" do código ainda muda na fase 3 (ver pendências).
- **Cartão Smart Link** (NFC + QR, vai de presente para o endereço do
  corretor), com prazo e não por quantidade (decisão dele):
  - 10 imóveis válidos: cartão Green (PVC). O cartão de metal por 30 imóveis
    ficou guardado para depois: o fornecedor não faz metal (07/10);
  - **promoção por tempo limitado**, nunca "os primeiros 100", que exigiria
    autorização da SPA (Lei 5.768/71);
  - o CRECI vai no cartão (exigência do COFECI);
  - o endereço é pedido só a quem bateu a meta, e apagado 30 dias depois da
    entrega.
- **QR por imóvel**: no ar desde 07/10 (PR app #122). Ver a seção "QR code
  por imóvel".
- **"Crie seu Smart Link" maior** no perfil e em cada imóvel (aprovado). Passa
  pela prévia do Mateus antes de ir ao ar.
- **Referência: Taggo** (taggo.one), cartão de visita NFC genérico, pago uma
  vez só. Alguns corretores usam o taggo.one como link da bio.

### API da fase 1: no ar desde 07/10 (PR api #79)

- A indicação nasce "a conferir" (PENDING). Vira aprovada quando o colega tem
  celular verificado e um imóvel no ar há 7 dias ou mais.
  - Rodada diária às 06h15 (Brasília). A primeira aprovação pode sair por
    volta de 14/10.
  - Quem indicou: código REF ou utm do perfil (`utm_content=perfil-<slug>`).
- Gestão por `/backoffice/indicacao/*`. O que grava passa por prévia e código
  de confirmação:
  - `GET niveis`, `POST niveis/preview` e `PUT niveis`;
  - `GET indicacoes` e `GET corretor`;
  - `POST verificar` (com `simular: true` não grava nada);
  - `POST decidir/preview` e `POST decidir`.
- Quem gerencia é esta conversa, com a autonomia dada pelo Mateus (acima).

### Níveis gravados em 07/10 (16h20; cores às 16h38; dois cartões às 16h47)

- 16h20: gravados com o "pode gravar os niveis, green, blue, black e
  partner" do Mateus, na ordem Green → Blue → Black → Partner.
- 16h38: o Blue (desenho "Noite", a cor da marca) passou para cima do
  Black ("vamos mudar uma coisa, o noite pode ser o ultimo acima do black
  pq é nossa cor").
- **16h47 (Brasília; `updated_at` 19:47:57Z): só dois cartões, Green e
  Blue.** As três frases do Mateus, no fim da tarde:
  - "me informaram aqui que nao tem o de metal.. podemos deixar ele para o
    blue": o fornecedor não faz cartão de metal, então o Partner fica com
    o Blue;
  - "acho que no primeiro momento podemos manter 2 cartoes o green e o
    blue... depois evoluimos": começar com dois cartões; o Black sai;
  - perguntado sobre o degrau: "pode ser blue a partir de 5".
  - Mudaram só nome e descrição dos ids 5 e 10 a 13, e só a descrição dos
    ids 14 e 15. Mínimos, descontos, `view_order`, 730 dias e ids ficaram
    iguais. Conferido depois num GET à parte, campo a campo: OK. O
    `POST verificar` com `simular: true` rodou sem erro.
- **Os nomes ficam Green, Blue e Partner** (Mateus, 08/10: "por enquanto
  vamos manter os nomes que ja criamos Green, blue e Partner"). Não sugerir
  nomes novos de novo. Se um dia mudarem, regravar só `name` e
  `description` (prévia e depois `PUT niveis`). Nenhum código da API nem do
  app escolhe a cor pelo nome.

| Nível | Colegas | Desconto guardado | Cartão | id_level |
|---|---|---|---|---|
| Entrada | 0 | 0% | nenhum | 6 |
| Green · 10% a 40% | 1 a 4 | 10% por colega | Green | 4, 7, 8, 9 |
| Blue · 50% a 100% | 5 a 10 | 50% a 100% | Blue | 5, 10, 11, 12, 13, 14 |
| Partner · 100% | 11 ou mais | 100% | Blue com "PARTNER" impresso | 15 |

- São 12 níveis, um por degrau. O nome traz a cor e o desconto ("Blue ·
  60%"). `view_order` = colegas + 1. Ninguém está em nível nenhum ainda.
- Descrições: "N colegas ativos: X% guardado e cartão Green" (ids 4, 7, 8
  e 9), "N colegas ativos: X% guardado e cartão Blue" (ids 5 e 10 a 14) e
  "11 ou mais colegas ativos: 100% guardado e cartão Blue com PARTNER
  impresso" (id 15). Nenhum nome ou descrição fala mais em metal, Black,
  Noite ou selo.
- O Green também sai para quem tem 10 imóveis no ar. Essa regra fica fora
  dos níveis e continua valendo: um cartão por corretor.
- O desconto vai para `indication_discount_carry` e fica guardado. Só vira
  cupom na fase 3, quando a cobrança ligar. Imóvel extra não entra (01/10).
- Validade do nível: 730 dias. Quando vence, o corretor perde o nível (e o
  cartão), mas não o desconto guardado. A validade só se renova quando o
  nível muda. Mudar os dias depois só vale para quem chegar ao nível dali em
  diante.
- Para o código, "colegas" são as indicações aprovadas de todos os tempos.
  Quem tira os imóveis do ar ou apaga a conta continua contando. Perguntar
  ao Mateus se o desconto deve cair nesses casos.
- `is_default` ficou false nos 12 (o PUT não grava esse campo). Nada na
  aprovação nem no checkout lê esse campo; marcar Entrada é opcional.
- Arquivos de antes, da prévia e de depois: `scratchpad/niveis/` (a troca
  das 16h38 nos `*-noite.json`; a das 16h47 nos `*-2cartoes.json`, com a
  conferência em `verif-indep.json` e `verif-simular-indep.json`).
- Pôr as três gravações no relatório diário, com as frases do Mateus.

### Cartão por nível e fornecedor

- **Desde 07/10, 16h47: dois cartões, os dois de PVC.**
  - **Green:** de 1 a 4 colegas ativos, e também com 10 imóveis no ar
    (regra fora dos níveis, que continua).
  - **Blue**, o desenho "Noite" (cor da marca): a partir de 5 colegas.
  - **Partner** (11 colegas ou mais): o mesmo cartão Blue, com "PARTNER"
    impresso. É o mesmo "Parceiro Match House" de cima.
- **Black e Metal ficaram guardados para depois** ("depois evoluimos").
  Não oferecer a corretor nem pôr em orçamento até o Mateus retomar. Os
  desenhos estão em `scratchpad/cartao-design/descartados/`
  (`Frente-Black`, `Verso-Black`, `Frente-Metal` e `Verso-Metal`, mais o
  quadro de antes em `canvas.antes-2cartoes.json`).
- Os detalhes "premium" do desenho (chip metálico, nome prateado e grão)
  estavam no Black, agora guardado. Podem passar ao Blue quando o Mateus
  mandar as alterações do desenho.
- Rótulos na frente: "SMART LINK · GREEN" e "SMART LINK · BLUE", com
  "Nº 0001". No Partner, "SMART LINK · PARTNER" e "Nº 001"; o verso é
  igual ao do Blue.
- A cor do cartão sai do mínimo de colegas (1 a 4 Green; 5 ou mais Blue;
  11 ou mais, Blue com PARTNER), não do nome do nível, que pode mudar.
- Arquivos em `scratchpad/cartao-design/project/`: Green frente e verso,
  Blue frente (`Main.dc.html`) e verso (`Verso-Noite.dc.html`), Partner
  frente. Os PNGs mais novos, em `render-respiro-rev/`, ainda têm o Black.
- **Fornecedor: Vixcard (Victor e Thaisa).**
  - **Orçamento nº 32481, de 07/10:** chip Mifare 1K com gravação do ID.
    Por cartão: 100 un. R$ 9,89; 250 un. R$ 8,99; 500 un. R$ 6,99. Frete
    R$ 0, 7 dias úteis, pagamento à vista, validade de 30 dias.
  - **O Mifare 1K provavelmente não abre link no iPhone.** O iPhone abre
    sozinho, só aproximando, o NTAG213/215; o Mifare Classic, não. Com ele,
    o cartão não faz o que promete para quem usa iPhone.
  - **Pedido de novo orçamento** (mensagem dada ao Mateus para a Thaisa):
    - chip NTAG213 ou NTAG215, com um link diferente gravado em cada cartão
      e a gravação travada;
    - dados variáveis vindos de planilha: nome, CRECI, número do cartão e
      QR;
    - 2 artes no mesmo pedido (Green e Blue);
    - PVC fosco, impressão colorida frente e verso, 100, 250 e 500
      unidades;
    - amostra antes de fechar, para testar na visita num iPhone e num
      Android, só aproximando, sem aplicativo.
  - Seguiram mais duas mensagens para ela, também dadas ao Mateus: pedir o
    NTAG213 escrito no orçamento e uma amostra gravada; e, depois de um
    vídeo dela em que o cartão abriu num Samsung (o app mostrava Mifare
    Classic 1k), pedir o mesmo teste num iPhone e o NTAG213 no mesmo preço
    se não abrir. Fecha se a amostra abrir o link no iPhone e no Android.
  - O orçamento de metal pedido ao Victor caiu: eles não fazem metal.
  - **Atualização de 07–08/10:**
    - A Thaisa mandou um vídeo de um iPhone abrindo o link só aproximando um
      cartão Mifare 1K deles: eles configuram o chip para se comportar como
      NTAG213. A suspeita acima não se confirmou; a prova final é a amostra.
    - 08/10: o Mateus mandou por e-mail a arte da amostra (PDF com Green e
      Blue, frente e verso, dados da INMC) e o LEIA-ME com o link do chip
      (`smartli.ink/inmcpatrimonial?utm_source=nfc&utm_medium=cartao`; o QR
      leva `utm_source=qr`). Amostra em 3 dias úteis; com o feriado de 12/10,
      terça 13 ou quarta 14. Lembrete marcado para 13/10 às 9h07.
    - A Vixcard **não faz carta-berço** ("Somente com a confecção dos
      cartões"), e o envio para cada cliente ficou sem resposta (provável
      que não façam). Plano: carta-berço numa gráfica e envio rastreado
      postado por nós (Correios ou plataforma de etiqueta). Modelo de
      referência: a embalagem da C6 Tag (luva com meia-lua para puxar e
      cartela que desliza com a peça presa por cortes, sem cola); fotos no
      e-mail "Carta berço" do Mateus, 08/10.
  - **Nenhum dado de corretor vai para o fornecedor.** A amostra sai com a
    conta interna.

### Pendências do Indique e Ganhe (revisão de 07/10)

- **"Ganhe 5 imóveis adicionais" continua ligado aos níveis de id 4 (Green
  · 10%) e 5 (Blue · 50%).** Já estava antes; a troca das 16h47 não mexeu.
  - Nenhum corretor vê. Aparece só no painel admin antigo, no
    `GET /backoffice/indicacao/niveis` e no GraphQL de admin.
  - Quem chegar ao nível 4 ou 5 ganha só um registro no histórico, sem
    imóvel.
  - Desligar antes de o cartão do app ler benefícios. Não há rota no
    backoffice: o Mateus, no painel antigo, tira o benefício dos dois
    níveis ou desativa o benefício.
- **Fase 3 (cobrança):**
  - com `BILLING_MODE=on`, o desconto não pode virar cupom "forever". Hoje
    o `mh_ind_pct_<X>` é `duration: 'forever'`, e a recorrência do C6
    também não tem fim. Tem de valer 6 meses;
  - 100% quebra o checkout do Pro (fatura de R$ 0 cancela e dá 502; no C6,
    Pix de R$ 0). Os níveis de 100% (Blue · 100%, id 14, e Partner, id 15)
    precisam de um caminho próprio;
  - o desconto guardado nunca vence no código. O combinado é até 90 dias
    depois que o Pro abrir;
  - quando o nível desce, o desconto vai a 0, não ao do nível de baixo
    (`indication-discount.util.ts`). Consertar antes.
- **Antes da primeira aprovação (~14/10):** o `createPayment` antigo
  (GraphQL) não confere `canSubscribe` e poria o desconto como cupom
  "forever" em qualquer plano com preço, o Pro inclusive. Conferir se o app
  antigo ainda compra plano; se comprar, travar.
- **Fase 2:** o app ainda não manda o slug no cadastro, e a tela de
  progresso no app ainda não existe.
- **Prova de SMS no `updateUser`**: ficou de fora do PR #79.
- **Não usar o motor antigo do admin** (`processIndicationConversion`,
  `updateUserIndicationLevel`, `updateIndication` para aprovada). Ele compara
  nível pelo id e aprova sem conferir a ativação. O painel antigo mostra só
  10 níveis: os ids 14 (Blue · 100%) e 15 (Partner) não aparecem lá.
- O selo e o destaque do Partner no Smart Link ainda não existem. Desde
  16h47 a descrição do id 15 fala só do cartão Blue com PARTNER, sem selo
  nem destaque. Não prometer os dois ao corretor até existirem.
- **Cartão:** não há cartão de metal nem Black no começo, só Green e Blue
  (o Partner é o Blue com PARTNER). Com a Vixcard, fechar só com chip NTAG
  e a amostra abrindo o link no iPhone e no Android (ver "Cartão por nível
  e fornecedor").
- A conta 56 (interna) tem 2 indicações antigas aprovadas, que contam para o
  nível. A trava de conta interna só vale para as novas.

## Planilhas do funil: etapas de leads da IA (Mateus, 07/10)

- Pedido dele: "inclua nas duas planilhas o receberam leads na conversa da
  IA". Entraram duas etapas depois de "4. Cadastraram imóvel":
  - "5. Receberam conversa na IA": o cliente do corretor escreveu para a IA
    do Smart Link (`visitante_escreveu`);
  - "6. Receberam leads da IA": lead = nome + celular válido, pelo critério
    do `/backoffice/leads`.
- **Fonte:** a aba "Leads IA" do Painel do Funil PRO (sheetId 902212).
  - Tem uma linha por corretor e por semana, de segunda a domingo, desde
    13/07. L2:R agrupa por id_usuario.
  - O Comparativo de Rotas v2 importa L2:Q por IMPORTRANGE (aba "Leads IA",
    sheetId 826142310).
- **Atualização:** rotina `trig_011zZvcgNN73kVfWyPypb1dc`, às 06h47, com o
  script `scratchpad/leads-ia/atualiza.sh`. Ela regrava as duas últimas
  semanas. O `/backoffice/leads` às vezes responde 500 ou fica incompleto: o
  script repete. Leia por semana, nunca o período inteiro, que para em 1.000
  conversas.
- **Não mover no Painel do PRO:**
  - L3:M5 (etapas 1 a 3): a aba oculta "Base dos gráficos" lê M3:M5 fixo;
  - os rótulos que o robô do export procura (`sync-panels-from-csv.mjs`, na
    branch `claude/post-deploy-api-export-csv-2qpvzq` da api, disparado
    todo dia).
  - Os dois gráficos de ativação são do robô: ele reescreve o estilo todo
    dia. Pode mudar só a posição deles.
- Números de 07/10, desde 14/07, contando as contas internas que estão no
  PRO: 27 corretores receberam conversa e 3 receberam lead (1082, 1175 e
  1182), com 4 leads únicos. Fora do funil ficam os leads da 825 (sem
  usuário) e da 27 (interna).

## Rodar localmente

`npx serve -p 3456 .` (config em `.claude/launch.json`).
