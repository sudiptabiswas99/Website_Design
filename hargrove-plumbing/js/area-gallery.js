/* =================================================================
   Service-area gallery — vanilla port of the shadcn "Gallery4"
   (originally React + Embla). Horizontal scroll-snap carousel of
   satellite city cards: arrows, dots, pointer-drag, keyboard.
   ================================================================= */
(function () {
  'use strict';
  var vp = document.getElementById('areaGallery');
  if (!vp) return;
  var track = vp.querySelector('.area-gallery__track');
  var cards = [].slice.call(track.querySelectorAll('.ag-card'));
  if (!cards.length) return;
  var prevBtn = document.getElementById('agPrev');
  var nextBtn = document.getElementById('agNext');
  var dotsWrap = document.getElementById('agDots');

  function base0() { return cards[0].offsetLeft; }              // = track padding-left
  function targetFor(i) { return cards[i].offsetLeft - base0(); }
  function maxScroll() { return vp.scrollWidth - vp.clientWidth; }

  function activeIndex() {
    var x = vp.scrollLeft, best = 0, bd = Infinity;
    cards.forEach(function (_, i) { var d = Math.abs(targetFor(i) - x); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function scrollToCard(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    vp.scrollTo({ left: targetFor(i), behavior: 'smooth' });
  }

  /* ---- dots ---- */
  var dots = cards.map(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ag-dot';
    var t = c.querySelector('.ag-card__title');
    b.setAttribute('aria-label', 'Go to ' + (t ? t.textContent : 'slide ' + (i + 1)));
    b.addEventListener('click', function () { scrollToCard(i); });
    dotsWrap.appendChild(b);
    return b;
  });

  function sync() {
    var i = activeIndex();
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    if (prevBtn) prevBtn.disabled = vp.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = vp.scrollLeft >= maxScroll() - 2;
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { scrollToCard(activeIndex() - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollToCard(activeIndex() + 1); });

  var raf = null;
  vp.addEventListener('scroll', function () {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; sync(); });
  }, { passive: true });
  window.addEventListener('resize', sync);

  /* ---- pointer drag (desktop grab-to-scroll) ---- */
  var down = false, startX = 0, startScroll = 0, moved = false;
  vp.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;       // native touch scroll handles this
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft;
    vp.classList.add('is-dragging');
  });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    vp.scrollLeft = startScroll - dx;
  });
  window.addEventListener('pointerup', function () {
    if (!down) return;
    down = false; vp.classList.remove('is-dragging');
    scrollToCard(activeIndex());                 // snap to nearest
  });
  // a drag shouldn't trigger the card's link
  cards.forEach(function (c) { c.addEventListener('click', function (e) { if (moved) { e.preventDefault(); } }); });

  sync();
})();
