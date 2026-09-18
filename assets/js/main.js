/* JRG Construction & Remodeling — site scripts */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  };
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('a', navLinks).forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Hero slideshow ---------- */
  const slides = $$('.hero__slide');
  const dots = $('#heroDots');
  let current = 0, timer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.addEventListener('click', () => { go(i); restart(); });
    dots.appendChild(b);
  });
  const dotBtns = $$('button', dots);

  function go(i) {
    slides[current].classList.remove('is-active');
    dotBtns[current].classList.remove('is-active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dotBtns[current].classList.add('is-active');
  }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => go(current + 1), 6000);
  }
  dotBtns[0].classList.add('is-active');
  restart();

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Before / After compare sliders ---------- */
  $$('[data-compare]').forEach(box => {
    const range = $('.compare__range', box);
    const set = (v) => {
      box.style.setProperty('--pos', v + '%');
      box.style.setProperty('--pos-frac', Math.max(v, 0.01) / 100);
    };
    set(range.value);
    range.addEventListener('input', () => set(range.value));

    // Pointer drag anywhere in the box (mouse + touch)
    let dragging = false;
    const fromEvent = (e) => {
      const r = box.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      const v = Math.min(100, Math.max(0, (x / r.width) * 100));
      range.value = v; set(v);
    };
    box.addEventListener('pointerdown', (e) => { dragging = true; fromEvent(e); });
    window.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    window.addEventListener('pointerup', () => dragging = false);
  });

  /* ---------- Gallery filters ---------- */
  const filters = $$('.filter');
  const tiles = $$('.tile');
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    tiles.forEach(t => {
      const show = f === 'all' || t.dataset.cat.split(' ').includes(f);
      t.classList.toggle('is-hidden', !show);
      if (show) t.classList.add('is-visible');
    });
  }));

  /* ---------- Lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCap');
  let items = [], idx = 0;

  const allLinks = $$('[data-lightbox]');
  const visibleItems = () => allLinks.filter(a => !a.classList.contains('is-hidden'));

  function show(i) {
    idx = (i + items.length) % items.length;
    const a = items[idx];
    lbImg.src = a.dataset.lightbox;
    lbImg.alt = ($('img', a) || {}).alt || '';
    lbCap.textContent = a.dataset.caption || '';
    // preload neighbours
    [idx + 1, idx - 1].forEach(n => { const im = new Image(); im.src = items[(n + items.length) % items.length].dataset.lightbox; });
  }
  function open(a) {
    items = visibleItems();
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    show(items.indexOf(a));
    $('#lbClose').focus();
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; lbImg.src = ''; }, 250);
  }
  allLinks.forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); open(a); }));
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(idx - 1));
  $('#lbNext').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
  // swipe
  let sx = 0;
  lb.addEventListener('touchstart', (e) => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(dx < 0 ? idx + 1 : idx - 1);
  });

  /* ---------- Contact form (mailto) ---------- */
  const form = $('#contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(form);
    let valid = true;
    ['name', 'phone'].forEach(n => {
      const el = form.elements[n];
      const ok = el.value.trim().length > 0;
      el.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) { form.elements.name.focus(); return; }

    const subject = `Estimate request: ${f.get('service')} — ${f.get('name')}`;
    const body = [
      `Name: ${f.get('name')}`,
      `Phone: ${f.get('phone')}`,
      `Email: ${f.get('email') || '-'}`,
      `Service: ${f.get('service')}`,
      '',
      'Project details:',
      f.get('message') || '-'
    ].join('\n');
    window.location.href = `mailto:jaime.gomez.9381@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
