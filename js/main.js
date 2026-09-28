/* ============================================================
   Asraf Siddiquee - Portfolio Scripts
   ============================================================ */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = $('#loader');
    if (loader) loader.classList.add('is-hidden');
  });

  /* ---------- Theme Toggle ---------- */
  const THEME_KEY = 'ans-portfolio-theme';
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved || 'dark');
  })();

  themeToggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Mobile Nav ---------- */
  const navToggle = $('#navToggle');
  const nav = $('#nav');

  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  $$('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle?.classList.remove('is-active');
      navToggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Header Scroll State + Progress Bar + Scrollspy + Back to top ---------- */
  const header = $('#header');
  const progressBar = $('#progressBar');
  const backToTop = $('#backToTop');
  const sections = $$('main section[id]');
  const navLinks = $$('.nav__link[data-nav]');

  function onScroll() {
    const scrollY = window.scrollY;

    header.classList.toggle('is-scrolled', scrollY > 20);
    backToTop.classList.toggle('is-visible', scrollY > 500);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;

    let currentId = sections[0]?.id;
    const offset = 140;
    for (const section of sections) {
      if (section.offsetTop - offset <= scrollY) {
        currentId = section.id;
      }
    }
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Reveal on Scroll ---------- */
  const revealEls = $$('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = $$('.stat__num');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  const aboutStats = $('.about__stats');
  if (aboutStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(aboutStats);
  }

  /* ---------- Experience Tabs ---------- */
  const tabButtons = $$('.tabs__btn');
  const tabPanels = $$('.tabs__panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.panel === target);
      });
    });
  });

  /* ---------- Show More Presentations ---------- */
  const presToggle = $('#presToggle');
  presToggle?.addEventListener('click', () => {
    const hiddenCards = $$('.pres-card--hidden');
    hiddenCards.forEach(card => card.classList.remove('pres-card--hidden'));
    presToggle.style.display = 'none';
  });

  /* ---------- Research-themed Background Canvas ---------- */
  const canvas = $('#bgCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    const LINK_DIST = 140;

    function accentColor() {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      return c || '#45e0c4';
    }
    function accent2Color() {
      const c = getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim();
      return c || '#5b8cff';
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(90, Math.floor((W * H) / 22000));
      nodes = [];
      for (let i = 0; i < density; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.8,
          orbit: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const a = accentColor();
      const a2 = accent2Color();

      // Links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.35;
            ctx.strokeStyle = hexToRgba(a2, alpha);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes (with a subtle glow)
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grad.addColorStop(0, hexToRgba(a, 0.55));
        grad.addColorStop(1, hexToRgba(a, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hexToRgba(a, 0.9);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    function hexToRgba(hex, alpha) {
      hex = hex.replace('#', '').trim();
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  /* ---------- Hero Showreel: single-player clip switcher ---------- */
  const showreelVideo = $('#showreelVideo');
  const showreelTabs = $$('.showreel__tab');
  const showreelTag = $('#showreelTag');
  const showreelCaption = $('#showreelCaption');

  showreelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;

      showreelTabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      showreelVideo.style.opacity = '0';
      window.setTimeout(() => {
        showreelVideo.src = tab.dataset.src;
        showreelVideo.load();
        showreelVideo.play().catch(() => {});
        showreelTag.textContent = tab.dataset.tag;
        showreelCaption.textContent = tab.dataset.caption;
        showreelVideo.style.opacity = '1';
      }, 180);
    });
  });

  if (showreelVideo) {
    const showreelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          showreelVideo.play().catch(() => {});
        } else {
          showreelVideo.pause();
        }
      });
    }, { threshold: 0.3 });
    showreelObserver.observe(showreelVideo);
  }

  /* ---------- Project videos: auto-play in loop while in view ---------- */
  const PLAY_ICON = '<path d="M8 5v14l11-7z"/>';
  const PAUSE_ICON = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';

  const videoFrames = $$('.video-card__frame');
  if (videoFrames.length) {
    videoFrames.forEach(frame => {
      const video = frame.querySelector('video');
      const playBtn = frame.querySelector('.video-card__play');
      const icon = playBtn.querySelector('svg');

      video.addEventListener('play', () => {
        frame.classList.add('is-playing');
        icon.innerHTML = PAUSE_ICON;
      });
      video.addEventListener('pause', () => {
        frame.classList.remove('is-playing');
        icon.innerHTML = PLAY_ICON;
      });

      // Manual override: let the viewer pause/resume a clip on click.
      function togglePlay() {
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      }
      playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
      frame.addEventListener('click', togglePlay);
    });

    const autoplayObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const frame = entry.target;
        const video = frame.querySelector('video');
        if (entry.isIntersecting) {
          if (!video.getAttribute('src') && video.dataset.src) {
            video.src = video.dataset.src;
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.35 });
    videoFrames.forEach(frame => autoplayObserver.observe(frame));
  }

  /* ---------- Footer Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
