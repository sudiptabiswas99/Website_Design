/* =================================================================
   Live "Open now / Closed" status for the top utility bar.
   Business hours: 10:00 AM – 6:00 PM, evaluated in the business's
   timezone (America/Los_Angeles) so it's correct regardless of where
   the visitor is. Re-checks every 30s so it flips at 10:00 and 18:00.
   ================================================================= */
(function () {
  'use strict';
  var el = document.getElementById('bizStatus');
  if (!el) return;
  var dot = document.getElementById('bizDot');
  var state = document.getElementById('bizState');

  var OPEN = 10 * 60;  // 10:00 -> 600 minutes
  var CLOSE = 18 * 60; // 18:00 -> 1080 minutes

  function pacificMinutes() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    var h = 0, m = 0;
    parts.forEach(function (p) {
      if (p.type === 'hour') h = parseInt(p.value, 10);
      if (p.type === 'minute') m = parseInt(p.value, 10);
    });
    if (h === 24) h = 0; // some engines report midnight as 24
    return h * 60 + m;
  }

  function update() {
    var mins = pacificMinutes();
    var open = mins >= OPEN && mins < CLOSE;
    dot.className = open ? 'dot dot--live' : 'dot dot--closed';
    state.textContent = open ? 'Open now' : 'Closed';
    el.classList.toggle('is-closed', !open);
  }

  update();
  setInterval(update, 30000);
})();
