/* =================================================================
   Reviews, vanilla port of the 21st.dev stagger-testimonials.
   A staggered fan of clip-corner cards; center card highlighted.
   Click a side card (or arrows) to rotate the deck, cards animate
   to their new slots. Persistent DOM nodes keep the motion smooth.
   ================================================================= */
(function () {
  'use strict';
  var deck = document.getElementById('stagDeck');
  var root = document.getElementById('reviewStagger');
  if (!deck || !root) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // sample reviewer names — swap for your real reviewers. stars: 1-5.
  var DATA = [
    { q: 'Water heater died on a Sunday with a full house of guests. They had a new one in before dinner, the exact price quoted on the phone. No weekend gouging.', name: 'Marcus D.', service: 'WATER HEATER', stars: 5, av: 'assets/avatars/r1.jpg' },
    { q: 'Three other companies wanted to jackhammer my slab. They found the leak with a sensor, fixed one spot, and saved me thousands. Honest is the word.', name: 'Elena R.', service: 'LEAK DETECTION', stars: 5, av: 'assets/avatars/r2.jpg' },
    { q: 'Repiped our house in two days, walked me through every choice, and the crew swept up after themselves. Felt like having a plumber in the family.', name: 'Tom B.', service: 'WHOLE-HOME REPIPE', stars: 5, av: 'assets/avatars/r3.jpg' },
    { q: 'Called at 1 a.m. with water coming through the ceiling. A real person answered and a truck was out within the hour. Absolute lifesavers.', name: 'Priya N.', service: 'EMERGENCY', stars: 5, av: 'assets/avatars/r4.jpg' },
    { q: 'Flat rate, no surprises, no upsell. The plumber explained everything in plain English before touching a thing.', name: 'Jamal W.', service: 'DRAIN & SEWER', stars: 5, av: 'assets/avatars/r5.jpg' },
    { q: 'Booked online and got a text back in ten minutes. The work was spotless. This is how every contractor should run.', name: 'Sarah L.', service: 'KITCHEN SINK', stars: 5, av: 'assets/avatars/r6.jpg' },
    { q: 'They hooked up our new gas range, pressure-tested the line, and showed me the reading. Felt safe the whole time.', name: 'Hector M.', service: 'GAS LINE', stars: 5, av: 'assets/avatars/r7.jpg' },
    { q: 'The two-year warranty actually meant something, they came back for a tiny drip, no charge, no attitude.', name: 'Karen P.', service: 'WARRANTY', stars: 5, av: 'assets/avatars/r8.jpg' },
    { q: 'Fair price, on time, and boot covers in the house. Small things, but it tells you everything.', name: 'Wei Z.', service: 'BATHROOM', stars: 5, av: 'assets/avatars/r9.jpg' }
  ];

  var uid = 0;
  var list = DATA.map(function (d) { return { id: 'c' + (uid++), q: d.q, name: d.name, service: d.service, stars: d.stars, av: d.av }; });
  var nodes = {};
  var size = 365, timer = null, visible = false;

  function buildCard(d) {
    var card = document.createElement('div');
    card.className = 'stag-card';
    var stars = '★★★★★'.slice(0, d.stars) + '☆☆☆☆☆'.slice(0, 5 - d.stars);
    card.innerHTML =
      '<span class="stag-card__line" aria-hidden="true"></span>' +
      '<div class="stag-card__head">' +
        '<img class="stag-card__av" src="' + d.av + '" alt="" loading="lazy">' +
        '<div class="stag-card__meta">' +
          '<span class="stag-card__name">' + d.name + '</span>' +
          '<span class="stag-card__stars" aria-label="' + d.stars + ' out of 5 stars">' + stars + '</span>' +
        '</div>' +
      '</div>' +
      '<p class="stag-card__quote">“' + d.q + '”</p>' +
      '<p class="stag-card__by">VERIFIED · ' + d.service + '</p>';
    card.addEventListener('click', function () {
      var p = parseInt(card.getAttribute('data-pos'), 10) || 0;
      if (p !== 0) move(p);
    });
    return card;
  }

  function place(card, pos) {
    var isC = pos === 0;
    var ty = isC ? -65 : (pos % 2 ? 15 : -15);
    var rot = isC ? 0 : (pos % 2 ? 2.5 : -2.5);
    card.style.width = card.style.height = size + 'px';
    card.style.transform =
      'translate(-50%,-50%) translateX(' + (size * 0.72 * pos) + 'px) translateY(' + ty + 'px) rotate(' + rot + 'deg)';
    card.style.zIndex = isC ? 10 : 0;
    card.setAttribute('data-pos', pos);
    card.classList.toggle('is-center', isC);
  }

  function render() {
    var n = list.length, seen = {};
    list.forEach(function (d, index) {
      seen[d.id] = true;
      var pos = (n % 2) ? index - (n + 1) / 2 : index - n / 2;
      var card = nodes[d.id];
      if (!card) { card = buildCard(d); nodes[d.id] = card; deck.appendChild(card); }
      place(card, pos);
    });
    Object.keys(nodes).forEach(function (id) {
      if (!seen[id]) { nodes[id].remove(); delete nodes[id]; }
    });
  }

  // rotate the deck; the wrapped item gets a fresh id (a new node), the rest
  // keep their ids so they transition to the next slot.
  function move(steps) {
    var nl = list.slice();
    if (steps > 0) {
      for (var i = steps; i > 0; i--) { var a = nl.shift(); if (!a) return; nl.push({ id: 'c' + (uid++), q: a.q, name: a.name, service: a.service, stars: a.stars, av: a.av }); }
    } else {
      for (var j = steps; j < 0; j++) { var b = nl.pop(); if (!b) return; nl.unshift({ id: 'c' + (uid++), q: b.q, name: b.name, service: b.service, stars: b.stars, av: b.av }); }
    }
    list = nl; render(); restart();
  }

  document.getElementById('stagNext').addEventListener('click', function () { move(1); });
  document.getElementById('stagPrev').addEventListener('click', function () { move(-1); });
  document.addEventListener('keydown', function (e) {
    if (!visible) return;
    if (e.key === 'ArrowLeft') move(-1);
    else if (e.key === 'ArrowRight') move(1);
  });

  function startAuto() { if (timer || !visible) return; timer = setInterval(function () { move(1); }, 2000); }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stopAuto(); startAuto(); }
  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);

  function setSize() { size = window.matchMedia('(min-width: 640px)').matches ? 365 : 288; render(); }
  window.addEventListener('resize', setSize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { visible = en.isIntersecting; if (visible) startAuto(); else stopAuto(); });
    }, { threshold: 0.1 }).observe(root);
  } else { visible = true; startAuto(); }

  setSize();
})();
