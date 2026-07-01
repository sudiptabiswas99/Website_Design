/* =================================================================
   Financing feature — image-left / animated-details-right.
   Clicking a pill (tab) cross-fades the details text + the picture.
   Vanilla, no React, no build. Keyboard + ARIA kept in sync.
   ================================================================= */
(function () {
  'use strict';
  var root = document.getElementById('finTabs');
  if (!root) return;
  var tabs  = [].slice.call(root.querySelectorAll('.fin2-tab'));
  var texts = [].slice.call(root.querySelectorAll('.fin2-text'));
  var imgs  = [].slice.call(root.querySelectorAll('.fin2-img'));
  if (!tabs.length || tabs.length !== texts.length) return;

  function activate(i) {
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    texts.forEach(function (p, k) {
      var on = k === i;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    imgs.forEach(function (im, k) { im.classList.toggle('is-active', k === i); });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { activate(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); var n = (i + 1) % tabs.length; activate(n); tabs[n].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); var p = (i - 1 + tabs.length) % tabs.length; activate(p); tabs[p].focus();
      }
    });
  });
})();
