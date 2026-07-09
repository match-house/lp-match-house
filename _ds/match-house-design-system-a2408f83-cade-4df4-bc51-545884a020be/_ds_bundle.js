/* @ds-bundle: {"format":3,"namespace":"MatchHouseDesignSystem_a2408f","components":[],"sourceHashes":{"smart-link/App.jsx":"2ac9cbb700c6","smart-link/Chat.jsx":"0750c299183d","smart-link/Home.jsx":"d3489d42217f","smart-link/ShareSheet.jsx":"663a7a8a33e3","smart-link/Story.jsx":"94a1b80db457","smart-link/Summary.jsx":"fb943263a35a","smart-link/components.jsx":"a25ea1c30437","smart-link/data.js":"e2d8634145fb","smart-link/tweaks-panel.jsx":"6591467622ed","ui_kits/linkbio/App.jsx":"f04a824e81ff","ui_kits/linkbio/Bio.jsx":"b72f575bef33","ui_kits/linkbio/ChatPanel.jsx":"84eb6f0e6364","ui_kits/linkbio/PropertyDetail.jsx":"e081d703275b","ui_kits/linkbio/components.jsx":"b858f1990e53","ui_kits/linkbio/data.js":"70df40d323ba"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MatchHouseDesignSystem_a2408f = window.MatchHouseDesignSystem_a2408f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// smart-link/App.jsx
try { (() => {
// App — device shell, navigation, tweaks
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "claro",
  "tone": "proximo",
  "hero": "gradiente",
  "accent": "#00efff"
} /*EDITMODE-END*/;
const GREETINGS = {
  proximo: ['Oi! Eu sou a IA da Ana.', 'Atendo por ela aqui no link, a qualquer hora.', 'Me conta o que você procura — eu separo o que mais combina com você.'],
  direto: ['Sou a IA da Ana. Atendo 24/7 por aqui.', 'Sem espera, sem fila.', 'Diz o que procura que eu trago os melhores matches na hora.'],
  sofisticado: ['Bem-vindo. Sou a inteligência da Ana Coutinho.', 'Disponível a qualquer hora, com a curadoria dela.', 'Conte o que busca — vou selecionar o que mais se alinha ao seu perfil.']
};
function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const data = window.SL_DATA;
  const [view, setView] = React.useState('home'); // home | chat | story | summary
  const [returnTo, setReturnTo] = React.useState('home');
  const [storyImovel, setStoryImovel] = React.useState(null);
  const [seedIntent, setSeedIntent] = React.useState(null);
  const [share, setShare] = React.useState({
    open: false,
    kind: 'profile',
    imovel: null
  });
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);

  // greeting per tone
  const greetData = React.useMemo(() => ({
    ...data,
    aiGreeting: GREETINGS[t.tone] || GREETINGS.proximo
  }), [t.tone]);
  const showToast = msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };
  const openChat = seed => {
    setSeedIntent(seed || null);
    setView('chat');
  };
  const openStory = (imovel, from) => {
    setStoryImovel(imovel);
    setReturnTo(from || view);
    setView('story');
  };
  const openShare = (kind, imovel) => setShare({
    open: true,
    kind,
    imovel: imovel || null
  });
  const closeShare = () => setShare(s => ({
    ...s,
    open: false
  }));
  const isDark = t.theme === 'escuro';
  return /*#__PURE__*/React.createElement("div", {
    className: "sl-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-pitch"
  }, /*#__PURE__*/React.createElement("img", {
    className: "sl-pitch__logo",
    src: "../assets/logo-compact.png",
    alt: "match house"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-pitch__eyebrow"
  }, "Smart Link \xB7 experi\xEAncia do cliente"), /*#__PURE__*/React.createElement("h1", null, "O link da bio", /*#__PURE__*/React.createElement("br", null), "que ", /*#__PURE__*/React.createElement("span", {
    className: "accent"
  }, "conversa"), "."), /*#__PURE__*/React.createElement("p", null, "Toque, fale com a IA, fa\xE7a o tour em 60s e compartilhe \u2014 tudo dentro de um \xFAnico link com a marca do corretor."), /*#__PURE__*/React.createElement("div", {
    className: "sl-pitch__steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-pitch__step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-pitch__num"
  }, "1"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "A IA recebe o cliente"), " no tom de voz do corretor e entende o que ele procura.")), /*#__PURE__*/React.createElement("div", {
    className: "sl-pitch__step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-pitch__num"
  }, "2"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Tour imersivo em Stories"), " com o % de match calculado na hora.")), /*#__PURE__*/React.createElement("div", {
    className: "sl-pitch__step"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-pitch__num"
  }, "3"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Story card pronto pra compartilhar"), " \u2014 com QR e a marca do corretor.")))), /*#__PURE__*/React.createElement("div", {
    className: "sl-device"
  }, /*#__PURE__*/React.createElement("div", {
    className: `sl-screen ${isDark ? 'is-dark' : ''}`,
    "data-theme": isDark ? 'dark' : undefined,
    style: {
      '--mh-cyan': t.accent
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-notch"
  }), /*#__PURE__*/React.createElement(window.StatusBar, {
    dark: isDark || view === 'story' || view === 'summary'
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-view",
    key: view === 'story' || view === 'summary' ? view : 'base'
  }, view === 'home' && /*#__PURE__*/React.createElement(window.Home, {
    data: greetData,
    heroStyle: t.hero,
    onOpenChat: () => openChat(),
    onOpenStory: p => openStory(p, 'home'),
    onShare: openShare,
    onIntent: q => openChat(`Quero ver ${q.label.toLowerCase()}`)
  }), view === 'chat' && /*#__PURE__*/React.createElement(window.Chat, {
    data: data,
    seedIntent: seedIntent,
    onBack: () => setView('home'),
    onOpenStory: p => openStory(p, 'chat'),
    onSummary: () => {
      setReturnTo('chat');
      setView('summary');
    },
    onWhatsApp: () => showToast('Abrindo WhatsApp da Ana…')
  }), view === 'story' && storyImovel && /*#__PURE__*/React.createElement(window.Story, {
    data: data,
    imovel: storyImovel,
    onClose: () => setView(returnTo),
    onShare: openShare,
    onWhatsApp: () => showToast('Abrindo WhatsApp da Ana…')
  }), view === 'summary' && /*#__PURE__*/React.createElement(window.Summary, {
    data: data,
    onClose: () => setView(returnTo),
    onShare: openShare,
    onOpenStory: p => openStory(p, 'summary')
  })), view === 'home' && /*#__PURE__*/React.createElement("div", {
    className: "sl-dock"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sl-dock__btn",
    onClick: () => openChat()
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-dock__orb"
  }), /*#__PURE__*/React.createElement("span", {
    className: "sl-dock__txt"
  }, /*#__PURE__*/React.createElement("b", null, "Falar com a IA da Ana"), /*#__PURE__*/React.createElement("span", null, "responde na hora, 24/7")), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-microphone"
  }))), /*#__PURE__*/React.createElement(window.ShareSheet, {
    data: data,
    open: share.open,
    kind: share.kind,
    imovel: share.imovel,
    onClose: closeShare,
    onToast: showToast
  }), /*#__PURE__*/React.createElement("div", {
    className: `sl-toast ${toast ? 'is-show' : ''}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-check-circle"
  }), " ", toast))), /*#__PURE__*/React.createElement(window.TweaksPanel, null, /*#__PURE__*/React.createElement(window.TweakSection, {
    label: "Apar\xEAncia"
  }), /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Tema",
    value: t.theme,
    options: ['claro', 'escuro'],
    onChange: v => setTweak('theme', v)
  }), /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Topo da home",
    value: t.hero,
    options: ['gradiente', 'navy'],
    onChange: v => setTweak('hero', v)
  }), /*#__PURE__*/React.createElement(window.TweakColor, {
    label: "Cor de destaque",
    value: t.accent,
    options: ['#00efff', '#5af5ff', '#2748df'],
    onChange: v => setTweak('accent', v)
  }), /*#__PURE__*/React.createElement(window.TweakSection, {
    label: "Voz da IA"
  }), /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Tom",
    value: t.tone,
    options: ['proximo', 'direto', 'sofisticado'],
    onChange: v => setTweak('tone', v)
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/App.jsx", error: String((e && e.message) || e) }); }

// smart-link/Chat.jsx
try { (() => {
// Chat — conversational AI in the corretor's voice
function Chat({
  data,
  seedIntent,
  onBack,
  onOpenStory,
  onSummary,
  onWhatsApp
}) {
  const {
    corretor,
    convo,
    imoveis
  } = data;
  const [items, setItems] = React.useState([]);
  const [typing, setTyping] = React.useState(false);
  const bodyRef = React.useRef(null);
  const findImovel = id => imoveis.find(i => i.id === id);
  React.useEffect(() => {
    let cancelled = false;
    const seq = [];
    if (seedIntent) seq.push({
      from: 'you',
      text: seedIntent
    });
    convo.forEach(c => seq.push(c));
    setItems([]);
    setTyping(false);
    let idx = 0;
    const run = () => {
      if (cancelled || idx >= seq.length) return;
      const msg = seq[idx];
      if (msg.from === 'ai') {
        setTyping(true);
        setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setItems(prev => [...prev, msg]);
          idx++;
          setTimeout(run, 650);
        }, 1100);
      } else {
        setItems(prev => [...prev, msg]);
        idx++;
        setTimeout(run, 850);
      }
    };
    const t = setTimeout(run, 450);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [seedIntent]);
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [items, typing]);
  return /*#__PURE__*/React.createElement("div", {
    className: "sl-page sl-chat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sl-chat__back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-arrow-left"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__id"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__orb"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__name"
  }, "IA da ", corretor.first, " ", /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-seal-check"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__status"
  }, "responde por ", corretor.name, " \xB7 agora"))), /*#__PURE__*/React.createElement("button", {
    className: "sl-chat__menu",
    onClick: onSummary
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-sparkle"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__body",
    ref: bodyRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__note"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle",
    style: {
      color: 'var(--mh-blue)'
    }
  }), " Atendimento por IA com o tom de voz da ", corretor.name, ". A qualquer momento ela entra na conversa."), items.map((m, i) => {
    if (m.match) {
      const p = findImovel(m.match);
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        className: "sl-msg sl-msg--ai"
      }, /*#__PURE__*/React.createElement("div", {
        className: "sl-bubble sl-bubble--ai"
      }, m.text)), /*#__PURE__*/React.createElement("button", {
        className: "sl-chatcard",
        onClick: () => onOpenStory(p)
      }, /*#__PURE__*/React.createElement("div", {
        className: "sl-chatcard__img",
        style: {
          background: p.cover
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "sl-chatcard__match"
      }, p.match, "% match")), /*#__PURE__*/React.createElement("div", {
        className: "sl-chatcard__body"
      }, /*#__PURE__*/React.createElement("div", {
        className: "sl-chatcard__title"
      }, p.title), /*#__PURE__*/React.createElement("div", {
        className: "sl-chatcard__price"
      }, p.price), /*#__PURE__*/React.createElement("div", {
        className: "sl-chatcard__cta"
      }, "Ver tour de 60s ", /*#__PURE__*/React.createElement("i", {
        className: "ph-bold ph-play-circle"
      })))));
    }
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `sl-msg sl-msg--${m.from}`
    }, /*#__PURE__*/React.createElement("div", {
      className: `sl-bubble sl-bubble--${m.from}`
    }, m.text));
  }), typing && /*#__PURE__*/React.createElement("div", {
    className: "sl-typing"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null))), /*#__PURE__*/React.createElement("div", {
    className: "sl-chat__quick"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sl-chat__chip",
    onClick: onSummary
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle",
    style: {
      color: 'var(--mh-blue)',
      marginRight: 4,
      verticalAlign: -1
    }
  }), "Ver meu resumo"), /*#__PURE__*/React.createElement("button", {
    className: "sl-chat__chip",
    onClick: onWhatsApp
  }, "Chamar a ", corretor.first), /*#__PURE__*/React.createElement("button", {
    className: "sl-chat__chip"
  }, "Outras regi\xF5es"), /*#__PURE__*/React.createElement("button", {
    className: "sl-chat__chip"
  }, "Quero financiar")), /*#__PURE__*/React.createElement("div", {
    className: "sl-composer"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: `Escreva pra IA da ${corretor.first}…`
  }), /*#__PURE__*/React.createElement("button", null, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-paper-plane-tilt"
  }))));
}
window.Chat = Chat;
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/Chat.jsx", error: String((e && e.message) || e) }); }

// smart-link/Home.jsx
try { (() => {
// Home — the living bio link
function Home({
  data,
  heroStyle = 'gradiente',
  onOpenChat,
  onOpenStory,
  onShare,
  onIntent
}) {
  const {
    corretor,
    aiGreeting,
    quickIntents,
    imoveis,
    links,
    smartLinkUrl
  } = data;
  const [typed, done] = window.useTypewriter(aiGreeting);
  const heroBg = heroStyle === 'navy' ? {
    background: 'var(--mh-navy)'
  } : undefined;
  const lastTyping = typed.findIndex((s, i) => s.length < aiGreeting[i].length);
  return /*#__PURE__*/React.createElement("div", {
    className: "sl-page sl-home"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-hero",
    style: heroBg
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-hero__glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-hero__brandrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-hero__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-symbol.png",
    alt: ""
  }), " match house"), /*#__PURE__*/React.createElement("button", {
    className: "sl-hero__share",
    onClick: () => onShare('profile')
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-share-network"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sl-profile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-avatar",
    style: {
      background: corretor.avatarGrad
    }
  }, corretor.initials, /*#__PURE__*/React.createElement("span", {
    className: "sl-avatar__live"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sl-profile__name"
  }, corretor.name, " ", corretor.verified && /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-seal-check"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sl-profile__title"
  }, corretor.title), /*#__PURE__*/React.createElement("div", {
    className: "sl-profile__stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-profile__stat"
  }, /*#__PURE__*/React.createElement("b", null, corretor.stats.rating, "\u2605"), "avalia\xE7\xE3o"), /*#__PURE__*/React.createElement("div", {
    className: "sl-profile__stat"
  }, /*#__PURE__*/React.createElement("b", null, corretor.stats.deals), "fechamentos"), /*#__PURE__*/React.createElement("div", {
    className: "sl-profile__stat"
  }, /*#__PURE__*/React.createElement("b", null, corretor.stats.resp), "atendimento"))))), /*#__PURE__*/React.createElement("div", {
    className: "sl-greet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-greet__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-greet__badge"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " IA da ", corretor.first, " \xB7 online")), /*#__PURE__*/React.createElement("div", {
    className: "sl-greet__lines"
  }, aiGreeting.map((full, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    className: `sl-greet__line ${i > 0 ? 'is-muted' : ''}`
  }, typed[i] || '', !done && i === lastTyping && /*#__PURE__*/React.createElement("span", {
    className: "sl-cursor"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "sl-intents"
  }, quickIntents.map(q => /*#__PURE__*/React.createElement("button", {
    key: q.id,
    className: "sl-intent",
    onClick: () => onIntent(q)
  }, /*#__PURE__*/React.createElement("i", {
    className: q.icon
  }), " ", q.label)))), /*#__PURE__*/React.createElement("div", {
    className: "sl-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-section__head"
  }, /*#__PURE__*/React.createElement("h3", null, "Sele\xE7\xE3o da ", corretor.first), /*#__PURE__*/React.createElement("button", {
    className: "sl-section__link",
    onClick: onOpenChat
  }, "pedir mais ", /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-arrow-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sl-rail"
  }, imoveis.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: "sl-card",
    onClick: () => onOpenStory(p)
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-card__img",
    style: {
      background: p.cover
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-card__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-card__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-card__match"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle"
  }), " ", p.match, "%"), /*#__PURE__*/React.createElement("span", {
    className: "sl-card__save"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bookmark-simple"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sl-card__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-card__bairro"
  }, p.bairro, " \xB7 ", p.city), /*#__PURE__*/React.createElement("div", {
    className: "sl-card__title"
  }, p.title), /*#__PURE__*/React.createElement("div", {
    className: "sl-card__price"
  }, p.price), /*#__PURE__*/React.createElement("div", {
    className: "sl-card__meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-resize"
  }), p.m2, "m\xB2"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-bed"
  }), p.suites, " su\xEDtes"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-car"
  }), p.vagas))))))), /*#__PURE__*/React.createElement("div", {
    className: "sl-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-section__head"
  }, /*#__PURE__*/React.createElement("h3", null, "Mais sobre a ", corretor.first)), /*#__PURE__*/React.createElement("div", {
    className: "sl-links"
  }, links.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.id,
    className: "sl-linkrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-linkrow__icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: l.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "sl-linkrow__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-linkrow__label"
  }, l.label), /*#__PURE__*/React.createElement("span", {
    className: "sl-linkrow__sub"
  }, l.sub)), /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-arrow-up-right sl-linkrow__arrow"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "sl-foot"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-compact.png",
    alt: "match house"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-foot__tag"
  }, smartLinkUrl, " \xB7 feito com Match House")));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/Home.jsx", error: String((e && e.message) || e) }); }

// smart-link/ShareSheet.jsx
try { (() => {
// ShareSheet — bottom sheet with the shareable 9:16 card + actions
function ShareSheet({
  data,
  open,
  kind,
  imovel,
  onClose,
  onToast
}) {
  const {
    corretor,
    smartLinkUrl
  } = data;
  const isImovel = kind === 'imovel' && imovel;
  const bg = isImovel ? imovel.cover : corretor.avatarGrad;
  const title = isImovel ? imovel.title : `${corretor.name}`;
  const sub = isImovel ? imovel.priceShort : corretor.title;
  return /*#__PURE__*/React.createElement("div", {
    className: `sl-sheet ${open ? 'is-open' : ''}`,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-sheet__panel",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-sheet__grab"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "sl-sheet__title"
  }, isImovel ? 'Compartilhar imóvel' : 'Compartilhar meu Smart Link'), /*#__PURE__*/React.createElement("p", {
    className: "sl-sheet__sub"
  }, "Pronto pro story \u2014 com seu QR e sua marca."), /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__bg",
    style: {
      background: bg
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__top"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../assets/logo-symbol.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", null, "match house")), isImovel && /*#__PURE__*/React.createElement("span", {
    className: "sl-storycard__match"
  }, imovel.match, "% match"), /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__body"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "sl-storycard__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__price"
  }, sub), /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__qr"
  }, /*#__PURE__*/React.createElement(window.QR, {
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    className: "sl-storycard__handle"
  }, /*#__PURE__*/React.createElement("b", null, corretor.name), /*#__PURE__*/React.createElement("span", null, smartLinkUrl))))), /*#__PURE__*/React.createElement("div", {
    className: "sl-share__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sl-share__act",
    onClick: () => {
      onToast('Aberto no Instagram Stories');
      onClose();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-share__ico",
    style: {
      background: 'linear-gradient(135deg,#feda75,#d62976 45%,#962fbf 80%)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-instagram-logo"
  })), "Stories"), /*#__PURE__*/React.createElement("button", {
    className: "sl-share__act",
    onClick: () => {
      onToast('Compartilhado no WhatsApp');
      onClose();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-share__ico",
    style: {
      background: '#25D366'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-whatsapp-logo"
  })), "WhatsApp"), /*#__PURE__*/React.createElement("button", {
    className: "sl-share__act",
    onClick: () => {
      onToast('Imagem salva na galeria');
      onClose();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-share__ico",
    style: {
      background: 'var(--mh-blue)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-download-simple"
  })), "Salvar"), /*#__PURE__*/React.createElement("button", {
    className: "sl-share__act",
    onClick: () => {
      onToast('Cartão enviado');
      onClose();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-share__ico",
    style: {
      background: 'var(--mh-navy)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-paper-plane-tilt"
  })), "Enviar")), /*#__PURE__*/React.createElement("div", {
    className: "sl-share__copy"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-link-simple"
  }), /*#__PURE__*/React.createElement("span", null, smartLinkUrl, isImovel ? '/' + imovel.id : ''), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onToast('Link copiado');
    }
  }, "Copiar"))));
}
window.ShareSheet = ShareSheet;
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/ShareSheet.jsx", error: String((e && e.message) || e) }); }

// smart-link/Story.jsx
try { (() => {
// Story — immersive vertical property tour (Instagram-Stories format)
function Story({
  data,
  imovel,
  onClose,
  onShare,
  onWhatsApp
}) {
  const segments = imovel.segments;
  const [seg, setSeg] = React.useState(0);
  const {
    corretor
  } = data;

  // auto-advance
  React.useEffect(() => {
    setSeg(0);
  }, [imovel.id]);
  React.useEffect(() => {
    if (seg >= segments.length) return;
    const t = setTimeout(() => {
      setSeg(s => s < segments.length - 1 ? s + 1 : s);
    }, 4000);
    return () => clearTimeout(t);
  }, [seg, segments.length]);
  const prev = () => setSeg(s => Math.max(0, s - 1));
  const next = () => setSeg(s => s < segments.length - 1 ? s + 1 : s);
  const cur = segments[seg];
  return /*#__PURE__*/React.createElement("div", {
    className: "sl-page sl-story"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-story__bg",
    style: {
      background: cur.grad
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__bars"
  }, segments.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "sl-story__bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: `sl-story__barfill ${i < seg ? 'is-done' : ''} ${i === seg ? 'is-active' : ''}`
  })))), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sl-story__av",
    style: {
      background: corretor.avatarGrad
    }
  }, corretor.initials), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__who"
  }, /*#__PURE__*/React.createElement("b", null, corretor.name), /*#__PURE__*/React.createElement("span", null, "tour guiado pela IA")), /*#__PURE__*/React.createElement("button", {
    className: "sl-story__close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__seglabel"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-camera",
    style: {
      marginRight: 5,
      verticalAlign: -1
    }
  }), cur.label), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__nav"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: prev,
    "aria-label": "anterior"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: next,
    "aria-label": "pr\xF3ximo"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-story__match"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle"
  }), " ", imovel.match, "% match com voc\xEA"), /*#__PURE__*/React.createElement("h2", {
    className: "sl-story__title"
  }, imovel.title), /*#__PURE__*/React.createElement("p", {
    className: "sl-story__bairro"
  }, imovel.bairro, " \xB7 ", imovel.city), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__price"
  }, imovel.price), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__specs"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-resize"
  }), imovel.m2, "m\xB2"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-bed"
  }), imovel.suites, " su\xEDtes"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-car"
  }), imovel.vagas, " vagas")), seg === segments.length - 1 && /*#__PURE__*/React.createElement("p", {
    className: "sl-story__pitch"
  }, imovel.pitch)), /*#__PURE__*/React.createElement("div", {
    className: "sl-story__actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sl-story__wpp",
    onClick: onWhatsApp
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-whatsapp-logo"
  }), " Falar com a ", corretor.first), /*#__PURE__*/React.createElement("button", {
    className: "sl-story__sharebtn",
    onClick: () => onShare('imovel', imovel)
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-share-fat"
  }))));
}
window.Story = Story;
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/Story.jsx", error: String((e && e.message) || e) }); }

// smart-link/Summary.jsx
try { (() => {
// Summary — AI-generated match recap, designed to be shared
function Summary({
  data,
  onClose,
  onShare,
  onOpenStory
}) {
  const {
    corretor,
    imoveis
  } = data;
  const prefs = ['R$ 8–13M', '3–4 suítes', 'Perto de parque', 'São Paulo'];
  const ranked = [...imoveis].sort((a, b) => b.match - a.match);
  return /*#__PURE__*/React.createElement("div", {
    className: "sl-page sl-summary"
  }, /*#__PURE__*/React.createElement("button", {
    className: "sl-summary__close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sl-summary__eyebrow"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle"
  }), " Seu match \xB7 gerado pela IA"), /*#__PURE__*/React.createElement("h1", {
    className: "sl-summary__h1"
  }, "Encontrei ", ranked.length, " im\xF3veis", /*#__PURE__*/React.createElement("br", null), "com a sua cara."), /*#__PURE__*/React.createElement("div", {
    className: "sl-summary__by"
  }, "Curadoria de ", corretor.name, " \xB7 ", corretor.creci), /*#__PURE__*/React.createElement("div", {
    className: "sl-summary__pref"
  }, prefs.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    className: "sl-summary__chip"
  }, p))), /*#__PURE__*/React.createElement("div", {
    className: "sl-summary__list"
  }, ranked.map((p, i) => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    className: "sl-summary__item",
    onClick: () => onOpenStory(p),
    style: {
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sl-summary__rank"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "sl-summary__thumb",
    style: {
      background: p.cover
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "sl-summary__info"
  }, /*#__PURE__*/React.createElement("b", null, p.short), /*#__PURE__*/React.createElement("span", null, p.bairro, " \xB7 ", p.priceShort)), /*#__PURE__*/React.createElement("span", {
    className: "sl-summary__pct"
  }, p.match, "%")))), /*#__PURE__*/React.createElement("button", {
    className: "sl-summary__cta",
    onClick: () => onShare('profile')
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-share-fat"
  }), " Compartilhar meu match"));
}
window.Summary = Summary;
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/Summary.jsx", error: String((e && e.message) || e) }); }

// smart-link/components.jsx
try { (() => {
// Smart Link — shared atoms
const {
  useState,
  useEffect,
  useRef
} = React;

// Fake-but-convincing QR (decorative; not scannable). Deterministic grid from a seed.
function QR({
  size = 38,
  fg = '#00073e'
}) {
  const cells = 11;
  const seed = 7;
  const mods = [];
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      // finder patterns in 3 corners
      const inFinder = (cx, cy) => x >= cx && x < cx + 3 && y >= cy && y < cy + 3;
      const finder = inFinder(0, 0) || inFinder(cells - 3, 0) || inFinder(0, cells - 3);
      const finderRing = (cx, cy) => x >= cx - 1 && x < cx + 4 && y >= cy - 1 && y < cy + 4;
      const onRing = finderRing(0, 0) || finderRing(cells - 3, 0) || finderRing(0, cells - 3);
      let on;
      if (finder) on = true;else if (onRing) on = false;else on = (x * 13 + y * 7 + seed * (x ^ y)) % 5 < 2;
      if (on) mods.push(/*#__PURE__*/React.createElement("rect", {
        key: x + '-' + y,
        x: x,
        y: y,
        width: "1",
        height: "1",
        fill: fg
      }));
    }
  }
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${cells} ${cells}`,
    width: size,
    height: size,
    shapeRendering: "crispEdges"
  }, mods);
}
function StatusBar({
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `sl-status`
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
    className: "sl-status__icons"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-cell-signal-full"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-wifi-high"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-battery-full"
  })));
}

// Typewriter hook — types an array of lines sequentially.
// Output buffer is fixed at lines.length so a double-invoked effect can never
// duplicate a line.
function useTypewriter(lines, speed = 26, lineGap = 380) {
  const [out, setOut] = useState(() => lines.map(() => ''));
  const [done, setDone] = useState(false);
  const runRef = useRef(0);
  useEffect(() => {
    const myRun = ++runRef.current;
    const alive = () => runRef.current === myRun;
    const n = lines.length;
    setOut(lines.map(() => ''));
    setDone(false);
    let li = 0;
    const typeLine = () => {
      if (!alive()) return;
      if (li >= n) {
        setDone(true);
        return;
      }
      const full = lines[li];
      let ci = 0;
      const tick = () => {
        if (!alive() || li >= n) return;
        ci++;
        const idx = li;
        setOut(prev => {
          const c = prev.slice(0, n);
          while (c.length < n) c.push('');
          if (idx < n) c[idx] = full.slice(0, ci);
          return c;
        });
        if (ci < full.length) setTimeout(tick, speed);else {
          li++;
          setTimeout(typeLine, lineGap);
        }
      };
      setTimeout(tick, speed);
    };
    const start = setTimeout(typeLine, 500);
    return () => {
      runRef.current++;
      clearTimeout(start);
    };
  }, [lines.join('|'), speed, lineGap]);
  return [out, done];
}
window.QR = QR;
window.StatusBar = StatusBar;
window.useTypewriter = useTypewriter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/components.jsx", error: String((e && e.message) || e) }); }

// smart-link/data.js
try { (() => {
// Smart Link — prototype data
window.SL_DATA = {
  corretor: {
    name: 'Ana Coutinho',
    first: 'Ana',
    handle: '@ana.imoveissp',
    creci: 'CRECI-SP 184.520',
    title: 'Especialista em alto padrão · São Paulo',
    bio: 'Curadoria de coberturas e casas premium nos Jardins, Itaim e Vila Nova. 8 anos conectando pessoas a imóveis que combinam com elas.',
    initials: 'AC',
    avatarGrad: 'linear-gradient(135deg,#001a8a 0%,#0a3fd0 55%,#00d4ff 100%)',
    stats: {
      rating: '4.9',
      deals: '312',
      resp: '24/7'
    },
    verified: true
  },
  // The AI greets in the corretor's voice
  aiGreeting: ['Oi! Eu sou a IA da Ana.', 'Atendo por ela aqui no link, a qualquer hora.', 'Me conta o que você procura — eu já separo o que mais combina com você.'],
  quickIntents: [{
    id: 'cobertura',
    icon: 'ph-fill ph-buildings',
    label: 'Coberturas'
  }, {
    id: 'casa',
    icon: 'ph-fill ph-house-line',
    label: 'Casas em condomínio'
  }, {
    id: 'invest',
    icon: 'ph-fill ph-trend-up',
    label: 'Pra investir'
  }, {
    id: 'visita',
    icon: 'ph-fill ph-calendar-check',
    label: 'Agendar visita'
  }],
  imoveis: [{
    id: 'p1',
    title: 'Triplex com vista panorâmica',
    short: 'Triplex panorâmico',
    bairro: 'Vila Nova Conceição',
    city: 'São Paulo',
    price: 'R$ 12.800.000',
    priceShort: 'R$ 12,8M',
    m2: 480,
    suites: 4,
    vagas: 5,
    match: 94,
    pitch: 'Cobertura premiada com terraço de 120m² e vista 270° do Parque Ibirapuera.',
    tags: ['Vista parque', 'Terraço', 'Studio Arthur Casas'],
    segments: [{
      label: 'Fachada & lobby',
      grad: 'linear-gradient(160deg,#00073e,#0a3fd0)'
    }, {
      label: 'Living integrado',
      grad: 'linear-gradient(160deg,#050f5a,#1d6df0)'
    }, {
      label: 'Terraço 270°',
      grad: 'linear-gradient(160deg,#0a3fd0,#00d4ff)'
    }],
    cover: 'linear-gradient(160deg,#00073e 0%,#0a3fd0 55%,#00d4ff 100%)'
  }, {
    id: 'p2',
    title: 'Cobertura duplex no Itaim',
    short: 'Duplex Itaim',
    bairro: 'Itaim Bibi',
    city: 'São Paulo',
    price: 'R$ 8.400.000',
    priceShort: 'R$ 8,4M',
    m2: 290,
    suites: 3,
    vagas: 3,
    match: 88,
    pitch: 'Duplex reformado a 2 min da Faria Lima, com rooftop e piscina privativa.',
    tags: ['Rooftop', 'Pet-friendly', 'Reformado'],
    segments: [{
      label: 'Entrada social',
      grad: 'linear-gradient(160deg,#050f5a,#1d6df0)'
    }, {
      label: 'Rooftop & piscina',
      grad: 'linear-gradient(160deg,#1d6df0,#5af5ff)'
    }],
    cover: 'linear-gradient(160deg,#050f5a 0%,#1d6df0 70%,#5af5ff 100%)'
  }, {
    id: 'p3',
    title: 'Casa em condomínio fechado',
    short: 'Casa Alphaville',
    bairro: 'Alphaville',
    city: 'Barueri',
    price: 'R$ 6.900.000',
    priceShort: 'R$ 6,9M',
    m2: 620,
    suites: 5,
    vagas: 6,
    match: 81,
    pitch: 'Casa térrea de 620m² com piscina, quadra e segurança 24h em condomínio fechado.',
    tags: ['Piscina', 'Quadra', 'Segurança 24h'],
    segments: [{
      label: 'Fachada & jardim',
      grad: 'linear-gradient(160deg,#00073e,#000f90)'
    }, {
      label: 'Área de lazer',
      grad: 'linear-gradient(160deg,#000f90,#2748df)'
    }],
    cover: 'linear-gradient(160deg,#00073e 0%,#000f90 80%,#2748df 100%)'
  }],
  // Scripted conversation for the chat demo
  convo: [{
    from: 'you',
    text: 'Quero algo entre 8 e 13 milhões, 3-4 suítes, perto de parque'
  }, {
    from: 'ai',
    text: 'Anotado ✓ Faixa de R$ 8–13M, 3 a 4 suítes, com verde por perto. Tenho 3 matches fortes — esse é o nº1:',
    match: 'p1'
  }, {
    from: 'you',
    text: 'Adorei esse. Tem terraço mesmo?'
  }, {
    from: 'ai',
    text: 'Tem sim — 120m² de terraço com vista pro Ibirapuera. Quer ver o tour de 60s ou já chamo a Ana no WhatsApp pra agendar visita?'
  }],
  links: [{
    id: 'wpp',
    icon: 'ph-fill ph-whatsapp-logo',
    label: 'Falar com a Ana',
    sub: 'Atendimento humano · 9h–22h'
  }, {
    id: 'ig',
    icon: 'ph-fill ph-instagram-logo',
    label: 'Instagram',
    sub: '80k seguidores'
  }, {
    id: 'port',
    icon: 'ph-fill ph-briefcase',
    label: 'Portfólio completo',
    sub: '47 imóveis ativos'
  }],
  smartLinkUrl: 'matchhouse.com.br/ana'
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/data.js", error: String((e && e.message) || e) }); }

// smart-link/tweaks-panel.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "smart-link/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/linkbio/App.jsx
try { (() => {
// Top-level App: orchestrates Bio / PropertyDetail / ChatPanel
const {
  Bio: BioScreen,
  ChatPanel: Chat,
  PropertyDetail: Detail
} = window;
function App() {
  const data = window.MH_DATA;
  const [view, setView] = React.useState('bio'); // 'bio' | 'detail'
  const [chatOpen, setChatOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);

  // Open via URL hash for deep-linking from the desktop nav
  React.useEffect(() => {
    const onHash = () => {
      const h = location.hash.slice(1);
      if (h === 'chat') {
        setView('bio');
        setChatOpen(true);
      } else if (h === 'detail') {
        setView('detail');
        setChatOpen(false);
        setActive(data.imoveis[0]);
      } else {
        setView('bio');
        setChatOpen(false);
      }
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [data]);
  function openProperty(p) {
    setActive(p);
    setView('detail');
  }
  function openChat() {
    setChatOpen(true);
  }
  function closeChat() {
    setChatOpen(false);
  }
  function backToBio() {
    setView('bio');
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mh-shell"
  }, view === 'bio' && /*#__PURE__*/React.createElement(BioScreen, {
    data: data,
    onOpenChat: openChat,
    onOpenProperty: openProperty
  }), view === 'detail' && /*#__PURE__*/React.createElement(Detail, {
    p: active,
    onBack: backToBio,
    onOpenChat: openChat
  }), /*#__PURE__*/React.createElement(Chat, {
    data: data,
    open: chatOpen,
    onClose: closeChat
  }));
}
function Demo() {
  const [tab, setTab] = React.useState('bio');
  React.useEffect(() => {
    location.hash = tab === 'bio' ? '' : tab;
  }, [tab]);
  return /*#__PURE__*/React.createElement("div", {
    className: "mh-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-stage__intro"
  }, /*#__PURE__*/React.createElement("h1", null, "Link da Bio + IA do corretor"), /*#__PURE__*/React.createElement("p", null, "Mobile mock @ 390\xD7844. Toque no card \"Fale com a IA\" para abrir o chat; toque em um im\xF3vel para o detalhe."), /*#__PURE__*/React.createElement("div", {
    className: "mh-stage__nav"
  }, /*#__PURE__*/React.createElement("button", {
    className: tab === 'bio' ? 'is-active' : '',
    onClick: () => setTab('bio')
  }, "Bio"), /*#__PURE__*/React.createElement("button", {
    className: tab === 'chat' ? 'is-active' : '',
    onClick: () => setTab('chat')
  }, "Chat IA"), /*#__PURE__*/React.createElement("button", {
    className: tab === 'detail' ? 'is-active' : '',
    onClick: () => setTab('detail')
  }, "Im\xF3vel"))), /*#__PURE__*/React.createElement(App, null));
}
window.MHApp = App;
window.MHDemo = Demo;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(Demo, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/linkbio/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/linkbio/Bio.jsx
try { (() => {
// Bio screen — corretor's link-in-bio landing page
const {
  Avatar: Av,
  Badge: Bd,
  Button: Bt,
  IconTile: IT,
  LinkRow: LR,
  StatChip: SC
} = window;
function PropertyCard({
  p,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "mh-prop",
    onClick: onClick,
    style: {
      background: p.gradient
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-prop__top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mh-chip"
  }, p.bairro), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bookmark-simple"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mh-prop__cover"
  }, p.cover), /*#__PURE__*/React.createElement("div", {
    className: "mh-prop__body"
  }, /*#__PURE__*/React.createElement("h4", null, p.title), /*#__PURE__*/React.createElement("div", {
    className: "mh-prop__price"
  }, p.price), /*#__PURE__*/React.createElement("div", {
    className: "mh-prop__meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-resize"
  }), " ", p.m2, " m\xB2"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-bed"
  }), " ", p.suites), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-car"
  }), " ", p.vagas))));
}
function Bio({
  data,
  onOpenChat,
  onOpenProperty
}) {
  const {
    corretor,
    imoveis,
    links
  } = data;
  return /*#__PURE__*/React.createElement("div", {
    className: "mh-bio"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-status"
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
    className: "mh-status__icons"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-cell-signal-full"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-wifi-high"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-battery-full"
  }))), /*#__PURE__*/React.createElement("header", {
    className: "mh-bio__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-bio__brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-symbol.png",
    alt: "match house",
    className: "mh-bio__logo"
  }), /*#__PURE__*/React.createElement("span", {
    className: "mh-bio__brandtxt"
  }, "match house\xAE")), /*#__PURE__*/React.createElement(Av, {
    initials: corretor.avatarInitials,
    size: 84,
    online: true
  }), /*#__PURE__*/React.createElement("h1", {
    className: "mh-bio__name"
  }, corretor.name), /*#__PURE__*/React.createElement("div", {
    className: "mh-bio__creci"
  }, corretor.creci, " \xB7 ", corretor.handle), /*#__PURE__*/React.createElement("p", {
    className: "mh-bio__desc"
  }, corretor.bio), /*#__PURE__*/React.createElement("div", {
    className: "mh-bio__stats"
  }, /*#__PURE__*/React.createElement(SC, {
    icon: "ph-fill ph-star",
    value: corretor.rating,
    label: "aval."
  }), /*#__PURE__*/React.createElement(SC, {
    icon: "ph-fill ph-handshake",
    value: corretor.closings,
    label: "fech."
  }), /*#__PURE__*/React.createElement(SC, {
    icon: "ph-fill ph-lightning",
    value: corretor.responseTime,
    label: "resp."
  }))), /*#__PURE__*/React.createElement("button", {
    className: "mh-ai-card",
    onClick: onOpenChat
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-ai-card__glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mh-ai-card__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mh-ai-card__tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mh-ai-card__pulse"
  }), "IA da Ana \xB7 online"), /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-arrow-right"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "mh-ai-card__title"
  }, "Fale com a IA", /*#__PURE__*/React.createElement("br", null), "e desbloqueie seu mundo"), /*#__PURE__*/React.createElement("p", {
    className: "mh-ai-card__sub"
  }, "A IA da Ana atende voc\xEA 24/7, com o tom de voz dela: tira d\xFAvidas, qualifica e te leva direto pro WhatsApp.")), /*#__PURE__*/React.createElement("section", {
    className: "mh-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-section__head"
  }, /*#__PURE__*/React.createElement("h3", null, "Em destaque"), /*#__PURE__*/React.createElement("button", {
    className: "mh-link"
  }, "ver todos ", /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-arrow-right"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mh-props"
  }, imoveis.map(p => /*#__PURE__*/React.createElement(PropertyCard, {
    key: p.id,
    p: p,
    onClick: () => onOpenProperty(p)
  })))), /*#__PURE__*/React.createElement("section", {
    className: "mh-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mh-section__solo"
  }, "Mais sobre mim"), /*#__PURE__*/React.createElement("div", {
    className: "mh-links"
  }, links.map(l => /*#__PURE__*/React.createElement(LR, {
    key: l.id,
    icon: l.icon,
    label: l.label,
    sub: l.sub
  })))), /*#__PURE__*/React.createElement("footer", {
    className: "mh-foot"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-compact.png",
    alt: "match house"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mh-foot__tag"
  }, "Desbloqueie seu mundo.")));
}
window.Bio = Bio;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/linkbio/Bio.jsx", error: String((e && e.message) || e) }); }

// ui_kits/linkbio/ChatPanel.jsx
try { (() => {
// ChatPanel — bottom sheet with IA Match conversation
const {
  Avatar: AvC,
  MessageBubble: MB,
  TypingDots: TD
} = window;
function ChatPanel({
  data,
  open,
  onClose
}) {
  const [visible, setVisible] = React.useState([]);
  const [typing, setTyping] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setVisible([]);
      setTyping(false);
      return;
    }
    let i = 0;
    setVisible([]);
    const step = () => {
      if (i >= data.conversa.length) return;
      const msg = data.conversa[i];
      if (msg.from === 'ai') {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setVisible(v => [...v, msg]);
          i++;
          setTimeout(step, 700);
        }, 900);
      } else {
        setVisible(v => [...v, msg]);
        i++;
        setTimeout(step, 1100);
      }
    };
    const t = setTimeout(step, 400);
    return () => clearTimeout(t);
  }, [open, data.conversa]);
  return /*#__PURE__*/React.createElement("div", {
    className: `mh-sheet ${open ? 'is-open' : ''}`,
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-sheet__panel",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-sheet__grab"
  }), /*#__PURE__*/React.createElement("header", {
    className: "mh-chat__head"
  }, /*#__PURE__*/React.createElement(AvC, {
    initials: "",
    withLogo: true,
    size: 40,
    online: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "mh-chat__title"
  }, /*#__PURE__*/React.createElement("div", null, "IA Match ", /*#__PURE__*/React.createElement("span", {
    className: "mh-chat__verified"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-seal-check"
  }))), /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("span", {
    className: "mh-chat__live"
  }), " online \xB7 responde na hora")), /*#__PURE__*/React.createElement("button", {
    className: "mh-chat__close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mh-chat__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-chat__intro"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle"
  }), /*#__PURE__*/React.createElement("span", null, "Esta conversa \xE9 atendida pela IA da Match House. A qualquer momento, a Ana pode entrar \u2014 voc\xEA ver\xE1 um \"humano online\".")), visible.map((m, i) => /*#__PURE__*/React.createElement(MB, {
    key: i,
    from: m.from,
    tag: m.tag && i === 0
  }, m.text)), typing && /*#__PURE__*/React.createElement(TD, null)), /*#__PURE__*/React.createElement("div", {
    className: "mh-chat__quick"
  }, /*#__PURE__*/React.createElement("button", null, "\uD83D\uDCC5 Agendar visita"), /*#__PURE__*/React.createElement("button", null, "\uD83D\uDCB0 Quero financiar"), /*#__PURE__*/React.createElement("button", null, "\uD83D\uDCCD Outras regi\xF5es")), /*#__PURE__*/React.createElement("footer", {
    className: "mh-chat__composer"
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Escreva sua mensagem\u2026"
  }), /*#__PURE__*/React.createElement("button", {
    className: "mh-chat__send"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-paper-plane-tilt"
  })))));
}
window.ChatPanel = ChatPanel;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/linkbio/ChatPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/linkbio/PropertyDetail.jsx
try { (() => {
// PropertyDetail — fullscreen detail view for a single listing
const {
  Badge: BdP,
  Button: BtP
} = window;
function PropertyDetail({
  p,
  onBack,
  onOpenChat
}) {
  if (!p) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mh-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-status"
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("div", {
    className: "mh-status__icons"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-cell-signal-full"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-wifi-high"
  }), /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-battery-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__hero",
    style: {
      background: p.gradient
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "mh-detail__back",
    onClick: onBack
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-arrow-left"
  })), /*#__PURE__*/React.createElement("button", {
    className: "mh-detail__save"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-bookmark-simple"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__hero-cover"
  }, p.cover), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__hero-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__bairro"
  }, p.bairro, " \xB7 ", p.city), /*#__PURE__*/React.createElement("h1", null, p.title))), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__match"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__match-num"
  }, "91% match com seu perfil"), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__match-sub"
  }, "Avaliado pela IA Match \xB7 h\xE1 2 min"))), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__price"
  }, p.price), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__specs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-resize"
  }), /*#__PURE__*/React.createElement("b", null, p.m2), " m\xB2"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-bed"
  }), /*#__PURE__*/React.createElement("b", null, p.suites), " su\xEDtes"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "ph ph-car"
  }), /*#__PURE__*/React.createElement("b", null, p.vagas), " vagas")), /*#__PURE__*/React.createElement("div", {
    className: "mh-detail__tags"
  }, p.tags.map(t => /*#__PURE__*/React.createElement(BdP, {
    key: t,
    intent: "soft"
  }, t))), /*#__PURE__*/React.createElement("h3", {
    className: "mh-detail__h3"
  }, "Sobre o im\xF3vel"), /*#__PURE__*/React.createElement("p", {
    className: "mh-detail__copy"
  }, "Cobertura em pr\xE9dio premiado, piso superior com terra\xE7o integrado e vista 270\xB0. Acabamento original do studio Arthur Casas, automa\xE7\xE3o Lutron, ar-condicionado VRF em todos os ambientes."), /*#__PURE__*/React.createElement("h3", {
    className: "mh-detail__h3"
  }, "Pr\xF3ximos passos"), /*#__PURE__*/React.createElement(BtP, {
    variant: "cyan",
    icon: "ph-fill ph-sparkle",
    fullWidth: true,
    onClick: onOpenChat
  }, "Falar com a IA sobre este im\xF3vel"), /*#__PURE__*/React.createElement(BtP, {
    variant: "ghost",
    icon: "ph-fill ph-calendar",
    fullWidth: true
  }, "Agendar visita com a Ana")));
}
window.PropertyDetail = PropertyDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/linkbio/PropertyDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/linkbio/components.jsx
try { (() => {
// Atomic components — Match House Link da Bio UI kit
const {
  useState,
  useEffect,
  useRef
} = React;

// ---------------------------------------------------------------------------
// Avatar — gradient symbol circle with initials, optional online dot
// ---------------------------------------------------------------------------
function Avatar({
  initials = 'M',
  size = 64,
  online = false,
  withLogo = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mh-avatar",
    style: {
      width: size,
      height: size,
      fontSize: size * 0.34
    }
  }, withLogo ? /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-symbol.png",
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", null, initials), online && /*#__PURE__*/React.createElement("span", {
    className: "mh-avatar__dot"
  }));
}

// ---------------------------------------------------------------------------
// Badge — pill with optional icon, multiple intents
// ---------------------------------------------------------------------------
function Badge({
  children,
  intent = 'soft',
  icon,
  live = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `mh-badge mh-badge--${intent} ${live ? 'is-live' : ''}`
  }, live && /*#__PURE__*/React.createElement("span", {
    className: "mh-badge__pulse"
  }), icon && /*#__PURE__*/React.createElement("i", {
    className: icon
  }), /*#__PURE__*/React.createElement("span", null, children));
}

// ---------------------------------------------------------------------------
// Button — primary, dark, cyan, ghost, link
// ---------------------------------------------------------------------------
function Button({
  children,
  variant = 'primary',
  icon,
  iconRight,
  onClick,
  fullWidth,
  size = 'md'
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: `mh-btn mh-btn--${variant} mh-btn--${size} ${fullWidth ? 'is-full' : ''}`,
    onClick: onClick
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: icon
  }), /*#__PURE__*/React.createElement("span", null, children), iconRight && /*#__PURE__*/React.createElement("i", {
    className: iconRight
  }));
}

// ---------------------------------------------------------------------------
// IconTile — squared rounded tile with icon, matches brandbook iconography
// ---------------------------------------------------------------------------
function IconTile({
  icon,
  mode = 'light',
  size = 40
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: `mh-tile mh-tile--${mode}`,
    style: {
      width: size,
      height: size,
      fontSize: size * 0.5
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: icon
  }));
}

// ---------------------------------------------------------------------------
// LinkRow — primary nav row, used in the bio page
// ---------------------------------------------------------------------------
function LinkRow({
  icon,
  label,
  sub,
  onClick,
  accent = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: `mh-linkrow ${accent ? 'is-accent' : ''}`,
    onClick: onClick
  }, /*#__PURE__*/React.createElement(IconTile, {
    icon: icon,
    mode: accent ? 'dark' : 'light',
    size: 42
  }), /*#__PURE__*/React.createElement("span", {
    className: "mh-linkrow__body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mh-linkrow__label"
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    className: "mh-linkrow__sub"
  }, sub)), /*#__PURE__*/React.createElement("i", {
    className: "ph-bold ph-arrow-right mh-linkrow__arrow"
  }));
}

// ---------------------------------------------------------------------------
// MessageBubble — chat bubble (them/you)
// ---------------------------------------------------------------------------
function MessageBubble({
  from,
  children,
  tag
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `mh-msg mh-msg--${from}`
  }, from === 'ai' && /*#__PURE__*/React.createElement(Avatar, {
    initials: "",
    withLogo: true,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    className: `mh-msg__bubble mh-msg__bubble--${from}`
  }, tag && /*#__PURE__*/React.createElement("div", {
    className: "mh-msg__tag"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ph-fill ph-sparkle"
  }), " IA Match \xB7 agora"), children));
}

// ---------------------------------------------------------------------------
// TypingDots — animated typing indicator for AI thinking
// ---------------------------------------------------------------------------
function TypingDots() {
  return /*#__PURE__*/React.createElement("div", {
    className: "mh-msg mh-msg--ai"
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: "",
    withLogo: true,
    size: 32
  }), /*#__PURE__*/React.createElement("div", {
    className: "mh-typing"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)));
}

// ---------------------------------------------------------------------------
// StatChip — small inline stat (e.g. "4.9 ★ · 312 fechamentos")
// ---------------------------------------------------------------------------
function StatChip({
  icon,
  value,
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mh-stat"
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: icon
  }), /*#__PURE__*/React.createElement("b", null, value), /*#__PURE__*/React.createElement("span", null, label));
}

// Expose
Object.assign(window, {
  Avatar,
  Badge,
  Button,
  IconTile,
  LinkRow,
  MessageBubble,
  TypingDots,
  StatChip
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/linkbio/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/linkbio/data.js
try { (() => {
// Mock data for the Link da Bio + IA prototype
window.MH_DATA = {
  corretor: {
    name: 'Ana Coutinho',
    handle: '@ana.coutinhomh',
    creci: 'CRECI-SP 184.520',
    bio: 'Alto padrão · Jardins, Vila Nova, Itaim · 8 anos transformando interesse em fechamento.',
    avatarInitials: 'AC',
    rating: 4.9,
    closings: 312,
    responseTime: '4 min'
  },
  imoveis: [{
    id: 'p1',
    title: 'Triplex com vista panorâmica',
    bairro: 'Vila Nova Conceição',
    city: 'São Paulo, SP',
    price: 'R$ 12.800.000',
    m2: 480,
    suites: 4,
    vagas: 5,
    tags: ['Alto padrão', 'Vista mar', 'Documentação OK'],
    gradient: 'linear-gradient(135deg, #00073e 0%, #0a3fd0 60%, #00efff 100%)',
    cover: 'A'
  }, {
    id: 'p2',
    title: 'Cobertura duplex no Itaim',
    bairro: 'Itaim Bibi',
    city: 'São Paulo, SP',
    price: 'R$ 8.400.000',
    m2: 290,
    suites: 3,
    vagas: 3,
    tags: ['Reformado', 'Pet-friendly'],
    gradient: 'linear-gradient(135deg, #050f5a 0%, #1d6df0 70%, #5af5ff 100%)',
    cover: 'B'
  }, {
    id: 'p3',
    title: 'Casa em condomínio fechado',
    bairro: 'Alphaville',
    city: 'Barueri, SP',
    price: 'R$ 6.900.000',
    m2: 620,
    suites: 5,
    vagas: 6,
    tags: ['Piscina', 'Segurança 24h'],
    gradient: 'linear-gradient(135deg, #00073e 0%, #000f90 80%, #2748df 100%)',
    cover: 'C'
  }],
  links: [{
    id: 'wpp',
    icon: 'ph-fill ph-whatsapp-logo',
    label: 'WhatsApp comigo',
    sub: 'Atendimento humano · 9h–22h'
  }, {
    id: 'tour',
    icon: 'ph-fill ph-video-camera',
    label: 'Tours virtuais 4K',
    sub: 'Visite antes de visitar'
  }, {
    id: 'port',
    icon: 'ph-fill ph-briefcase',
    label: 'Meu portfólio completo',
    sub: '47 imóveis ativos'
  }, {
    id: 'sell',
    icon: 'ph-fill ph-trend-up',
    label: 'Quero vender meu imóvel',
    sub: 'Avaliação grátis em 48h'
  }, {
    id: 'ig',
    icon: 'ph-fill ph-instagram-logo',
    label: 'Siga no Instagram',
    sub: '80k seguidores'
  }],
  conversa: [{
    from: 'ai',
    text: 'Oi! Eu sou a IA Match, assistente da Ana. Posso te ajudar a encontrar o imóvel certo agora — em que faixa de valor você está pensando?',
    tag: true
  }, {
    from: 'you',
    text: 'Algo entre 8 e 12 milhões, 3-4 suítes, em SP capital'
  }, {
    from: 'ai',
    text: 'Perfeito. Tenho 3 matches qualificados pra você. Quer que eu mande um vídeo de 60s do que mais te encaixa?'
  }, {
    from: 'you',
    text: 'Sim, manda'
  }, {
    from: 'ai',
    text: 'Enviado ✓. O triplex em Vila Nova Conceição tem 91% de match com seu perfil. Posso já agendar visita pra Ana te acompanhar amanhã?'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/linkbio/data.js", error: String((e && e.message) || e) }); }

})();
