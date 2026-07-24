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

  // ── 3. INTERCEPTAR CLIQUES EM WA.ME ───────────────────────
  //
  // Escuta TODOS os cliques no documento (captura).
  // Para wa.me que navega NA MESMA ABA: segura a navegação
  // (preventDefault), dispara Pixel + GA4 e navega no event_callback
  // do GA4 ou num fallback duro de 900ms — o que vier primeiro.
  // Sem isso, o navegador (sobretudo o embutido do Instagram) cancela
  // a requisição do pixel ao descarregar a página, e o Lead se perde.
  //
  document.addEventListener(
    'click',
    function (e) {
      // Encontrar o <a> mais próximo (pode ser clique em <i> dentro do <a>)
      var link = e.target.closest ? e.target.closest('a[href]') : null;
      if (!link) {
        // fallback para browsers sem closest
        var el = e.target;
        while (el && el.tagName !== 'A') el = el.parentElement;
        link = el;
      }
      if (!link || !link.href) return;

      var href = link.href;

      // ── 3a. Clique em wa.me ────────────────────────────────
      if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) {
        // Extrair texto da mensagem (se houver)
        var msgMatch = href.match(/text=([^&]*)/);
        var msg = msgMatch ? decodeURIComponent(msgMatch[1]).substring(0, 50) : '';

        // Identificar posição do botão na página
        var section = 'unknown';
        var parent = link;
        while (parent) {
          if (parent.id) {
            section = parent.id;
            break;
          }
          if (parent.getAttribute && parent.getAttribute('data-screen-label')) {
            section = parent.getAttribute('data-screen-label');
            break;
          }
          parent = parent.parentElement;
        }

        // event_id único; no fbq vai no 4º argumento (eventID), que é
        // onde o Meta lê para deduplicação (pronto p/ CAPI futura)
        var eventId = 'wac_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

        // ── META PIXEL ───────────────────────────────────────
        fbq('trackCustom', 'WhatsAppClick', {
          content_name: 'smartlink_whatsapp_click',
          content_category: section,
          value: 1,
          currency: 'BRL',
        }, { eventID: eventId });

        fbq('track', 'Lead', {
          content_name: 'whatsapp_lead',
          content_category: section,
          value: 1,
          currency: 'BRL',
        }, { eventID: eventId + '_lead' });

        // ── GA4: evento de engajamento ───────────────────────
        gtag('event', 'whatsapp_click', {
          event_category: 'engagement',
          event_label: section,
          link_url: href,
          message_preview: msg,
          event_id: eventId,
          transport_type: 'beacon',
        });

        // Nova aba / janela / modificadores: a página atual não
        // descarrega, o pixel sobrevive — não interceptar a navegação.
        var opensElsewhere =
          link.target === '_blank' ||
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
          (typeof e.button === 'number' && e.button !== 0);

        if (opensElsewhere) {
          gtag('event', 'generate_lead', {
            event_category: 'conversion',
            event_label: 'whatsapp_' + section,
            value: 1,
            currency: 'BRL',
            transport_type: 'beacon',
          });
          console.log('[MH Tracking] WhatsApp click (nova aba):', section, eventId);
          return;
        }

        // Mesma aba: segurar a navegação até o pixel sair.
        e.preventDefault();

        var navigated = false;
        var go = function () {
          if (navigated) return;
          navigated = true;
          window.location.href = href;
        };

        gtag('event', 'generate_lead', {
          event_category: 'conversion',
          event_label: 'whatsapp_' + section,
          value: 1,
          currency: 'BRL',
          transport_type: 'beacon',
          event_callback: go,
          event_timeout: 900,
        });

        // Fallback duro: aconteça o que acontecer (adblock, pixel
        // bloqueado, rede ruim), o usuário navega em ≤ 900ms.
        setTimeout(go, 900);

        console.log('[MH Tracking] WhatsApp click:', section, eventId);
      }

      // ── 3b. Clique em Smart Link externo ───────────────────
      if (href.indexOf('smartli.ink') !== -1) {
        fbq('trackCustom', 'SmartLinkClick', {
          content_name: 'smartlink_demo_click',
          link_url: href,
        });

        gtag('event', 'smartlink_click', {
          event_category: 'engagement',
          event_label: href,
          transport_type: 'beacon',
        });

        console.log('[MH Tracking] SmartLink click:', href);
      }
    },
    true
  ); // useCapture = true para rodar antes de handlers de terceiros

  // ── 4. TRACKING DE SCROLL (25%, 50%, 75%, 100%) ───────────
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };

  window.addEventListener('scroll', function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);

    [25, 50, 75, 100].forEach(function (mark) {
      if (pct >= mark && !scrollMarks[mark]) {
        scrollMarks[mark] = true;

        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: mark + '%',
          value: mark,
        });

        if (mark === 50) {
          fbq('trackCustom', 'ScrollDepth50', {});
        }
        if (mark === 100) {
          fbq('trackCustom', 'ScrollDepth100', {});
        }
      }
    });
  });

  // ── 5. TEMPO NA PÁGINA (30s, 60s, 120s) ───────────────────
  var timeMarks = [30, 60, 120];
  timeMarks.forEach(function (sec) {
    setTimeout(function () {
      gtag('event', 'time_on_page', {
        event_category: 'engagement',
        event_label: sec + 's',
        value: sec,
      });
    }, sec * 1000);
  });

  // ── 6. TRACKING DA CONVERSA INTERATIVA ─────────────────────
  //
  // Observa mudanças no DOM para detectar quando o usuário
  // avança na conversa (chips clicados, nome digitado, etc.)
  //
  var conversaTracked = {};

  // Retorna true se o texto aparece dentro de root E está visível na tela.
  // A checagem de offsetParent evita falso-positivo caso o bloco <sc-if>
  // fique no DOM oculto (display:none) em vez de removido.
  function textoVisivel(root, texto) {
    var els = root.querySelectorAll('div');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (
        el.textContent &&
        el.textContent.indexOf(texto) !== -1 &&
        el.offsetParent !== null
      ) {
        return true;
      }
    }
    return false;
  }

  function checarConversa(root) {
    if (!root) return;

    // ── Prévia do Smart Link apareceu (painel da direita) ──
    if (!conversaTracked.preview && textoVisivel(root, 'Prévia do seu Smart Link')) {
      conversaTracked.preview = true;
      fbq('trackCustom', 'SmartLinkPreview', {});
      gtag('event', 'smartlink_preview', {
        event_category: 'engagement',
        event_label: 'conversa_completa',
      });
      console.log('[MH Tracking] Smart Link preview shown');
    }

    // ── CTA final: "Seu Smart Link no ar em 5 minutos." (c3Done) ──
    if (!conversaTracked.ctaDone && textoVisivel(root, 'Seu Smart Link no ar em 5 minutos')) {
      conversaTracked.ctaDone = true;
      fbq('track', 'CompleteRegistration', {
        content_name: 'conversa_completa',
        value: 1,
        currency: 'BRL',
      });
      gtag('event', 'conversa_completa', {
        event_category: 'conversion',
        event_label: 'conversa_interativa',
      });
      console.log('[MH Tracking] Conversa completa');
    }
  }

  var observer = new MutationObserver(function () {
    checarConversa(document.getElementById('conversa'));
  });

  // Observar mudanças na seção de conversa
  document.addEventListener('DOMContentLoaded', function () {
    var conversa = document.getElementById('conversa');
    if (conversa) {
      observer.observe(conversa, { childList: true, subtree: true });
      checarConversa(conversa); // checagem inicial (caso já esteja renderizado)
    }
  });

  console.log('[MH Tracking] Loaded — Pixel:', META_PIXEL_ID, '| GA4:', GA4_ID);
})();
