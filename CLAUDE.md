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
  - Desde 02/10 (aprovado pelo Mateus) o topo é a "LP2": título "Acorde com
    visitas marcadas.", cartão de uma noite em três passos e botão logo abaixo;
    só um exemplo de Smart Link, maior; botão de cadastro fixo no rodapé do
    celular. Os cadastros chegam com `mh_v=lp2` (ou `lp2-barra`), contra
    `lp1` da versão anterior: comparar depois de uns 7 dias.
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
  Pendente: o painel da OpenAI marca 0 conversões. Conferir em Fontes de
  dados se chegam eventos `registration_completed` do pixel do
  app.smartli.ink, e se a campanha usa esse pixel e esse evento.

## Contas de teste e internas — fora de qualquer número (confirmado em 29/09)

Tirar do funil, dos relatórios e de custo por cadastro (id_user):

- Testes: 1011, 1014, 1033, 1095, 1096.
- Internas: 980 (Leo Zeferino, equipe), 941 (testematheus), 937 (e-mail
  @matchhouse), 999 (INMC Patrimonial, conta própria).
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

- **Responder corretor pelo WhatsApp da esteira (27 99854-6800).** Ligado
  em 29/09 (`BACKOFFICE_SEND_ENABLED=true` na revisão `matchhouse-back:17`
  do ECS). Quem escreve no 6800 chega por e-mail ("WhatsApp de <nome>") e a
  resposta sai do próprio 6800: primeiro `POST /backoffice/messages/preview`
  (`{id_user, channel: "whatsapp", kind: "texto", text}`), que devolve um
  código `confirmacao`; depois `POST /backoffice/messages/send` com o mesmo
  corpo + `confirmacao`. Texto livre só até 24 h depois da última mensagem
  da pessoa. Não mandar a pessoa para outro número.
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
- **Plano Pro criado** no backoffice em 01/10, às 19h57 (id_plan 21, ativo,
  R$ 147 a cada 30 dias; o preço no Stripe foi criado depois do PR api #43,
  que faz plano de 30 dias virar mensal). Criar o plano não cobra
  ninguém: a cobrança (renovação, falha de pagamento, Pix) ainda está por fazer.
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
- Isto muda o conteúdo das respostas, não quem envia: cada envio pelo 6800
  continua precisando do "pode" até ele decidir sobre a autonomia (10 envios
  limpos).

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

## Visita marcada pela IA: passo 1 na API desde 02/10; falta a Intelliway

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
  2. **Guardado para depois (Mateus, 02/10: "guarde para fazermos depois a
     mensagem no whatsapp"):** criar o modelo `mh_visita_marcada` na Twilio,
     rodando `npm run modelos` em `api/mcp-backoffice` no computador dele.
     Depois a Meta precisa aprovar. Até lá, o aviso sai só por e-mail. Puxar
     o assunto quando a Intelliway confirmar o envio da visita.
- **Passo 2, não feito:** "Conectar Google Agenda" no app, para a IA
  oferecer só horários livres. Depende da verificação do Google e de a IA da
  Intelliway consultar a nossa API.

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

## Rodar localmente

`npx serve -p 3456 .` (config em `.claude/launch.json`).
