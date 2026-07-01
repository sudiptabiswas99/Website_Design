/* =================================================================
   Hargrove & Sons, interactions
   ================================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- current year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- hero load reveal ---- */
  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () {
    setTimeout(function () { hero.classList.add('loaded'); }, 80);
  });

  /* ---- reduced motion: don't autoplay the background video ---- */
  var video = document.getElementById('heroVideo');
  if (video && reduce) { try { video.pause(); video.removeAttribute('autoplay'); } catch (e) {} }

  /* ---- sticky header shrink ---- */
  var header = document.getElementById('siteHeader');
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile drawer ---- */
  var toggle = document.getElementById('menuToggle');
  var drawer = document.getElementById('drawer');
  if (toggle && drawer) {
    var setOpen = function (open) {
      drawer.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setOpen(drawer.hidden);
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  /* ---- scroll reveal (bidirectional: fade in on enter, out on leave) ---- */
  // auto-tag content blocks across every page so the whole site reveals/hides
  // on scroll. one block per logical unit (no nesting) to avoid double fades.
  var SR_SELECTORS = [
    '.band-check__copy', '.ziptool',
    '.services .section-head', '.svc-row', '.carousel',
    '.fan', '.stats',
    '.process .section-head', '.step',
    '.reviews__head', '.stagger',
    '.fin-head', '.fin-tabs',
    '.book__copy', '.bookform',
    '.site-footer__col', '.site-footer__lead', '.site-footer__meta',
    // interior pages (services.html, areas/*)
    '.subhero .wrap > *', '.svc-detail', '.cta-band__inner',
    '.area-svc__item', '.hub-card', '.faq__item', '.area-card',
    '.area-intro', '.hood-list', '.area-h2'
  ];
  SR_SELECTORS.forEach(function (sel) {
    [].forEach.call(document.querySelectorAll(sel), function (el) {
      if (!el.closest('.hero') && !el.closest('.site-header') && !el.closest('.utility')) {
        el.classList.add('reveal');
      }
    });
  });

  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  // hero reveals are handled by .loaded; exclude them from the scroll observer
  reveals = reveals.filter(function (el) { return !el.closest('.hero'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle('in', en.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- count-up stats ---- */
  var counted = false;
  var stats = [].slice.call(document.querySelectorAll('.stat__num'));
  function runCount() {
    if (counted) return; counted = true;
    stats.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (isNaN(target)) return; // placeholder stat (e.g. XXXXX), leave the text as-is
      if (reduce) { el.textContent = target.toFixed(dec); return; }
      var start = null, dur = 1400;
      function tick(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      }
      requestAnimationFrame(tick);
    });
  }
  var statWrap = document.querySelector('.stats');
  if (statWrap && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCount(); so.disconnect(); } });
    }, { threshold: 0.4 });
    so.observe(statWrap);
  } else { runCount(); }

  /* ---- ZIP coverage checker ---- */
  // TODO: fill SERVICE_ZIPS with the real ZIP codes you cover, then the checker is live.
  var SERVICE_ZIPS = []; // e.g. ['95814','95816','95818', …]
  function checkZip(form, input, result) {
    var raw = (input.value || '').trim();
    result.className = 'ziptool__result';
    if (!/^\d{5}$/.test(raw)) {
      result.textContent = 'Enter a 5-digit ZIP code.';
      result.classList.add('no'); return;
    }
    if (SERVICE_ZIPS.length === 0) {
      result.textContent = '✓ Thanks, leave your details below and we\'ll confirm coverage for ' + raw + '.';
      result.classList.add('ok');
    } else if (SERVICE_ZIPS.indexOf(raw) !== -1) {
      result.textContent = '✓ Yes, we cover ' + raw + '. Same-day slots usually open. Book below.';
      result.classList.add('ok');
    } else {
      result.textContent = 'That ZIP looks outside our usual area, call us, we may still help or refer you.';
      result.classList.add('no');
    }
  }
  var zipForm = document.getElementById('zipForm');
  if (zipForm) {
    zipForm.addEventListener('submit', function (e) {
      e.preventDefault();
      checkZip(zipForm, document.getElementById('zip'), document.getElementById('zipResult'));
    });
  }

  /* ---- auto-grow textareas (the "What's happening?" field) ---- */
  function autosize(el) { if (!el) return; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  Array.prototype.forEach.call(document.querySelectorAll('textarea[data-autosize]'), function (t) {
    autosize(t);
    t.addEventListener('input', function () { autosize(t); });
  });

  /* ---- booking form -> POST /api/book (+ cookie "account" + success state) ---- */
  var bookForm = document.getElementById('bookForm');
  if (bookForm) {
    var submitBtn = document.getElementById('bookSubmit');

    // Cookie helpers — booking/account lives in cookies, so clearing cookies wipes it.
    var CUST = 'hg_customer', BOOKING = 'hg_booking';
    function setCookie(k, v, days) {
      var d = new Date(); d.setTime(d.getTime() + (days || 30) * 864e5);
      document.cookie = k + '=' + encodeURIComponent(v) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
    }
    function getCookie(k) { var m = document.cookie.match('(?:^|; )' + k + '=([^;]*)'); return m ? decodeURIComponent(m[1]) : null; }
    function delCookie(k) { document.cookie = k + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'; }
    function readJSON(k) { try { return JSON.parse(getCookie(k) || 'null'); } catch (e) { return null; } }
    function $(id) { return document.getElementById(id); }
    function makeRef() {
      var s = (Date.now().toString(36) + Math.random().toString(36).slice(2)).toUpperCase().replace(/[^A-Z0-9]/g, '');
      return 'HS-' + s.slice(0, 6);
    }

    function showSuccess(rec) {
      // Pages without the rich panel (e.g. service-area pages) fall back to an inline message.
      if (!$('bookSuccess')) {
        var m = $('bookMsg');
        if (m) { m.className = 'bookform__msg ok'; m.textContent = 'Request received (' + rec.ref + ') — a Sacramento plumber will call ' + rec.phone + ' shortly.'; }
        bookForm.reset();
        return;
      }
      $('bsRef').textContent = '#' + rec.ref;
      $('bsService').textContent = rec.service || 'General plumbing';
      $('bsAddress').textContent = rec.address || (rec.zip ? 'ZIP ' + rec.zip : '—');
      $('bsPhone').textContent = rec.phone;
      $('bsLead').textContent = 'A licensed Sacramento plumber will call you at ' + rec.phone +
        ' within the hour (business hours) to confirm your visit window.';
      bookForm.hidden = true;
      var ret = $('bookReturn'); if (ret) ret.hidden = true;
      var s = $('bookSuccess'); s.hidden = false;
      s.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Returning visitor: prefill from the saved cookie + show a welcome banner.
    (function prefill() {
      var cust = readJSON(CUST);
      if (!cust) return;
      var map = { name: 'name', phone: 'phone', address: 'address', zip: 'zip2', lat: 'lat', lng: 'lng' };
      Object.keys(map).forEach(function (key) {
        var el = $(map[key]); if (el && cust[key] && !el.value) el.value = cust[key];
      });
      if (cust.lat && cust.lng) { var f = document.querySelector('.field--address'); if (f) f.classList.add('has-pin'); }
      var ret = $('bookReturn');
      if (ret) {
        var last = readJSON(BOOKING);
        var first = (cust.name || 'there').split(' ')[0];
        $('bookReturnText').textContent = last && last.ref
          ? 'Welcome back, ' + first + ' — your request #' + last.ref + ' is on file. Need another visit?'
          : 'Welcome back, ' + first + ' — your details are saved on this device.';
        ret.hidden = false;
      }
    })();

    var clearBtn = $('bookReturnClear');
    if (clearBtn) clearBtn.addEventListener('click', function () {
      delCookie(CUST); delCookie(BOOKING);
      bookForm.reset();
      $('lat').value = ''; $('lng').value = '';
      var f = document.querySelector('.field--address'); if (f) f.classList.remove('has-pin');
      var ret = $('bookReturn'); if (ret) ret.hidden = true;
      autosize($('notes'));
    });

    var anotherBtn = $('bookAnother');
    if (anotherBtn) anotherBtn.addEventListener('click', function () {
      $('bookSuccess').hidden = true;
      bookForm.hidden = false;
      var m = $('bookMsg'); if (m) { m.textContent = ''; m.className = 'bookform__msg'; }
      autosize($('notes'));
      bookForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    bookForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var msg = $('bookMsg');
      var data = Object.fromEntries(new FormData(bookForm).entries());

      // quick client-side check (server validates authoritatively)
      if (!data.name || data.name.trim().length < 2 || !data.phone || data.phone.trim().length < 7) {
        msg.className = 'bookform__msg'; msg.style.color = 'var(--copper-d)';
        msg.textContent = 'Add your name and a phone number so we can reach you.';
        return;
      }

      var label = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      msg.className = 'bookform__msg'; msg.style.color = ''; msg.textContent = '';

      var rec = { ref: makeRef(), name: data.name, phone: data.phone, address: data.address || '',
        zip: data.zip || '', service: data.service || '', ts: Date.now() };
      setCookie(CUST, JSON.stringify({ name: data.name, phone: data.phone, address: data.address || '',
        zip: data.zip || '', lat: data.lat || '', lng: data.lng || '' }), 60);
      setCookie(BOOKING, JSON.stringify(rec), 30);
      // No backend on static hosting: open the visitor's email client with the booking pre-filled.
      var lines = Object.keys(data).filter(function (k) { return String(data[k]).trim(); })
        .map(function (k) { return k + ': ' + data[k]; });
      window.location.href = 'mailto:hello@hargroveplumbing.com?subject=' +
        encodeURIComponent('Booking request ' + rec.ref) + '&body=' + encodeURIComponent(lines.join(String.fromCharCode(10)));
      showSuccess(rec);
      bookForm.reset();
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = label; }
    });
  }
})();
