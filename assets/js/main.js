// Little Details — mobile drawer (modal dialog)
// Opens/closes the drawer, keeps aria state in sync, locks page scroll,
// makes everything behind the dialog inert, traps focus inside it, and
// returns focus to the menu button on close.

(function () {
  const toggle = document.querySelector('.nav__toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.querySelector('[data-drawer-backdrop]');
  const closeBtn = drawer && drawer.querySelector('.drawer__close');
  if (!toggle || !drawer || !backdrop || !closeBtn) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const CLOSE_HIDE_MS = 360; // slightly longer than --dur-drawer (320ms)
  let closeTimer = null;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const focusables = () => [...drawer.querySelectorAll('a[href], button:not([disabled])')];

  // Everything behind the dialog: page content plus every header item except
  // the menu button (which stays tappable but is hidden from assistive tech).
  const background = () => {
    const header = document.querySelector('.site-header');
    const headerItems = header
      ? [...header.querySelectorAll('.nav__inner > *, .nav__actions > *')].filter(
          (el) => el !== toggle && !el.contains(toggle)
        )
      : [];
    return [...document.querySelectorAll('main, footer'), ...headerItems];
  };

  function setBackgroundInert(inert) {
    background().forEach((el) => {
      el.inert = inert;
    });
  }

  function open({ byPointer = false } = {}) {
    clearTimeout(closeTimer);
    drawer.hidden = false;
    backdrop.hidden = false;
    // A tap/click open keeps the close button hidden until the keyboard is used
    drawer.toggleAttribute('data-pointer-open', byPointer);
    // A keyboard open reserves the close button's row so links never shift
    drawer.toggleAttribute('data-keyboard-open', !byPointer);
    // Force a reflow so the slide-in transition runs from the closed position
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    // Move focus into the dialog before hiding the menu button from assistive
    // tech, so a focused element is never aria-hidden
    closeBtn.focus({ preventScroll: true });
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    toggle.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('tabindex', '-1');
    setBackgroundInert(true);
    document.documentElement.classList.add('is-drawer-open');
    document.addEventListener('keydown', onKeydown);
  }

  function close({ returnFocus = true } = {}) {
    if (!isOpen()) return;
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.removeAttribute('aria-hidden');
    toggle.removeAttribute('tabindex');
    setBackgroundInert(false);
    document.documentElement.classList.remove('is-drawer-open');
    document.removeEventListener('keydown', onKeydown);

    // Hide after the slide-out finishes so it stays out of the tab order
    closeTimer = setTimeout(() => {
      if (isOpen()) return;
      drawer.hidden = true;
      backdrop.hidden = true;
      drawer.removeAttribute('data-pointer-open');
      drawer.removeAttribute('data-keyboard-open');
    }, CLOSE_HIDE_MS);

    if (returnFocus) toggle.focus();
  }

  function onKeydown(event) {
    // Any key press means keyboard use: allow the close button to show on focus
    drawer.removeAttribute('data-pointer-open');

    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!items.includes(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  // event.detail is 0 for keyboard-triggered clicks, 1+ for taps and mouse clicks
  toggle.addEventListener('click', (event) =>
    isOpen() ? close() : open({ byPointer: event.detail > 0 })
  );
  // While open, the menu button is aria-hidden: stop a press on it from
  // focusing it (the click still closes the drawer and focus returns to it)
  toggle.addEventListener('mousedown', (event) => {
    if (isOpen()) event.preventDefault();
  });
  closeBtn.addEventListener('click', () => close());
  backdrop.addEventListener('click', () => close());

  // Tapping any link in the drawer closes it, then the link navigates
  drawer.addEventListener('click', (event) => {
    if (event.target.closest('a')) close({ returnFocus: false });
  });

  // Rotating or resizing up to desktop closes the drawer
  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) close({ returnFocus: false });
  });
})();
