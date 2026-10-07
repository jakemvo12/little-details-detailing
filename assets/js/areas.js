// Little Details — Areas We Serve
// Town buttons update the selection, the bar and the quote link (works without
// the map). The Leaflet map is lazy-loaded when the section nears the viewport;
// if it fails, the map box is hidden and the list + bar keep working.

(function () {
  const section = document.getElementById('areas');
  if (!section) return;

  const buttons = [...section.querySelectorAll('.areas__town')];
  const mapEl = document.getElementById('areas-map');
  const nameEl = section.querySelector('.areas__selected-name');
  const cta = section.querySelector('.areas__cta');
  if (!buttons.length || !mapEl || !nameEl || !cta) return;

  const LEAFLET_JS = 'assets/vendor/leaflet/leaflet.js';
  const LEAFLET_CSS = 'assets/vendor/leaflet/leaflet.css';
  const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
  const RADIUS_MILES = 12.5; // farthest town (West Chester, 11.4 mi) plus a margin
  const METERS_PER_MILE = 1609.344;
  const FIT_PADDING = [28, 28];
  const PAN_SECONDS = 0.5;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const towns = buttons.map((button) => ({
    button,
    slug: button.dataset.town,
    name: button.dataset.name,
    latlng: [parseFloat(button.dataset.lat), parseFloat(button.dataset.lng)],
  }));
  const center = towns[0].latlng; // Coatesville

  let selected = towns.find((t) => t.button.getAttribute('aria-pressed') === 'true') || towns[0];
  let map = null;
  let pin = null;
  let circleBounds = null;
  const dots = new Map();

  function select(town) {
    selected = town;
    towns.forEach((t) => t.button.setAttribute('aria-pressed', String(t === town)));
    nameEl.textContent = town.name;
    cta.href = `estimate.html?area=${town.slug}`;
    if (map) updateMap({ animate: true });
  }

  function updateMap({ animate }) {
    pin.setLatLng(selected.latlng);
    dots.forEach((marker, slug) => {
      const el = marker.getElement();
      if (el) el.classList.toggle('is-selected', slug === selected.slug);
    });
    // The circle contains every town, so fitting it keeps the pin in view too
    map.fitBounds(circleBounds, {
      padding: FIT_PADDING,
      animate: animate && !reducedMotion.matches,
      duration: PAN_SECONDS,
    });
  }

  towns.forEach((town) => town.button.addEventListener('click', () => select(town)));

  // --- Map (lazy) ----------------------------------------------------------

  // Reserve the map's space now (it stays hidden if JavaScript is off)
  mapEl.hidden = false;

  function fail() {
    mapEl.hidden = true;
  }

  function loadAsset(tag, attrs) {
    return new Promise((resolve, reject) => {
      const el = document.createElement(tag);
      Object.assign(el, attrs);
      el.onload = resolve;
      el.onerror = reject;
      document.head.append(el);
    });
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function buildMap() {
    const L = window.L;
    const animate = !reducedMotion.matches;

    map = L.map(mapEl, {
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false,
      zoomAnimation: animate,
      fadeAnimation: animate,
      markerZoomAnimation: animate,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

    // Leaflet needs a view before vector layers are added
    const radius = RADIUS_MILES * METERS_PER_MILE;
    circleBounds = L.latLng(center).toBounds(radius * 2);
    map.fitBounds(circleBounds, { padding: FIT_PADDING, animate: false });

    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: ATTRIBUTION }).addTo(map);

    const teal = cssVar('--color-teal');
    L.circle(center, {
      radius,
      color: teal,
      weight: 2,
      fillColor: teal,
      fillOpacity: 0.15,
      interactive: false,
    }).addTo(map);

    // Town dots: mouse/touch shortcut only — the list rows are the keyboard
    // and screen-reader control, so dots are hidden from assistive tech
    towns.forEach((town) => {
      const marker = L.marker(town.latlng, {
        icon: L.divIcon({
          className: 'areas__dot',
          html: '<span class="areas__dot-mark"></span>',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
        keyboard: false,
        riseOnHover: false,
      }).addTo(map);
      marker.on('click', () => select(town));
      const el = marker.getElement();
      el.setAttribute('aria-hidden', 'true');
      el.removeAttribute('tabindex');
      dots.set(town.slug, marker);
    });

    pin = L.marker(selected.latlng, {
      icon: L.divIcon({
        className: 'areas__pin',
        html:
          '<svg viewBox="0 0 28 36" aria-hidden="true" focusable="false">' +
          '<path class="areas__pin-shape" d="M14 1C6.8 1 1 6.7 1 13.8 1 23.4 14 35 14 35s13-11.6 13-21.2C27 6.7 21.2 1 14 1z"/>' +
          '<circle class="areas__pin-dot" cx="14" cy="13.5" r="5"/>' +
          '</svg>',
        iconSize: [28, 36],
        iconAnchor: [14, 35],
      }),
      interactive: false,
      keyboard: false,
      zIndexOffset: 1000,
    }).addTo(map);
    pin.getElement().setAttribute('aria-hidden', 'true');

    updateMap({ animate: false });
  }

  function loadMap() {
    Promise.all([
      loadAsset('link', { rel: 'stylesheet', href: LEAFLET_CSS }),
      window.L ? Promise.resolve() : loadAsset('script', { src: LEAFLET_JS }),
    ])
      .then(() => {
        if (!window.L) throw new Error('Leaflet unavailable');
        buildMap();
      })
      .catch(fail);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          loadMap();
        }
      },
      { rootMargin: '400px 0px' }
    );
    observer.observe(section);
  } else {
    loadMap();
  }
})();
