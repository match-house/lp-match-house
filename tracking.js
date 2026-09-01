/* =========================================================================
   BOOTSTRAP (preservado da versao anterior — o codigo novo abaixo assume
   que o pixel base e o GA4 ja estao carregados; neste repo eles vivem aqui)
   - limpeza de utm_source corrompido pelos url_tags (roda ANTES do pixel)
   - Meta Pixel base (init + PageView + noscript)
   - GA4 loader + config
   ========================================================================= */
/* ============================================================
   Match House — Tracking Script (Meta Pixel + GA4)
   Arquivo: tracking.js
   Adicionar ao <head> do index.html:
     <script src="tracking.js"></script>
   ============================================================ */

(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────────
  var META_PIXEL_ID = '1159381878670820';
  var GA4_ID = 'G-HCDP75SR8J';
  // ────────────────────────────────────────────────────────────

  // ── 0. LIMPAR UTMs CORROMPIDOS DOS ANÚNCIOS ────────────────
  //
  // Os anúncios de julho/2026 foram salvos com a URL inteira colada no
  // campo "Parâmetros de URL" do Meta Ads; o Meta anexa aquilo à query
  // e a página chega com um par-lixo do tipo
  //   ?https://matchhouse.com.br/go?utm_source=meta&utm_medium=cpc&...
  // O utm_source real fica preso dentro do par-lixo e o GA4 perde a
  // origem da sessão. Antes de iniciar Pixel/GA4: recupera o utm_source,
  // descarta o lixo, remove utm_* duplicado e reescreve a URL
  // (replaceState) para os dois lerem a query limpa.
  //
  try {
    var rawPairs = window.location.search.replace(/^\?/, '').split('&');
    var cleanPairs = [];
    var seenUtm = {};
    var recoveredSource = null;
    var queryChanged = false;
    for (var qi = 0; qi < rawPairs.length; qi++) {
      if (!rawPairs[qi]) continue;
      var decPair = rawPairs[qi];
      try { decPair = decodeURIComponent(decPair); } catch (errDec) {}
      if (decPair.indexOf('://') !== -1) {
        var srcMatch = decPair.match(/utm_source=([^&?]*)/);
        if (srcMatch && srcMatch[1] && !recoveredSource) recoveredSource = srcMatch[1];
        queryChanged = true;
        continue;
      }
      var utmKey = decPair.indexOf('utm_') === 0 ? decPair.split('=')[0] : null;
      if (utmKey) {
        if (seenUtm[utmKey]) { queryChanged = true; continue; }
        seenUtm[utmKey] = true;
      }
      cleanPairs.push(rawPairs[qi]);
    }
    if (recoveredSource && !seenUtm.utm_source) {
      cleanPairs.unshift('utm_source=' + recoveredSource);
      queryChanged = true;
    }
    if (queryChanged && window.history && window.history.replaceState) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname +
          (cleanPairs.length ? '?' + cleanPairs.join('&') : '') +
          window.location.hash
      );
    }
  } catch (errUtm) { /* limpeza nunca pode travar o tracking */ }

  // ── 1. META PIXEL (base code) ──────────────────────────────
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');

  // noscript fallback (pixel img)
  var ns = document.createElement('noscript');
  var img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src =
    'https://www.facebook.com/tr?id=' +
    META_PIXEL_ID +
    '&ev=PageView&noscript=1';
  ns.appendChild(img);
  document.body.appendChild(ns);

  // ── 2. GOOGLE ANALYTICS 4 (gtag) ──────────────────────────
  var gs = document.createElement('script');
  gs.async = true;
  gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(gs);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA4_ID, {
    send_page_view: true,
  });
})();


/* =========================================================================
   Match House — tracking.js
   LP: matchhouse.com.br  |  Pixel: 1159381878670820  |  GA4: G-HCDP75SR8J

   O QUE MUDOU (jul/2026):
   - `Lead`    -> agora dispara no CTA de CADASTRO (evento de otimizacao Meta)
   - `Contact` -> agora dispara no CTA de WhatsApp (medicao, NAO otimizacao)
   - UTMs + fbclid + _fbp/_fbc sao repassados pra URL de cadastro (cross-domain)

   IMPORTANTE: nao renomeie o evento `Lead`. O conjunto
   "[07] Criativos Manual" otimiza por ele. Trocar o nome reseta o aprendizado.
   ========================================================================= */
(function () {
  'use strict';

  /* --------------------------------------------------------------------
     CONFIG — ajuste só esta parte
     -------------------------------------------------------------------- */

  // Qualquer link cujo href bata com isto é tratado como CTA de cadastro.
  // Alternativa mais segura: coloque data-mh-cta="signup" no botão.
  var SIGNUP_HREF = /(\/cadastro|\/signup|\/login|\/entrar|app\.matchhouse\.com\.br|app\.smartli\.ink)/i;

  // CTA de WhatsApp.
  var WHATSAPP_HREF = /(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)/i;

  // Tempo máximo que seguramos a navegação esperando o beacon do pixel.
  // São dois tetos porque o custo de errar é o botão ficar morto no dedo
  // da pessoa:
  //   - GA4 no ar   -> o event_callback volta em ~100ms e este teto quase
  //                    nunca é usado; fica só como rede de segurança.
  //   - GA4 bloqueado (adblock/Brave/Safari com proteção) -> o callback
  //                    NUNCA chega. Aí seguramos apenas o mínimo para o
  //                    beacon do fbq sair. Antes eram 900ms de botão morto.
  var NAV_FALLBACK_MS = 400;
  var NAV_NO_GA4_MS = 150;

  // Clique repetido no MESMO CTA. Mesmo com a navegacao rapida, o corretor
  // no celular toca duas vezes quando a tela nao muda na hora. Sem trava,
  // cada toque virava um `Lead` separado e inflava justamente o numero que
  // a campanha otimiza (os dados do Meta mostram 728 cliques no anuncio
  // vindos de 617 pessoas: reclicar e comportamento real deste publico).
  // Dentro da janela, o segundo toque navega na hora e NAO dispara evento.
  var REFIRE_WINDOW_MS = 1500;

  var ATTR_KEY = 'mh_attr';
  var ATTR_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign',
                     'utm_content', 'utm_term', 'fbclid', 'gclid'];

  /* --------------------------------------------------------------------
     HELPERS
     -------------------------------------------------------------------- */

  function getCookie(name) {
    var m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return m ? m.pop() : null;
  }

  function newEventId() {
    return 'mh-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
  }

  // Grava a atribuição na 1a visita e reusa nas seguintes (o corretor
  // costuma clicar no anúncio, sair, e voltar depois pelo direto).
  // TTL de 30 dias: atribuição guardada some sozinha depois disso, senão
  // um clique antigo (ex.: tags de julho pré-retag) vale para sempre e
  // contamina a leitura por criativo. O formato antigo (sem timestamp)
  // é descartado de propósito — é ele que carrega o resíduo "ig".
  var ATTR_TTL_MS = 30 * 24 * 60 * 60 * 1000;

  function loadAttribution() {
    var current = {};
    var found = false;

    try {
      var qs = new URLSearchParams(window.location.search);
      ATTR_PARAMS.forEach(function (k) {
        var v = qs.get(k);
        if (v) { current[k] = v; found = true; }
      });
    } catch (e) { /* browser antigo — segue sem */ }

    if (found) {
      try {
        localStorage.setItem(ATTR_KEY, JSON.stringify({ v: current, ts: Date.now() }));
      } catch (e) {}
      return current;
    }

    try {
      var stored = JSON.parse(localStorage.getItem(ATTR_KEY) || 'null');
      if (!stored || typeof stored !== 'object' || !stored.v || !stored.ts) {
        // vazio ou formato antigo (pré-TTL): limpa e segue sem atribuição
        try { localStorage.removeItem(ATTR_KEY); } catch (e) {}
        return {};
      }
      if (Date.now() - stored.ts > ATTR_TTL_MS) {
        try { localStorage.removeItem(ATTR_KEY); } catch (e) {}
        return {};
      }
      return stored.v;
    } catch (e) { return {}; }
  }

  var attribution = loadAttribution();

  // Anexa atribuição + cookies do Meta na URL de destino, pra que o
  // cadastro (outro domínio) saiba de onde a pessoa veio.
  function decorateUrl(href, eventId) {
    try {
      var u = new URL(href, window.location.href);

      Object.keys(attribution).forEach(function (k) {
        if (!u.searchParams.has(k)) u.searchParams.set(k, attribution[k]);
      });

      var fbp = getCookie('_fbp');
      var fbc = getCookie('_fbc');
      if (fbp && !u.searchParams.has('fbp')) u.searchParams.set('fbp', fbp);
      if (fbc && !u.searchParams.has('fbc')) u.searchParams.set('fbc', fbc);

      // mh_eid: MESMO id do evento `Lead` disparado aqui. O cadastro roda em
      // outro dominio (app.smartli.ink), entao este e o unico fio que liga
      // "clicou em criar conta" a "criou a conta". Com ele o app pode mandar
      // o CompleteRegistration pelo CAPI usando este eventID e o Meta
      // deduplica os dois lados em vez de contar como visitas soltas.
      // mh_src: marca que a pessoa veio pela LP, e nao do anuncio direto.
      if (eventId && !u.searchParams.has('mh_eid')) u.searchParams.set('mh_eid', eventId);
      if (!u.searchParams.has('mh_src')) u.searchParams.set('mh_src', 'lp');

      return u.toString();
    } catch (e) {
      return href;
    }
  }

  /* --------------------------------------------------------------------
     FUGA DO NAVEGADOR INTERNO (Android)

     Quase todo o trafego pago chega pelo navegador embutido do Instagram.
     No Android esse navegador e uma WebView, e o Google BLOQUEIA o login
     dele por politica de seguranca ("disallowed_useragent"). Como a tela
     de cadastro do app so oferece Google e Apple, e o corretor de Android
     nao tem Apple ID, ele fica sem saida.

     Os numeros batem com isso (21-31/08): Android converte 1,49% do clique
     ao cadastro; iPhone, 4,37% — quase 3x mais, e o iPhone tem o botao
     Apple funcionando dentro da WebView.

     Solucao: no Android + navegador interno, mandar o destino para o
     Chrome de verdade via intent://. Tres redes de seguranca:
       1. S.browser_fallback_url — se o Chrome nao estiver instalado, o
          proprio Android navega para a URL normal.
       2. timer de 1,2s — se o intent nao fizer nada, navega do jeito antigo.
       3. try/catch — qualquer erro cai na navegacao normal.
     Em iPhone e em navegador normal NADA muda.
     -------------------------------------------------------------------- */

  var ESCAPE_FALLBACK_MS = 1200;

  function isAndroidInAppBrowser() {
    var ua = navigator.userAgent || '';
    return /Android/i.test(ua) && /(Instagram|FBAN|FBAV|FB_IAB)/i.test(ua);
  }

  function chromeIntentUrl(httpsUrl) {
    return 'intent://' + httpsUrl.replace(/^https?:\/\//i, '') +
           '#Intent;scheme=https;package=com.android.chrome;' +
           'S.browser_fallback_url=' + encodeURIComponent(httpsUrl) + ';end';
  }

  // allowEscape: so o CTA de cadastro tenta sair. O WhatsApp nao — o
  // navegador interno ja abre o app do WhatsApp sozinho.
  function openDestination(url, newTab, allowEscape) {
    if (newTab) { window.open(url, '_blank', 'noopener'); return; }

    if (allowEscape && isAndroidInAppBrowser()) {
      var cancelled = false;
      var fallback = window.setTimeout(function () {
        if (cancelled) return;
        cancelled = true;
        window.location.href = url;
      }, ESCAPE_FALLBACK_MS);
      function cancel() {
        if (cancelled) return;
        cancelled = true;
        window.clearTimeout(fallback);
      }
      function onVis() { if (document.hidden) cancel(); }
      document.addEventListener('visibilitychange', onVis);
      window.addEventListener('pagehide', cancel);
      try {
        window.location.href = chromeIntentUrl(url);
        return;
      } catch (e) { cancel(); }
    }

    window.location.href = url;
  }

  /* --------------------------------------------------------------------
     DISPARO SEGURO
     O bug antigo: a navegação cancela o beacon do pixel antes dele sair.
     Solução: preventDefault -> dispara -> navega no callback OU no timeout.
     -------------------------------------------------------------------- */

  function fireAndNavigate(eventName, extraParams, destination, openInNewTab, eventId) {
    eventId = eventId || newEventId();
    var params = {};

    Object.keys(attribution).forEach(function (k) { params[k] = attribution[k]; });
    Object.keys(extraParams || {}).forEach(function (k) { params[k] = extraParams[k]; });

    var navigated = false;
    var navTimer = null;
    function navigate() {
      if (navigated) return;
      navigated = true;
      if (navTimer) window.clearTimeout(navTimer);
      openDestination(destination, openInNewTab, eventName === 'Lead');
    }

    // window.gtag é definido no bootstrap DESTE arquivo (só empilha no
    // dataLayer), então ele existe mesmo quando o gtag.js do Google é
    // bloqueado — e nesse caso esperar o event_callback trava o clique à toa.
    // google_tag_manager só aparece se o script real subiu: é o único jeito
    // de saber se vale a pena esperar.
    var ga4Live = typeof window.google_tag_manager !== 'undefined';
    var waitMs = ga4Live ? NAV_FALLBACK_MS : NAV_NO_GA4_MS;

    // Meta Pixel — fbq nao tem callback, entao dependemos do timer.
    // O eventID deixa pronto pra dedup quando o CAPI server-side entrar.
    if (typeof window.fbq === 'function') {
      try { window.fbq('track', eventName, params, { eventID: eventId }); }
      catch (e) {}
    }

    // GA4 — esse sim tem eventCallback, entao navega assim que confirmar.
    // Com o gtag.js bloqueado ainda empilhamos o evento no dataLayer (se o
    // script subir depois, ele é processado), mas sem esperar callback.
    if (typeof window.gtag === 'function') {
      var gaParams = { mh_event_id: eventId };
      if (ga4Live) {
        gaParams.event_callback = navigate;
        gaParams.event_timeout = waitMs;
      }
      try {
        window.gtag('event', eventName === 'Lead' ? 'signup_cta_click' : 'whatsapp_click', gaParams);
      } catch (e) {}
    }

    // Rede de segurança: navega de qualquer jeito.
    navTimer = window.setTimeout(navigate, waitMs);
  }

  /* --------------------------------------------------------------------
     LISTENER (delegado — funciona com CTA renderizado depois)
     -------------------------------------------------------------------- */

  // Ultimo CTA disparado, para a trava de reclique (REFIRE_WINDOW_MS).
  var lastFire = { key: '', ts: 0, eid: '' };

  document.addEventListener('click', function (ev) {
    // Deixa passar: ctrl/cmd/shift click, botão do meio, default já prevenido.
    if (ev.defaultPrevented || ev.button !== 0) return;
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

    var el = ev.target.closest ? ev.target.closest('a, [data-mh-cta]') : null;
    if (!el) return;

    var href = el.getAttribute('href') || el.getAttribute('data-mh-href') || '';
    var flag = el.getAttribute('data-mh-cta') || '';

    var isSignup   = flag === 'signup'   || (href && SIGNUP_HREF.test(href));
    var isWhatsapp = flag === 'whatsapp' || (href && WHATSAPP_HREF.test(href));

    if (!isSignup && !isWhatsapp) return;
    if (!href) return;

    var newTab = el.getAttribute('target') === '_blank';

    ev.preventDefault();

    // Reclique no mesmo CTA dentro da janela: navega direto, sem disparar
    // o evento de novo. Reaproveita o mesmo eventID para o destino nao
    // mudar entre um toque e outro.
    var fireKey = (isSignup ? 'signup:' : 'whatsapp:') + href;
    var now = Date.now();
    if (lastFire.key === fireKey && (now - lastFire.ts) < REFIRE_WINDOW_MS) {
      var again = isSignup ? decorateUrl(href, lastFire.eid) : href;
      openDestination(again, newTab, isSignup);
      return;
    }

    var eventId = newEventId();
    lastFire = { key: fireKey, ts: now, eid: eventId };

    if (isSignup) {
      // >>> EVENTO DE OTIMIZACAO DA CAMPANHA META <<<
      fireAndNavigate('Lead', {
        content_name: 'cta_cadastro',
        cta_label: (el.textContent || '').trim().slice(0, 60)
      }, decorateUrl(href, eventId), newTab, eventId);
    } else {
      // Medicao apenas — mantem o zap vivo como canal de discovery.
      fireAndNavigate('Contact', {
        content_name: 'cta_whatsapp'
      }, href, newTab, eventId);
    }
  }, true);

  /* --------------------------------------------------------------------
     PageView de apoio (o pixel base já dispara o seu; este é só o custom)
     -------------------------------------------------------------------- */

  if (typeof window.fbq === 'function') {
    try {
      window.fbq('trackCustom', 'LPView', {
        content_name: 'lp_smartlink',
        utm_content: attribution.utm_content || '(none)'
      });
    } catch (e) {}
  }
})();

/* =========================================================================
   SCROLL DEPTH (reintroduzido em 30/07 a pedido do time de análise)
   - GA4:   scroll_depth { percent_scrolled }
   - Pixel: ScrollDepth25 / ScrollDepth50 / ScrollDepth75 / ScrollDepth100
   Dispara uma única vez por marco, listener passivo (não afeta performance).
   ========================================================================= */
(function () {
  'use strict';

  var marks = { 25: false, 50: false, 75: false, 100: false };

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);

    [25, 50, 75, 100].forEach(function (mark) {
      if (pct >= mark && !marks[mark]) {
        marks[mark] = true;

        if (typeof window.fbq === 'function') {
          try { window.fbq('trackCustom', 'ScrollDepth' + mark, { percent: mark }); }
          catch (e) {}
        }
        if (typeof window.gtag === 'function') {
          try {
            window.gtag('event', 'scroll_depth', {
              percent_scrolled: mark,
              transport_type: 'beacon'
            });
          } catch (e) {}
        }
      }
    });

    if (marks[100]) window.removeEventListener('scroll', onScroll);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
