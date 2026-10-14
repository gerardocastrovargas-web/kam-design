/* KAM DESIGN – demo de experiencia. JS sin dependencias. */
(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const header = $('#site-header');
  const toggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú accesible y navegación móvil.
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    mobileMenu.inert = true;
  };
  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); return; }
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    mobileMenu.classList.add('is-open');
    mobileMenu.inert = false;
    document.body.classList.add('menu-open');
  });
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  // Hero cinematográfico: transiciones crossfade, Ken Burns y controles manuales.
  const slides = $$('.hero-slide');
  const slideIndex = $('#slide-index');
  const progress = $('#hero-progress');
  let active = 0;
  let timer = null;
  let paused = false;
  const slideDuration = 8000;
  const setSlide = (next) => {
    active = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === active));
    if (slideIndex) slideIndex.innerHTML = `${String(active + 1).padStart(2, '0')} <span>/ ${String(slides.length).padStart(2, '0')}</span>`;
    if (progress) {
      progress.classList.remove('animate');
      void progress.offsetWidth;
      if (!reduceMotion && !paused) progress.classList.add('animate');
    }
    if (timer) clearTimeout(timer);
    if (!reduceMotion && !paused) timer = setTimeout(() => setSlide(active + 1), slideDuration);
  };
  $('#slide-next')?.addEventListener('click', () => setSlide(active + 1));
  $('#slide-prev')?.addEventListener('click', () => setSlide(active - 1));
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (document.hidden && timer) clearTimeout(timer);
    else setSlide(active);
  });
  if (slides.length) setSlide(0);

  // Animaciones de entrada eficientes.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: .10, rootMargin: '0px 0px -30px 0px' });
    $$('.reveal').forEach(el => observer.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in-view'));
  }

  // Parallax sutil para la sección manifiesto.
  if (!reduceMotion) {
    const scene = $('.manifesto-photo');
    const section = $('.manifesto-image');
    let scheduled = false;
    const parallax = () => {
      if (!scene || !section) return;
      const rect = section.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      const offset = Math.max(-40, Math.min(40, (window.innerHeight / 2 - middle) * .08));
      scene.style.setProperty('--parallax-y', `${offset}px`);
      scheduled = false;
    };
    if (scene && section) {
      window.addEventListener('scroll', () => {
        if (!scheduled) { window.requestAnimationFrame(parallax); scheduled = true; }
      }, { passive: true });
      parallax();
    }
  }

  const footerYear = $('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());
})();
