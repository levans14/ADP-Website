/* ===== MOBILE NAV ===== */
(function () {
  const hamburger = document.getElementById('nav-hamburger');
  const mobile    = document.getElementById('nav-mobile');
  if (!hamburger || !mobile) return;

  hamburger.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    const [a, b, c] = hamburger.querySelectorAll('span');
    if (open) {
      a.style.transform = 'translateY(7px) rotate(45deg)';
      b.style.opacity   = '0';
      c.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      a.style.transform = b.style.opacity = c.style.transform = '';
      b.style.opacity = '1';
    }
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobile.contains(e.target)) {
      mobile.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => (s.style.transform = s.style.opacity = ''));
    }
  });
})();

/* ===== BEFORE / AFTER SLIDER ===== */
(function () {
  const sliders = document.querySelectorAll('.ba-slider');
  sliders.forEach(slider => {
    const beforeEl = slider.querySelector('.ba-slider__before');
    const handle   = slider.querySelector('.ba-slider__handle');
    if (!beforeEl || !handle) return;

    let dragging = false;

    function setPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let pct = (clientX - rect.left) / rect.width;
      pct = Math.max(0.02, Math.min(0.98, pct));
      const pctPx = pct * 100;
      beforeEl.style.clipPath = `inset(0 ${100 - pctPx}% 0 0)`;
      handle.style.left = `${pctPx}%`;
    }

    // Mouse
    handle.addEventListener('mousedown', (e) => { dragging = true; e.preventDefault(); });
    window.addEventListener('mouseup',   () => { dragging = false; });
    window.addEventListener('mousemove', (e) => { if (dragging) setPosition(e.clientX); });

    // Touch
    handle.addEventListener('touchstart', (e) => { dragging = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchend',   () => { dragging = false; });
    window.addEventListener('touchmove',  (e) => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    // Click anywhere on slider to jump
    slider.addEventListener('click', (e) => setPosition(e.clientX));
  });
})();

/* ===== SCROLL FADE-IN ===== */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ===== QUOTE MODAL ===== */
(function () {
  const modal   = document.getElementById('quote-modal');
  const overlay = document.getElementById('quote-overlay');
  if (!modal) return;

  function open() {
    modal.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal="quote"]').forEach(btn => btn.addEventListener('click', open));
  overlay.addEventListener('click', close);
  document.getElementById('modal-close')?.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  const form = modal?.querySelector('form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    form.innerHTML = `
      <div style="text-align:center;padding:40px 0">
        <span class="material-symbols-outlined" style="font-size:48px;color:var(--color-primary);display:block;margin-bottom:16px">check_circle</span>
        <p class="t-h3" style="margin-bottom:8px">Request Received</p>
        <p class="t-body-md" style="color:var(--color-secondary)">We'll contact you within 24 hours.</p>
      </div>`;
    setTimeout(close, 2800);
  });
})();
