/* =========================================================
   AUREA — global behaviour (header, reveal, parallax)
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastY = 0;

  /* ---------- Header state + top bar auto-hide ---------- */
  const hdr = $('#hdr');
  const top = $('#top');

  function onScroll() {
    const h = document.documentElement;
    const y = h.scrollTop;
    if (hdr) hdr.classList.toggle('is-solid', y > 60);
    if (top && top.classList.contains('top--sticky')) {
      const goingDown = y > lastY;
      top.classList.toggle('is-hidden', y > 640 && goingDown);
    }
    lastY = y;

    if (!reduce) {
      $$('[data-parallax]').forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const speed = parseFloat(el.dataset.parallax) || 0.06;
          el.style.transform = 'translateY(' + ((r.top - window.innerHeight / 2) * speed).toFixed(1) + 'px)';
        }
      });
    }

    /* Safety net: reveal anything that entered the viewport, even if the
       IntersectionObserver missed it (e.g. fast scroll / restored scroll). */
    const pending = document.querySelectorAll('.reveal:not(.in), [data-clip]:not(.in)');
    if (pending.length) {
      const vh = window.innerHeight;
      pending.forEach(function (el) {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh - 40) el.classList.add('in');
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Reveal on scroll (progressive enhancement) ----------
     Elements are visible by default; JS opts them into the animation,
     so the theme still renders correctly with JS disabled. */
  const revealables = $$('.reveal, [data-clip]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    revealables.forEach(function (el) {
      if (el.hasAttribute('data-clip') && el.dataset.clip === 'right') el.classList.add('clip-rtl');
      else if (el.hasAttribute('data-clip')) el.classList.add('clip');
      io.observe(el);
    });
  }

  /* ---------- Scroll progress (if present) ---------- */
  const prog = $('#scrollProg');
  if (prog) window.addEventListener('scroll', function () {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }, { passive: true });

  /* ---------- Cursor glow (pointer devices) ---------- */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
    const glow = document.createElement('span');
    glow.className = 'cursor';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $$('.magnet').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (mx * 0.18).toFixed(1) + 'px,' + (my * 0.28 - 2).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Lookbook: drag to scroll ---------- */
  $$('.look__rail').forEach(function (rail) {
    let down = false, startX = 0, startLeft = 0;
    rail.addEventListener('pointerdown', function (e) {
      down = true; startX = e.clientX; startLeft = rail.scrollLeft;
      rail.classList.add('is-drag');
      try { rail.setPointerCapture(e.pointerId); } catch (err) {}
    });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      rail.scrollLeft = startLeft - (e.clientX - startX);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      rail.addEventListener(ev, function () { down = false; rail.classList.remove('is-drag'); });
    });
  });

  onScroll();
  window.addEventListener('load', onScroll);
  setTimeout(onScroll, 200);
  setTimeout(onScroll, 900);
})();
