# Meta no automático (decisão do Mateus, 22/10/2026)

Pergunta dele: "como podemos automatizar as campanhas na meta? digo, gerar novos
criativos e subir varios, pausar e destivar os que nao performam e perseguir uma
escala alta para ter custo igual ou menor do que o chatgpt? queria te dar
autonomia para isso".

Respostas dele, 22/10:
1. Religar a Meta: "sim" (com criativos novos; a primeira leva vem do Fable).
2. Teto: "100,00/dia".
3. Meta e freio: "Isso 40 e pausa se passar de 120" (R$ 40 por corretor que
   publicou; pausa tudo se os 7 dias passarem de R$ 120).
4. Criativos: "pode subir e ligar direto e me manda para eu checar depois. mas
   vc vai ter autonomia para agir.. confio em vc, estmaos juntos."

Estado vivo em `estado.json` (só no scratchpad: tem gasto, que é número da
empresa; o repositório é público). Se sumir, recriar pelo Windsor (estado dos
anúncios) e pela seção "Meta no automático" do CLAUDE.md.

## Onde

- Conta 450532434323918, página 261171503755179.
- Campanha do app 120252349246370445 (orçamento na campanha, centavos), conjunto
  120252351113480445. Segmentação manual (nunca Advantage+). Evento Lead do
  pixel 1159381878670820 sem renomear.
- **Nunca no Espírito Santo** (Mateus, 22/10: "nao quero que a campanha da meta
  rode no espírito santo"). Todo conjunto, inclusive o de seguidores, leva
  `"excluded_geo_locations": {"regions": [{"key": "445"}]}` (445 = Espírito
  Santo, conferido na própria conta). No `update_adset` o `targeting` substitui
  o objeto inteiro: mandar tudo de novo, com `advantage_audience: 0`.
- Pausa noturna 23h13–07h13 pela regra do Gerenciador (religa os conjuntos).
- **Campanha 13, Modo Desbloqueado** (Mateus, 22/10: "vamos usar para trafego
  pago tb blza"), a campanha do Claude Design. Campanha 120252905488250445,
  R$ 40/dia na campanha, conjunto 120252905491280445 (cópia do conjunto do app,
  para herdar o anunciante verificado; o `create_adset` pela API é recusado sem
  ele, então conjunto novo sempre por `duplicate_adset`). Anúncios 13a
  120252905496920445 e 13b 120252905499330445, utm_campaign
  `MH_2026_10_desbloqueado`. Regras por anúncio iguais às do app; a verba fica
  em R$ 40 até a leitura de 29/10 (comparar custo por corretor que publicou com
  a do app).
- **Teto é a soma:** app + 13 + seguidores nunca passam de R$ 100/dia. Hoje
  R$ 50 + R$ 40, e R$ 10 de seguidores a partir de 26/10. A subida de 20%
  de uma só cabe no que sobra do teto.

## Regras do dia (rotina das 07h37)

Números da Meta sem imposto no Windsor; para custo por corretor, somar 13,83%.
Contas por `utm_content` (`<criativo>-story-app`) no /backoffice/signups, com
a ORIGEM_CORRIGIDA e o INTERNOS do `custos/cac.py`.

Por anúncio (desde que entrou):
1. Gastou R$ 30 e nenhuma conta: pausar.
2. Gastou R$ 80 e ninguém publicou: pausar.
3. Entre os que passaram de R$ 30: custo por conta concluída acima de 2x o do
   melhor: pausar o pior.
4. Nunca deixar o conjunto com menos de 2 anúncios ativos sem substituto: se a
   regra pausaria o penúltimo, criar criativo novo antes (rotina de criativos)
   ou esperar.
5. Reprovado pela Meta: anotar o motivo em `reprovacoes` e não reenviar o mesmo.

Verba (na campanha):
- Custo por corretor que publicou nos últimos 7 dias, com imposto, só da
  campanha do app.
- Até R$ 40, com pelo menos 3 que publicaram nos 7 dias e a última mudança há
  3 dias ou mais: subir 20% (arredondar para R$ 5), sem passar do teto
  somado (R$ 100 menos as outras campanhas).
- De R$ 40 a R$ 120: manter. Se passar de R$ 70 em duas leituras seguidas,
  voltar à verba anterior.
- Acima de R$ 120, com pelo menos R$ 150 gastos nos 7 dias: pausar a campanha
  e avisar o Mateus na hora.
- A Meta recusa mudança de verba muito seguida: no máximo uma por dia.

Depois de agir: gravar em `estado.json` (`log`) e mandar ao Mateus 2 a 4 linhas
com o que mudou e o número que justificou. Sem mudança: silêncio (vai no
relatório diário).

## Criativos novos (segunda e quinta, 08h17)

- Quando houver menos de 3 anúncios ativos, ou um foi pausado desde a última
  rodada: criar 2 ou 3 novos (no máximo 3 por rodada).
- Ângulos: `fila` do `estado.json`; briefing
  https://claude.ai/artifact/1FpGjLzGwcr3ksukDgSpRC; o que aparecer nas
  mensagens dos corretores (`mensagens-vistas.json`) e no Amplitude (o que mais
  usam no app). Só insight geral: nunca nome nem dado de corretor no anúncio.
- Regras de texto do CLAUDE.md (nunca grátis/gratuito, nunca "30 leads", a IA
  atende os clientes que já chegam ao corretor, nada que não exista, exemplo
  fictício com selo "Exemplo", sem número de resultado como promessa, sem
  domínio escrito no texto).
- Artes: 1080x1350 (feed) e 1080x1920 (story), HTML renderizado com Playwright
  (modelo em `scratchpad/criativos11/render.mjs` e `render45.mjs`; cópia em
  `anuncios/fonte-11/` da branch de trabalho). Conferir cada PNG olhando.
- Subir: commitar os PNGs em `anuncios/` da branch
  `claude/cheque-campanha-numeros-ivhccq` (só arte, nada de número) e usar o
  endereço raw com o hash do commit. Nome do anúncio
  `[12] 12a <ideia> (feed 4x5 + story 9x16)`; utm_content `12a-story-app`.
- Modelo do create_ad (o mesmo dos 11):

```json
{"adset_id":"120252351113480445","name":"[12] 12a <ideia> (feed 4x5 + story 9x16)","status":"active",
 "creative":{"object_story_spec":{"page_id":"261171503755179"},
  "asset_feed_spec":{
   "images":[{"url":"https://raw.githubusercontent.com/match-house/lp-match-house/<commit>/anuncios/12a-<ideia>-4x5.png","adlabels":[{"name":"feed_12a"}]},
             {"url":"https://raw.githubusercontent.com/match-house/lp-match-house/<commit>/anuncios/12a-<ideia>-9x16.png","adlabels":[{"name":"story_12a"}]}],
   "bodies":[{"text":"<texto>"}],"titles":[{"text":"<título>"}],
   "link_urls":[{"website_url":"https://app.smartli.ink/?utm_source=meta&utm_medium=cpc&utm_campaign=MH_2026_09_app&utm_content=12a-story-app"}],
   "call_to_action_types":["SIGN_UP"],"ad_formats":["SINGLE_IMAGE"],"optimization_type":"PLACEMENT",
   "asset_customization_rules":[
    {"customization_spec":{"publisher_platforms":["instagram"],"instagram_positions":["stream"]},"image_label":{"name":"feed_12a"},"priority":1},
    {"customization_spec":{"publisher_platforms":["instagram"],"instagram_positions":["story","reels"]},"image_label":{"name":"story_12a"},"priority":2}]}}}
```

- Freio: 2 reprovações na mesma semana, parar de subir novos e avisar o Mateus.
- Depois: mandar ao Mateus os nomes, o texto e as artes (SendUserFile), para ele
  checar depois.

## Semana (segunda, junto com os criativos)

- Comparar Meta x ChatGPT nos 7 dias: gasto, contas, concluíram, publicaram,
  custo por conta e por corretor que publicou.
- Atualizar a `fila` de ângulos com o que funcionou e o que apareceu nas
  mensagens e no Amplitude.

## Instagram orgânico e seguidores (Mateus, 22/10: "Pode ser assim! otimo")

O que ele aprovou, em resposta à proposta do mesmo dia:
- Campanha de seguidores: R$ 10/dia DENTRO dos R$ 100/dia (a do app + a de
  seguidores nunca passam de R$ 100 somadas), impulsionando o melhor post da
  semana.
  [22/10: pela API, `create_adset` pede o anunciante verificado
  (`regional_regulation_identities` com `universal_beneficiary` e
  `universal_payer`, ids de Configurações do negócio > Identidades
  verificadas). Pedidos ao Mateus em 22/10; sem eles, o conjunto de seguidores
  não nasce pela API.]
- **Campanha 14 de seguidores, no ar desde 22/10, 20h45** (Mateus: "vamos comecar
  agora"): campanha 120252906629350445 (OUTCOME_TRAFFIC, R$ 10/dia na campanha),
  conjunto 120252906629990445 (destino perfil do Instagram, cópia de um conjunto
  antigo de visitas ao perfil; o Mateus pôs o beneficiário e pagador à mão).
  Público igual ao do app, sem ES e sem Advantage+. Troca semanal do post:
  vídeo do Instagram precisa subir antes com `create_ad_video` (URL raw), e o
  anúncio vai com `creative.object_story_spec` (page_id, instagram_user_id
  17841456747581112, video_data com video_id, image_url da capa, message e
  call_to_action {"type":"VIEW_INSTAGRAM_PROFILE"}). Outro botão é recusado.
  Foto: `source_instagram_media_id` serve direto. Pausar o anúncio anterior.
- Orgânico: publico direto e mostro depois, como nos anúncios.
- Ritmo: 3 posts no feed por semana (seg, qua, sex), story todo dia útil e
  1 reels por semana (terça).
- Temas: dicas para o corretor (bio, QR na placa, responder rápido), o Smart
  Link funcionando com o exemplo da Camila (selo "Exemplo"), novidades (Pro,
  Indique e Ganhe). Mesmas regras de texto dos anúncios; a legenda termina com
  o convite para o link da bio.

Como publicar (Windsor, conector `instagram`, depois que o Mateus conectar o
@matchhouse.br):
- `create_image_post` (feed, JPEG até 8 MB, 4:5), `create_carousel_post`
  (2 a 10 JPEG), `create_story` (JPEG 9:16 ou vídeo de 3 a 60 s),
  `create_video_post` (reels, MP4 9:16, `share_to_feed` true).
- O Instagram só aceita JPEG: renderizar com Playwright em JPEG (ou converter
  com ffmpeg). Endereço público: raw do GitHub, pasta `anuncios/organico/` da
  branch de trabalho (só arte).
- Reels: montar com ffmpeg (há `ffmpeg` no ambiente e os scripts do vídeo da
  Camila em `scratchpad/demo/`: `gravar.mjs`, `montar-video.sh`), 15 a 30 s.
- Depois de cada post: mandar ao Mateus a arte e a legenda (SendUserFile), e
  anotar em `estado.json` (`organico`).

Seguidores:
- Toda segunda, escolher o post de feed da semana com mais alcance e
  interações (leitura do conector `instagram`) e impulsionar por 7 dias com
  R$ 10/dia: campanha OUTCOME_ENGAGEMENT, conjunto com destino no perfil
  (FACEBOOK_PAGE + PROFILE_AND_PAGE_ENGAGEMENT, botão VISIT_PROFILE) e a mesma
  segmentação manual do conjunto do app (nunca Advantage+), e `boost_post`.
- Medir: seguidores ganhos, custo por seguidor e contas com
  `utm_source=org-instagram` (link da bio).
- Se a verba do app estiver em R$ 100, a de seguidores só entra se a do app
  descer para R$ 90 (o teto é a soma).
