/* =================================================================
   Hargrove & Sons — site assistant (rule-based, no AI, $0, offline).
   Answers questions about the business, walks through financing, and
   books a visit by POSTing to the same /api/book endpoint the form uses.
   Knowledge is grounded in window.HARGROVE_KB (generated from data.js),
   so it never invents a phone number, price, or service.

   Input UX is a vanilla port of the 21st.dev "multimodal-ai-chat-input"
   (originally React + shadcn + framer-motion): auto-growing rounded
   textarea, paperclip attach (bottom-left) + circular send (bottom-right),
   attachment preview thumbnails with remove, and suggested-action cards.
   No React/Tailwind/TS — this stays a static site.

   Photo handling is intentionally honest: it previews the image and flags
   it on the booking, but does NOT analyze or transmit it (vision phase).
   ================================================================= */
(function () {
  'use strict';
  var KB = window.HARGROVE_KB;
  if (!KB) return;

  var base = location.pathname.indexOf('/areas/') !== -1 ? '../' : '';
  var biz = KB.biz;
  var hasPhoto = false;     // any image attached this session
  var flow = null;          // active booking flow state, or null
  var pending = [];         // attachments staged in the dock, not yet sent
  var attId = 0;

  /* ---------- build the widget DOM ---------- */
  var launch = el('button', 'cbot-launch', { type: 'button', 'aria-label': 'Open chat assistant', 'aria-expanded': 'false' });
  launch.innerHTML = icon('chat') + '<span class="cbot-launch__dot" aria-hidden="true"></span>';

  var panel = el('section', 'cbot', { role: 'dialog', 'aria-label': 'Hargrove & Sons assistant', 'aria-modal': 'false' });
  panel.innerHTML =
    '<header class="cbot__head">' +
      '<span class="cbot__avatar" aria-hidden="true">' + icon('wrench') + '</span>' +
      '<span class="cbot__id"><strong>Ask Hargrove</strong><span class="cbot__status">Usually replies instantly</span></span>' +
      '<button class="cbot__close" type="button" aria-label="Close chat">' + icon('x') + '</button>' +
    '</header>' +
    '<div class="cbot__log" id="cbotLog" role="log" aria-live="polite"></div>' +
    '<div class="cbot__chips" id="cbotChips"></div>' +
    '<form class="cbot__dock" id="cbotForm">' +
      '<div class="cbot-tray" id="cbotTray" hidden></div>' +
      '<div class="cbot-field">' +
        '<textarea id="cbotText" rows="1" placeholder="Send a message…" aria-label="Type a message"></textarea>' +
        '<button class="cbot-attach" id="cbotPhoto" type="button" aria-label="Attach a photo">' + icon('paperclip') + '</button>' +
        '<button class="cbot-send" id="cbotSend" type="submit" aria-label="Send" disabled>' + icon('arrowup') + '</button>' +
        '<input id="cbotFile" type="file" accept="image/*" multiple hidden />' +
      '</div>' +
    '</form>';

  document.body.appendChild(launch);
  document.body.appendChild(panel);

  var log = panel.querySelector('#cbotLog');
  var chipsWrap = panel.querySelector('#cbotChips');
  var form = panel.querySelector('#cbotForm');
  var input = panel.querySelector('#cbotText');
  var sendBtn = panel.querySelector('#cbotSend');
  var fileInput = panel.querySelector('#cbotFile');
  var tray = panel.querySelector('#cbotTray');
  var greeted = false;

  /* ---------- open / close ---------- */
  function open() {
    panel.classList.add('is-open');
    launch.setAttribute('aria-expanded', 'true');
    launch.classList.add('is-hidden');
    if (!greeted) { greet(); greeted = true; }
    setTimeout(function () { input.focus(); }, 80);
  }
  function close() {
    panel.classList.remove('is-open');
    launch.setAttribute('aria-expanded', 'false');
    launch.classList.remove('is-hidden');
    launch.focus();
  }
  launch.addEventListener('click', open);
  panel.querySelector('.cbot__close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('is-open')) close(); });

  /* ---------- message helpers ---------- */
  function bot(html) {
    var row = el('div', 'cbot-msg cbot-msg--bot');
    row.innerHTML = '<div class="cbot-bubble">' + html + '</div>';
    log.appendChild(row); scroll(); return row;
  }
  function userMsg(text, atts) {
    var row = el('div', 'cbot-msg cbot-msg--me');
    var b = el('div', 'cbot-bubble');
    if (atts && atts.length) {
      var strip = el('div', 'cbot-bubble__atts');
      atts.forEach(function (a) {
        if (a.type.indexOf('image/') === 0) {
          var im = el('img', 'cbot-bubble__img', { src: a.url, alt: a.name });
          strip.appendChild(im);
        } else {
          var f = el('div', 'cbot-bubble__file'); f.textContent = (a.name.split('.').pop() || 'file').toUpperCase();
          strip.appendChild(f);
        }
      });
      b.appendChild(strip);
    }
    if (text) { var t = el('div'); t.textContent = text; b.appendChild(t); }
    row.appendChild(b); log.appendChild(row); scroll();
  }
  function typing(cb) {
    var row = el('div', 'cbot-msg cbot-msg--bot');
    row.innerHTML = '<div class="cbot-bubble cbot-typing"><span></span><span></span><span></span></div>';
    log.appendChild(row); scroll();
    setTimeout(function () { row.remove(); cb(); }, 380);
  }
  function scroll() { log.scrollTop = log.scrollHeight; }

  // pill chips: [{label, act}] or {label, run}
  function chips(list) {
    chipsWrap.innerHTML = '';
    var box = el('div', 'cbot-chiprow');
    list.forEach(function (c) {
      var b = el('button', 'cbot-chip', { type: 'button' });
      b.textContent = c.label;
      b.addEventListener('click', function () { if (c.run) return c.run(); userMsg(c.label); act(c.act); });
      box.appendChild(b);
    });
    chipsWrap.appendChild(box);
  }
  // suggested-action cards (2-col), ported from the component's SuggestedActions
  function cards(list) {
    chipsWrap.innerHTML = '';
    var grid = el('div', 'cbot-cards');
    list.forEach(function (c) {
      var b = el('button', 'cbot-card', { type: 'button' });
      b.innerHTML = '<strong>' + c.title + '</strong><span>' + c.label + '</span>';
      b.addEventListener('click', function () { if (c.run) return c.run(); userMsg(c.title + ' ' + c.label); act(c.act); });
      grid.appendChild(b);
    });
    chipsWrap.appendChild(grid);
  }
  function clearChips() { chipsWrap.innerHTML = ''; }

  function tel() { return '<a href="tel:' + biz.tel + '">' + biz.phone + '</a>'; }
  function menuChips() {
    chips([
      { label: 'Our services', act: 'services' }, { label: 'Service areas', act: 'areas' },
      { label: 'Financing', act: 'financing' }, { label: 'Book a visit', act: 'book' },
      { label: 'Send a photo', act: 'photo' }, { label: 'Talk to a human', act: 'human' }
    ]);
  }

  /* ---------- greeting ---------- */
  function greet() {
    bot('Hi! I’m the <strong>' + biz.name + '</strong> assistant. I can explain our services, walk you through financing, look at a photo of the problem, or book a visit — ' + biz.hours + ', ' + biz.area + '.');
    bot('What do you need a hand with?');
    cards([
      { title: 'Our services', label: 'what we fix, day or night', act: 'services' },
      { title: 'How financing works', label: '$0 down · soft credit pull', act: 'financing' },
      { title: 'Service areas', label: 'find your city + ETA', act: 'areas' },
      { title: 'Book a visit', label: 'fast follow-up, flat rate', act: 'book' }
    ]);
  }

  /* ---------- intent router ---------- */
  function act(cmd) {
    clearChips();
    if (cmd === 'services') return showServices();
    if (cmd.indexOf('svc:') === 0) return showService(cmd.slice(4));
    if (cmd === 'areas') return showAreas();
    if (cmd.indexOf('area:') === 0) return showArea(cmd.slice(5));
    if (cmd === 'financing') return showFinancing();
    if (cmd === 'book') return startBooking();
    if (cmd.indexOf('book:') === 0) return startBooking(cmd.slice(5));
    if (cmd === 'photo') return askPhoto();
    if (cmd === 'human') return showHuman();
    if (cmd === 'hours') return answer('We run <strong>' + biz.hours + '</strong> across ' + biz.area + '. A real person answers ' + tel() + ' day or night.');
    if (cmd === 'credentials') return answer('We’re <strong>' + biz.legal + '</strong>, licensed <strong>' + biz.license + '</strong>, bonded &amp; insured, with a ' + biz.warranty + '.');
    if (cmd === 'pricing') return answer('Every job gets a <strong>flat-rate quote before work starts</strong> — nights and weekends cost the same, no overtime surcharge. You approve the price first.');
    if (cmd === 'reviews') return answer('We’re rated <strong>' + biz.rating + '★</strong> across <strong>' + biz.reviews + '</strong> reviews.');
    if (cmd === 'emergency') return showEmergency();
    if (cmd === 'menu') { bot('What else can I help with?'); return menuChips(); }
    return fallback();
  }
  function answer(html) { typing(function () { bot(html); afterAnswer(); }); }
  function afterAnswer() {
    chips([
      { label: 'Book a visit', act: 'book' },
      { label: 'Call ' + biz.phone, run: function () { location.href = 'tel:' + biz.tel; } },
      { label: 'Main menu', act: 'menu' }
    ]);
  }

  /* ---------- services ---------- */
  function showServices() {
    typing(function () {
      bot('Here’s what we handle. Tap one for details:');
      chips(KB.services.map(function (s) { return { label: shortTitle(s.title), act: 'svc:' + s.slug }; }).concat([{ label: 'Book a visit', act: 'book' }]));
    });
  }
  function showService(slug) {
    var s = find(KB.services, slug); if (!s) return fallback();
    typing(function () {
      bot('<strong>' + s.title + '</strong><br>' + s.body + '<ul class="cbot-list">' + s.bullets.map(function (b) { return '<li>' + b + '</li>'; }).join('') + '</ul>');
      chips([{ label: 'Book ' + shortTitle(s.title).toLowerCase(), act: 'book:' + s.slug }, { label: 'Other services', act: 'services' }, { label: 'Main menu', act: 'menu' }]);
    });
  }

  /* ---------- areas ---------- */
  function showAreas() {
    typing(function () {
      bot('We cover <strong>' + biz.area + '</strong>. Pick your city for response times:');
      chips(KB.areas.map(function (a) { return { label: a.name, act: 'area:' + a.slug }; }));
    });
  }
  function showArea(slug) {
    var a = find(KB.areas, slug); if (!a) return fallback();
    typing(function () {
      bot('<strong>' + a.name + '</strong> — average arrival <strong>' + a.eta + '</strong>.<br>' + a.blurb + '<br><span class="cbot-muted">Neighborhoods: ' + a.neighborhoods.join(', ') + '</span>');
      chips([
        { label: 'Book in ' + a.name, run: function () { userMsg('Book in ' + a.name); flow = null; startBooking(null, a.name); } },
        { label: 'Other areas', act: 'areas' }, { label: 'Main menu', act: 'menu' }
      ]);
    });
  }

  /* ---------- financing ---------- */
  function showFinancing() {
    var f = KB.financing;
    typing(function () {
      bot('<strong>' + f.intro + '</strong>');
      bot('How it works:<ol class="cbot-list cbot-list--num">' + f.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol><span class="cbot-muted">' + f.fine + '</span>');
      bot('Jobs that usually qualify: ' + f.qualifying.join(' · ') + '.');
      chips([{ label: 'Start a request', act: 'book' }, { label: 'Call to check my rate', run: function () { location.href = 'tel:' + biz.tel; } }, { label: 'Main menu', act: 'menu' }]);
    });
  }

  /* ---------- emergency / human ---------- */
  function showEmergency() {
    typing(function () {
      bot('If water is actively flowing, <strong>shut off your main valve</strong> if you can, then call us — we answer ' + biz.hours + ' and roll a stocked truck (average arrival under an hour).');
      chips([{ label: 'Call now ' + biz.phone, run: function () { location.href = 'tel:' + biz.tel; } }, { label: 'Book a visit', act: 'book' }, { label: 'Send a photo', act: 'photo' }]);
    });
  }
  function showHuman() {
    typing(function () {
      bot('A real person picks up ' + biz.hours + ': ' + tel() + '.<br>Prefer we reach out? I can book a visit and a plumber texts you back within the hour (business hours).');
      chips([{ label: 'Call ' + biz.phone, run: function () { location.href = 'tel:' + biz.tel; } }, { label: 'Book a visit', act: 'book' }, { label: 'Main menu', act: 'menu' }]);
    });
  }

  /* ---------- photo (honest: preview only, no analysis this phase) ---------- */
  function askPhoto() {
    typing(function () {
      bot('Sure — tap the paperclip below to attach a photo of the problem, then send.');
      chips([{ label: '📎 Choose a photo', run: function () { fileInput.click(); } }, { label: 'Main menu', act: 'menu' }]);
    });
  }
  function photoAck() {
    typing(function () {
      bot('Got it. I can’t diagnose photos just yet — but if you book a visit I’ll <strong>flag that you have a picture</strong> so the plumber arrives ready. You can also text it to ' + tel() + '.');
      chips([{ label: 'Book a visit', act: 'book' }, { label: 'Text it instead', run: function () { location.href = 'tel:' + biz.tel; } }, { label: 'Main menu', act: 'menu' }]);
    });
  }
  panel.querySelector('#cbotPhoto').addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () {
    var files = Array.from(fileInput.files || []);
    fileInput.value = '';
    var MAX = 25 * 1024 * 1024;
    files.forEach(function (file) {
      if (file.size > MAX) { return; }
      var a = { id: ++attId, url: URL.createObjectURL(file), name: file.name, type: file.type || 'application/octet-stream', size: file.size, uploading: true };
      pending.push(a);
      renderTray();
      // brief "uploading" beat for fidelity to the component, then ready
      setTimeout(function () { a.uploading = false; renderTray(); updateSend(); }, 600);
    });
    updateSend();
  });
  function renderTray() {
    if (!pending.length) { tray.hidden = true; tray.innerHTML = ''; return; }
    tray.hidden = false;
    tray.innerHTML = '';
    pending.forEach(function (a) {
      var item = el('div', 'cbot-att');
      if (a.type.indexOf('image/') === 0) {
        item.innerHTML = '<img class="cbot-att__img" src="' + a.url + '" alt="' + esc(a.name) + '">';
      } else {
        var f = el('div', 'cbot-att__file'); f.textContent = (a.name.split('.').pop() || 'file').toUpperCase(); item.appendChild(f);
      }
      if (a.uploading) {
        var sp = el('div', 'cbot-att__spin'); sp.innerHTML = icon('loader'); item.appendChild(sp);
      } else {
        var x = el('button', 'cbot-att__x', { type: 'button', 'aria-label': 'Remove ' + a.name }); x.innerHTML = icon('x');
        x.addEventListener('click', function () { removeAtt(a.id); });
        item.appendChild(x);
      }
      tray.appendChild(item);
    });
  }
  function removeAtt(id) {
    var a = pending.filter(function (p) { return p.id === id; })[0];
    if (a && a.url.indexOf('blob:') === 0) URL.revokeObjectURL(a.url);
    pending = pending.filter(function (p) { return p.id !== id; });
    renderTray(); updateSend(); input.focus();
  }

  /* ---------- booking flow ---------- */
  function startBooking(slug, areaName) {
    var preset = slug ? find(KB.services, slug) : null;
    flow = { step: 'name', data: { name: '', phone: '', zip: '', service: preset ? preset.title : '', notes: '', area: areaName || '', photo: hasPhoto } };
    typing(function () { bot('Let’s get you booked. A ' + (areaName || 'local') + ' plumber will follow up within the hour (business hours).'); askName(); });
  }
  function askName() { flow.step = 'name'; bot('First — what’s your <strong>name</strong>?'); clearChips(); }
  function askPhone() { flow.step = 'phone'; bot('Thanks, ' + esc(flow.data.name) + '. What’s the best <strong>phone number</strong> to reach you?'); clearChips(); }
  function askZip() { flow.step = 'zip'; bot('What’s your <strong>ZIP code</strong>? (helps us route the nearest truck)'); chips([{ label: 'Skip', run: function () { userMsg('Skip'); flow.data.zip = ''; askService(); } }]); }
  function askService() {
    flow.step = 'service';
    if (flow.data.service) { bot('Got it — logged this as <strong>' + esc(flow.data.service) + '</strong>.'); return askNotes(); }
    bot('What do you need done?');
    chips(KB.services.map(function (s) { return { label: shortTitle(s.title), run: function () { userMsg(shortTitle(s.title)); flow.data.service = s.title; askNotes(); } }; })
      .concat([{ label: 'Something else', run: function () { userMsg('Something else'); flow.data.service = 'Something else'; askNotes(); } }]));
  }
  function askNotes() { flow.step = 'notes'; bot('Anything else we should know? (what’s happening, when it started…)'); chips([{ label: 'Skip', run: function () { userMsg('Skip'); flow.data.notes = ''; confirmBooking(); } }]); }
  function resumeBooking() {
    if (!flow) return;
    var s = flow.step;
    if (s === 'name') return askName(); if (s === 'phone') return askPhone(); if (s === 'zip') return askZip();
    if (s === 'service') return askService(); if (s === 'notes') return askNotes(); if (s === 'confirm') return confirmBooking();
  }
  function confirmBooking() {
    flow.step = 'confirm';
    var d = flow.data;
    bot('Here’s your request:<ul class="cbot-list">' +
      '<li><strong>Name:</strong> ' + esc(d.name) + '</li>' +
      '<li><strong>Phone:</strong> ' + esc(d.phone) + '</li>' +
      (d.zip ? '<li><strong>ZIP:</strong> ' + esc(d.zip) + '</li>' : '') +
      (d.service ? '<li><strong>Service:</strong> ' + esc(d.service) + '</li>' : '') +
      (d.notes ? '<li><strong>Notes:</strong> ' + esc(d.notes) + '</li>' : '') +
      (d.photo ? '<li><strong>Photo:</strong> attached — plumber will review on the visit</li>' : '') +
      '</ul>Send it?');
    chips([{ label: 'Send request', run: submitBooking }, { label: 'Start over', run: function () { userMsg('Start over'); startBooking(); } }, { label: 'Cancel', run: function () { userMsg('Cancel'); flow = null; act('menu'); } }]);
  }
  function submitBooking() {
    var d = flow.data; userMsg('Send request'); clearChips();
    var notes = d.notes;
    if (d.area) notes = (notes ? notes + ' ' : '') + '[Area: ' + d.area + ']';
    if (d.photo) notes = (notes ? notes + ' ' : '') + '[Customer has a photo of the issue to show]';
    typing(function () {
      bot('Sending…');
      fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: d.name, phone: d.phone, zip: d.zip, service: d.service, notes: notes, company: '' }) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (body) { return { res: res, body: body }; }); })
        .then(function (r) {
          if (r.res.ok && r.body.ok) {
            bot('✅ ' + (r.body.message || 'Got it — a plumber will reach out shortly.') + ' We’ll call ' + esc(d.phone) + '.');
            flow = null;
            chips([{ label: 'Call us now', run: function () { location.href = 'tel:' + biz.tel; } }, { label: 'Main menu', act: 'menu' }]);
          } else if (r.res.status === 400 && r.body.fields) {
            var first = Object.values(r.body.fields)[0];
            bot('Hmm — ' + (Array.isArray(first) ? first[0] : 'please check that') + '. Let’s fix it.');
            var key = Object.keys(r.body.fields)[0];
            flow.step = key === 'phone' ? 'phone' : key === 'zip' ? 'zip' : 'name';
            resumeBooking();
          } else { throw new Error(r.body.error || 'failed'); }
        })
        .catch(function () {
          bot('I couldn’t reach the booking server. Please call us at ' + tel() + ' — we’ll pick up.');
          flow = null;
          chips([{ label: 'Call ' + biz.phone, run: function () { location.href = 'tel:' + biz.tel; } }, { label: 'Main menu', act: 'menu' }]);
        });
    });
  }
  function handleBookingInput(text) {
    var d = flow.data;
    if (flow.step === 'name') { if (text.trim().length < 2) { bot('I just need a name to put on the visit — what should I call you?'); return; } d.name = text.trim(); return askPhone(); }
    if (flow.step === 'phone') { if (text.replace(/\D/g, '').length < 7) { bot('That doesn’t look like a full number — mind re-sending it?'); return; } d.phone = text.trim(); return askZip(); }
    if (flow.step === 'zip') { if (!/^\d{5}$/.test(text.trim())) { bot('ZIP should be 5 digits — or tap Skip.'); return; } d.zip = text.trim(); return askService(); }
    if (flow.step === 'service') { d.service = text.trim(); return askNotes(); }
    if (flow.step === 'notes') { d.notes = text.trim(); return confirmBooking(); }
    if (flow.step === 'confirm') { bot('Tap <strong>Send request</strong> to confirm, or Cancel.'); return; }
  }

  /* ---------- free-text routing ---------- */
  var INTENTS = [
    ['emergency', /emergenc|burst|flood|gushing|no water|sewage|overflow/],
    ['financing', /financ|fund|loan|payment|monthly|afford|\$0|zero down|installment|rate/],
    ['book', /book|appoint|schedule|visit|come out|send someone|quote|estimate/],
    ['areas', /area|cover|city|location|near me|do you (serve|come)|zip/],
    ['pricing', /price|cost|how much|fee|charge|flat[- ]?rate/],
    ['hours', /hour|open|when|today|tonight|weekend|24\/7|right now/],
    ['credentials', /licens|insur|bond|legit|certified/],
    ['reviews', /review|rating|stars|reputation/],
    ['photo', /photo|picture|image|pic|show you/],
    ['human', /human|person|agent|talk|call|phone|number|speak/],
    ['services', /service|fix|repair|drain|sewer|water heater|tankless|repipe|leak|faucet|toilet|clog|what do you/]
  ];
  function route(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < KB.services.length; i++) { if (t.indexOf(KB.services[i].slug.replace('-', ' ')) !== -1) return showService(KB.services[i].slug); }
    for (var j = 0; j < KB.areas.length; j++) { if (t.indexOf(KB.areas[j].name.toLowerCase()) !== -1) return showArea(KB.areas[j].slug); }
    for (var k = 0; k < INTENTS.length; k++) { if (INTENTS[k][1].test(t)) return act(INTENTS[k][0]); }
    return fallback();
  }
  function fallback() {
    typing(function () {
      bot('I can help with <strong>services</strong>, <strong>service areas</strong>, <strong>financing</strong>, a <strong>photo</strong> of the problem, or <strong>booking a visit</strong>. You can also reach a person at ' + tel() + '.');
      menuChips();
    });
  }

  /* ---------- dock: auto-grow textarea, send-state, submit ---------- */
  function adjustHeight() { input.style.height = 'auto'; input.style.height = (input.scrollHeight + 2) + 'px'; }
  function updateSend() { sendBtn.disabled = !(input.value.trim().length > 0 || pending.some(function (p) { return !p.uploading; })); }
  input.addEventListener('input', function () { adjustHeight(); updateSend(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !(e.isComposing)) { e.preventDefault(); if (!sendBtn.disabled) doSubmit(); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); if (!sendBtn.disabled) doSubmit(); });

  function doSubmit() {
    var text = input.value.trim();
    var atts = pending.filter(function (p) { return !p.uploading; });
    if (!text && !atts.length) return;

    userMsg(text, atts);
    input.value = ''; input.style.height = 'auto'; input.rows = 1;
    if (atts.length) { hasPhoto = true; pending = pending.filter(function (p) { return p.uploading; }); renderTray(); }
    updateSend();

    if (flow) {
      if (atts.length) flow.data.photo = true;
      if (text) return handleBookingInput(text);
      bot('Added your photo to the request — let’s keep going.'); return resumeBooking();
    }
    if (text) return route(text);
    return photoAck();   // attachment only, no active flow
  }

  /* ---------- tiny helpers ---------- */
  function el(tag, cls, attrs) { var n = document.createElement(tag); if (cls) n.className = cls; if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); }); return n; }
  function find(arr, slug) { for (var i = 0; i < arr.length; i++) if (arr[i].slug === slug) return arr[i]; return null; }
  function shortTitle(t) { return t.split(' &')[0].split(',')[0]; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function icon(name) {
    var p = {
      chat: '<path d="M21 11.5a8.38 8.38 0 0 1-8.9 8.4 8.5 8.5 0 0 1-3.6-.9L3 21l1.9-5.4A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 8.9-8.4 8.38 8.38 0 0 1 8.1 8.4z"/>',
      wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5l-7.3 7.3a2.1 2.1 0 0 1-3-3z"/>',
      x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      paperclip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
      arrowup: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
      loader: '<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>'
    }[name];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
})();
