/* ==========================================================================
   KAM DESIGN® — Architectural Visions & Luxury Edition
   Client-Side Interaction Controller (Zero-Dependency Vanilla JS)
   ========================================================================== */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // --- 1. Sticky Header Effect ---
  const header = $('#site-header');
  const onScroll = () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- 2. Accessible Mobile Menu Navigation ---
  const toggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');

  const closeMenu = () => {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    mobileMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    mobileMenu.inert = true;
  };

  const openMenu = () => {
    if (!toggle || !mobileMenu) return;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    mobileMenu.classList.add('is-open');
    mobileMenu.inert = false;
    document.body.classList.add('menu-open');
  };

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });

    $$('#mobile-menu a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- 3. Hero Video & Slideshow System ---
  const heroVideo = $('#hero-video');
  const heroSlider = $('#hero-slider');
  const slides = $$('.hero-slide');
  const slideIndex = $('#slide-index');
  const progress = $('#hero-progress');
  const mediaSwitch = $('#media-switch');

  let activeSlide = 0;
  let slideTimer = null;
  let isPaused = false;
  const slideDuration = 7000;

  // Video Autoplay Guarantee
  if (heroVideo) {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy fallback: show image slider
        if (heroSlider) heroSlider.style.display = 'block';
        if (heroVideo) heroVideo.style.display = 'none';
      });
    }
  }

  const setSlide = (next) => {
    if (!slides.length) return;
    activeSlide = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeSlide);
    });

    if (slideIndex) {
      slideIndex.innerHTML = `${String(activeSlide + 1).padStart(2, '0')} <span>/ ${String(slides.length).padStart(2, '0')}</span>`;
    }

    if (progress) {
      progress.classList.remove('animate');
      void progress.offsetWidth; // Force reflow
      if (!reduceMotion && !isPaused) progress.classList.add('animate');
    }

    if (slideTimer) clearTimeout(slideTimer);
    if (!reduceMotion && !isPaused && slides.length > 1) {
      slideTimer = setTimeout(() => setSlide(activeSlide + 1), slideDuration);
    }
  };

  $('#slide-next')?.addEventListener('click', () => setSlide(activeSlide + 1));
  $('#slide-prev')?.addEventListener('click', () => setSlide(activeSlide - 1));

  // Toggle Video / Photos mode if user wants to browse stills
  if (mediaSwitch && heroVideo && heroSlider) {
    mediaSwitch.addEventListener('click', () => {
      const isVideoActive = heroVideo.style.display !== 'none';
      if (isVideoActive) {
        heroVideo.style.display = 'none';
        heroSlider.style.display = 'block';
        mediaSwitch.textContent = '▶ Ver Video Reel';
        mediaSwitch.classList.add('is-active');
        setSlide(0);
      } else {
        heroVideo.style.display = 'block';
        heroSlider.style.display = 'none';
        heroVideo.play();
        mediaSwitch.textContent = '🖼 Ver Galería Fija';
        mediaSwitch.classList.remove('is-active');
        if (slideTimer) clearTimeout(slideTimer);
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
    if (document.hidden) {
      if (slideTimer) clearTimeout(slideTimer);
      if (heroVideo) heroVideo.pause();
    } else {
      if (heroVideo && heroVideo.style.display !== 'none') heroVideo.play();
      else if (slides.length) setSlide(activeSlide);
    }
  });

  if (slides.length) setSlide(0);

  // --- 4. Project Modal / Lightbox System (In-Situ Case Study) ---
  const modal = $('#project-modal');
  const modalImg = $('#modal-img');
  const modalBadge = $('#modal-badge');
  const modalTitle = $('#modal-title');
  const modalDesc = $('#modal-desc');
  const modalLocation = $('#modal-location');
  const modalScope = $('#modal-scope');
  const modalSoftware = $('#modal-software');
  const modalClose = $('#modal-close');
  const modalCta = $('#modal-cta');

  const openProjectModal = (data) => {
    if (!modal) return;
    if (modalImg) modalImg.src = data.img || '';
    if (modalImg) modalImg.alt = data.title || 'Proyecto KAM DESIGN';
    if (modalBadge) modalBadge.textContent = data.badge || 'PROYECTO';
    if (modalTitle) modalTitle.textContent = data.title || '';
    if (modalDesc) modalDesc.textContent = data.desc || '';
    if (modalLocation) modalLocation.textContent = data.location || 'Cancún, México';
    if (modalScope) modalScope.textContent = data.scope || 'Visualización 3D & Dirección de Arte';
    if (modalSoftware) modalSoftware.textContent = data.software || '3ds Max · Corona Renderer · Photoshop';

    if (modalCta) {
      modalCta.href = `https://wa.me/529986391022?text=${encodeURIComponent('Hola, me interesa conocer más sobre el proyecto ' + data.title + ' y cotizar algo similar.')}`;
    }

    modal.classList.add('is-active');
    document.body.classList.add('modal-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeProjectModal = () => {
    if (!modal) return;
    modal.classList.remove('is-active');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeProjectModal();
    }
  });

  // Attach click listener to all project & service cards that have data attributes
  $$('[data-project]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        const data = JSON.parse(card.getAttribute('data-project'));
        openProjectModal(data);
      } catch (err) {
        console.error('Error opening project modal:', err);
      }
    });
  });

  // --- 5. Reveal Animations via IntersectionObserver ---
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

    $$('.reveal').forEach(el => observer.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in-view'));
  }

  // --- 6. Parallax for Manifesto Banner ---
  if (!reduceMotion) {
    const scene = $('.manifesto-photo');
    const section = $('.manifesto-image');
    let scheduled = false;

    const updateParallax = () => {
      if (!scene || !section) return;
      const rect = section.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      const offset = Math.max(-50, Math.min(50, (window.innerHeight / 2 - middle) * 0.08));
      scene.style.setProperty('--parallax-y', `${offset}px`);
      scheduled = false;
    };

    if (scene && section) {
      window.addEventListener('scroll', () => {
        if (!scheduled) {
          window.requestAnimationFrame(updateParallax);
          scheduled = true;
        }
      }, { passive: true });
      updateParallax();
    }
  }

  // --- 7. Auto-update Footer Year ---
  const footerYear = $('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

})();
