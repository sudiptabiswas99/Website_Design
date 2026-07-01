/* =================================================================
   Booking "Background Paths" — vanilla port of the Aceternity/Kokonut
   animated-paths component (originally React + Framer Motion). The
   demo's title + button are dropped; only the two flowing SVG path
   layers remain, used as the booking section's animated background.

   Path geometry is reproduced exactly (viewBox 0 0 696 316, 36 paths
   per layer, d = M-(380-i·5·pos) …, width 0.5+i·0.03, opacity 0.1+i·0.03).
   Framer Motion's pathLength/pathOffset tween is replaced by a CSS
   stroke-dashoffset flow (see .book-paths path in styles.css).
   ================================================================= */
(function () {
  'use strict';
  var boxes = [].slice.call(document.querySelectorAll('.book-paths'));
  if (!boxes.length) return;
  var NS = 'http://www.w3.org/2000/svg';

  function buildLayer(position) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 696 316');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('class', 'book-paths__svg');

    for (var i = 0; i < 36; i++) {
      var off = i * 5 * position;
      var d =
        'M-' + (380 - off) + ' -' + (189 + i * 6) +
        'C-' + (380 - off) + ' -' + (189 + i * 6) +
        ' -' + (312 - off) + ' ' + (216 - i * 6) +
        ' ' + (152 - off) + ' ' + (343 - i * 6) +
        'C' + (616 - off) + ' ' + (470 - i * 6) +
        ' ' + (684 - off) + ' ' + (875 - i * 6) +
        ' ' + (684 - off) + ' ' + (875 - i * 6);

      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', (0.5 + i * 0.03).toFixed(2));
      p.setAttribute('stroke-opacity', (0.1 + i * 0.03).toFixed(2));
      p.setAttribute('fill', 'none');
      p.setAttribute('pathLength', '1');
      p.style.setProperty('--dur', (16 + Math.random() * 10).toFixed(2) + 's');
      p.style.setProperty('--delay', (-Math.random() * 24).toFixed(2) + 's');
      svg.appendChild(p);
    }
    return svg;
  }

  boxes.forEach(function (box) {
    box.appendChild(buildLayer(1));
    box.appendChild(buildLayer(-1));
  });
})();
