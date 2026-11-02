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

  // --- 7. Blog Article Reader Modal (In-Site Pop-up Articles) ---
  const blogPostsData = {
    'classic-car': {
      kicker: 'TWINMOTION 2025 · SKETCHUP 2024',
      tag: 'INNOVACIÓN & RENDERS',
      date: '2 de Febrero, 2025',
      readTime: '4 min de lectura',
      title: 'Descubriendo el Futuro: Render Revolucionario con Twinmotion 2025.1.2 & Classic Car Warehouse',
      img: './assets/web/blog-classic_car.webp',
      ctaText: 'Cotizar un proyecto de visualización 3D',
      ctaMsg: 'Hola, leí su artículo sobre el render de Classic Car Warehouse con Twinmotion 2025 y me gustaría cotizar un proyecto.',
      body: `
        <p class="article-lead">En el cambiante mundo de la visualización arquitectónica, surgen nuevas herramientas que transforman la forma en que los creadores dan vida a sus ideas. Entre estas innovaciones se encuentra <strong>Twinmotion 2025.1.2</strong>, un potente motor de renderizado llamado a cambiar las reglas del juego junto con las precisas capacidades de modelado de <strong>SketchUp 2024</strong>.</p>
        
        <h3>El poder de Twinmotion 2025.1.2</h3>
        <p>Twinmotion 2025.1.2 se ha convertido en un software imprescindible para arquitectos y diseñadores. Emplea tecnología de renderizado en tiempo real y Path Tracing avanzado, logrando tiempos de producción hasta un <strong>80% más rápidos</strong> en comparación con flujos tradicionales.</p>
        <p>Las mejoras clave en las bibliotecas de materiales PBR e iluminación global marcan una diferencia significativa en la calidad final. Además, su sistema meteorológico dinámico y opciones de vegetación realista permiten mostrar proyectos en distintas estaciones y atmósferas lumínicas.</p>

        <h3>SketchUp 2024: Creación de la maqueta Classic Car Warehouse</h3>
        <p>El primer paso para una visualización eficaz es construir un modelo tridimensional detallado y preciso. En este caso, un almacén de automóviles clásicos sirve como punto focal. Con SketchUp 2024 logramos una estructura en capas milimétrica que considera desde las cerchas metálicas e iluminación industrial hasta la disposición espacial para albergar vehículos icónicos de colección.</p>
        <p>El modelo también cumple una función narrativa: al integrar automóviles clásicos en la arquitectura industrial, la visualización conecta emocionalmente con el espectador y resalta el legado del diseño automotriz.</p>

        <h3>Características clave aprovechadas en el renderizado</h3>
        <ul>
          <li><strong>Efectos de iluminación realistas:</strong> Simulación precisa de ciclos solares de día y noche, reflejos cáusticos sobre la carrocería automotriz y sombras suaves sobre concreto pulido.</li>
          <li><strong>Contexto ambiental de alta calidad:</strong> Incorporación de vegetación detallada, texturas de alta resolución y activos ambientales que incrementan el atractivo visual hasta en un 45%.</li>
          <li><strong>Aplicaciones comerciales:</strong> Ideal para recorridos interactivos con clientes, aprobaciones de diseño rápidas y material de marketing inmobiliario de alto impacto.</li>
        </ul>

        <blockquote>“La sinergia entre Twinmotion 2025.1.2 y SketchUp 2024 ejemplifica posibilidades extraordinarias en la comunicación visual arquitectónica y automotriz.”</blockquote>
      `
    },
    'apple-cabin': {
      kicker: 'PROYECTOS ECOLÓGICOS · CANCÚN',
      tag: 'ARQUITECTURA SUSTENTABLE',
      date: '3 de Diciembre, 2024',
      readTime: '3 min de lectura',
      title: 'Proyecto de Oficina Corporativa: Módulo Prefabricado Tipo Apple Cabin',
      img: './assets/web/blog-apple_cabin.webp',
      ctaText: 'Cotizar diseño o render de módulo prefabricado',
      ctaMsg: 'Hola, me interesa conocer más sobre el proyecto de Oficina Corporativa tipo Apple Cabin en Cancún.',
      body: `
        <p class="article-lead">El presente proyecto tiene como objetivo la creación de una oficina corporativa en <strong>Cancún, Quintana Roo</strong>, utilizando un módulo prefabricado inspirado en el diseño vanguardista de la <em>Apple Cabin</em>. Este enfoque promueve la sostenibilidad, la eficiencia constructiva y la innovación arquitectónica.</p>

        <h3>Justificación del Proyecto en el Caribe Mexicano</h3>
        <p>Cancún es un polo de desarrollo económico y turístico en México que demanda espacios de trabajo funcionales, estéticamente atractivos y acordes a la visión contemporánea de las empresas. La elección de un módulo prefabricado permite reducir drásticamente los tiempos de obra y los costos asociados, ofreciendo una solución ecológica y adaptable.</p>

        <h3>Diseño y Características Principales del Módulo</h3>
        <ul>
          <li><strong>Estructura Modular Escalable:</strong> Facilita la ampliación futura y la personalización según las necesidades específicas de cada empresa.</li>
          <li><strong>Materiales Sostenibles:</strong> Uso de paneles térmicos y materiales ecoamigables que aseguran bajo impacto ambiental y alta durabilidad frente al clima tropical.</li>
          <li><strong>Eficiencia Energética:</strong> Ventanales panorámicos de doble acristalamiento con filtro UV y preparación para energía solar, maximizando la iluminación natural.</li>
          <li><strong>Espacios Abiertos y Colaborativos:</strong> Distribución interior que promueve el trabajo en equipo con áreas comunes y privado ejecutivo.</li>
          <li><strong>Costos y Tiempos Controlados:</strong> La prefabricación en serie reduce imprevistos en obra sin comprometer el acabado de lujo.</li>
        </ul>

        <h3>Plan de Implementación en 5 Etapas</h3>
        <ol>
          <li><strong>Estudio de Sitio:</strong> Evaluación del terreno en Cancún para determinar orientación solar y cimentación ligera.</li>
          <li><strong>Diseño Detallado 3D:</strong> Elaboración de planos arquitectónicos, estructurales y visualización fotorrealista previa.</li>
          <li><strong>Prefabricación Controlada:</strong> Manufactura del módulo bajo estrictos estándares de calidad.</li>
          <li><strong>Transporte e Instalación:</strong> Logística de traslado y montaje rápido en sitio.</li>
          <li><strong>Entrega Llave en Mano:</strong> Inspección final y puesta en marcha de la oficina corporativa.</li>
        </ol>
      `
    },
    'nubes-volumetricas': {
      kicker: 'TWINMOTION GURU · TUTORIAL PASO A PASO',
      tag: 'TUTORIALES & ATMÓSFERA',
      date: '31 de Diciembre, 2024',
      readTime: '5 min de lectura',
      title: 'Desvelando los Misterios de Twinmotion 2025.1: Guía Paso a Paso sobre Nubes Volumétricas',
      img: './assets/web/blog-nubes_volumetricas.webp',
      ctaText: 'Solicitar asesoría o visualización arquitectónica',
      ctaMsg: 'Hola, leí su guía de Twinmotion 2025.1 sobre nubes volumétricas y me gustaría platicar con ustedes.',
      body: `
        <p class="article-lead">Crear visualizaciones impresionantes es esencial para arquitectos y artistas CGI. Una de las funciones más destacadas de <strong>Twinmotion 2025.1</strong> es su sistema de <strong>nubes volumétricas tridimensionales</strong>, capaz de transformar por completo la atmósfera, profundidad e iluminación de cualquier escena exterior.</p>

        <h3>¿Qué son las nubes volumétricas?</h3>
        <p>A diferencia de los domos de cielo planos tradicionales (HDRI estáticos), las nubes volumétricas son formaciones 3D reales que interactúan físicamente con los rayos del sol, proyectando sombras sobre el terreno y generando dispersión lumínica realista.</p>

        <h3>Guía Paso a Paso en Twinmotion 2025.1</h3>
        <ul>
          <li><strong>1. Configuración de la escena:</strong> Importa tu modelo arquitectónico 3D y define el encuadre principal donde el cielo tenga protagonismo compositivo.</li>
          <li><strong>2. Acceso al panel de Clima (Ambience → Env):</strong> Dirígete a los controles meteorológicos y activa la opción de <em>Volumetric Clouds</em>.</li>
          <li><strong>3. Ajuste de Densidad, Altura y Cobertura:</strong>
            <br>• <em>Densidad (0.2 a 0.7):</em> Controla el espesor desde cirros ligeros hasta cielos dramáticos de tormenta.
            <br>• <em>Altitud (200m a 1000m+):</em> Nubes bajas crean dramatismo envolvente; nubes altas aportan amplitud editorial.
            <br>• <em>Cobertura (10% a 100%):</em> Regula el porcentaje de cielo cubierto para equilibrar luz directa y sombra.
          </li>
          <li><strong>4. Interacción con el Sol y Niebla Atmosférica:</strong> Prueba un ángulo solar vespertino de 45° (Golden Hour) combinado con una sutil niebla exponencial para generar rayos volumétricos (<em>God rays</em>) de impacto cinematográfico.</li>
        </ul>

        <blockquote>“El equilibrio es clave: las nubes volumétricas deben enmarcar y exaltar la arquitectura sin robarle el punto focal al proyecto.”</blockquote>
      `
    },
    'camiones-gratis': {
      kicker: 'RECURSOS 3D COMUNIDAD · FREE ASSET',
      tag: 'DESCARGA GRATIS',
      date: '17 de Marzo, 2025',
      readTime: 'Recurso Gratuito',
      title: '¡Modelos de Camiones 3D Gratis Disponibles para Twinmotion y FBX!',
      img: './assets/web/blog-camiones.webp',
      ctaText: 'Solicitar enlace de descarga por WhatsApp',
      ctaMsg: 'Hola KAM DESIGN, me gustaría obtener el enlace de descarga de los modelos de camiones 3D gratuitos para Twinmotion.',
      body: `
        <p class="article-lead">¡Nos emociona compartir con toda la comunidad de arquitectos y artistas 3D los renders y paquetes de nuestros <strong>modelos de camiones 3D optimizados</strong> para ambientar escenas urbanas, comerciales, logísticas e industriales!</p>

        <h3>Especificaciones del Paquete 3D</h3>
        <ul>
          <li><strong>Compatibilidad Nativa:</strong> Listos para importar directamente en <strong>Twinmotion 2025.1</strong> y formatos universales (FBX / SketchUp).</li>
          <li><strong>Materiales PBR Calibrados:</strong> Pintura automotriz metálica, cristales polarizados, neumáticos con relieve realista y cromados listos para Path Tracing.</li>
          <li><strong>Geometría Optimizada:</strong> Poligonaje balanceado para insertar múltiples unidades en masterplans, naves industriales o carreteras sin afectar el rendimiento del viewport.</li>
        </ul>

        <h3>¿Cómo obtener los modelos?</h3>
        <p>En <strong>KAM DESIGN®</strong> compartimos periódicamente bibliotecas y bloques 3D gratuitos con nuestra comunidad. Haz clic en el botón inferior para solicitar el enlace directo de descarga o síguenos en nuestro canal oficial de YouTube para acceder a todos los recursos.</p>
      `
    },
    'twinmotion-guru': {
      kicker: 'COLABORADOR DESTACADO · WORKFLOW & CGI',
      tag: 'WORKFLOW & CGI',
      date: '31 de Diciembre, 2024',
      readTime: '3 min de lectura',
      title: 'Twinmotion Guru: Acelera tus Tiempos de Render con Nuestra Biblioteca Gratuita',
      img: './assets/web/blog-twinmotion_guru.webp',
      ctaText: 'Ver Video y Descargar en YouTube',
      ctaUrl: 'https://youtu.be/sOzyJfwsAHY?si=K2XChPHs0lxtR_-L',
      body: `
        <p class="article-lead">¡Buenas noticias para todos los usuarios de Twinmotion! ¿Quieres acelerar tu flujo de trabajo y elevar la calidad de tus entregas? Hemos preparado un video especial donde puedes descargar nuestra <strong>Biblioteca de Usuario de Twinmotion GRATIS</strong>.</p>

        <h3>¿Qué incluye y cómo mejora tu flujo de trabajo?</h3>
        <p>Imagina contar con una librería curada de modelos 3D, vegetaciones, luminarias y materiales PBR preconfigurados listos para arrastrar y soltar en tus escenas arquitectónicas para que cobren vida en una fracción del tiempo habitual.</p>
        <ul>
          <li><strong>Ahorro de tiempo en cada entrega:</strong> Evita configurar materiales desde cero en cada nuevo proyecto residencial o comercial.</li>
          <li><strong>Optimización de memoria VRAM:</strong> Activos depurados para mantener altos cuadros por segundo (FPS) mientras trabajas en tiempo real.</li>
          <li><strong>Guía en video paso a paso:</strong> En nuestro tutorial de YouTube te mostramos todos los modelos incluidos y cómo instalar la carpeta directamente en tu User Library de Twinmotion.</li>
        </ul>

        <div class="blog-video-box">
          <p><strong>🎬 Tutorial completo y enlace de descarga en YouTube:</strong></p>
          <a href="https://youtu.be/sOzyJfwsAHY?si=K2XChPHs0lxtR_-L" target="_blank" rel="noopener noreferrer" class="blog-video-btn">
            <span>▶ Ver Video en YouTube (Twinmotion Guru)</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      `
    }
  };

  const blogOrder = ['classic-car', 'apple-cabin', 'nubes-volumetricas', 'camiones-gratis', 'twinmotion-guru'];
  let currentBlogKey = null;

  const blogModal = $('#blog-modal');
  const blogModalScroll = $('#blog-modal-scroll');
  const blogModalKicker = $('#blog-modal-kicker');
  const blogModalTag = $('#blog-modal-tag');
  const blogModalImg = $('#blog-modal-img');
  const blogModalDate = $('#blog-modal-date');
  const blogModalReadtime = $('#blog-modal-readtime');
  const blogModalTitle = $('#blog-modal-title');
  const blogModalBody = $('#blog-modal-body');
  const blogModalCta = $('#blog-modal-cta');
  const blogModalCtaText = $('#blog-modal-cta-text');
  const blogModalClose = $('#blog-modal-close');
  const blogModalPrev = $('#blog-modal-prev');
  const blogModalNext = $('#blog-modal-next');

  const openBlogModal = (key) => {
    const post = blogPostsData[key];
    if (!blogModal || !post) return;
    currentBlogKey = key;

    if (blogModalKicker) blogModalKicker.textContent = post.kicker;
    if (blogModalTag) {
      blogModalTag.textContent = post.tag;
      blogModalTag.className = 'blog-tag' + (key === 'camiones-gratis' ? ' free-tag' : '');
    }
    if (blogModalImg) {
      blogModalImg.src = post.img;
      blogModalImg.alt = post.title;
    }
    if (blogModalDate) blogModalDate.textContent = post.date;
    if (blogModalReadtime) blogModalReadtime.textContent = post.readTime;
    if (blogModalTitle) blogModalTitle.textContent = post.title;
    if (blogModalBody) blogModalBody.innerHTML = post.body;

    if (blogModalCta && blogModalCtaText) {
      blogModalCtaText.textContent = post.ctaText || 'Cotizar proyecto similar';
      if (post.ctaUrl) {
        blogModalCta.href = post.ctaUrl;
      } else {
        blogModalCta.href = `https://wa.me/529986391022?text=${encodeURIComponent(post.ctaMsg || 'Hola, leí su blog y me gustaría cotizar un proyecto.')}`;
      }
    }

    blogModal.classList.add('is-active');
    document.body.classList.add('modal-open');
    blogModal.setAttribute('aria-hidden', 'false');
    if (blogModalScroll) blogModalScroll.scrollTop = 0;
  };

  const closeBlogModal = () => {
    if (!blogModal) return;
    blogModal.classList.remove('is-active');
    document.body.classList.remove('modal-open');
    blogModal.setAttribute('aria-hidden', 'true');
  };

  if (blogModalClose) blogModalClose.addEventListener('click', closeBlogModal);
  if (blogModal) {
    blogModal.addEventListener('click', (e) => {
      if (e.target === blogModal) closeBlogModal();
    });
  }

  if (blogModalPrev) {
    blogModalPrev.addEventListener('click', () => {
      const idx = blogOrder.indexOf(currentBlogKey);
      const prevIdx = (idx - 1 + blogOrder.length) % blogOrder.length;
      openBlogModal(blogOrder[prevIdx]);
    });
  }

  if (blogModalNext) {
    blogModalNext.addEventListener('click', () => {
      const idx = blogOrder.indexOf(currentBlogKey);
      const nextIdx = (idx + 1) % blogOrder.length;
      openBlogModal(blogOrder[nextIdx]);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogModal && blogModal.classList.contains('is-active')) {
      closeBlogModal();
    }
  });

  $$('[data-blog-post]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-blog-post');
      openBlogModal(key);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBlogModal(card.getAttribute('data-blog-post'));
      }
    });
  });

  // --- 8. Auto-update Footer Year ---
  const footerYear = $('#footer-year');
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

})();
