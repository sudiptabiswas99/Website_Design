/* Full-page Grid Pattern background — random highlighted cells crossfade
   (Magic-UI style, vanilla). Static grid lines come from CSS/SVG pattern;
   this only injects the animated highlighted squares. */
(function () {
  var SIZE = 46, N = 14;
  var svg = document.querySelector('.gridbg__svg');
  var g = document.getElementById('gridbgCells');
  if (!svg || !g) return;

  function rng(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

  function build() {
    var r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var cols = Math.ceil(r.width / SIZE), rows = Math.ceil(r.height / SIZE);
    g.innerHTML = '';
    var used = {};
    for (var i = 0; i < N; i++) {
      var cx, cy, key, tries = 0;
      do { cx = rng(0, cols); cy = rng(0, rows); key = cx + ',' + cy; tries++; }
      while (used[key] && tries < 40);
      used[key] = 1;
      var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('class', 'gridbg__cell');
      rect.setAttribute('width', SIZE - 1);
      rect.setAttribute('height', SIZE - 1);
      rect.setAttribute('x', cx * SIZE + 0.5);
      rect.setAttribute('y', cy * SIZE + 0.5);
      rect.style.setProperty('--dur', (3.5 + Math.random() * 4).toFixed(2) + 's');
      rect.style.setProperty('--delay', (Math.random() * 5).toFixed(2) + 's');
      g.appendChild(rect);
    }
  }

  build();
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
})();
