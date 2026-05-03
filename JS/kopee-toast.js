/* ══════════════════════════════════════════════════════════
   KOPEE — TOAST NOTIFICATION SYSTEM
   Reusable toast library for all Kopee pages
   Usage: KopeeToast.show({ type, title, message, duration })
══════════════════════════════════════════════════════════ */
 
const KopeeToast = (() => {
 
    // ─── ICONS ─────────────────────────────────────────────
    const ICONS = {
      success: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 4.5L6.5 11.5L3 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      error: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`,
      warning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3L14 13H2L8 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M8 7V9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
      </svg>`,
      info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.6"/>
        <path d="M8 7.5V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="8" cy="5.5" r="0.75" fill="currentColor"/>
      </svg>`,
    };
   
    // ─── DEFAULT TITLES ─────────────────────────────────────
    const DEFAULT_TITLES = {
      success: 'Berhasil',
      error:   'Terjadi Kesalahan',
      warning: 'Perhatian',
      info:    'Informasi',
    };
   
    // ─── DEFAULT DURATIONS (ms) ─────────────────────────────
    const DEFAULT_DURATION = {
      success: 4000,
      error:   6000,
      warning: 5000,
      info:    4500,
    };
   
    // ─── ENSURE CONTAINER ───────────────────────────────────
    function getContainer() {
      let container = document.getElementById('kopee-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'kopee-toast-container';
        document.body.appendChild(container);
      }
      return container;
    }
   
    // ─── INJECT CSS IF NOT ALREADY LOADED ──────────────────
    function ensureCSS() {
      if (document.getElementById('kopee-toast-css')) return;
   
      // Try to load from same directory as this script
      const scripts = document.querySelectorAll('script[src]');
      let basePath = 'JS/'; // default assumption
   
      scripts.forEach(s => {
        if (s.src && s.src.includes('kopee-toast.js')) {
          basePath = s.src.replace('kopee-toast.js', '').replace(window.location.origin, '');
        }
      });
   
      const link = document.createElement('link');
      link.id   = 'kopee-toast-css';
      link.rel  = 'stylesheet';
      link.href = basePath.replace('JS/', 'CSS/') + 'kopee-toast.css';
      document.head.appendChild(link);
    }
   
    // ─── DISMISS TOAST ──────────────────────────────────────
    function dismiss(toast) {
      if (toast.dataset.dismissed === 'true') return;
      toast.dataset.dismissed = 'true';
   
      // Pause the progress animation
      const bar = toast.querySelector('.kopee-toast__progress');
      if (bar) bar.style.animationPlayState = 'paused';
   
      toast.classList.add('kopee-toast--out');
      toast.addEventListener('animationend', () => {
        toast.remove();
      }, { once: true });
    }
   
    // ─── MAIN SHOW FUNCTION ─────────────────────────────────
    /**
     * @param {Object} options
     * @param {'success'|'error'|'warning'|'info'} options.type
     * @param {string} [options.title]
     * @param {string} options.message
     * @param {number} [options.duration]  ms, 0 = persistent
     */
    function show({ type = 'info', title, message = '', duration } = {}) {
      ensureCSS();
      const container = getContainer();
   
      const resolvedTitle    = title    ?? DEFAULT_TITLES[type]    ?? 'Notifikasi';
      const resolvedDuration = duration ?? DEFAULT_DURATION[type]  ?? 4000;
   
      // ── Build element ──
      const toast = document.createElement('div');
      toast.className = `kopee-toast kopee-toast--${type}`;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
   
      toast.innerHTML = `
        <div class="kopee-toast__icon-wrap" aria-hidden="true">
          ${ICONS[type] || ICONS.info}
        </div>
        <div class="kopee-toast__body">
          <div class="kopee-toast__title">${resolvedTitle}</div>
          ${message ? `<div class="kopee-toast__msg">${message}</div>` : ''}
        </div>
        <button class="kopee-toast__close" aria-label="Tutup notifikasi">✕</button>
        ${resolvedDuration > 0 ? `<div class="kopee-toast__progress" style="animation-duration: ${resolvedDuration}ms"></div>` : ''}
      `;
   
      // ── Click anywhere to dismiss ──
      toast.addEventListener('click', () => dismiss(toast));
   
      // ── Close button ──
      toast.querySelector('.kopee-toast__close')
           .addEventListener('click', (e) => { e.stopPropagation(); dismiss(toast); });
   
      // ── Pause progress on hover ──
      toast.addEventListener('mouseenter', () => {
        const bar = toast.querySelector('.kopee-toast__progress');
        if (bar) bar.style.animationPlayState = 'paused';
      });
      toast.addEventListener('mouseleave', () => {
        const bar = toast.querySelector('.kopee-toast__progress');
        if (bar) bar.style.animationPlayState = 'running';
      });
   
      container.appendChild(toast);
   
      // ── Auto dismiss ──
      if (resolvedDuration > 0) {
        setTimeout(() => dismiss(toast), resolvedDuration);
      }
   
      return toast;
    }
   
    // ─── SHORTHAND HELPERS ──────────────────────────────────
    const success = (message, title, duration) => show({ type: 'success', title, message, duration });
    const error   = (message, title, duration) => show({ type: 'error',   title, message, duration });
    const warning = (message, title, duration) => show({ type: 'warning', title, message, duration });
    const info    = (message, title, duration) => show({ type: 'info',    title, message, duration });
   
    return { show, success, error, warning, info };
   
  })();
  