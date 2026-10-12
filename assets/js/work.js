// Little Details — Cars We've Detailed slideshow
// Follows the WAI-ARIA carousel pattern. Slides, labels, dots and the counter
// are built from the markup, so adding or removing a slide needs no JS edits.
// Without JavaScript the slides stay a plain stacked list.

(function () {
  const root = document.querySelector('.work__carousel');
  if (!root) return;

  const list = root.querySelector('.work__slides');
  const slides = [...root.querySelectorAll('.work-slide')];
  const controls = root.querySelector('.work__controls');
  const toggle = root.querySelector('.work__btn--toggle');
  const toggleText = root.querySelector('.work__toggle-text');
  const prev = root.querySelector('.work__prev');
  const next = root.querySelector('.work__next');
  const dotsWrap = root.querySelector('.work__dots');
  const counter = root.querySelector('.work__counter');
  if (!list || !slides.length || !controls || !toggle || !prev || !next || !dotsWrap || !counter) return;

  const INTERVAL_MS = 5000;
  const total = slides.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let index = 0;
  let timer = null;
  // Stopped = no rotation until Play is pressed (pause button, manual
  // navigation, or reduced motion). The rest are temporary pauses.
  let stopped = reducedMotion.matches;
  let hovering = false;
  let focusInside = false;
  let tabHidden = document.hidden;
  let onScreen = false;

  const pad = (n) => String(n).padStart(2, '0');

  // --- Build ---------------------------------------------------------------

  root.classList.add('is-enhanced');
  controls.hidden = false;
  list.id = list.id || 'work-slides';

  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${total}`);
  });

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'work__dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-controls', list.id);
    dot.addEventListener('click', () => goTo(i, { manual: true }));
    dotsWrap.append(dot);
    return dot;
  });

  prev.setAttribute('aria-controls', list.id);
  next.setAttribute('aria-controls', list.id);

  // --- State ---------------------------------------------------------------

  function show(i) {
    index = (i + total) % total;
    slides.forEach((slide, n) => {
      const active = n === index;
      slide.classList.toggle('is-active', active);
      slide.inert = !active;
      if (active) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
    });
    dots.forEach((dot, n) => {
      if (n === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
  }

  function isRotating() {
    return !stopped && !hovering && !focusInside && !tabHidden && onScreen;
  }

  function update() {
    // Announce changes only when rotation is stopped, not on every auto-advance
    list.setAttribute('aria-live', stopped ? 'polite' : 'off');
    toggle.classList.toggle('is-stopped', stopped);
    toggleText.textContent = stopped ? 'Play' : 'Pause';

    clearTimeout(timer);
    timer = null;
    if (isRotating()) {
      timer = setTimeout(() => {
        show(index + 1);
        update();
      }, INTERVAL_MS);
    }
  }

  function goTo(i, { manual = false } = {}) {
    if (manual) stopped = true;
    // Set the live region before the change so it is announced
    list.setAttribute('aria-live', stopped ? 'polite' : 'off');
    show(i);
    update();
  }

  // --- Controls --------------------------------------------------------------

  toggle.addEventListener('click', () => {
    stopped = !stopped;
    update();
  });
  prev.addEventListener('click', () => goTo(index - 1, { manual: true }));
  next.addEventListener('click', () => goTo(index + 1, { manual: true }));

  // --- Pausing rules -------------------------------------------------------

  root.addEventListener('mouseenter', () => {
    hovering = true;
    update();
  });
  root.addEventListener('mouseleave', () => {
    hovering = false;
    update();
  });

  // Keyboard focus inside pauses — except on the pause/play button itself,
  // so pressing Play there actually starts rotation
  root.addEventListener('focusin', (event) => {
    focusInside = event.target !== toggle;
    update();
  });
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) {
      focusInside = false;
      update();
    }
  });

  document.addEventListener('visibilitychange', () => {
    tabHidden = document.hidden;
    update();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        update();
      },
      { threshold: 0.25 }
    ).observe(root);
  } else {
    onScreen = true;
  }

  // Turning on reduced motion mid-visit stops rotation
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      stopped = true;
      update();
    }
  });

  show(0);
  update();
})();
