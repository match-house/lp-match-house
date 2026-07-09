# Match House — Design System

> **Marca:** Match House®
> **Tagline:** *Desbloqueie seu mundo*
> **Produto:** **Smart Link com IA** — "Sua IA no link da bio". Transforma o link da bio do corretor em uma central de atendimento inteligente que atende clientes 24/7: mais conexões, mais negócios.
> **Site:** [www.matchhouse.com.br](https://www.matchhouse.com.br) · App: Google Play + App Store

Match House é uma **plataforma de tecnologia e infraestrutura digital** para agentes imobiliários do **segmento premium** (imóveis a partir de R$ 1 milhão). **Não é imobiliária, não é portal, não é agência de geração de leads** — não intermedia vendas. O objetivo é aumentar a **produtividade e a autoridade** do corretor, profissionalizando sua operação independente.

O coração do produto é o **Smart Link**: uma vitrine digital de alto padrão num único link inteligente, que centraliza os imóveis, redes sociais e WhatsApp do corretor, usando IA para gerar descrições profissionais, qualificar leads e responder 24/7 — com o **nome e o tom de voz do próprio corretor**.

**Provas / números da marca:** +1.000 corretores · imóveis R$ 1 milhão+ · primeiro imóvel publicado em ~2 minutos.
**Planos:** GO R$ 14,90/mês (3 imóveis) · Flow R$ 47/mês (50 imóveis — *mais escolhido*) · Imobiliárias sob consulta.

Este design system traduz o brandbook oficial + o posicionamento atual do produto em tokens, componentes e exemplos prontos para construir interfaces (web, mobile, materiais) consistentes com a marca.

---

## Sources

| Source | Onde está | Notas |
|---|---|---|
| Brandbook PDF (oficial) | `uploads/Brandbook - VF (Diretrizes Match House).pdf` | 56 páginas. Logo, cultura, cores, tipografia, iconografia, identidade verbal, exemplos. |
| Site / produto atual | [www.matchhouse.com.br](https://www.matchhouse.com.br) | Posicionamento, copy de marketing, planos e preços, FAQ. Fonte da seção Content Fundamentals. |
| Páginas-chave renderizadas | `uploads/pdf_pages/p*.png` | Logo (p07–p11), cores (p24), ícones (p35), exemplos (p42–p47) |
| Logos extraídos | `assets/logo-symbol.png`, `assets/logo-compact.png`, `assets/logo-symbol-full.png` | Recortes em alta resolução do PDF |
| Tokens CSS | `colors_and_type.css` | Variáveis para cores, tipografia, espaçamento, sombras, motion |

> ⚠️ **Sobre fontes:** auto-hospedadas em `fonts/` (Poppins + Helvetica Now Display, fornecidas pela marca). `colors_and_type.css` declara os `@font-face` — sem dependência de CDN.

> ⚠️ **Sobre o ícone (symbol):** o PNG extraído (`logo-symbol.png`) é raster. **Peça ao usuário o arquivo vetorial (.svg / .eps)** — o brandbook menciona que esses formatos foram entregues.

> ⚠️ **Cores no PDF:** as páginas 24 e 26 listam os hexes ao lado dos swatches mas algumas etiquetas estão **com erro de digitação** (cyan e cinza aparecem rotuladas como `#000f90`). Os valores corretos foram extraídos por amostragem direta do PDF: `#00073e`, `#000f90`, `#00efff`, `#f1f1f1`.

---

## Índice deste design system

```
README.md                  ← você está aqui
SKILL.md                   ← entrypoint para uso como Agent Skill
colors_and_type.css        ← variáveis CSS (tokens) + estilos semânticos
assets/                    ← logos, símbolo, marcas
preview/                   ← cards individuais que aparecem na aba Design System
ui_kits/
  └── linkbio/             ← Link da Bio + IA do corretor (HTML + JSX)
uploads/                   ← brandbook original + páginas extraídas
```

---

## Content Fundamentals

> Como a marca fala. Fonte: Sessão 06 – Identidade Verbal do brandbook.

**Atributos do tom de voz:**
1. **Claro e com propriedade** — fala com precisão, evita jargão e enrolação, sempre bem embasada mas fácil de entender.
2. **Inovador com propósito** — sem promessas vazias nem clichês. A inovação tem um alvo claro: derrubar barreiras no mercado imobiliário.
3. **Próximo e Humano** — fala com empatia. O corretor é tratado como parceiro; o cliente, como alguém único.
4. **Inspirador** — empoderadora mas não impositiva, inspiradora mas não inalcançável. Sofistica sem soar inalcançável.

**Pessoa / endereçamento.** A marca fala em **primeira pessoa do plural** ("acreditamos", "somos uma plataforma de tecnologia") quando se apresenta institucionalmente, e em **segunda pessoa direta** ("você", "seu", "sua" — nunca "vocês") quando endereça o corretor. Trata o corretor como **protagonista autônomo**: alguém que decidiu ter "mais autonomia e praticidade". Nunca como "usuário", "lead" ou alguém que precisa ser resgatado.

**Registro.** No site, o tom é **direto e orientado a benefício**, em ritmo de SaaS: frases curtas, muitos **imperativos de empoderamento** ("Transforme", "Desbloqueie", "Crie", "Otimize", "Multiplique"). O verbo de ação está sempre do lado do corretor — *ele* transforma, *ele* desbloqueia. A marca é a ferramenta que habilita, não a heroína.

**Caixa.** O wordmark é sempre `match house` em **caixa baixa** (mesmo o ®). Títulos em sentence case ou Capitalized. ALL CAPS só em microtipos (overlines, eyebrow, badges) e em ênfases pontuais de destaque ("IA com SEU NOME", "ESCOLHIDO POR MAIS DE 1.000"). Nomes de produto e planos em Capitalized: **Smart Link**, **GO**, **Flow**.

**Setas e navegação verbal.** O brandbook usa setas (`→`, `↘`, `↙`, `↗`) como marcadores tipográficos para indicar continuidade ou direção de leitura. **Use com moderação como elemento de UI** — funciona bem em CTAs ("Transforme seu link da bio agora →") e títulos com subtítulo ("Conceito da Paleta ↘").

**Pontuação decorativa.** Os títulos de sub-seção usam o padrão `Sessão XX → Sub-seção`. Replicável em breadcrumbs.

**Numerais em listas.** O brandbook usa numerais circulados / em estilo old-style (`①, ②, ③, ④` ou `❶, ❷, ❸`) para enumerar valores e atributos. É uma marca de estilo discreta — use quando quiser dar densidade tipográfica a uma lista curta de 3–5 itens.

**Emoji:** essencialmente **não usa**. A marca é sóbria; setas e símbolos tipográficos (®, →, ↘) substituem qualquer função decorativa. A única exceção observada no produto é a estrela `⭐` no badge "Mais escolhido" do plano Flow — um selo, não decoração de texto. Não introduza outros emoji.

**O que a marca NÃO é (frame de descrição — vem do FAQ do site).** Sempre que descrever a Match House, deixe claro o que ela **não** é: não é imobiliária, não é portal imobiliário, não é agência de geração de leads, não intermedia vendas. É **plataforma de tecnologia e infraestrutura digital**. Isso é parte central da mensagem — protege o posicionamento de "ferramenta do corretor independente".

**Vibes.** Premium acessível. Tecnologia que profissionaliza sem intimidar. Não é "tech bro" nem corporativo cinza — é elegante, claro e prático. "Respostas claras, sem complicação."

**Mensagens-pilares (copy real do produto — use como banco de calibragem):**

- **Headline mestre:** *"Sua IA no link da bio."*
- **Subheadline:** *"Transforme seu link da bio em uma central de atendimento inteligente que atende seus clientes 24/7: mais conexões, mais negócios."*
- **Produto:** *"Smart Link com IA: tudo em um só lugar."* · *"Link na bio com IA: gestão inteligente de leads e imóveis."*
- **Mantra/assinatura:** *"Desbloqueie seu mundo."* · na seção de planos: *"Desbloqueie seu potencial."*
- **Prova social:** *"ESCOLHIDO POR MAIS DE 1.000 corretores que decidiram ter mais autonomia e praticidade para atender seus clientes."*
- **Promessa de detalhe:** *"inteligência em cada detalhe."*
- **FAQ (tom institucional):** *"Não. Somos uma plataforma de tecnologia e infraestrutura digital. O nosso objetivo é aumentar a produtividade e a autoridade do corretor…"*
- **Tagline de seção de suporte:** *"Respostas claras, sem complicação."*
- **CTA padrão:** *"Baixar app e assinar"* · *"Transforme seu link da bio agora"*

**Diferenciais a destacar (do produto):** IA com o nome do corretor · escolha do tom de voz · textos profissionais gerados por IA · qualificação automática de leads 24/7 · botão WhatsApp + redes · painel de performance · publicação em ~2 min · foco em imóveis R$ 1M+.

**Vocabulário central a privilegiar:**
IA / inteligência artificial, Smart Link, link da bio, automação, qualificação de leads, atendimento 24/7, autonomia, praticidade, produtividade, autoridade, profissional, desbloquear, oportunidade, alto padrão, premium, performance, "seu nome", "seu tom de voz".

**Vocabulário a evitar:**
"melhor da categoria", "líder de mercado", "revolucionário", "transformação digital", "disruptivo", "ecossistema" — clichês corporativos. Evite também posicionar a Match House como **imobiliária, portal ou geradora de leads** — ela é plataforma de tecnologia. E nada de "venda agressiva" / urgência falsa ("última chance", etc).

---

## Visual Foundations

> O guarda-roupa visual da Match House. Fonte: Sessões 01, 03, 04, 05 do brandbook + análise das aplicações da Sessão 07.

### Cores

A paleta institucional é **enxuta de propósito**: quatro cores, cada uma com um papel claro.

| Cor | Hex | Papel |
|---|---|---|
| **Navy** | `#00073e` | Texto primário, fundos escuros, sombras profundas, "ink" da marca |
| **Blue** | `#000f90` | Cor de marca principal, preenchimentos sólidos, CTAs, fundos chapados |
| **Cyan** | `#00efff` | Acento "desbloqueio" — highlights, marcadores ativos, glow, gradiente |
| **Paper** | `#f1f1f1` | Fundo padrão de superfícies claras (não usar branco puro como bg principal) |

**Regra de balanço:** o brandbook é explícito — "utilizar essas cores de forma equilibrada é fundamental". Em interfaces, o **azul navy + paper** dominam (~80%), o blue serve como cor de ação (~15%), e o **cyan é um acento de no máximo 5%** — usado para indicar "live / AI ativo / desbloqueado". O cyan sobre-utilizado fica neon, fora do tom premium.

**Combinações permitidas** (Sessão 03 → Sobreposições): cyan sobre blue ✅ ; blue sobre navy ✅ ; navy sobre paper ✅ ; cyan sobre navy ✅ (alto contraste, use para "spotlights"). **Não use** blue sobre navy se for texto (contraste insuficiente).

### Gradientes (signature)

O **gradiente brand** é talvez o motivo mais forte da identidade: corre de navy (top-left) → blue (centro) → cyan (bottom-right). Aparece como fundo de hero, no símbolo, em avatares e em superfícies premium.

```css
background: var(--mh-gradient-brand);
/* linear-gradient(115deg, #00073e 0%, #000f90 45%, #00efff 100%) */
```

Variações disponíveis em `colors_and_type.css`: `--mh-gradient-brand`, `--mh-gradient-brand-soft`, `--mh-gradient-symbol`, `--mh-gradient-radial`.

### Tipografia

**Duas famílias auto-hospedadas** (arquivos em `fonts/`, fornecidos pela marca):

- **Helvetica Now Display** — família de **display**: wordmark, headlines grandes, números de destaque (preços). Pesos: Regular 400, Bold 700, ExtraBold 800, Black 900. Token: `var(--font-display)`.
- **Poppins** — família de **texto/UI**: corpo, labels, captions, botões, a maior parte da interface. 10 pesos (100→900) + itálicos. Token: `var(--font-sans)`.

Geométrica + neo-grotesca: a Poppins traz a clareza humana e amigável; a Helvetica Now Display dá o peso sofisticado e cortante aos títulos. Use display **só** em headlines / wordmark / números-herói — todo o resto é Poppins.

- **Display / títulos hero:** Helvetica Now Display ExtraBold 800, tracking `-0.02em`.
- **H1:** Helvetica Now Display Bold 700.
- **H2–H3 / subtítulos:** Poppins SemiBold 600.
- **Corpo:** Poppins Regular 400, line-height 1.45–1.6.
- **Microtipos / overlines:** Poppins SemiBold 600 ALL-CAPS, tracking `0.12em`.

**Restrições do brandbook (Sessão 04, "Usos Incorretos"):**
- ❌ Não justifique texto.
- ❌ Não use tracking apertado (letter-spacing negativo agressivo).
- ❌ Não use line-height muito apertado.
- ❌ Não estique, distorça ou contornee.
- ❌ Não use outras famílias.

### Backgrounds

Três tratamentos canônicos:

1. **Paper plano (`#f1f1f1`)** — superfície padrão de UI, sempre. Branco puro só dentro de cards.
2. **Brand gradient full-bleed** — heros, telas de boas-vindas, separadores entre seções, modais celebratórios. O gradiente é "molhado", denso, sem ruído.
3. **Foto através de máscara M** — motivo proprietário (ver p32, p35 do brandbook): uma foto é recortada na silhueta da letra "M" do logo, sobre fundo blue. Use sparingly — peças hero institucionais.

Sem padrões repetidos, sem texturas, sem ruído/grão. A marca não usa ilustrações decorativas — confia no logo, nas cores e em fotografia real.

### Fotografia

> Sessão 05 → "Luz natural, composições equilibradas, tons realistas. Estética moderna e acolhedora. Pessoas, ambientes e detalhes que expressem confiança, elegância e propósito — sempre em contextos que representem a conexão entre pessoas e imóveis."

Em código/protótipos sem fotos disponíveis: deixe um slot vazio com gradient placeholder (não invente uma SVG de "casa").

### Animação

Tom: **intencional, sem pressa, sem bounce**. A marca é sóbria — não use `cubic-bezier` elástico ou easings de "rebote".

- Easing canônico: `cubic-bezier(0.2, 0.7, 0.2, 1)` (`--ease-out`) para entradas, `cubic-bezier(0.65, 0, 0.35, 1)` (`--ease-in-out`) para transições contínuas.
- Durações: 120ms (microinterações), 200ms (hover/state), 360ms (transições de página), 600ms (revelações deliberadas).
- Padrão preferido: **fade + leve translate** (4–8px). Evite scale > 1.05 e nunca rotacione o logo (proibido pelo brandbook).
- Loading: barra de progresso fina cyan sobre navy, ou pulsar do cyan glow (Box-shadow). Sem spinners genéricos.

### Hover & Press

- **Hover (botão sólido):** fundo escurece 8–10% (use overlay `rgba(0,7,62,0.08)` por cima ou cor mais escura na escala).
- **Hover (botão fantasma):** fundo vai de transparente para `--mh-paper`.
- **Hover (link):** cor vai de `--mh-blue` para `--mh-navy`; sublinhado se torna sólido.
- **Press:** translate-y de 1px e shadow reduzida. **Não use scale-down** ("squeeze") — fica brincalhão demais para a marca.
- **Focus visible:** ring duplo — `0 0 0 2px var(--mh-paper), 0 0 0 4px var(--mh-cyan)` — o cyan é a cor canônica de "atenção".

### Bordas

- Bordas neutras: 1px `var(--border-subtle)` (cinza muito claro).
- Bordas marcadas: 1px `var(--mh-navy)` em estados elevados, 2px em estados de erro/sucesso.
- Cards padrão: **sem borda** — apoiados em sombra suave. Bordas só quando o fundo é da mesma cor da superfície.

### Sombras

Pilha de elevação 5 níveis (`--shadow-xs` → `--shadow-xl`), todas com tinta navy (`rgba(0,7,62,...)`) ao invés de preto puro — dá uma sombra mais "fria" e premium.

Uma sombra especial: `--shadow-glow` — anel cyan + drop blue. Usar **só** para indicar "AI ativa" / "conexão viva" / "match aconteceu". Não é uma sombra de hover.

### Cards

- **Radius:** `--radius-lg` (24px) padrão. `--radius-xl` (32px) para cards-hero. `--radius-pill` para pills/badges.
- **Surface:** branco puro (`#ffffff`) sobre o `bg-1` cinza-paper — dá separação sem precisar de borda.
- **Shadow:** `--shadow-md` em repouso, `--shadow-lg` em hover.
- **Padding:** 24–32px nos cards padrão; 48–64px em cards-hero.

### Cantos arredondados (radius system)

O brandbook é decididamente arredondado, **nunca chip-square**. Tudo em UI tem pelo menos 6px de raio.

- Chips/tags: pill (999px)
- Inputs / buttons: 14–16px (`--radius-md`)
- Cards: 24px (`--radius-lg`)
- Hero surfaces: 32–48px (`--radius-xl` / `--radius-2xl`)
- Avatares: círculo (50%)

### Transparência & blur

Glass-morphism **não é** um motivo da marca — evite `backdrop-filter` decorativo. A única exceção é **uma barra de busca / pesquisa flutuando sobre o gradient brand** (ver p42–p45), onde a barra é **branca opaca**, não transparente.

Para overlays modais: `rgba(0, 7, 62, 0.72)` (navy semi-transparente), **sem** blur. A marca prefere superfícies sólidas e separação clara.

### Layout

- Densidade: **espaçosa**. O brandbook respira — muito whitespace ao redor de elementos primários.
- Grid: 12 colunas com gutter de 24px em desktop; mobile colapsa para 1 coluna com 16px padding.
- Elementos fixos: header do produto **flutua com leve padding interno**, nunca colado nas bordas — o "respiro" é parte da identidade.
- Limite de largura: textos longos devem cair em ~640px de largura. Cards/hero podem ir até 1280–1440px.

### "Mood" das imagens

Quando usar fotografia: **fria-neutra, alta nitidez**. Arquitetura urbana (skyline visto de baixo é o exemplo canônico do brandbook), interiores arejados, momentos humanos quietos (sem pose de stock photo). Evite warm filters, vintage, B&W contrastado, grão.

---

## Iconography

> Sessão 05 → Iconografia do brandbook.

O brandbook ilustra um **conjunto custom de ~36 ícones** desenhados sob medida (envelope, telefone, equipe, download, coração, perfil, trending-up, ferramenta, prédio, maleta, send, avião, bandeira, configurações, clipboard, layers, calculadora, cartão, carrinho, pie chart, funil, target, bar chart, carteira, nuvem, escudo, wifi, link, tap, câmera, vídeo, play, notícia, edit, código, share).

**Forma:** glyph branco/azul **dentro de um quadrado arredondado** (radius ~22%) com **gradient azul** (mesmo gradient do símbolo). Existem duas variantes oficiais:
- **Modo Claro:** tile claro (`#f1f1f1` ou branco) com glyph em azul gradient.
- **Modo Escuro:** tile em gradient blue→cyan com glyph branco.

**Peso visual:** glyphs sólidos / filled (não outline). Cantos arredondados nos glyphs também.

### Como usar em código (recomendado)

Como **não recebi** os SVGs dos ícones nativos da marca, **estou substituindo por [Phosphor Icons](https://phosphoricons.com/)** com peso `fill` — é a biblioteca CDN-acessível mais próxima em estilo (geométrica, peso sólido, cantos arredondados). **Flagged: peça ao usuário o ícone-set vetorizado da marca** para substituir antes da entrega final.

```html
<!-- CDN do Phosphor (substituto temporário) -->
<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>

<!-- Uso (glyph filled dentro do tile da marca) -->
<span class="mh-icon-tile mh-icon-tile--light">
  <i class="ph-fill ph-house"></i>
</span>
```

O componente `IconTile` no UI kit (`ui_kits/linkbio/IconTile.jsx`) já implementa as duas variantes (claro/escuro) com o gradient correto.

### Quando NÃO usar ícone

A marca **não usa emoji**. Não use ícones decorativos em corpo de texto — só para affordances funcionais (botões, chips, listas estruturadas) ou para o grid de "atalhos" tipo home-screen.

### Setas

A marca usa **caracteres tipográficos** (`→`, `↘`, `↙`, `↑`, `↓`) como elementos de design. São válidos em UI — em botões, breadcrumbs, em fim de títulos de seção. **Não** redesenhe como SVG; deixe a seta como texto, herdando peso e cor do contexto.

---

## UI Kits

| Kit | Caminho | O que tem |
|---|---|---|
| **Link da Bio + IA** | `ui_kits/linkbio/` | Página de link-in-bio do corretor com central de IA, lista de imóveis, chat ao vivo. Mobile-first (390×844) com versão web. |

Cada UI kit tem seu próprio `README.md`, um `index.html` que demonstra o produto interativo, e componentes JSX modulares.

---

## Quick Start (para outro agente / Claude Code)

1. Importe os tokens: `<link rel="stylesheet" href="colors_and_type.css">`
2. Carregue Poppins (já está no `@import` do CSS) e Phosphor Icons (`<script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>`)
3. Use as variáveis: `color: var(--fg-1)`, `background: var(--mh-gradient-brand)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-md)`.
4. Para componentes prontos, copie do `ui_kits/linkbio/`.
5. Para o símbolo, use `assets/logo-compact.png` ou `assets/logo-symbol.png`.

---

## Caveats / pendências

- 🟢 **Fontes Poppins + Helvetica Now Display:** auto-hospedadas em `fonts/`, declaradas em `colors_and_type.css`. Sem dependência de CDN.
- 🟡 **Ícones:** Phosphor (fill) substitui temporariamente o set custom da marca. Peça os SVGs originais.
- 🟡 **Logo vetorial:** estou usando PNGs extraídos do PDF. Peça o `.svg` / `.eps` do símbolo para escala perfeita.
- 🟡 **Hexes:** corrigidos por amostragem (o PDF tem typos nos rótulos das pgs 24 e 26).
- 🟡 **Status colors (success/warn/danger):** não constam no brandbook; criei harmonizadas. Confirme com o time se forem usadas em produção.
- 🟢 **Tom de voz, manifesto, tagline, paleta institucional, tipografia, motivos visuais:** todos fiéis ao brandbook.
