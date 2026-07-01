/* =================================================================
   "Why neighbors call us first" photo fan — clean coverflow.
   Ported from the IRONHAND photo-showcase demo and re-themed for
   Hargrove (light/cream, ocean-blue glow, local job photos).
   A symmetric, infinitely-wrapping fan: the centre card pops forward
   with a soft glow, neighbours arc down and tilt away. Click any card
   to bring it to centre; arrows, dots, ← → keys and swipe also work.
   No build, no deps — GSAP tweens replaced with CSS transitions.
   ================================================================= */
(function () {
  'use strict';
  var root = document.getElementById('storyFan');
  if (!root) return;
  var layout = document.getElementById('fanLayout');
  var cards = [].slice.call(layout.querySelectorAll('.fan-card'));
  var N = cards.length;
  if (!N) return;

  var VISIBLE = 3;          // cards shown each side of centre (so up to 7 in view)
  var TILT = 7;             // degrees of fan tilt per step
  var active = N >> 1;      // start in the middle
  var entered = false;
  var hovered = null;       // index currently hovered (or null)

  /* spacing + arc scale with the rendered card width so it stays
     proportional on every screen size. Measured live, never guessed. */
  function metrics() {
    // offsetWidth is the un-transformed layout width (getBoundingClientRect
    // would be shrunk by the cards' scale() and bunch the fan together).
    var w = cards[0].offsetWidth || 220;
    return { gap: w * 0.54, arc: w * 0.115 };
  }

  function tf(x, y, rot, scale) {
    return 'translate(-50%,-50%) translateX(' + x + 'px) translateY(' + y +
           'px) rotate(' + rot + 'deg) scale(' + scale + ')';
  }

  function layoutCards(instant) {
    var m = metrics();
    cards.forEach(function (c, i) {
      var off = i - active;
      if (off > N / 2) off -= N;            // wrap for a symmetric infinite fan
      if (off < -N / 2) off += N;
      var a = Math.abs(off);

      var x = off * m.gap;
      var y = a * m.arc;                     // dip down -> arc, centre is the peak
      var rot = off * TILT;
      var scale = off === 0 ? 1.06 : Math.max(0.62, 0.86 - (a - 1) * 0.1);

      // hovered neighbour lifts a touch and stands taller
      if (hovered !== null && i === hovered && off !== 0) { y -= m.arc * 0.9; scale += 0.05; }

      if (instant) c.style.transition = 'none';
      else c.style.transition = '';
      c.style.transitionDelay = (instant ? 0 : a * 0.03) + 's';
      c.style.transform = tf(x, y, rot, scale);
      c.style.zIndex = (hovered === i && off !== 0) ? 60 : 50 - a;
      c.style.opacity = a > VISIBLE ? 0 : (1 - a * 0.18);
      c.style.pointerEvents = a > VISIBLE ? 'none' : 'auto';
      c.classList.toggle('is-center', off === 0);
      if (instant) void c.offsetWidth;       // commit the no-transition frame
    });
    paintDots();
  }

  function setActive(i) {
    active = ((i % N) + N) % N;
    layoutCards(false);
  }

  /* ---- entry animation: collapsed stack -> fans open ---- */
  function play() {
    var m = metrics();
    cards.forEach(function (c) {
      c.style.transition = 'none';
      c.style.transform = tf(0, m.arc * 4, 0, 0.5);
      c.style.opacity = '0';
    });
    void layout.offsetWidth;
    cards.forEach(function (c, i) {
      var off = i - active;
      if (off > N / 2) off -= N;
      if (off < -N / 2) off += N;
      c.style.transition = '';
      c.style.transitionDelay = (0.08 + Math.abs(off) * 0.06) + 's';
    });
    requestAnimationFrame(function () { layoutCards(false); });
    window.setTimeout(function () { entered = true; }, 1100);
  }

  /* ---- dots ---- */
  var nav = document.getElementById('fanNav');
  var dotsWrap = document.getElementById('fanDots');
  var dots = [];
  function paintDots() {
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === active); });
  }
  if (nav) {
    nav.hidden = false;
    var prev = document.getElementById('fanPrev');
    var next = document.getElementById('fanNext');
    if (prev) prev.addEventListener('click', function () { setActive(active - 1); });
    if (next) next.addEventListener('click', function () { setActive(active + 1); });
    cards.forEach(function (_, i) {
      var s = document.createElement('span');
      s.className = 'fan-dot';
      s.addEventListener('click', function () { setActive(i); });
      dotsWrap.appendChild(s);
      dots.push(s);
    });
  }

  /* ---- click a card to centre it + hover lift ---- */
  cards.forEach(function (c, i) {
    c.addEventListener('click', function () { setActive(i); });
    c.addEventListener('mouseenter', function () { hovered = i; layoutCards(false); });
    c.addEventListener('mouseleave', function () { hovered = null; layoutCards(false); });
  });

  /* ---- keyboard ---- */
  document.addEventListener('keydown', function (e) {
    if (!entered) return;
    if (e.key === 'ArrowLeft') setActive(active - 1);
    else if (e.key === 'ArrowRight') setActive(active + 1);
  });

  /* ---- swipe / drag ---- */
  var sx = null;
  layout.addEventListener('pointerdown', function (e) { sx = e.clientX; });
  window.addEventListener('pointerup', function (e) {
    if (sx === null) return;
    var dx = e.clientX - sx;
    if (Math.abs(dx) > 50) setActive(active + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---- responsive relayout ---- */
  var rt = null;
  window.addEventListener('resize', function () {
    if (rt) clearTimeout(rt);
    rt = window.setTimeout(function () { layoutCards(true); }, 120);
  });

  /* ---- autoplay: auto-advance one card per second ---- */
  var AUTOPLAY_MS = 1000;
  var timer = null, onScreen = false, paused = false;
  function startAuto() {
    if (timer) return;
    timer = window.setInterval(function () {
      if (entered && onScreen && !paused) setActive(active + 1);
    }, AUTOPLAY_MS);
  }
  // pause while the pointer is over the fan so hovering to look doesn't get yanked
  root.addEventListener('mouseenter', function () { paused = true; });
  root.addEventListener('mouseleave', function () { paused = false; });

  /* ---- play once the section scrolls into view, then keep autoplaying ---- */
  if ('IntersectionObserver' in window) {
    var started = false;
    new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        onScreen = en.isIntersecting;
        if (onScreen && !started) { started = true; play(); startAuto(); }
      });
    }, { threshold: 0.2 }).observe(root);
  } else {
    onScreen = true; play(); startAuto();
  }
})();
