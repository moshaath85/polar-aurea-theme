/* =========================================================
   AUREA — cinematic hero slideshow
   Ken Burns + crossfade + progress bars + per-slide panels
   ========================================================= */
(function () {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll('.hero__slide'));
  const panels = Array.from(hero.querySelectorAll('.hero__panel'));
  const bars = Array.from(hero.querySelectorAll('.hero__bar'));
  if (slides.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cfg = window.theme || {};
  const DURATION = parseInt(cfg.heroAutoplay, 10) || 7000;
  hero.style.setProperty('--slide-ms', DURATION + 'ms');

  /* ---------- Word-by-word title reveal ---------- */
  function splitWords(el) {
    if (el.dataset.split === '1') return;
    const words = (el.textContent || '').trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w) {
      const wrap = document.createElement('span');
      wrap.className = 'w';
      const inner = document.createElement('i');
      inner.textContent = w;
      wrap.appendChild(inner);
      el.appendChild(wrap);
      el.appendChild(document.createTextNode(' '));
    });
    el.dataset.split = '1';
  }
  if (!reduce) panels.forEach(function (p) {
    const t = p.querySelector('.hero__title');
    if (t) splitWords(t);
  });

  /* ---------- Progress bar ---------- */
  const prog = hero.querySelector('.hero__progress i');
  function runProgress() {
    if (!prog || reduce) return;
    prog.classList.remove('run');
    void prog.offsetWidth;
    prog.classList.add('run');
    prog.style.animationDuration = DURATION + 'ms';
  }

  let idx = 0;
  let timer = null;
  let paused = false;

  function go(next) {
    const n = ((next % slides.length) + slides.length) % slides.length;
    if (n === idx) return;

    slides[idx].classList.remove('is-active');
    if (panels[idx]) panels[idx].classList.remove('is-active');
    if (bars[idx]) bars[idx].classList.remove('is-active');

    idx = n;

    const slide = slides[idx];
    const img = slide.querySelector('img');
    slide.classList.add('is-active');
    if (img && !reduce && cfg.heroKenBurns) {
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
    }
    if (panels[idx]) panels[idx].classList.add('is-active');

    if (bars[idx]) {
      bars[idx].classList.remove('is-active');
      void bars[idx].offsetWidth;
      bars[idx].classList.add('is-active');
    }
    runProgress();
  }

  function start() {
    stop();
    if (!reduce && !paused) timer = setInterval(function () { go(idx + 1); }, DURATION);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  bars.forEach(function (bar, i) {
    bar.addEventListener('click', function () { go(i); start(); });
  });

  /* swipe support */
  let x0 = null;
  hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) { go(dx > 0 ? idx + 1 : idx - 1); start(); }
    x0 = null;
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
    if (paused) stop(); else start();
  });

  start();
  runProgress();
})();
