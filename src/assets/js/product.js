/* =========================================================
   AUREA — product page helpers
   ========================================================= */
(function () {
  'use strict';

  /* Keep option selects from submitting placeholder values and
     reflect availability state from Salla's option payload. */
  const form = document.querySelector('.pdp__form');
  if (form) {
    form.addEventListener('submit', function (e) {
      const missing = Array.from(form.querySelectorAll('select[data-required]'))
        .filter(function (s) { return !s.value; });
      if (missing.length) {
        e.preventDefault();
        missing[0].focus();
      }
    });
  }

  /* Smooth switch between gallery thumbs if Salla emits slide changes */
  document.addEventListener('salla:product:image:changed', function () {
    const slider = document.querySelector('.pdp__slider');
    if (slider) slider.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
