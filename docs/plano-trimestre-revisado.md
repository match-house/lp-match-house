# Os próximos 3 meses — revisão com os números reais

**Data:** 20/08/2026
**Base:** plano trimestral "Os próximos 3 meses" (Leo) + documento de ajustes (19/08)
**Fonte dos números:** conta de anúncios Meta `[MH] Match House 01` (`450532434323918`), leitura direta via Windsor.ai · código da LP (`tracking.js`, `index.html`)

---

## 1. O que esta revisão muda

Os dois documentos anteriores constroem a sequência de 12 semanas sobre três sinais quantitativos: *clique → tela carregada ≈ 30%*, *CPM de R$2–3* e *43–58% da entrega indo para 18–24*. Fui à conta de anúncios conferir os três. **Nenhum se sustenta nos dados de hoje.** Os três descrevem, com fidelidade razoável, como a conta se comportava na primeira semana de julho — e a conta mudou de comportamento em 19/07.

Isso não invalida os documentos. Invalida o **cronograma** deles: as semanas 1–3 estão reservadas para consertar uma etapa que já está funcionando, e a etapa que ninguém consegue ver é justamente a que entra no ar amanhã.

Resumo em uma linha: **o plano descreve julho; a conta já está em agosto.**

---

## 2. Os números reais

Janela: **últimos 30 dias encerrados em 18/08/2026**. Recortes por campanha, idade e posicionamento fecham todos no mesmo total (1.300 cliques / 1.085 páginas carregadas), então a leitura é internamente consistente.

| Etapa | Valor | Taxa |
|---|---|---|
| Investimento | R$ 2.161,79 | — |
| Impressões | 49.170 | — |
| Cliques no link | 1.300 | CTR 2,6% |
| **Página carregada (LPV)** | **1.085** | **83,5% dos cliques** |
| Clique no CTA de cadastro (`Lead`) | 131 | 12,1% de quem carregou |
| **Cadastros concluídos** | **0 medidos** | — |

| Custo | Valor |
|---|---|
| CPM | R$ 43,97 |
| Por clique no link | R$ 1,66 |
| Por página carregada | R$ 1,99 |
| Por clique no CTA | R$ 16,50 |

**Por dispositivo** — o único vazamento técnico que os dados sustentam:

| Dispositivo | Cliques | Página carregada | Taxa |
|---|---|---|---|
| Android | 1.160 | 1.009 | **87,0%** |
| iPhone | 131 | 69 | **52,7%** |

**Por idade** (impressões): 18–24 = **8,6%** · 25–34 = 32,3% · 35–44 = 23,9% · 45–54 = 27,2% · 55–64 = 8,0%. Dentro do alvo 25–64: **91,4%**.

**Por posicionamento:** 89% Instagram (feed 58%, reels 23%, stories 7%), 11% Facebook. CPM entre R$32 e R$66 conforme o posicionamento.

**Conjuntos:** `[07] Criativos Manual` está pausado. `[08] agosto 2026` está ativo, R$50/dia, lance sem limite, otimizando pelo evento `Lead` no pixel `1159381878670820`, expansão de público desligada (`smart_pse_enabled: false` — conforme a regra fixa), e em estado **`LEARNING`**.

---

## 3. As três premissas que caíram

### 3.1 "Chegada quebrada: ~30%, 70% da mídia evapora"

**Medido: 83,5%.** Acima do próprio limiar de alarme que o plano define no painel de segunda ("< 80% é bug, não otimização").

O número existiu, e era pior do que 83% — mas em julho, e **já foi consertado**:

| Período | Página carregada | CPM | Custo por clique |
|---|---|---|---|
| 07 a 13/07 | 63,0% | R$ 12,25 | R$ 0,11 |
| 20/07 a 18/08 | 83,5% | R$ 43,97 | R$ 1,66 |

A causa provável do salto está registrada nos próprios anúncios: os de julho apontavam para `matchhouse.com.br/go` — domínio sem `www` **e** com redirecionamento (`vercel.json` manda `/go` para `/`). Isso são duas idas e voltas de rede antes de a página começar a carregar, em celular, dentro do navegador do Instagram. Os anúncios de agosto apontam direto para `https://www.matchhouse.com.br/`. A taxa subiu 20 pontos.

Vale registrar o que isso faz com o teste que o documento de ajustes propôs na §4.1. A proposta era comparar GA4 contra pixel para saber se os 70% eram medição ou vazamento. **Metade do teste já está respondida:** o lado do pixel mostra 83,5%. Não há 70% para explicar. Se algum painel mostra 30%, o problema está naquele painel — não na chegada do usuário.

### 3.2 "CPM de R$2–3, 10× abaixo do benchmark B2B"

**Medido: R$ 43,97.** Não abaixo do benchmark B2B de R$15–35 — **acima** dele.

O R$2–3 é uma métrica real, lida na coluna errada: é o **custo por página carregada** (R$1,99 no geral, R$2,61 na campanha de agosto). Não é CPM.

A conclusão inverte, e a inversão importa. O plano lê "CPM baratíssimo" como sinal de que a mídia está sendo servida para gente errada e barata, e por isso manda auditar configuração antes de concluir qualquer coisa sobre público. O dado real diz o oposto: a entrega está **cara e estreita**, que é o perfil de quem compra atenção qualificada. Em toda a história disponível desta conta (começa em 07/07/2026), o CPM diário mais baixo foi R$9,19 — nunca chegou perto de R$2–3.

A intuição por trás da premissa não era boba, e tem endereço: em 07–13/07 o clique custava **R$0,11** e a taxa de chegada era 63%. Aquilo, sim, tinha cara de clique barato de baixa qualidade. A conta já saiu de lá.

### 3.3 "43–58% da entrega para 18–24, fora do alvo 25–64"

**Medido: 8,6%** das impressões em 18–24. **91,4% está dentro de 25–64.** A segmentação está entregando onde deveria.

---

## 4. O que continua de pé

A revisão crítica acertou o principal, e um dos acertos é o mais importante do conjunto.

**`Lead` não é cadastro — confirmado no código.** O `tracking.js` dispara `Lead` no clique de qualquer elemento marcado como CTA de cadastro, e todos os CTAs da LP apontam para `https://app.smartli.ink/` (`index.html`, linha 527). `Lead` sempre significou "clicou no botão".

Só que a leitura correta é mais dura do que a do documento. Não é que o número esteja *inflado em 2–3×*. É que **não existe nada depois dele**: `complete_registration` marca **zero** no período inteiro. Dos R$2.161 investidos, 131 pessoas atravessaram para o app — e o que aconteceu com as 131 nunca apareceu em lugar nenhum. Esse era o buraco, e é o único que os dados apontam.

**Segue de pé também:**

- **Não existe preço.** A ameaça 4 do plano tira conclusão de um input arbitrário (R$19,90). O trimestre precisa produzir o preço, não assumi-lo.
- **Não existe base de usuários.** O teste do desligamento e o perfil de entrevistado da seção 4 não têm de onde sair.
- **A ameaça 1 — nice to have — segue sendo a que mata**, e segue sem evidência em nenhuma direção.
- **A venda na mão para 10 corretores segue sendo a frente mais barata e a única que testa isso.** Não depende de volume, não depende de mídia, não depende de instrumentação. Depende de o fundador ligar para 10 pessoas.

---

## 5. A pergunta do trimestre, reescrita

O plano do Leo formula: *aumentar o volume de cadastros completos por dia e descobrir onde o funil quebra entre o clique e a conta criada.* A formulação está certa; a suposição embutida — de que a quebra está na chegada — não está.

O que os números mostram: a chegada entrega 83,5%, a LP converte 12,1% de quem chega em clique no CTA, e cada um desses cliques custa R$16,50. Daí para frente, escuridão.

Com a instrumentação do cadastro entrando no ar, a pergunta vira:

> **Quanto custa uma conta criada — e alguém paga por ela?**

A primeira metade fica respondida em duas semanas de campanha. A segunda não depende de campanha nenhuma: depende das 10 ligações.

---

## 6. O risco mecânico que precisa entrar no plano antes da campanha subir

O conjunto ativo está em **fase de aprendizado** (`LEARNING`). O Meta pede da ordem de **50 eventos de otimização por semana** por conjunto para sair dela. O `[08] agosto 2026` fez **29 `Lead` na última semana**.

Consequências, enquanto isso durar:

- a entrega não estabiliza, e o CPM oscila para cima (foi de R$41 para R$54–67 nos últimos dias da janela);
- **leitura por criativo é ruído.** Comparar criativo A contra B dentro da fase de aprendizado produz número, não informação.

E há uma implicação direta para amanhã: ao trocar o evento de otimização de "clique no CTA" para "registro concluído", o evento fica **mais raro**, não menos. Se 131 cliques de CTA em 30 dias já não sustentam 50 por semana, cadastros concluídos sustentarão menos ainda.

Isso não é motivo para não subir a campanha. É motivo para entrar sabendo de três coisas:

1. as duas primeiras semanas não vão dar leitura confiável por criativo — e tudo bem, porque não é isso que elas precisam produzir;
2. a métrica que essas semanas precisam produzir é uma só: **quantas contas criadas, a que custo**;
3. em algum momento é preciso decidir qual evento sustenta volume suficiente para a otimização funcionar. Existem caminhos (orçamento, evento intermediário, janela de atribuição), e eles têm trade-offs diferentes.

**Nada disso foi alterado e nada será alterado sem sua aprovação direta** — é a regra fixa. Está aqui como fato e risco, não como recomendação de execução.

---

## 7. Sequência revisada

A espinha do plano do Leo é mantida. O que muda é a ordem, e o que cada bloco precisa produzir.

### Semanas 1–2 · Ler a coluna que nunca existiu

Três frentes em paralelo, nenhuma exigindo mais mídia:

| # | Frente | O que responde |
|---|---|---|
| 1 | Funil diário completo: cliques → página carregada → CTA → **conta criada** | Quanto custa uma conta. Primeira vez que a última coluna existe. |
| 2 | Venda na mão para 10 corretores + as 5 perguntas da seção 4 | Alguém quer isso, e paga quanto? |
| 3 | Buraco do iPhone (52,7% contra 87,0% do Android) | Uma tarde. Vale ~10% dos cliques. |

A frente 2 é a que o plano original adia para as semanas 8–12 por falta de volume. Ela não depende de volume. É a mais barata das três e a única que testa a ameaça que mata a empresa.

### Semanas 3–5 · Decidir com a coluna na mão

Só aqui se decide se o trabalho é **técnico** (webview, OAuth, login por WhatsApp) ou de **relevância** (público, mensagem, oferta). O plano original aposta no primeiro sem ter descartado o segundo; agora existe o dado que decide.

É também aqui que o preço vira trabalho: com o CAC observado, inverter o simulador — em vez de fixar preço e ver se fecha, fixar o CAC e perguntar qual combinação de ticket e churn fecha. O resultado é alvo a validar, não veredito.

### Semanas 5–10 · Expandir entrada

Mantido como está no plano do Leo: inventário de criativos de 3 para 8, 9:16 vertical. Com uma correção de leitura: a auditoria de configuração que o plano coloca aqui **já foi feita** — está na seção 2 deste documento, e o resultado é que a configuração não é o problema.

### Semanas 8–12 · Primeiro olhar no pós-cadastro

Mantido. Onboarding por caso de uso, importação de imóvel por link, leitura de abandono na conversa da IA.

---

## 8. Painel de segunda — corrigido

As seis métricas do plano, com os limiares ajustados ao que foi medido.

| Métrica | Dispara ação quando |
|---|---|
| Clique → página carregada, **por dispositivo** | Android < 80% ou iPhone < 60%. O número agregado (83,5%) já passa e esconde o problema do iPhone. |
| Página → clique no CTA | Cair abaixo de 10%. Hoje: 12,1%. |
| **Clique no CTA → conta criada** | **Métrica nova. É a que faltava.** Sem alvo ainda — as duas primeiras semanas produzem o baseline. |
| Contas criadas por dia | Não crescer por 2 semanas com criativo novo no ar |
| **Custo por conta criada** | **Métrica nova.** Baseline hoje: R$16,50 por clique no CTA. O custo por conta é esse número dividido pela taxa que ainda não conhecemos. |
| Custo por clique no CTA, por criativo | Variar >30% sem mudança conhecida — **e só depois de sair da fase de aprendizado** |

---

## 9. O que eu não verifiquei

Para não passar por certeza o que não é:

- **GA4 não está conectado.** A terceira coluna do teste de medição (sessões de GA4 contra cliques do Meta) segue faltando. Se algum painel mostra 30% de chegada, é ali que está a discrepância — o lado do pixel já respondeu 83,5%.
- **Só uma conta de anúncios está conectada.** Se houver outra conta ativa, estes totais são parciais.
- **Os fatos sobre o WhatsApp Business AI** (lançamento no Brasil em fev/2026, banimento de bibliotecas não oficiais) não foram checados de forma independente. Toda a conclusão da §3 do documento de ajustes — de que a oportunidade 6.1 nasceria competindo com grátis e nativo — se apoia neles. Vale confirmar antes de virar decisão.
- **`LPView` e `ScrollDepth` aparecem com zero conversões**, embora o `tracking.js` dispare os dois. A explicação mais provável é falta de conversão personalizada configurada no Gerenciador de Eventos, não defeito no código — mas não confirmei.
- **Janela de atribuição:** os números saem da atribuição padrão da conta. Mudanças de janela mexem nos totais, não nas proporções entre etapas.

---

## 10. Resumo em uma linha

A chegada não está quebrada e a mídia não está barata — o que faltava era enxergar o cadastro, e isso entra no ar agora. O trimestre é sobre descobrir **quanto custa uma conta criada e se alguém paga por ela**, não sobre consertar uma esteira que já entrega 83%.
