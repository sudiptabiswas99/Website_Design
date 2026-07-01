/* =================================================================
   Footer scroll-reveal — the "Flow Art / story scroll" rotate-into-
   place effect (originally React + GSAP ScrollTrigger), rebuilt as a
   self-contained vanilla scrubber. The footer panel starts tilted on
   its bottom-left corner and straightens to flat as you scroll the
   last stretch of the page into view.

   Why not GSAP/ScrollTrigger here: the footer is the LAST element on
   the page and rides an unusual `top:-100vh` sticky-reveal track, so
   any trigger whose end is "footer top reaches viewport top" can
   never complete (nothing scrolls below it) and the tilt freezes
   mid-animation. Instead we map progress to page-bottom proximity,
   which always reaches 1 at the very bottom — so it can never stick.

   Desktop only (>1000px, matching the CSS that drops the sticky
   footer on mobile) and disabled under prefers-reduced-motion.
   ================================================================= */
(function () {
  'use strict';

  var footer = document.querySelector('.sticky-footer .site-footer');
  if (!footer) return;

  var deskMQ = window.matchMedia('(min-width: 1001px)');
  var motionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var MAX_TILT = 12;     // degrees at the start of the reveal
  var ZONE = 0.85;       // straightens over the last 0.85 * viewport height
  var raf = null;
  var active = false;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function render() {
    raf = null;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight;
    var distFromBottom = docH - (window.scrollY + vh); // 0 at the very bottom
    var p = clamp01(1 - distFromBottom / (vh * ZONE));
    footer.style.transform = 'rotate(' + ((1 - p) * MAX_TILT).toFixed(3) + 'deg)';
  }

  function onScroll() {
    if (raf === null) raf = requestAnimationFrame(render);
  }

  function enable() {
    if (active) return;
    active = true;
    footer.style.transformOrigin = 'bottom left';
    footer.style.willChange = 'transform';
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    render();
  }

  function disable() {
    if (!active) return;
    active = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    footer.style.transform = '';
    footer.style.transformOrigin = '';
    footer.style.willChange = '';
  }

  function sync() {
    if (deskMQ.matches && !motionMQ.matches) enable();
    else disable();
  }

  sync();
  deskMQ.addEventListener('change', sync);
  motionMQ.addEventListener('change', sync);
  window.addEventListener('load', function () { if (active) render(); });
})();
