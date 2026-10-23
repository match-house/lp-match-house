# Semana desbloqueada da Camila: como publicar cada horário

Combinado com o Mateus em 22/10, à noite ("Pode", "ok, segue com modo desbloqueado",
"vou deixar vc fazendo e amanha de manha checamos tudo"). Base: a revisão de 22/10 do
Claude Design, com os ajustes dele (o "assinante Pro" junto da frase do contato que
chega na hora; cadeado aberto nas peças paradas, fechado só no ep. 1; Espírito Santo
fora; datas reais desta semana; a Camila sempre como personagem, com "Exemplo").

Tudo está em `legendas.json` desta pasta: horários (`slots`), legendas, textos dos
anúncios e o endereço público das artes (`base_url`, commit 27e59bf). As artes ficam
em `anuncios/organico/semana/` da branch de trabalho, e a fonte em `anuncios/fonte-semana/`.

## Em cada horário (a rotina manda o id: t1, t2, e1 a e7)

0. Antes de publicar, ler a conversa: se o Mateus pediu para mudar ou parar aquele
   episódio, fazer o que ele pediu (refazer a arte, commitar de novo e usar o novo
   hash). Se ele mandou parar a semana, não publicar e avisar.
1. Story: Windsor `instagram`, conta 17841456747581112, `create_story` com
   `image_url` = base_url + story (no e6, `video_url` = base_url + e6-reels.mp4).
2. Post: `create_image_post` com `image_url` = base_url + post e `caption` =
   legendas[id]. No e6: `create_video_post` com `video_url` = base_url + e6-reels.mp4,
   `cover_url` = base_url + e6-capa.jpg, `caption` = legendas.e6 e `share_to_feed` true.
3. Anúncio (só quando o slot tem `anuncio: true`): Windsor `facebook`, conta
   450532434323918, `create_ad` no conjunto 120252905491280445 (campanha 13), status
   active, com `creative.object_story_spec.page_id` 261171503755179 e
   `asset_feed_spec` igual ao modelo do `meta-auto/LEIA-ME.md`:
   - imagens base_url + `<id>f.jpg` (adlabel `feed_<id>`) e base_url + `<id>s.jpg`
     (adlabel `story_<id>`);
   - `bodies` = anuncios[id].texto, `titles` = anuncios[id].titulo;
   - link = link_app + `13-<id>-story-app`, botão SIGN_UP;
   - `asset_customization_rules`: stream com feed_<id> (prioridade 1); story e reels
     com story_<id> (prioridade 2).
   No e2 (`ligar_campanha_13`): conferir que os anúncios 13a (120252905496920445)
   e 13b (120252905499330445) continuam pausados, depois `enable_adset`
   120252905491280445 e `enable_campaign` 120252905488250445 (R$ 40/dia). O teto
   somado continua em R$ 100/dia: app 50 + 13 40 + seguidores 10.
   No e7: pausar o anúncio do e2 (`pausar_anuncio`), para ficarem no máximo 3 ativos.
   Se a Meta recusar um anúncio, anotar em `meta-auto/estado.json` (reprovacoes) e
   seguir com o orgânico.
4. Anotar em `meta-auto/estado.json`: organico.posts (id, media_id, hora), anuncios
   (nome, ad_id, utm_content, campanha "13") e log.
5. Avisar o Mateus em 1 ou 2 linhas, em primeira pessoa: o que saiu e, se houve,
   o anúncio. Nos horários da madrugada e da noite (e1, e3, e5), mensagem curta.

## Durante a semana (23 a 28/10)

- A rotina do Instagram orgânico das 09h17 não publica o calendário dela nesses
  dias: só responde comentários e mede. A série da Camila é a programação da semana.
- Segunda, 26/10: na campanha 14 de seguidores, trocar o reel da Camila pelo post da
  semana com mais alcance, se for outro (passo a passo no LEIA-ME).
