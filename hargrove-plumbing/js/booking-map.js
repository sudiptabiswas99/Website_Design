/* Location picker for the booking form.
   Free stack — Leaflet + OpenStreetMap tiles + Nominatim geocoding (no API key).
   Opens from the "Use map" button (or a tap on the empty address field), lets the
   visitor search / drop / drag a pin, then writes the address + lat/lng back to the form.
   Swap to Google Maps later by replacing the tile layer + geocoder here only. */
(function () {
  'use strict';

  var addr = document.getElementById('address');
  var btn = document.getElementById('addrMapBtn');
  var latEl = document.getElementById('lat');
  var lngEl = document.getElementById('lng');
  var zipEl = document.getElementById('zip2');
  var modal = document.getElementById('mapModal');
  if (!addr || !btn || !modal) return; // booking form not on this page

  var canvas = document.getElementById('mapCanvas');
  var searchIn = document.getElementById('mapSearch');
  var searchBtn = document.getElementById('mapSearchBtn');
  var pickedEl = document.getElementById('mapPicked');
  var useBtn = document.getElementById('mapUse');
  var SAC = [38.5816, -121.4944]; // Sacramento default center

  var map = null, marker = null, picked = null; // picked = { lat, lng, address, zip }

  var pinIcon = window.L && L.divIcon({
    className: '',
    html: '<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#0e7ea8;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.45);transform:rotate(-45deg)"></div>',
    iconSize: [22, 22], iconAnchor: [11, 22],
  });

  function openModal() {
    if (!window.L) { // Leaflet failed to load (offline) — degrade gracefully
      addr.focus();
      pickedEl && (pickedEl.textContent = '');
      alert('Map is unavailable right now — please type your address (house no, road, area, city).');
      return;
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!map) initMap();
    setTimeout(function () { map.invalidateSize(); }, 60);
    setTimeout(function () { map.invalidateSize(); }, 360);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  function initMap() {
    map = L.map(canvas, { zoomControl: true }).setView(SAC, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);
    map.on('click', function (e) { setMarker(e.latlng.lat, e.latlng.lng, true); });
  }

  function setMarker(lat, lng, doReverse) {
    if (!marker) {
      marker = L.marker([lat, lng], { draggable: true, icon: pinIcon }).addTo(map);
      marker.on('dragend', function () {
        var p = marker.getLatLng();
        reverse(p.lat, p.lng);
      });
    } else {
      marker.setLatLng([lat, lng]);
    }
    useBtn.disabled = false;
    if (doReverse) reverse(lat, lng);
  }

  // Format Nominatim address parts into "house road, area, city".
  function formatAddress(a, fallback) {
    if (!a) return fallback || '';
    var line1 = [a.house_number, a.road].filter(Boolean).join(' ');
    var area = a.suburb || a.neighbourhood || a.quarter || a.city_district || a.hamlet || '';
    var city = a.city || a.town || a.village || a.municipality || a.county || '';
    var parts = [line1, area, city].filter(Boolean);
    return parts.length ? parts.join(', ') : (fallback || '');
  }

  function setPicked(lat, lng, text, zip) {
    picked = { lat: lat, lng: lng, address: text, zip: zip || '' };
    pickedEl.textContent = text ? '📍 ' + text : '📍 Pin set (' + lat.toFixed(5) + ', ' + lng.toFixed(5) + ')';
    pickedEl.classList.add('set');
  }

  function reverse(lat, lng) {
    setPicked(lat, lng, 'Finding address…', '');
    pickedEl.classList.remove('set');
    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=' + lat + '&lon=' + lng + '&accept-language=en')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var text = formatAddress(d.address, d.display_name);
        setPicked(lat, lng, text, d.address && d.address.postcode);
      })
      .catch(function () { setPicked(lat, lng, '', ''); });
  }

  function search() {
    var q = (searchIn.value || '').trim();
    if (!q) return;
    searchBtn.disabled = true;
    fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=' + encodeURIComponent(q) + '&accept-language=en')
      .then(function (r) { return r.json(); })
      .then(function (list) {
        searchBtn.disabled = false;
        if (!list || !list.length) { pickedEl.textContent = 'No match — try a nearby street or area.'; pickedEl.classList.remove('set'); return; }
        var hit = list[0];
        var lat = parseFloat(hit.lat), lng = parseFloat(hit.lon);
        map.setView([lat, lng], 16);
        setMarker(lat, lng, false);
        setPicked(lat, lng, formatAddress(hit.address, hit.display_name), hit.address && hit.address.postcode);
      })
      .catch(function () { searchBtn.disabled = false; pickedEl.textContent = 'Search unavailable — drop a pin on the map instead.'; });
  }

  // Browser Geolocation — drop the pin on the visitor's real position, then reverse-geocode it.
  function locate() {
    var locBtn = document.getElementById('mapLocate');
    if (!navigator.geolocation) {
      pickedEl.classList.remove('set');
      pickedEl.textContent = 'Location isn’t supported here — search or tap the map instead.';
      return;
    }
    if (!map) initMap();
    locBtn.disabled = true;
    pickedEl.classList.remove('set');
    pickedEl.textContent = 'Locating you…';
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        locBtn.disabled = false;
        var lat = pos.coords.latitude, lng = pos.coords.longitude;
        map.setView([lat, lng], 16);
        setMarker(lat, lng, true); // reverse-geocodes + enables "Use this location"
      },
      function (err) {
        locBtn.disabled = false;
        pickedEl.classList.remove('set');
        pickedEl.textContent = err && err.code === 1
          ? 'Location permission denied — search or tap the map instead.'
          : 'Couldn’t get your location — search or tap the map instead.';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function useLocation() {
    if (!picked) return;
    if (picked.address) addr.value = picked.address;
    latEl.value = picked.lat.toFixed(6);
    lngEl.value = picked.lng.toFixed(6);
    // The picked location's ZIP wins (still freely editable on the form afterward).
    if (picked.zip && zipEl && /^\d{5}$/.test(picked.zip)) zipEl.value = picked.zip;
    addr.closest('.field--address').classList.add('has-pin');
    closeModal();
  }

  // --- wiring ---
  // The address box is a plain text field — tap to type. The map opens ONLY via the button.
  btn.addEventListener('click', openModal);
  document.getElementById('mapLocate').addEventListener('click', locate);
  searchBtn.addEventListener('click', search);
  searchIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); search(); } });
  useBtn.addEventListener('click', useLocation);
  document.getElementById('mapClose').addEventListener('click', closeModal);
  document.getElementById('mapCancel').addEventListener('click', closeModal);
  document.getElementById('mapBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
})();
