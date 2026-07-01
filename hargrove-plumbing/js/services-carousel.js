/* =================================================================
   "What we fix", vanilla port of the 21st.dev circular-testimonials
   3D carousel. Stacked images (left / center / right), autoplay,
   arrows, dots, keyboard nav, blur-in copy. Repurposed for services.
   ================================================================= */
(function () {
  'use strict';
  var root = document.getElementById('svcCarousel');
  var stage = document.getElementById('carStage');
  if (!root || !stage) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SERVICES = [
    { name: 'Water leaks & burst pipes', tag: 'EMERGENCY · 24/7', img: 'assets/svc/water-leak.jpg',
      quote: 'Burst lines, slab leaks, failed shutoffs, flooding. We answer day or night, stop the damage fast, then fix it right with a flat-rate quote first.' },
    { name: 'Gas lines', tag: 'CERTIFIED · PRESSURE-TESTED', img: 'assets/svc/gas.jpg',
      quote: 'Leak checks, new gas runs, and appliance hook-ups, done to code, pressure-tested, and confirmed safe before we leave the house.' },
    { name: 'Bathroom plumbing', tag: 'FIXTURES · ROUGH-IN', img: 'assets/svc/bathroom.jpg',
      quote: 'Faucets, showers, toilets, and full bathroom rough-in. Clean, tidy work that’s built to last, and we haul the old fixtures away.' },
    { name: 'Kitchen sinks & disposals', tag: 'SINKS · DISPOSALS', img: 'assets/svc/kitchen.jpg',
      quote: 'Sinks, faucets, garbage disposals, and dishwasher lines installed right the first time, so nothing leaks under the cabinet later.' },
    { name: 'Drains & sewer', tag: 'CAMERA · HYDRO-JET', img: 'assets/svc/drain.jpg',
      quote: 'Camera inspection, hydro-jetting, root removal, and trenchless line repair across older Sacramento neighborhoods, no guesswork, no needless digging.' },
    { name: 'Repiping & pipe systems', tag: 'PEX / COPPER', img: 'assets/svc/repipe.jpg',
      quote: 'Whole-home PEX and copper repipes, plus clean rough-in for kitchen and bath remodels. Minimal drywall damage, two-year warranty.' }
  ];
  var N = SERVICES.length;
  var active = 0, timer = null;

  // ---- build images + dots ----
  var imgs = SERVICES.map(function (s, i) {
    var im = document.createElement('img');
    im.className = 'car-img';
    im.src = s.img;
    im.alt = s.name;
    im.loading = 'lazy';
    im.setAttribute('data-i', i);
    im.addEventListener('click', function () { go(i, true); });
    stage.appendChild(im);
    return im;
  });

  var dotsWrap = document.getElementById('carDots');
  var dots = SERVICES.map(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'car-dot'; b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', s.name);
    b.addEventListener('click', function () { go(i, true); });
    dotsWrap.appendChild(b);
    return b;
  });

  var elName = document.getElementById('carName');
  var elTag = document.getElementById('carTag');
  var elQuote = document.getElementById('carQuote');
  var elIndex = document.getElementById('carIndex');

  function gap() {
    var w = stage.clientWidth || 440, min = 1024, max = 1456, lo = 56, hi = 92;
    if (w <= min) return lo;
    if (w >= max) return hi;
    return lo + (hi - lo) * ((w - min) / (max - min));
  }

  function layout() {
    var g = gap(), stick = g * 0.8;
    imgs.forEach(function (im, i) {
      var isA = i === active;
      var isL = (active - 1 + N) % N === i;
      var isR = (active + 1) % N === i;
      var t, z, op, pe;
      if (isA) { t = 'translateX(0) translateY(0) scale(1) rotateY(0deg)'; z = 3; op = 1; pe = 'auto'; }
      else if (isL) { t = 'translateX(-' + g + 'px) translateY(-' + stick + 'px) scale(.86) rotateY(14deg)'; z = 2; op = 1; pe = 'auto'; }
      else if (isR) { t = 'translateX(' + g + 'px) translateY(-' + stick + 'px) scale(.86) rotateY(-14deg)'; z = 2; op = 1; pe = 'auto'; }
      else { t = 'translateX(0) scale(.8)'; z = 1; op = 0; pe = 'none'; }
      im.style.transform = t; im.style.zIndex = z; im.style.opacity = op; im.style.pointerEvents = pe;
      im.classList.toggle('is-active', isA);
    });
  }

  function reflow(el) { void el.offsetWidth; }
  function blurIn() {
    if (reduce) return;
    [elName, elTag, elQuote].forEach(function (e, k) {
      e.style.animation = 'none'; reflow(e);
      e.style.animation = 'carIn .5s ' + (k * 0.06) + 's ease both';
    });
  }

  function paint() {
    var s = SERVICES[active];
    elName.textContent = s.name;
    elTag.textContent = s.tag;
    elQuote.textContent = s.quote;
    elIndex.textContent = ('0' + (active + 1)).slice(-2) + ' / ' + ('0' + N).slice(-2);
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === active); d.setAttribute('aria-selected', i === active); });
    layout();
    blurIn();
  }

  function go(i, manual) {
    active = (i % N + N) % N;
    paint();
    if (manual) restart();
  }
  function next(manual) { go(active + 1, manual); }
  function prev(manual) { go(active - 1, manual); }

  document.getElementById('carNext').addEventListener('click', function () { next(true); });
  document.getElementById('carPrev').addEventListener('click', function () { prev(true); });

  // keyboard nav when the carousel is on screen / focused
  document.addEventListener('keydown', function (e) {
    if (!inView()) return;
    if (e.key === 'ArrowLeft') prev(true);
    else if (e.key === 'ArrowRight') next(true);
  });

  // autoplay (pauses on hover and off-screen)
  function startAuto() { if (timer || !visible) return; timer = setInterval(function () { next(false); }, 2000); }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stopAuto(); startAuto(); }
  root.addEventListener('mouseenter', stopAuto);
  root.addEventListener('mouseleave', startAuto);

  var visible = false;
  function inView() { return visible; }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (en) { visible = en.isIntersecting; if (visible) startAuto(); else stopAuto(); });
    }, { threshold: 0.2 }).observe(root);
  } else { visible = true; startAuto(); }

  window.addEventListener('resize', layout);
  paint();
})();
