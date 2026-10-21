# Match House — Landing Page (lp-match-house)

Notas do projeto para agentes. Ler antes de mexer.

## Fluxo de trabalho padrão (o agente faz tudo)

- **Falar com o Mateus em primeira pessoa, direto com ele** (19/10: "Pode
  conversar na primeira pessoa comigo.. somos nós dois na match amigo").
  Nada de "ele" para falar dele nas mensagens, e nada de recados em inglês
  no meio da conversa.

- O usuário **não é técnico** e espera que o agente **execute o processo inteiro**, do começo ao fim, sem pedir para ele mexer em git/GitHub.
- Priorizar sempre o caminho **mais prático e rápido**. Para uma correção/ajuste pequeno e de baixo risco:
  1. Fazer a alteração e commitar.
  2. **Levar direto para a `main`** — pode commitar/pushar na `main` (foi assim nos "publiques" anteriores) ou, se estiver numa branch, abrir o PR **e já dar o merge você mesmo**. Não deixar esperando aprovação para tarefas simples.
  3. Confirmar que a mudança chegou na `main` (é o que "publica" o site).
  4. Avisar o usuário que está no ar e lembrar do **hard refresh (Ctrl+Shift+R)** por causa do cache.
- Só parar para perguntar quando a mudança for **ambígua, grande ou arriscada** (ex.: reescrita, mudança de conteúdo/preço, algo que afete conversão). Ajuste visual/layout/cópia pequena: executar direto.
- Ao mexer em algo, **não regredir o que já estava corrigido** (ex.: não alterar a velocidade de digitação da conversa — `velocidadeDigitacao`, hoje 65ms — nem quebrar os grids responsivos de mobile).

## Consumo de créditos: poucos agentes (Mateus, 12/10)

- Ele migrou para o plano 20x e os créditos continuavam acabando. De 08 a
  11/10 o consumo foi cerca de 5x o do começo do mês, e mais de 80% vinha dos
  grupos de agentes (workflows com construtor, 2 revisores e até 3 rodadas).
- Decisão dele ("Menos agentes"): **workflow com vários agentes só em
  segurança e pagamento.** No resto (app, site, LP, relatórios, planilhas,
  mensagens), eu faço sozinho e peço **uma** revisão a um agente quando for
  código que vai ao ar. No máximo 2 rodadas de correção.
- Rotinas, conversa nova e arquivo de regras enxuto foram oferecidos e ele
  não escolheu agora: não insistir, só lembrar se o consumo voltar a apertar.

## Deploy / Publicação (IMPORTANTE)

- O site em produção — **https://www.matchhouse.com.br** — é servido a partir da branch **`main`**.
- **Toda alteração que precisa ir ao ar tem que chegar na `main`.** Commitar só numa branch de feature NÃO muda o site publicado.
- Depois do push na `main`, se a publicação não for automática, é preciso acionar o "publish" do site para a versão nova subir.
- Cache é agressivo (principalmente favicon). Depois de publicar, testar com hard refresh (Ctrl+Shift+R).
- **A branch de trabalho não vai inteira para a `main`.** Ela tem
  `ferramentas/`, `anuncios/` e `.claude/settings.json`, que não vão para
  o site. Os custos e os funis são só do Mateus.
  - Para levar só uma nota à `main`, commitar numa branch criada da `main`
    (`git checkout -b x origin/main`).
  - Nunca `git push origin HEAD:main` a partir da branch de trabalho. Em
    14/10 isso levou as ferramentas para a `main`; foi desfeito no mesmo
    minuto (7c1c5be).

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
  - **Desde 13/10, às 14h22: app no Meta em R$ 75/dia** (antes R$ 100).
    Nas palavras do Mateus: "Vamos reduzir a meta para 75 por dia e aumentar
    o chat GPT em 100 por dia."
    - Campanha 120252349246370445 ("[09] Match IA · Recibo v2 — App"),
      orçamento da campanha 7500. Conferido no Windsor logo depois.
    - O ChatGPT ele sobe no painel dele. O plano era ir de 75 para R$ 100/dia,
      mas o painel ficou em R$ 75 até 15/10 (Windsor: R$ 76,06 em 13/10 e
      R$ 70,94 em 14/10).
    - O teto de R$ 125/dia continua valendo para o Meta.
  - **Desde 15/10, às 16h38: app no Meta em R$ 50/dia** (antes R$ 75).
    Nas palavras do Mateus: "vamos reduzir para 50,00 por dia".
    - Mesma campanha 120252349246370445, orçamento 5000. Conferido no
      Windsor logo depois. O dia 15/10 mistura R$ 75 e R$ 50.
    - **ChatGPT em R$ 100/dia desde 15/10, ~16h45.** Nas palavras dele:
      "estava em 75,00 o chat, acabei de subir para 100,00 agora". Soma
      Meta + ChatGPT: R$ 150/dia.
    - A rotina do relatório diário foi atualizada no mesmo minuto (verba
      configurada 5000).
  - **16/10: 6g pausado** (Mateus: "Desativa o 6g"), depois de a Meta
    rejeitá-lo em 15/10, às 22h57, por "link enganoso". Não religar.
    - No conjunto do app ficam o 10a e os criativos 11a a 11d, no ar desde
      16/10 por volta das 07h05. Artes em `anuncios/` da branch de trabalho.
    - Isto vale acima do que a rotina do relatório diário ainda diz do 6g.
    - **Feed 4x5 desde 16/10, ~07h40** (Mateus: "faz versões 4x5 para o
      feed também"). Em outubro, 81% do gasto do app foi no Feed do
      Instagram (R$ 1.040 de R$ 1.287), e as artes 9:16 apareciam cortadas.
      - Cada criativo virou UM anúncio com Feed em 4x5 e Stories/Reels em
        9:16 (personalização por posicionamento): 11a 120252806121310445,
        11b 120252806245000445, 11c 120252806126270445 e 11d
        120252806128330445. O utm_content segue 11a…11d-story-app.
      - Os primeiros, só com 9:16, ficaram pausados: 120252805971390445,
        120252805974640445, 120252805975400445 e 120252805977490445. Estes
        ids valem acima dos que a rotina do relatório diário cita.
      - A 11b é a v4. O Mateus pediu outra casa ("Mude a casa do fundo da
        placa de vende se") e depois "uma casa mais com cara de casa,
        mais charme [...] sem esse modelo quadrado de casa sem telhado".
        Ficou a casa de madeira branca com telhado vermelho (Unsplash),
        inteira embaixo, com a placa menor no gramado. Na v4, a placa
        ficou azul-marinho com moldura branca (Mateus: "a placa ou a
        parede da casa precisam ter contraste"). Pausadas: a primeira
        (120252806124520445), a v2 (120252806165750445) e a v3
        (120252806206560445).
      - Critério: quando cada um somar uns R$ 30, comparar custo por
        cadastro e por corretor que publicou, e pausar o pior.
    - **16/10: 10a pausado** (Mateus: "que tal pausar o 10a?"). De 28/09 a
      15/10 gastou R$ 11,90, com 236 impressões, 1 clique e nenhum cadastro.
      No conjunto do app ficam só os 11a a 11d.
    - No mesmo dia, sobre os criativos: "Lembra que ja te concedi as
      permissoes". Subir criativo, pausar e redistribuir dentro do teto é
      sem perguntar; depois, contar no relatório.
  - **20/10, de manhã: o Mateus pausou o 11d** (cole-o-link, 120252806128330445)
    no Gerenciador ("desativei um criativo na Meta.."). Era o que mais gastava
    no conjunto do app: R$ 144 desde 16/10, contra R$ 25 do 11b e R$ 0,36 do
    11c. Ficam no ar o 11b e o 11c. Não religar sem ele.
  - **Desde 21/10, às 7h32: Meta inteira pausada** (Mateus: "Vamos pausar
    a meta"). A campanha do app (120252349246370445) está em PAUSED, com o
    orçamento em 5000 e os anúncios 11b e 11c como estavam. A LP já estava
    pausada desde 07/10.
    - Números que levaram à decisão, de 14 a 20/10: Meta app R$ 388 com
      imposto, 9 contas e 2 que publicaram (R$ 194 por corretor que
      publicou); ChatGPT R$ 656, 73 contas e 19 que publicaram (R$ 34,50).
    - A regra noturna religa os conjuntos às 07h13, mas não a campanha: com
      a campanha pausada, nada gasta. Gasto zero e nenhum cadastro da Meta
      não são alerta; gasto da Meta é (alguém religou).
    - Para voltar: `enable_campaign`, só com o Mateus.
    - Isto vale acima do que a rotina do relatório diário diz da Meta.
    - **ChatGPT fica em R$ 100/dia por enquanto** (Mateus, 21/10: "Vamos
      manter o chat e decidimos o aumento na semana que vem"). Levar os
      números do ChatGPT na segunda, 26/10, para ele decidir se sobe. Quem
      mexe na verba é ele, no painel da OpenAI.
  - **20/10: Meta continua no ar; decisão no fim da semana.** Entendi um
    "Pode" do Mateus como sim à minha proposta de passar os R$ 50/dia da
    Meta para o ChatGPT e pausei a campanha do app às 6h37. Ele
    respondeu: "Sobre a meta vamos esperar essa semana para decidir".
    Religuei às ~6h50, com a mesma verba (5000) e os mesmos anúncios 11.
    - Números da proposta, de 13 a 19/10:
      - Meta: R$ 418 com imposto, 12 contas e 3 que publicaram (R$ 139
        por corretor que publicou);
      - ChatGPT: R$ 625, 67 contas e 19 que publicaram (R$ 33).
    - Levar de novo no fim da semana, com os 7 dias novos. Até lá, não
      pausar a Meta.
  - **`DIAS` do funil diário leva toda a mídia** (Mateus, 21/10: "Pq o custo
    do cadastro esta 2,17 se tivemos 22 cadastros"). O `gasto` de cada dia
    é Meta com os 13,83% + Google + ChatGPT, como no CAC da área de custos,
    e não mais "Meta + Google sem imposto". Antes o ChatGPT ficava fora e o
    custo por cadastro saía baixo demais (R$ 2,17 em vez de R$ 6,98 em
    20/10). Vale acima do que a rotina do relatório diário diz de `DIAS`.
  - **Custo por cadastro sempre por canal** (Mateus, 21/10: "acho q nao
    esta considerando so custos do chatgpt, numeros n batem").
    - A tabela do CAC do relatório junta Meta, Google e ChatGPT e divide
      por todas as contas, inclusive as que vieram sem anúncio. Lida
      sozinha, parecia ser só o ChatGPT.
    - Daqui em diante, o relatório traz uma tabela por canal (ChatGPT,
      Meta app, total), com ontem, 7 dias e mês. Cada canal entra só com o
      gasto dele (a Meta com os 13,83%) e as contas que ele trouxe.
    - Para cada canal: custo por conta criada, por quem concluiu o
      cadastro e por quem publicou. Dizer sempre que "conta" é quem entrou
      e "concluiu" é quem passou do código.
    - O total vem depois, com o aviso de que o Google está sem gasto por
      dia desde 17/10.
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
  - **Desde 15/10: Google em R$ 10/dia** (antes R$ 30). Nas palavras do
    Mateus, em 16/10: "No google desde ontem reduzi para 10,00 por dia".
    Dia de até R$ 20 é normal. Alerta se passar disso ou se a média de 7
    dias passar de R$ 10.
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

## Fila: campanha pelos termos de busca (Mateus, 19/10)

- Pedido dele: "coloca na fila a ideia para fazermos uma campanha link da bio
  para corretores de imóveis e IA para corretores de imóveis, IA no link da
  bio para corretores e link da bio de imóveis com IA para corretores, vamos
  fazer criativos e testar na meta e no chatgpt".
- Seis ângulos, um criativo (e um texto) por ângulo:
  1. link da bio para corretores de imóveis;
  2. IA para corretores de imóveis;
  3. IA no link da bio para corretores;
  4. link da bio de imóveis com IA para corretores;
  5. a loja online do corretor de imóveis com IA;
  6. a imobiliária digital com IA do corretor de imóveis.
- Os dois últimos entraram no mesmo dia (Mateus: "acrecente a ideia da
  campanha: a loja online do corretor de imoveis com IA, a imobiliária
  digital com IA do corretor de imóveis").
- Meta: criativos 4x5 e 9:16, como os 11a a 11d, dentro do teto de
  R$ 125/dia. ChatGPT: os textos vão para o Mateus subir no painel dele.
- Mesmo critério de sempre: quando cada um somar uns R$ 30, comparar custo
  por cadastro e por corretor que publicou, e pausar o pior.
- Ainda não começado: entra depois da abertura do Pro.

## Contas de teste e internas — fora de qualquer número (confirmado em 29/09)

Tirar do funil, dos relatórios e de custo por cadastro (id_user):

- Testes: 1011, 1014, 1033, 1095, 1096.
- Internas: 980 (Leo Zeferino, equipe), 941 (testematheus), 937 (e-mail
  @matchhouse), 999 (INMC Patrimonial, conta própria), 3 (Admin, admin-1)
  e 56 (Match House, match-house-27). As duas últimas foram confirmadas
  pelo Mateus em 06/10: "sim sao nossas".
  - 39 (smartli.ink/matchhouse, id_agent 820): confirmada pelo Mateus em
    12/10, depois de publicar nela uma casa de teste e conversar com a IA:
    "sim, é nossa, pode tirar". Fora do funil, dos relatórios, do CAC e das
    contagens de conversas e leads da IA. Não saiu da esteira (ele não
    pediu, e não há volta).
- Ainda não confirmadas: 955 e 993. Perguntar uma vez, sem insistir.
- Duplicadas: 1240 (segunda conta do Enio; a principal é a 196) e 1241 e
  1242 (segundas contas da Bárbara; a principal é a 1226). Todas vazias,
  criadas em 08/10. Mateus, 10/10: "Pode tirar as 3 do funil claro". As
  principais continuam nos números.
  - Achadas na varredura de 11/10 e tiradas pela regra de higiene, sem
    precisar pedir (esteira e números). A principal vem entre parênteses:
    836 (722), 1103 (1104), 1128 (1126), 1187 (1137), 1196 (560) e
    1238 (756).
  - Achadas em 18 e 19/10, as duas criadas com Gmail por quem já tinha
    conta pela Apple: 1373 (1351) e 1372 (1317). Saíram da esteira em
    19/10, às 6h41, com o "pode" do Mateus.
  - Achada em 20/10, sem telefone, sem link e sem imóvel: 1361 (1191),
    criada em 17/10 quando o telefone dele barrou o cadastro novo. Saiu
    da esteira em 20/10, às 15h42, pela regra de higiene.
  - Com elas, setembro fecha em 96 cadastros (eram 98). Quem publicou não
    muda: as duplicadas estão vazias.
  - Em dúvida, perguntadas ao Mateus em 11/10: 1234 (100), 1092 (715) e
    1164 (998). A pessoa é a mesma e a segunda conta está vazia, mas a
    principal só tem o link, sem imóvel. Até ele responder, continuam nos
    números.
  - O detalhe da varredura (provas e as que não são duplicadas) está em
    `scratchpad/contas-fora/varredura-1011.md`, nos arquivos desta conversa.

Em 29/09 um relatório de funil saiu sem tirar 1014, 1033, 1095 e 1096: deu
161 cadastros de julho a setembro em vez de 157.

### Higiene da lista: sempre (regra do Mateus, 10/10)

- Nas palavras dele: "Vamos fazer sempre essa higiene na nossa lista".
- Conta duplicada é a segunda conta de quem já tem uma. Exemplos: um
  cadastro com outro Gmail, ou pelo "Crie seu Smart Link" do próprio perfil.
  Costuma travar em "telefone já está em outra conta", e a pessoa segue
  usando a principal.
- Só conta como duplicada quando valem as duas coisas:
  - a conta principal da pessoa está identificada e em uso (imóveis, login,
    conversas);
  - a duplicada está vazia: sem celular confirmado, sem link e sem imóvel.
- Achou uma? Sem precisar pedir:
  1. tirar da esteira (`/backoffice/activation/sair`, prévia e confirmação);
  2. pôr na lista "Duplicadas" acima e nos scripts do relatório, para sair
     do funil, dos relatórios e do custo por cadastro;
  3. contar no relatório diário: a conta, de quem é, a principal e a prova.
- Conta de teste nova da equipe recebe o mesmo tratamento, na lista de
  testes.
- Na dúvida, perguntar ao Mateus antes. Exemplos: a segunda conta tem
  imóvel, ou é ela que a pessoa usa.
- O relatório diário procura duplicadas entre os cadastros do dia anterior.

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
- **Tirar uma conta da esteira** (api #87, no ar desde 10/10). Com o "pode"
  do Mateus para aquela conta. Exceção: duplicada confirmada ou teste nova
  da equipe sai sem pedir, pela regra de higiene da lista.
  - Primeiro `POST /backoffice/activation/sair/preview` com `{id_user}`: mostra
    a conta, a situação na esteira e os avisos. Aviso de imóvel no ar quer
    dizer que pode ser a conta principal de alguém: parar.
  - Depois `POST /backoffice/activation/sair` com `{id_user, confirmacao}`
    (10 min). Grava só `activation_opt_out_at`: param os e-mails e os
    WhatsApps da esteira. A conta não é apagada.
  - Não há volta. E o envio manual pelo backoffice para esse `id_user` passa
    a ser recusado ("pediu para não receber"): falar pela conta principal.
  - Em 10/10, às 19h37, saíram assim as duplicadas 1240 (Enio; a principal é
    a 196) e 1241 e 1242 (Bárbara; a principal é a 1226). Foi pedido do
    Mateus, não delas. As principais não mudaram.

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
- **Pró-labore** (Mateus, 11/10): "Tem pro labore mas so pago qd tem receita".
  Hoje não é pago e não entra nos custos.
  - Quando a cobrança ligar, ele volta. Para a empresa ficar no Anexo III
    (6%), o Fator R pede folha (pró-labore incluído) de pelo menos 28% da
    receita dos últimos 12 meses. Abaixo disso, vai para o Anexo V (15,5%).
  - O INSS de 11% sai do pró-labore dele. A CPP já está no DAS.
  - Em projeção e ponto de equilíbrio, mostrar com o pró-labore de 28% e
    sem ele. Em 11/10 ficou com ele a pergunta à Contabilizei sobre o
    valor mínimo.

## Planos por lead qualificado (decidido pelo Mateus em 29/09, ainda não lançado)

- **19/10: atraso em vez de bloqueio** (direção do Mateus, ainda não
  construída nem lançada). Vale acima dos "3 primeiros" e do "até 30" abaixo.
  - Plano de entrada: o 1º cliente do mês (nome + celular) chega na hora;
    os outros, 36 h depois. A IA atende todos na hora, nos dois planos.
  - Pro: todos os clientes na hora, sem limite. A tela do Pro já diz isso
    desde 16/10 (app d56f6ba: "Cada cliente chega na sua mão, na hora.").
  - Imóveis: 100 no plano de entrada e 300 no Pro ("concordo com os 300").
    Não "ilimitado". O limite só vale depois de construir a conferência ao
    publicar, que hoje não existe.
  - Visita marcada segue o plano (Mateus: "ela não deve seguir igual ao
    plano pro?"). Do 2º cliente do mês em diante, no plano de entrada, a
    agenda só oferece horário 40 h depois do contato (36 h + 4 h de folga,
    para o aviso chegar antes da visita). "Ok" dele em 19/10.
  - O comunicado vai também por WhatsApp (pedido dele), além do e-mail e da
    tela. É mudança material: a seção 17 dos termos pede 15 dias de aviso.
  - Aviso "cliente chegou" no plano de entrada (sem o contato, com a hora da
    liberação), por e-mail e WhatsApp. Mateus: "isso mesmo melhor momento
    por email e whatsapp tb".
  - "Ligar logo" (Mateus, 19/10). A regra só começa quando todos puderem
    assinar o Pro; proposta enviada: comunicado 21/10, regra e Pro para
    todos (cartão) em 05/11, os 18 antes, em 03/11. Esperando o "ok".
  - Modelos de WhatsApp (api #104, criados e mandados à Meta por esta
    conversa, como ele pediu: "vc mesmo cria a mensagem e aprova na meta"):
    `mh_cliente_novo_pro_1` (Pro, com nome e celular) e
    `mh_cliente_chegou_1` (plano de entrada), os dois aprovados em 19/10, e
    `mh_aviso_regra_clientes_1` (comunicado), mandado à Meta depois dos
    termos no ar.
  - **Termos no ar desde 19/10** (main 54a0bc0; Mateus: "Pq nao publica os
    termos agora?"): seções 1, 6.5, 7, 8 e 10.3. As regras de 6.5, 7.2, 7.3
    e 7.4 valem a partir de 05/11, 15 dias depois do aviso. O aviso (e-mail,
    WhatsApp e tela) ainda não saiu: cada envio em massa precisa do "pode".
  - Plano completo em `scratchpad/pro/regra-atraso.md`, nos arquivos desta
    conversa.
- **Pro aberto para todos no cartão desde 19/10, ~15h41** (revisão
  `matchhouse-back:26`: `BILLING_MODE=on` e `NFSE_DESDE=2026-10-19`, postas
  pelo Mateus). Conferir em `GET /backoffice/pro/status` (api #108).
  - **Desistência nos 7 dias com estorno automático** (api #107): cancelar no
    app até as 23h59 do 7º dia depois do pagamento devolve no cartão e
    encerra o Pro na hora. Só na 1ª mensalidade do cartão. O pagamento fica
    "refunded" e não volta a valer. A taxa do Stripe não volta (no teste,
    R$ 12,52 de R$ 147).
  - **E-mail à equipe a cada cancelamento**, com o motivo da pesquisa.
  - **NFS-e da 1ª mensalidade espera 7 dias** (ideia do Mateus), nunca
    depois das 18h do último dia do mês. A desistência tira a nota da fila
    ou pede o cancelamento sozinha (motivo 9). Renovação não espera.
    Confirmar com a Contabilizei (texto dado ao Mateus em 19/10).
  - Pro com 300 imóveis no banco (migração da api #107).
  - App #150: tela com 300 imóveis, texto dos 7 dias, conserto do cartão e
    o aviso de 05/11 na visão geral (com o "pode subir" do Mateus).
  - O e-mail do anúncio assina só "Match House" (Mateus: "retirar meu nome
    do email"). Texto em `scratchpad/pro/email-anuncio.txt`.
  - O Stripe no Brasil repassa o cartão em 30 dias.
  - **Atendimento sobre o Pro em todos os canais** (Mateus, 19/10: "sim
    pode ajustar a mensagem em todos os pontos de contato com os
    clientes"). No 6800, no Direct, no e-mail e nas respostas, a dúvida
    sobre o Pro se responde com o que está no e-mail aprovado. É dúvida de
    uso: entra na autonomia.
    - R$ 147 por mês, no cartão. O Pix entra depois (C6).
    - Todos os clientes chegam na hora, e as visitas podem ser marcadas
      a partir de 1 h. O plano tem 300 imóveis; o plano de entrada, 100.
    - Desistência nos 7 dias devolve o valor sozinha. Cancelar é no app:
      Plano Pro > Cancelar assinatura.
    - A regra do plano de entrada começa em 05/11.
    - Nunca "30 leads" nem "30 clientes", e nunca dizer que a Match House
      traz clientes.
    - O desconto da indicação ainda não vale: não prometer.
    - Continuam com o "pode": desistência ou devolução fora do app,
      reclamação, cancelamento fora do app e qualquer promessa nova.
- **Cancelar o Pro: botão no app** (existe desde 05/10, "Cancelar assinatura"
  na tela do Pro). Mateus, 19/10: "cancleamento precisa ser no app. um
  botao".
  - **Pesquisa no cancelamento** (Mateus: "Colher feed back (pesquisa) no
    cancelamento"): api #105 e app #149, 19/10. Sete motivos e um comentário
    opcional; cancelar não depende da resposta. As respostas saem em
    `GET /backoffice/pro/cancelamentos`. O Amplitude leva só o motivo
    (`pro_cancel_confirmed`), nunca o comentário. A exclusão da conta apaga
    a pesquisa.
  - O relatório diário traz a linha "Cancelamentos do Pro": quantos houve
    ontem e os motivos, lidos em `/backoffice/pro/cancelamentos`. Se não
    houver nenhum, a linha diz "nenhum".
  - **Relatório diário: bloco "Pro: Stripe e Pix do C6"** (Mateus, 20/10:
    "pode incluir no relatório o stripe e o pix c6"). Vale acima do roteiro
    da rotina, que ainda não fala dele.
    - **Stripe:** o conector Stripe foi ligado pelo Mateus em 20/10. É só
      leitura: cobrar,
      devolver, cancelar ou mexer em assinatura só com o "pode" dele.
      Ler as assinaturas (`GetSubscriptions`, com status active, incomplete
      e canceled) e as cobranças de ontem (`GetCharges` com `created`).
      O `metadata.id_user` diz de quem é.
    - **Pix do C6:** `GET /backoffice/pro/pix?dias=2` (api #115) e
      `pix_c6` em `/backoffice/pro/status` (ligado ou não). Enquanto o C6
      não liberar a produção, a linha diz "desligado".
    - **Pix recebido na conta do C6** (Mateus, 20/10: "o C6 manda email
      toda vez que recebemos pix"):
      - Ler no Gmail os e-mails de ontem com
        `from:no-reply@c6bank.com.br "recebeu um Pix"`. O assunto é
        "Confira os detalhes da transação.", e o texto traz valor, quem
        pagou e a data.
      - Separar o que é dele (aporte do sócio, não é receita) do que é
        pagamento de corretor (o nome ou o documento batem com uma conta)
        e do que é outra entrada.
      - Os "Pix enviado" do mesmo remetente entram só como total do dia.
    - O que vai no bloco: assinaturas novas, renovações pagas, pagamentos
      que falharam, cancelamentos (com os motivos de `pro/cancelamentos`),
      devoluções dos 7 dias e quem começou a assinar e não terminou.
      Também o total de assinantes ativos e a receita do mês **só de
      corretores**. Fora: as contas internas, de teste e duplicadas.
    - O painel antigo (backoffice.matchhouse.com.br, "Total arrecadado
      por mês") soma as cobranças das contas internas e as já devolvidas.
      Não usar esse número.
    - Assinantes, receita e quem pagou ficam só no relatório e em
      `scratchpad/pro/`. Este repositório é público.
  - **Vendas no funil diário e no Funil Smart Link** (Mateus, 21/10: "as
    vendas podem entrar no funil diario e no funil").
    - A fonte é `GET /backoffice/pro/vendas?dias=N` (api #116). Ela lista
      quem está com o Pro ativo e os pagamentos do Pro do período. Funciona
      mesmo sem o conector do Stripe; quando o Stripe estiver na sessão,
      conferir com ele.
    - Na página do funil diário, o cartão "Vendas do Pro" lê a constante
      `VENDAS`, trocada todo dia junto com as outras: vendas do dia, vendas
      do mês, assinantes ativos, receita do mês e a lista do mês.
    - O Funil Smart Link (`gerar.py`) monta sozinho a seção "Vendas do Pro".
    - **A venda é a última etapa dos dois funis** (Mateus, 21/10: "depois do
      publicou agora, é o venda [...] quantos dos que publicaram compraram,
      e do funil inteiro").
      - Funil diário: `FUNIL` tem a 5ª etapa "Compraram o Pro" (vendas
        pagas no dia, de qualquer conta, com `semPior: true`), e `ORIGENS`
        tem a coluna `compraram`, pela origem da conta de quem comprou. A
        etapa pode passar da anterior: quem compra no dia raramente se
        cadastrou no mesmo dia. Dizer isso no `fonte`.
      - Tabela "Campanha por campanha" (Mateus, 21/10: "Aq tb precisamos do
        numero de vendas"): cada coluna de `CAMPANHAS.lista` tem `vendas`
        (vendas pagas no período, pela origem da conta de quem pagou). A
        tabela mostra "Compraram o Pro", "Publicou → comprou", "Por venda" e
        "Vendas por R$ 100". `CAMPANHAS.vendas_nota` diz de onde vieram as
        vendas do período, inclusive as que não vieram de anúncio.
      - Régua do PLG, linha "Freemium → pago" (Mateus, 21/10: "Aqui tb
        temos que incluir as vendas"): um ponto só, de todos os canais. A
        conta é corretores que pagaram ÷ corretores com imóvel no ar
        (todos os tempos, sem contas internas). Em 21/10 deu 1 de 137, ou
        0,73%. A régua não é diária, mas essa linha muda quando houver
        venda nova: trocar `geral` no `PLG` (fonte: `/pro/vendas` e
        `/agents` com publicados > 0).
      - Funil Smart Link: etapa 5 "Comprou o Pro". Ela conta a primeira
        compra de cada corretor pela data da compra, não do cadastro, nos
        cartões, no gráfico por mês e no semana a semana (Mateus, 21/10: "o
        enio deveria aparecer"). Assim entram as contas de antes de 1º/07,
        como o Enio (196). Na lista de usuários, quem pagou fica com a
        etapa "Comprou o Pro".
    - Contam só corretores: as contas internas e de teste ficam fora (a 999
      inclusive). Receita é o que foi pago e não devolvido.
    - Venda é status `succeeded` ou `paid` com valor acima de zero.
      `refunded` é devolvida, e os outros status são pagamento que não
      terminou.

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
  - **Exceção desde 11/10: os 16.** O Mateus disse "pode mostrar o Pro aos
    16", depois do estudo de cobrança (página "Equilíbrio da Match House",
    https://claude.ai/artifact/P6ohCKyhNaDkxQCi267msz; arquivos em
    `scratchpad/monetizacao/estudo/`).
    - Os 16 são os 5 da lista de espera do Pro e os 13 engajados que já
      tiveram comprador escrevendo; 2 estão nos dois grupos. A lista fica em
      `scratchpad/pro-16/os16.json`.
    - Só eles veem o preço e assinam, liberados um a um. BILLING_MODE
      continua desligado, e nenhum outro corretor vê preço.
    - Isso muda três decisões: preço a corretor, cobrar antes de medir os
      leads e vender o Pro pelas ferramentas, e não pelos leads.
    - Respostas dele no mesmo dia:
      1. Anual a R$ 1.470 à vista (10 mensalidades), sem preço de fundador.
         Responde à pergunta 3 de `api/docs/cobranca-pro.md`.
      2. Devolução do anual depois dos 7 dias de arrependimento: devolve o
         valor dos meses inteiros que ainda não começaram.
      3. Quem cancela o Pro volta sozinho ao plano de entrada no fim do
         período pago (decisão 5 de `cobranca-pro.md`).
      4. A oferta vai por e-mail, com o texto aprovado por ele antes, e pela
         tela do Pro no app, com preço e botão de assinar.
    - Mais respostas dele, no fim da tarde de 11/10 (plano em
      `scratchpad/pro-16/plano.md`):
      5. **O que o Pro tem a mais (D1):** aviso por e-mail na hora em que um
         cliente deixa nome e celular, e a planilha dos leads para baixar,
         os dois só no Pro. A tela diz que hoje o plano de entrada também
         mostra todos os contatos (`lead.liberado` é sempre true). Depende de
         a Intelliway mandar o lead de todos os corretores: perguntar por
         escrito até 22/10. Se ela não mandar, não vender esses recursos.
      6. **Anual (D2): só mensal no começo.** O anual (R$ 1.470, com a
         devolução dos meses que faltam) entra depois da régua de 17/11.
      7. **Quem entra (D4): 18 contas.** Os 16 mais 1278 (Clarice D'Urso) e
         1279 (wanderson klay), que entraram na lista de espera em 11/10. O
         cartão promete "Quem está na lista fica sabendo primeiro". O 1267
         espera a régua.
      8. **Abertura em 3 levas a partir de 03/11:** primeiro a lista de
         espera, depois quem tem cliente real, depois o resto. Cada leva
         precisa do "pode" para o e-mail.
      9. Nas dúvidas dessas contas no 6800 e no Direct, posso responder com
         o preço do e-mail aprovado, só depois de conferir que é uma conta
         liberada. Desistência, devolução e reclamação continuam com o
         "pode".
    - **Como falar do Pro (Mateus, 11/10):** "são 30 cadastros de clientes,
      pq o corretor tem que entender que é como um assistente dele, um SDR,
      e que ele tem que colocar na bio".
      - A IA é o assistente do corretor (um SDR): atende quem chega pelo
        link, tira as dúvidas e cadastra o cliente com nome e celular.
      - O Pro é "até 30 clientes seus cadastrados por mês".
      - A bio entra como condição: a IA só cadastra quem chega pelo link.
      - Fica a linha de transparência: hoje o plano de entrada ainda mostra
        todos os cadastros, e o limite de 3 tem aviso de 15 dias.
      - **Nunca "30 leads" sozinho.** Mateus, 11/10: "se escrever
        simplesmente 30 leads, eles vão achar que a plataforma vai trazer
        leads para ele de algum outro lugar [...] a gente é um motor que vai
        qualificar, que vai atender [...] os leads dele, que ele já gera.
        Porque o problema dele não é gerar leads, o problema dele é atender
        bem os leads e vender mais para a base que ele já tem."
        - A Match House não traz clientes de fora. A IA atende os que já
          chegam ao corretor: pelo Instagram, pelos anúncios, pela placa e
          por indicação.
        - O valor é atender todos na hora e não perder nenhum, para vender
          mais a quem já procura o corretor.
        - Vale para a oferta, a tela, os e-mails e as respostas no 6800 e no
          Direct.
      - Textos em `scratchpad/pro-16/textos-v3.md`.
    - **O que o Pro tem na abertura (Mateus, 11/10: "Sim, segue assim"):**
      1. até 30 clientes seus cadastrados por mês;
      2. aviso na hora de cada cadastro, por e-mail. Vai para o WhatsApp
         quando a Meta aprovar o modelo, que custa por mensagem;
      3. botão "Baixar meus clientes", em planilha Excel. Sai das conversas
         que IA & Leads já mostra (EvaGPT pelo BFF), sem depender do POST
         da Intelliway;
      4. relatório do mês, "O que a sua IA fez por você", em PDF e por
         e-mail.
      - Métricas novas só no Pro entram ao longo de novembro: conversas e
        cadastros, atendimento à noite e no fim de semana, imóveis que mais
        geram conversa e a origem do cliente. As métricas de hoje continuam
        para todos.
      - A oferta só cita o que já estiver no ar e testado.
      - Respostas dele à noite de 11/10 (desenho em
        `scratchpad/pro-16/recursos/desenho.md`):
        - o aviso e a planilha saem das conversas da IA (EvaGPT, lidas pela
          API com a regra do `/backoffice/leads`). Por isso entram na
          abertura sem esperar a Intelliway, se passarem no teste na 999. A
          mensagem à Glaucia de 14/10 continua, por causa do preço acima da
          franquia;
        - no mês sem nenhuma conversa, o relatório vira um e-mail curto,
          sem PDF, com 3 dicas: bio, QR do imóvel na placa e link nos
          anúncios;
        - do 31º cliente do mês em diante, enquanto o limite de 3 do plano
          de entrada não ligar, o Pro continua avisando e listando todos. O
          "até 30" fica como referência.
    - Antes da primeira venda: termos do Pro (arrependimento de 7 dias,
      renovação, cancelamento e devolução do anual), aviso de cartão
      recusado, volta ao plano de entrada, o nome certo do plano de entrada
      e o cupom da indicação com prazo. A meta é abrir em 03/11, ou antes,
      se tudo estiver pronto.
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
  - **16/10:** o C6 respondeu (caso 202699631714) que a Match House ainda
    está em homologação e que o contato é só pelo homologacaoapi@c6bank.com.
    No mesmo dia o Mateus mandou para lá o pedido de liberação com os 5
    itens acima e mais um: se a produção exige cadastrar o IP de origem.
    - O IP de saída do ECS muda a cada tarefa nova. Se o C6 exigir o
      cadastro, é preciso um IP fixo de saída.
    - O NAT foi tirado de propósito em 16/10 (cerca de US$ 33/mês), pelo
      Vitor, o dev. Volta a ser avaliado só se um parceiro exigir IP fixo.
  - **19/10, à noite:** o C6 mandou o contrato para assinar. O Mateus acha
    que o Pix sai em 20/10.
  - **21/10: credenciais de produção saíram.** O Mateus criou no portal do
    C6 o Client ID, o Client Secret e o certificado novos. Falta pôr no ECS:
    a revisão feita à tarde se perdeu quando o login da AWS venceu, e ele
    refaz em casa. Passo a passo (variáveis, teste na 999 e abertura) na
    página "Pix C6 no ar": https://claude.ai/artifact/TuDY3bkC4gFbetn8xjtDqx.
    - Na revisão 28, a partir da 27: `C6_CERT` e `C6_KEY` (base64 do .crt e
      do .key), `C6_USERNAME` e `C6_PASSWORD` novos, `C6_CONTA` e
      `C6_AGENCIA`. O resto do C6 já estava em produção.
    - **Trava `C6_PIX_SO_CONTAS` (api #118, no ar em 21/10).** Com
      `BILLING_MODE=on` (já ligado em produção), ligar o `C6_PIX_AUTOMATICO`
      abriria o Pix a todo corretor de uma vez. Com `C6_PIX_SO_CONTAS=999`,
      o Pix abre só para a 999. Tirar a variável abre para todos. Quem já
      assina segue cobrado com ou sem ela.
    - Ordem: revisão 28 → eu confiro o login no C6 e cadastro os webhooks →
      revisão 29 com `C6_PIX_AUTOMATICO=on` e `C6_PIX_SO_CONTAS=999` → Pix
      real de R$ 147 na 999 (com o "pode" dele) e desistência nos 7 dias →
      abrir para todos só com o "ok" dele.
    - **Feito em 21/10, à noite.** Revisão 28 (credenciais, certificado,
      conta e agência) às 20h00, login no C6 e webhooks `rec` e `cobr`
      cadastrados. Revisão 29 (`C6_PIX_AUTOMATICO=on`, `C6_PIX_SO_CONTAS=999`)
      às 20h12.
    - A 999 já era Pro no cartão até 19/11 e não podia assinar o Pix. O login
      do Mateus abre a 39 (smartli.ink/matchhouse), que entrou na trava pelo
      código (api #119, `PIX_C6_CONTAS_INTERNAS`).
    - **Teste real na 39, 20h25 a 20h28:** QR pago em 70 s, autorização
      APROVADA, Pro até 21/11; desistência pelo app, autorização CANCELADA no
      C6 e devolução dos R$ 147 conferida pelo Mateus na conta ("Devolveu o
      valor tudo ok!"). A 39 está fora da nota fiscal.
    - O relógio do Mac do Mateus estava um dia atrasado, e o login da AWS
      vencia em minutos ("security token ... expired"). Acertado, parou.
    - Falta: abrir para todos (revisão sem `C6_PIX_SO_CONTAS`, com o "ok"
      dele), CNPJ no Pix (pedido dele: "se for empresa precisa de campo para
      o CNPJ"), revogar a credencial antiga no portal do C6 e as perguntas de
      antecedência, tarifas e IP fixo.
  - **Desistência nos 7 dias também no Pix** (api #111 e app #153, 19/10):
    o e-mail do anúncio e os termos prometem o valor de volta em qualquer
    forma de pagamento. Antes, a devolução automática só existia no cartão.
    - A devolução vai pelo C6 (`PUT /pix/{e2e}/devolucao/{id}`), e o Pro só
      termina com ela aceita.
    - Vale também para quem parou o débito no banco dentro dos 7 dias.
    - O tick de hora em hora retoma desistência que ficou no meio, confere
      as devoluções que ainda estão saindo e alerta a equipe se uma não
      sair.
    - Detalhe no Apêndice A.x de `api/docs/cobranca-pro.md`.
    - **Escopos pedidos ao C6 em 19/10, à noite** (o Mateus mandou o
      complemento ao homologacaoapi@c6bank.com). A lista completa:
      `cob.write`, `cob.read`, `payloadlocationrec.write`, `rec.write`,
      `rec.read`, `cobr.write`, `cobr.read`, `webhookrec.write`,
      `webhookrec.read`, `webhookcobr.write`, `webhookcobr.read`,
      `pix.write` e `pix.read`. O pedido de 15/10 tinha só os 5 `.write`
      do Pix Automático.
      - Sem o `pix.write`, ninguém consegue desistir pelo Pix.
    - Os termos de uso das APIs do C6 foram assinados pelo Mateus em 19/10.
      São os termos padrão para desenvolvedores e não falam de escopo nem
      de produto: o que libera cada função é a chave.
    - Para ligar: as credenciais e o certificado de produção, `C6_CONTA` e
      `C6_AGENCIA` no ECS, os webhooks pelo backoffice e, por último,
      `C6_PIX_AUTOMATICO=on`.
    - Teste na 999: um Pix de verdade de R$ 147, a desistência e a
      conferência da devolução e da nota.
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
  - **Em produção desde 19/10, à tarde** (revisão `matchhouse-back:25` do
    ECS, posta pelo Mateus): `NFSE_EMISSAO=producao`,
    `NFSE_DESDE=2026-10-22`, `NFSE_SEM_CPF=sem_tomador`,
    `NFSE_EMAIL_CORRETOR=on` e `NFSE_SEM_NOTA_USER_IDS` com 3, 56 e 39.
    Conferido em `/backoffice/nfse/status`: série 900, certificado
    carregado, sem problemas de configuração. Se a abertura do Pro mudar de
    dia, trocar o `NFSE_DESDE`.
    - `charge.refunded` marcado no webhook do Stripe pelo Mateus em 19/10.
    - Na primeira nota real, conferir a inscrição municipal (E0116/E0120).
  - **Webhook do Stripe, 19/10 (api #106):** de 13 a 19/10, 427 das 805
    entregas falharam com 404 no `invoice.paid` da fatura de R$ 0 do teste
    do plano de entrada, que todo cadastro cria. Agora a fatura de R$ 0 sem
    pagamento nosso é confirmada na hora, e aviso repetido responde 200.
    Conferir no painel do Stripe que as falhas caíram.

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
  `openai/gpt-4o-mini` em `OPENROUTER_MODEL`.
  - **Trocar antes de 14/01/2027.** Em 19/10 chegou o aviso do OpenRouter
    "GPT-4o and GPT-4.1 models retire January 14, 2027". Escolher o
    substituto, testar a importação (link, fotos, PDF e texto) e trocar a
    variável. O provider já aceita um modelo
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
- **Nem informação interna da IA** (Mateus, 21/10: "nunca forneça
  informações internas, nem suas"). Em 21/10 um corretor perguntou no 6800
  "qual a plataforma base da sua IA, chatgpt, gemini?".
  - Não dizer fornecedor, modelo, parceiro (Intelliway, EvaGPT,
    OpenRouter, GPT, Claude), prompts nem como a IA funciona por dentro. Vale
    para a IA do Smart Link e para a do atendimento.
  - Resposta: dizer o que a IA faz pelo corretor e que fornecedor e modelo
    são informação interna da Match House.
  - Continua valendo dizer que as respostas são feitas com a ajuda de IA,
    com a equipe acompanhando: isso é transparência, não detalhe interno.
- Os relatórios, a área de custos e os funis são só para o Mateus e não saem
  daqui.

## Segurança e LGPD em toda a aplicação (Mateus, 11/10)

- Nas palavras dele: "Precisamos de segurança em toda aplicação,
  notadamente nessa parte de LGPD, dados dos clientes e de pagamento."
- Vale para todo PR, em qualquer repositório:
  - conferir o dono pelo login, nunca por um id que vem na chamada;
  - nada de dado de cliente, de corretor ou de pagamento a quem não é dono
    nem admin;
  - nada de segredo no código nem em log;
  - nada de dado pessoal em log, URL ou analytics.
- Furo de segurança nunca se testa em produção com dado de outra pessoa:
  prova-se com teste automatizado e leitura de código.
- Este repositório é público até o Mateus fechar. Achado de segurança,
  furo aberto, número da empresa e dado de corretor não entram aqui: ficam
  só em `scratchpad/seguranca/` (plano e achados), nos arquivos da conversa.

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
- **O SAIR vem depois do convite, em itálico, como rodapé** (Mateus, 21/10:
  "pode fazer assim, com o itálico").
  - Linha separada, no fim: `_Se não quiser mais receber essas mensagens, é
    só responder SAIR._`. No WhatsApp não dá para diminuir a letra, então o
    itálico faz a vez de nota de rodapé.
  - Só quando a pessoa está respondendo a uma mensagem automática (aviso ou
    esteira). Não vai em toda resposta.
  - No e-mail nada muda: o "Parar de receber" já fica no rodapé, cinza, em
    12 px.
  - Nos modelos do WhatsApp, quando houver versão nova, o SAIR vai no campo
    de rodapé da Meta, que já sai pequeno e cinza. Não trocar os aprovados
    só por isso.
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
- **Mensagem fora do app: no máximo duas respostas** (Mateus, 12/10).
  - Nas palavras dele: "a gente pode responder assim uma vez, somente uma
    vez ... desejando melhoras e mandando as coisas do app para ele abrir.
    Se caso a pessoa retornar com a mesma conversa que não é referente ao
    app, aí a gente pode mandar uma última mensagem falando que a gente só
    pode conversar sobre isso ... e daí sim, já não responde mais".
  - 1ª mensagem fora do app (assunto pessoal, saúde, engano): uma resposta
    curta e gentil (ex.: "desejamos melhoras") e o próximo passo dele no
    app, com o link.
  - Se ela voltar com assunto fora do app: uma última mensagem dizendo que
    por aqui só conseguimos falar do app e do Smart Link.
  - Depois disso, assunto fora do app não recebe mais resposta: só anotar
    em `ignorados_sem_acao`. Dúvida do app continua sendo respondida.
  - Contar em `mensagens-vistas.json` (`fora_do_app`, por id_user) quantas
    respostas fora do app a pessoa já recebeu.
  - Primeiro caso: Leandro (1193), 12/10 às 2h33, "Preciso passar no médico
    tenho problema de estômago".

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
  - Aviso à Intelliway: texto entregue ao Mateus no chat em 09/10; quem
    manda é ele.
  - **E-mails aos 9 corretores com imóvel antigo de fase no ar** (19
    anúncios): aprovados pelo Mateus em 09/10 ("Pode mandar amanha").
    - Saem em 10/10 às 9h (`trig_01Xdx9NQ5t5RTyDioaPMfpnA`).
    - Pedidos prontos em `scratchpad/d1010/fase-msgs/envio/`.
    - Ninguém da lista recebeu o e-mail dos tipos errados.
    - Nas revendas gravadas como "Pronto para morar" (388, 396, 397), o
      e-mail sugere desmarcar a Fase.
    - Ficam de fora os desativados 540 e 733 e o rascunho vazio 529.
- **Tela nova dos tipos: no ar desde 09/10, 12h20 (Brasília)**, com o "pode"
  do Mateus (app #134, merge 10cf8af; site #226, merge 16a7d67).
  - Residencial, Comercial e Rural, com os subtipos de cada um.
  - O subtipo é obrigatório para publicar (medir `property_publish_blocked`).
  - O site esconde "Andar 0" e "Mobiliado" de Terreno e Área.
  - Depois de publicada, saem as mensagens aos corretores dos imóveis com
    tipo errado, primeiro por e-mail.

## Login vencido e o link dos avisos (app #157, no ar desde 21/10, 11h33)

- Defeito visto no vídeo do Guilherme (1012), em 21/10. Ele tocou no link
  do aviso por e-mail (`/dashboard/indique`), viu "Entre na sua conta" e,
  ao tocar em "Fazer login", caiu em "Criar conta — Passo 2 de 2", com
  "Sua sessão expirou" e um botão que não fazia nada.
  - Causa: todo login gravava no navegador um "cadastro em andamento",
    também para quem já tem link, e esse registro nunca saía. Quando a
    sessão vencia, a entrada achava o registro e retomava a criação do
    link, com um login de mais de 40 dias (o login da API vale 40 dias).
- O que mudou:
  - login de conta pronta apaga esse registro;
  - a entrada descarta o registro com o login vencido, e também o de quem
    já tem link nesse navegador;
  - se a sessão cair no passo do link, a pessoa volta ao login com "Sua
    sessão expirou. Entre de novo para continuar.";
  - **o painel sem sessão abre direto a tela de entrada** (Mateus: "já
    pode abrir direto?"). Não existe mais a tela "Entre na sua conta para
    abrir o painel". Depois do login, a pessoa cai na tela do link que
    tocou.
- Publicação do app: em 21/10 o merge não disparou o "📦 Vercel Deploy"
  sozinho. Se acontecer de novo, rodar o workflow à mão (`deploy.yml`,
  workflow_dispatch na `main`).

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

## Teste A/B da tela de entrada do app (desde 14/10)

- Código em `app/src/lib/tela-entrada.ts`.
  - O sorteio só roda em produção e é meio a meio entre as versões de
    `VERSOES_NO_SORTEIO`.
  - A versão fica guardada em `mh_tela_entrada` e vai no endereço como
    `?mh_tela=`.
  - Quem já tem conta no aparelho fica fora do teste.
  - Para encerrar: `isTesteLigado = false`, ou trocar a lista pela vencedora.
- **"a"** (14/10, 11h, app #141, a pedido do Mateus): abre com a promessa do
  anúncio do ChatGPT e mostra os botões por extenso ("Continuar com Google").
- **"b" no lugar da "a"** (14/10, à tarde, app #142, merge 21370f2). Mateus:
  "B no lugar da A" e "Pode publicar".
  - A "b" é a "a" com o exemplo. O celular desenhado mostra a Camila (fictícia)
    e o selo "Ver um exemplo". O toque abre um vídeo de 34 s do Smart Link,
    com os botões embaixo.
  - O sorteio agora é hoje contra "b". Quem já tinha a "a" continua nela.
  - Contar a "b" a partir da entrada dela.
- **Leitura em ~2 semanas (perto de 28/10)**, por `tela`:
  - `auth_entry_viewed`, `auth_clicked`, `auth_completed`, cadastro concluído
    e primeiro imóvel publicado;
  - da "b": `exemplo_aberto` (`video`), `exemplo_fechado` (`segundos`, `viu`),
    `auth_clicked` com `surface: "exemplo"` e `exemplo_viu` no
    `auth_entry_left`.
  - **17/10: segue até 28/10** (Mateus: "ok, deixa rodando até 28/10"). A
    leitura parcial de 17/10 não deu para concluir: a diferença cabe no
    acaso. O detalhe está em `scratchpad/ab/leitura-1710.md`, nos arquivos
    desta conversa. Lembrete em 28/10, às 9h07
    (`trig_01GpTE6LuF26QoT3s1cvntn6`). Não encerrar antes sem o Mateus.
- **O exemplo é fictício, sempre com o selo "Exemplo".**
  - Corretora, imóveis e conversa são de mentira. Nunca vai para o site
    público, onde geraria lead falso.
  - As fotos são do Unsplash, cuja licença permite uso comercial sem crédito.
    A lista fica em `scratchpad/demo/fotos/CREDITOS-unsplash.txt`.
  - Não trocar por um corretor real sem a autorização dele.
  - Página do exemplo: https://claude.ai/artifact/9kCrTj1mBbuQsW9b6Gvcw1.
  - O link `smartli.ink/camiladuarte` está reservado na API desde 14/10
    (api #99, `RESERVED_SLUGS` em `validate-slug.function.ts`).
- Na rede do ambiente, `unsplash.com` e `images.unsplash.com` foram liberados
  pelo Mateus em 14/10.
  - A busca do Unsplash tem checagem anti-robô e não deve ser contornada.
  - Para achar fotos: baixar miniaturas de IDs conhecidos por
    `images.unsplash.com` e olhar.
- No mesmo PR, o aceite (Política de Privacidade e avisos pelo WhatsApp) foi
  também para as folhas de entrar, que não o mostravam.
- No site, desde 14/10 (site #230): a IA se apresenta como "Oi! Eu sou a IA
  de Camila", e o campo diz "Responder à IA de Camila…". Antes era "o Camila
  IA" para toda corretora.

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

## Vitrine (matchhouse.co): imóveis do Pro na frente (api #117, no ar desde 21/10, 12h20)

- Pedido do Mateus em 21/10: "colocar os clientes pro com os imóveis
  sempre na frente no matchhouse.co".
- A busca externa (`findAllPropertyPageExternal`) sem `id_agent` nem
  `id_property` devolve primeiro os imóveis de quem tem o Pro valendo e
  depois os outros. Cada bloco vai do mais novo para o mais antigo, e a
  paginação corre pelos dois como uma lista só.
- O que conta como Pro: plano Pro ativo, pela mesma regra do cron que
  desliga o plano (`cronDisableAt`). No cartão, vale a validade mais 10 dias
  de folga; com cancelamento pedido, até o fim do período; no Pix do C6,
  a própria validade. A conta interna 999 não entra.
- Ficam como eram: a página de um corretor (Smart Link e IA), um imóvel
  só e a contagem (`take -1`). Se o destaque falhar, volta à ordem de
  sempre.
- Conferido no ar em 21/10: a lista inteira com cada imóvel uma vez só, e
  os 15 do Enio (corretor 132) na frente.
- A revisão pegou que o Prisma recusa `id_agent: null`, porque o campo é
  obrigatório. Os testes com o banco simulado não pegam esse tipo de erro:
  filtro novo do Prisma se testa com um Postgres de verdade.

## Endereço do imóvel: só bairro, cidade e UF no site (Mateus, 19/10)

- Nas palavras dele: "volta a regra de nao aparecer o endereço completo do
  imóvel. racional: corretor nao quer que o cliente vá direto ao imovel e
  outros corretores".
- Site #237 (19/10): o detalhe mostra "Barra da Tijuca, Rio de Janeiro - RJ",
  sem rua, número, complemento nem CEP. O Google (JSON-LD) também não recebe
  esses dados, e as consultas do site não os pedem mais. O endereço completo
  aparecia desde 03/09 (8fbd779).
- Em resposta a corretor ou cliente, não passar rua e número de imóvel de
  outra pessoa.
- **A IA do link continua com o endereço completo e pode falar** (Mateus,
  19/10: "vamos deixar a IA ter todas as informações, so no card que nao
  entra a rua e numero" e "Ou seja a IA pode falar o endereço completo").
  Não mexer no que a API manda à IA.

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
  com o que ela disse e o que eu respondi. Desde 19/10, dúvida sobre o Pro
  (preço, o que tem, como assinar e cancelar) também entra, com o texto do
  e-mail aprovado (ver "Atendimento sobre o Pro em todos os canais").
  Continuam precisando do "pode": desistência ou devolução fora do app,
  reclamação, cancelamento fora do app, promessa em nome da Match House e
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
    - As regras de conteúdo continuam: nunca prometer recurso que não
      existe, sem "grátis" e convite da bio no fim. Desde 19/10 o Pro e o
      preço dele entram nas respostas, com o texto do e-mail aprovado (ver
      "Atendimento sobre o Pro em todos os canais").
    - No 6800: desistência, devolução, reclamação, cancelamento fora do app
      e promessa ainda pedem o "pode".
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
  - **Regras fechadas pelo Mateus em 19/10 ("1, 2, 3 e 4 - sim!"):**
    1. cada 10% vale **6 meses**, contados da aprovação do colega;
    2. com **100%** (10 colegas ativos), o Pro fica liberado sem cobrança
       enquanto os 100% durarem, direto pela API, sem passar pelo Stripe;
    3. o desconto **não cai** se o colega tirar os imóveis do ar ou apagar
       a conta: só acaba quando passam os 6 meses;
    4. o **colega indicado também ganha 10% por 6 meses**, contados da
       aprovação dele.
    - Em 19/10 não havia nenhuma indicação de corretor real (só as 2
      antigas da conta 56, interna), e o desconto continua desligado
      (`INDICACAO_DESCONTO`). Liga só depois de construído e testado.
    - Nos 13 dias até 19/10 houve 167 cadastros e só 1 veio de convite
      de perfil (a duplicada 1240, do próprio Enio). A contagem funciona;
      ninguém indicava porque não havia tela.
  - **Tela do Indique e Ganhe: pronta em 19/10 e escondida** (Mateus:
    "pode fazer e crie a tela do indique e ganhe"). API #109 e #110, app
    #152.
    - `/dashboard/indique` mostra:
      - o desconto de agora;
      - o link de convite ("Enviar para um colega" e "Copiar link");
      - o "Como funciona";
      - os colegas por etapa, sem nome nem contato (`meuIndiqueGanhe`).
    - O menu e o cartão na Visão geral só aparecem com
      `INDICACAO_DESCONTO=on`.
    - **O convite passa a valer mais que a origem anterior** (app #152):
      quem chegou antes por um anúncio e depois cria a conta pelo convite
      fica com a origem do convite (`smartli.ink / indicacao`). Os ids do
      clique continuam. Aparelho que já tem conta não muda de origem. Isso
      tira esses poucos cadastros da conta do anúncio no CAC.
    - Aviso 7 dias antes de os 100% acabarem, em duas versões:
      - com cartão salvo: a renovação é cobrada nele e o cancelamento é
        pelo app;
      - sem cartão: o pagamento sai pelo link do e-mail.
      - Sai uma vez por data de fim. A marca `mh_aviso_fim_dos_cem` fica
        na assinatura do Stripe.
    - Renovação sem cartão nenhum: o e-mail é de pagar, e não de "cartão
      recusado".
    - **Cupom testado de verdade na 999 em 19/10**, pela rota
      `POST /backoffice/pro/desconto-teste` (prévia e código; só a 999,
      fixo no código).
      - O teste achou um defeito: o cupom entrava e não saía. Consertado
        na api #110, com string vazia no Stripe.
      - Depois do conserto, 30% → 20% → 0% deu certo, e a 999 ficou sem
        cupom.
    - Ainda fora:
      - o Pix segue com preço cheio até o C6;
      - o Partner não aparece na tela, porque o selo e o destaque não
        existem;
      - não foi testado no Stripe se pagar pelo link da fatura salva o
        cartão.
    - Ligar: o Mateus põe `INDICACAO_DESCONTO=on` numa revisão nova do ECS,
      como fez com o `BILLING_MODE`. Depois de ligado:
      - conferir `desconto_indicacao: true` em `/backoffice/pro/status`;
      - tirar dos textos de resposta (rotina de hora em hora, guia e
        CLAUDE.md) o "o desconto da indicação ainda não vale".
    - **Ligado desde 20/10, 8h27** (revisão 27 do ECS, posta pelo Mateus).
      `/backoffice/pro/status` mostra `desconto_indicacao: true`. Vale
      acima de qualquer "desconto ainda não está ligado: não oferecer" que
      sobrar em texto antigo. A rotina de hora em hora, o guia (seção 12) e
      o e-mail do aviso de 05/11 já falam dele.
    - O WhatsApp do aviso de 05/11 é o `mh_aviso_regra_clientes_2`, com o
      Indique e Ganhe e o botão "Ver meu convite", aprovado pela Meta em
      20/10 (api #113).
    - **Link de convite curto desde 20/10** (app #155, merge 15ce197). Mateus: "consegue
      deixar o link mais amigável, com nome do corretor ou algo do tipo?".
      - É `app.smartli.ink/convite/<slug>`. O `vercel.json` redireciona
        (307) para o destino de antes, com `utm_medium=indicacao`,
        `utm_content=perfil-<slug>` e `ref`. A API conta a indicação como
        antes, e o card do WhatsApp continua "Crie seu Smart Link".
      - O redirect fica no `vercel.json` para sempre: sem ele, os links já
        mandados caem no 404. Não voltar a produção para um deploy de antes
        do #155.
      - Ponto no fim do slug vai como %2E, porque o WhatsApp corta o ponto
        final do link.
    - **Convite pelo WhatsApp desde 20/10, 14h26** (app #156). Mateus: "o
      compartilhamento tem que ser pelo whatsapp". "Enviar para um colega"
      abre o WhatsApp direto, com o texto e o link.
    - **Cada colega conta uma vez só, desde 20/10, 14h31** (api #114, merge
      40c60f6). Mateus: "veja se nao conta duplicada ou mais, e se nao conta
      o mesmo duas vezes".
      - O desconto, a tela e o nível contam cada colega uma vez. Se dois
        corretores convidarem a mesma conta, só o primeiro convite vale.
      - Quando o colega passa a contar, a indicação guarda um código
        cifrado do celular e do login dele. A mesma pessoa não conta de
        novo, nem com outro celular, nem com outra conta, nem depois de
        excluir a conta.
      - O código se apaga sozinho 1 ano depois. Está na Política de
        Privacidade (10.8 e 11). Mateus: "fica guardado para evitar fraude
        ou algo do tipo mas sem nenhum uso e podemos colocar um prazo para
        apagar automaticamente, 1 ano".
      - Aprovar à mão (do 6º colega do mês em diante) é só pelo `decidir` do
        backoffice.
        - Não se aprova à mão: mesmo login, mesmo celular, e-mail ou CPF do
          indicador, e colega que já conta.
        - Quando só o celular é igual, a prévia avisa e a aprovação à mão é
          permitida (pode ser número reciclado pela operadora).
      - O detalhe de segurança fica só em `scratchpad/seguranca/`.
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
  - o endereço é pedido só a quem bateu a meta e **fica guardado** (Mateus,
    20/10: "temos que ter o endereço de nossos clientes"). Vale acima do
    "apagado 30 dias depois da entrega" de 07/10. A API não tem rotina que
    apague o endereço.
    - O endereço serve para entregar o cartão, em casa ou no escritório, e
      só isso. Marketing por correio está fora (Mateus, 20/10:
      "provavelmente nao vamos mandar nada em papel. somos digital!"). Não
      pôr opção de correspondência no pedido do cartão.
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
- Rótulos na frente, na amostra de 08/10: "MATCH HOUSE · GREEN" e
  "MATCH HOUSE · BLUE", com "Nº 0001". O Partner fica "MATCH HOUSE ·
  PARTNER" e "Nº 001", com o verso igual ao do Blue.
- A cor do cartão sai do mínimo de colegas (1 a 4 Green; 5 ou mais Blue;
  11 ou mais, Blue com PARTNER), não do nome do nível, que pode mudar.
- **Arquivos: `ferramentas/cartao/` da branch de trabalho** (desde 16/10;
  os do scratchpad se perderam em 13/10).
  - O HTML editável das 4 faces vem com a Camila (exemplo, com "EXEMPLO"
    e CRECI 00000-F), junto com o PDF de impressão, as prévias, o gerador
    do QR e o LEIA-ME com as medidas para a gráfica.
  - O PDF da amostra da INMC enviado à Vixcard está em `original/`.
  - Remontado em 16/10. Mateus: "ele ja remontou la com dados da camila..
    mas pode fazer tb e salve aqui".
- **Versão 2 (19/10), depois da amostra impressa.** A amostra funcionou
  (NFC e QR), mas, nas palavras do Mateus: "ficou muito pequeno para
  leitura e as cores muito escuras nao da para diferenciar o azul do
  verde". No PVC, os fundos saíram quase pretos.
  - Ficaram o mesmo verde escuro e o mesmo azul-noite, mais claros. Texto
    branco a partir de 2,6 mm. O QR do verso tem 17 mm.
  - Recusados por ele no mesmo dia; não propor de novo:
    - verde e azul claros: "assim nao ficou um alto padrão";
    - a marca na vertical, à direita (as duas opções): "Nada disso ficou
      bom, volte ao que era".
  - Amostra 2 (INMC): `ferramentas/cartao/amostra-inmc-v2.pdf`. A
    mensagem à Thaisa (cor e número do chip) foi dada ao Mateus.
  - **20/10, decisão final: o desenho e as medidas da amostra impressa.**
    Mateus: "Vamos voltar tudo para o tamanho que estava antes.. a cor ja
    vai resolver o problema. entao resumindo: so vamos mudar do que foi
    impresso de teste, a cor e a retirada da marcaçao do chip".
    - Mudam só a cor (fundos clareados; texto e wordmark brancos) e o chip,
      que sai da frente.
    - O M da frente fica sem brilho em volta: branco sólido no Green e no
      degradê da marca no Blue ("tira a fumaça em volta do M").
    - Letra, QR, marca e posições são os da amostra. As tentativas com
      letra e QR maiores (19 e 20/10, commit 2bfb38c da branch de
      trabalho) foram descartadas: não propor de novo.
    - Amostra 2 da INMC para a Vixcard refeita assim (commit 87009a7).
      **Mandada à gráfica pelo Mateus em 20/10, de manhã** ("Ja mandei para
      a gráfica o cartao novo, cores + claras"). Quando chegar: testar o
      NFC e o QR num iPhone e num Android e ver se o verde e o azul se
      distinguem no PVC.
    - O pedido de orçamento da carta-berço para gráfica está em
      `ferramentas/cartao/pedido-carta-berco.md` da branch de trabalho.
      A Vixcard e a BPD não fazem.
- **No app, o cartão mostra o nome e o link do próprio corretor antes do
  pedido** (app #154, 19/10). Mateus: "consegue colocar o nome do corretor
  no cartao dele para ele ver no app? antes de pedir".
  - Na frente vão "<primeiro nome> IA" e `smartli.ink/<slug>`, sem número.
  - A arte do app ainda tem as cores da v1 e o chip. Passar para a v2 (só
    a cor nova e sem o chip) quando a amostra 2 for aprovada.
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
  - **Pedidos em lotes de 10, na planilha da Vixcard** (Mateus, 20/10: "eles
    vao me mandar uma planilha para prenchermos e podemos pedir de 10 em 10.
    dai fazemos tudo no modelo deles"). Quando a planilha chegar, eu
    preencho com os pedidos do app (`GET /backoffice/cartoes`, mais o CRECI e
    o link de cada um), 10 por vez. O envio também segue o modelo deles.
    - Mudar a Política de Privacidade para isso: o Mateus achou
      desnecessário (20/10). Não propor de novo.
    - A carta-berço (luva + cartela) está em `ferramentas/cartao/carta-berco/`
      da branch de trabalho. Em 20/10 o Mateus mandou o orçamento a duas
      gráficas.

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
  - L3:M8 (etapas 1 a 6): a aba oculta "Base dos gráficos" lê M3:M5 e
    M7:M8 fixos;
  - os rótulos que o robô do export procura (`sync-panels-from-csv.mjs`, na
    branch `claude/post-deploy-api-export-csv-2qpvzq` da api, disparado
    todo dia).
  - Os dois gráficos de ativação são do robô: ele reescreve o spec inteiro
    todo dia. Pode mudar só a posição deles; o resto muda no script.
- **Gráfico com as etapas da IA e as % (Mateus, 15/10):** "queria colocar
  no gráfico as conversas por IA e os leads por IA" e "com as porcentagens
  dessa etapa".
  - O robô (api 2044960) grava a Base em A1:C10: etapas 1 a 6 em A2:B7,
    o rótulo "pessoas · % da etapa anterior" (ex.: "44 · 54%") em C2:C7 e
    a pizza em A8:B9.
  - Os dois gráficos de barras do Painel usam esse rótulo: o do robô
    ("Funil completo — Smart Link + Imóveis (ativação)") lê C2:C7, e o de
    cima ("Funil — do login ao lead da IA", feito à mão) lê C1:C7, com o
    cabeçalho. Não mudar o texto de C1.
  - Em 15/10 o de cima virou um funil de barras empilhadas e voltou ao
    que era no mesmo dia (Mateus: "nao era isso, volte o grafico ao que
    era"). Não refazer. O spec antigo fica em
    `ferramentas/painel-pro/old-chart-1609832849.json`.
- **Pizzas até o lead da IA (Mateus, 15/10: "coloque a etapa 5 e 6 nos
  gráficos").** As fatias não se sobrepõem: há corretor com conversa na IA
  sem imóvel, então "com imóvel, sem conversa" desconta só quem tem os dois.
  - **"Onde cada pessoa parou" virou um funil desenhado nas células em
    15/10** (Mateus: "no outro o pizza vc transforma em funil mas use um
    bom modelo"). Não é gráfico: fica em H11:K26 do Painel.
    - Cada etapa ocupa duas linhas. Em H:I (mescladas) vai uma barra
      SPARKLINE centrada, com largura proporcional às pessoas e mínimo de
      3% para o lead não sumir. Em K vão o nome e o número, em negrito, e
      embaixo "% passaram · N pararam aqui".
    - O "pararam aqui" sai do bloco "Situação atual" (L11:M16) e soma o
      total de logins. As etapas saem de M3:M8. Tudo é fórmula e se
      atualiza sozinho; o robô não mexe ali.
    - As cores vão do azul-marinho ao ciano. Locale pt-BR: nas matrizes da
      SPARKLINE, coluna é "\" e decimal é ",".
    - A pizza antiga foi apagada; o spec está em
      `ferramentas/painel-pro/pizza-1302843605.json`. O gerador dos
      pedidos é `ferramentas/painel-pro/gera-funil.mjs`.
    - O bloco "Situação atual" (L10:M16) continua: o funil lê dele. O
      bloco "Etapa do funil — Google Ads" desceu para L18 (o robô o acha
      pelo título).
  - "Ativação — corretores com × sem imóvel" (do robô, api e9dd7b6) lê a
    Base A8:B11, as mesmas 4 fatias de quem completou o cadastro. B12 é a
    linha de apoio (conversa e imóvel juntos) e B13, imóveis no total.
  - A cor vem da ordem das fatias (a API não pinta fatia): 1ª azul, 2ª
    vermelha, 3ª amarela, 4ª verde. Mateus, 15/10: "o vermelho deve ser sem
    imóvel e sem conversa, e o azul imóvel publicado". Não reordenar.
  - O nome de cada fatia leva a % dela ("Sem imóvel nem conversa · 63%").
    A API não escreve texto dentro da fatia: `pieSliceText` é ignorado sem
    erro (testado em 15/10). Dentro da fatia, só pelo editor do gráfico.
- **Vendas no Painel do PRO (Mateus, 21/10: "pode fazer as vendas agora").**
  - Etapa "7. Compraram o Pro" em Painel!L9:M9. Ela conta as linhas da aba
    "Vendas Pro" (sheetId 1855183834), menos as devolvidas: uma linha por
    corretor, pela primeira compra paga, sem contas internas, de teste e
    duplicadas.
  - Conta toda venda desde a abertura (19/10), também de conta de antes de
    14/07, como no Funil Smart Link. O Enio (196), a 1ª venda, tem conta
    desde 12/2024.
  - A % da etapa 7 é sobre quem publicou (etapa 4) e sobre os logins, e não
    sobre a etapa 6: comprar não depende de ter recebido lead.
  - O funil desenhado foi para H11:K28, com a etapa 7 em verde (gerador
    `ferramentas/painel-pro/gera-funil.mjs`). O 💡 da aba Dados desceu para
    B29.
  - O gráfico de cima ("Funil — do login à compra do Pro") lê L2:M9, e os
    rótulos dele saem de 'Vendas Pro'!K2:K9: K3:K8 repetem a Base, e K9
    é o da venda. O robô do export não mexe em nada disso (ele grava a
    Base A1:C13 e as etapas 1 a 6).
  - Atualização: a rotina das 06h47 (`trig_011zZvcgNN73kVfWyPypb1dc`) roda
    `ferramentas/painel-pro/vendas.sh` e grava a aba a partir de A3.
  - Na parte de baixo (Mateus, 21/10: "aqui tb precisa refletir as
    vendas"): o cartão "COMPRARAM O PRO 💳" em K33:K34 (=$M$9), e o
    "Funil completo" do robô com a etapa 7 em verde (api a9886f0, na branch
    do robô). Com isso a Base desceu uma linha: etapas em A2:C8, pizza em
    A9:B12, apoio em B13 e imóveis no total em B14.
  - A pizza continua só até o lead da IA: ela é a turma desde 14/07, e o
    Enio (a 1ª venda) é de antes.
- Números de 07/10, desde 14/07, contando as contas internas que estão no
  PRO: 27 corretores receberam conversa e 3 receberam lead (1082, 1175 e
  1182), com 4 leads únicos. Fora do funil ficam os leads da 825 (sem
  usuário) e da 27 (interna).

## Se o scratchpad voltar vazio (aconteceu em 13/10, 20h08)

- O servidor desta conversa reiniciou do zero e a pasta de trabalho
  (scratchpad) voltou vazia. Perderam-se os arquivos que só existiam lá.
- As ferramentas que as rotinas usam têm cópia em `ferramentas/`, na
  branch `claude/cheque-campanha-numeros-ivhccq`. Para voltar com elas:
  `git show origin/claude/cheque-campanha-numeros-ivhccq:ferramentas/<arquivo>`.
  - `vigia/vigia.sh`: a vigia do Direct e do 6800 (vai em `scratchpad/vigia.sh`).
  - `leads-ia/atualiza.sh`: a aba "Leads IA" (rotina das 06h47).
  - `custos/cac.py` e `custos/aws_dias.py`: CAC e AWS do relatório.
  - `funil-smart-link/gerar.py` e `template.html`: o "Funil Smart Link".
  - `contas-fora/ONDE.md`: onde ficam as listas de contas fora dos números.
  - `painel-pro/vendas.sh`: a aba "Vendas Pro" do Painel (rotina das 06h47).
  - `cartao/`: o cartão Smart Link (Green e Blue), com o HTML, o PDF e o
    LEIA-ME.
- A página do funil diário volta pelo Artifact (`read` com `path`
  index.html), tirando o esqueleto `<!doctype…<body>` e o `</body></html>`.
- O registro das mensagens (`scratchpad/mensagens-vistas.json`) não pode ir
  para o repositório, que é público: tem nome de corretor. Se sumir,
  recriar pelo histórico da conversa e pelo `/backoffice/messages`.
- Ao mudar uma dessas ferramentas no scratchpad, atualizar a cópia na branch.

## Rodar localmente

`npx serve -p 3456 .` (config em `.claude/launch.json`).
