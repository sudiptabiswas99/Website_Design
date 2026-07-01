/* =================================================================
   Footer meteors — vanilla port of the Aceternity/shadcn "Meteors"
   effect. Generates N diagonal shooting-star streaks behind the
   footer content. Each meteor gets a random start position, delay
   and duration (fed to CSS via custom properties).
   ================================================================= */
(function () {
  'use strict';
  var box = document.querySelector('.footer-meteors');
  if (!box) return;

  var N = 22;
  var frag = document.createDocumentFragment();

  for (var i = 0; i < N; i++) {
    var m = document.createElement('span');
    m.className = 'meteor';
    m.style.left = (Math.random() * 100).toFixed(2) + '%';           // across the width
    m.style.top = (Math.random() * 88 - 8).toFixed(2) + '%';         // down the footer (some start above)
    m.style.setProperty('--delay', (Math.random() * 5).toFixed(2) + 's');
    m.style.setProperty('--dur', (Math.random() * 6 + 3).toFixed(2) + 's'); // 3–9s
    frag.appendChild(m);
  }
  box.appendChild(frag);
})();
