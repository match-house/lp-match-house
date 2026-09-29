# Guia para responder corretor: o que o app faz, com o nome de cada botão

Levantado no código do app (repo `app`, `main` em 2d4aca6, 29/09/2026).
Serve para responder no WhatsApp 6800 e por e-mail. **Só ensinar o que está
aqui.** Se a pessoa pedir algo que não está no guia, conferir no código antes
de responder. Não pode inventar botão nem prometer recurso.

Quando o app mudar (PR novo no `app`), atualizar este arquivo.

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
| Corrigir um imóvel, pôr fotos | Imóveis → lápis | app.smartli.ink/dashboard/imoveis/<id>/editar |
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
- **"Localização":** "Digite o CEP e o resto vem sozinho". Tem "Bairro",
  "Cidade" etc.
- **"Valores":**
  - "Valor de venda" (ou "Valor do aluguel");
  - "Condomínio (mensal)", "IPTU (anual)".
- **"Fotos e mídia":**
  - até 20 fotos; a primeira é a capa;
  - "Vídeo (YouTube ou link direto)" e "Tour virtual 360°".
- **"Publicação":** chaves "Anúncio ativo" e "Ocultar anúncio".

**Botões de baixo:**

- **"Salvar rascunho"**;
- **"Publicar imóvel →"**, que vira **"Salvar alterações →"** quando o imóvel
  já está publicado.

**IA nos textos:** na edição aparecem "Gerar nome com IA", "Gerar descrição
com IA" (ou "Reescrever com IA") e "Gerar com IA a partir do endereço". Só
aparecem se a conta tiver IA. **No cadastro novo não aparecem.**

**Fotos: como ensinar certo**

- Toque num espaço → escolhe a foto do celular.
- Num imóvel sem foto, **a primeira foto escolhida vira a capa**, qualquer
  que seja o espaço tocado. Então: escolher primeiro a foto principal, depois
  as outras, na ordem desejada.
- **Não dá para mudar a ordem arrastando.** O texto "Foto de capa — arraste
  aqui" aparece na tela, mas o app não tem essa função.
  - Erramos isso com a Juceli em 29/09.
  - Nunca prometer reordenar.
- Tocar numa foto que ainda não foi salva troca a foto.
- Trocar a capa **depois de salvar** não é simples: a foto nova vai para o
  fim da galeria. Se o corretor pedir isso, olhar o caso antes de responder.
- Não há botão de apagar uma foto.

**Pegadinhas:**

- **"Salvar rascunho" num imóvel publicado tira ele do ar**: o imóvel volta
  para "Rascunhos". Para corrigir imóvel publicado, o botão certo é "Salvar
  alterações →".
- Ao editar um imóvel publicado, o selo do topo mostra "● Rascunho" mesmo ele
  estando no ar. Se ele estranhar, é isso; o imóvel continua no ar.
- Nada é obrigatório para publicar, mas quanto mais completo, melhor a IA
  responde. O app diz: "Quanto mais completo o cadastro, melhor sua IA atende
  e qualifica cada lead."

### Lista (app.smartli.ink/dashboard/imoveis)

- Os publicados aparecem com "● Ativo" e três ícones: compartilhar, lápis
  (editar) e lixeira.
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
