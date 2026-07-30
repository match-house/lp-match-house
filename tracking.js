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
  var NAV_FALLBACK_MS = 900;

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
      try { localStorage.setItem(ATTR_KEY, JSON.stringify(current)); } catch (e) {}
      return current;
    }

    try { return JSON.parse(localStorage.getItem(ATTR_KEY) || '{}'); }
    catch (e) { return {}; }
  }

  var attribution = loadAttribution();

  // Anexa atribuição + cookies do Meta na URL de destino, pra que o
  // cadastro (outro domínio) saiba de onde a pessoa veio.
  function decorateUrl(href) {
    try {
      var u = new URL(href, window.location.href);

      Object.keys(attribution).forEach(function (k) {
        if (!u.searchParams.has(k)) u.searchParams.set(k, attribution[k]);
      });

      var fbp = getCookie('_fbp');
      var fbc = getCookie('_fbc');
      if (fbp && !u.searchParams.has('fbp')) u.searchParams.set('fbp', fbp);
      if (fbc && !u.searchParams.has('fbc')) u.searchParams.set('fbc', fbc);

      return u.toString();
    } catch (e) {
      return href;
    }
  }

  /* --------------------------------------------------------------------
     DISPARO SEGURO
     O bug antigo: a navegação cancela o beacon do pixel antes dele sair.
     Solução: preventDefault -> dispara -> navega no callback OU no timeout.
     -------------------------------------------------------------------- */

  function fireAndNavigate(eventName, extraParams, destination, openInNewTab) {
    var eventId = newEventId();
    var params = {};

    Object.keys(attribution).forEach(function (k) { params[k] = attribution[k]; });
    Object.keys(extraParams || {}).forEach(function (k) { params[k] = extraParams[k]; });

    var navigated = false;
    function navigate() {
      if (navigated) return;
      navigated = true;
      if (openInNewTab) window.open(destination, '_blank', 'noopener');
      else window.location.href = destination;
    }

    // Meta Pixel — fbq nao tem callback, entao dependemos do timer.
    // O eventID deixa pronto pra dedup quando o CAPI server-side entrar.
    if (typeof window.fbq === 'function') {
      try { window.fbq('track', eventName, params, { eventID: eventId }); }
      catch (e) {}
    }

    // GA4 — esse sim tem eventCallback, entao navega assim que confirmar.
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName === 'Lead' ? 'signup_cta_click' : 'whatsapp_click', {
          event_callback: navigate,
          event_timeout: NAV_FALLBACK_MS,
          mh_event_id: eventId
        });
      } catch (e) {}
    }

    // Rede de segurança: navega de qualquer jeito.
    window.setTimeout(navigate, NAV_FALLBACK_MS);
  }

  /* --------------------------------------------------------------------
     LISTENER (delegado — funciona com CTA renderizado depois)
     -------------------------------------------------------------------- */

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

    if (isSignup) {
      // >>> EVENTO DE OTIMIZACAO DA CAMPANHA META <<<
      fireAndNavigate('Lead', {
        content_name: 'cta_cadastro',
        cta_label: (el.textContent || '').trim().slice(0, 60)
      }, decorateUrl(href), newTab);
    } else {
      // Medicao apenas — mantem o zap vivo como canal de discovery.
      fireAndNavigate('Contact', {
        content_name: 'cta_whatsapp'
      }, href, newTab);
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
