/* ========================================
   AYAKA KAMISATO — APP LOGIC
   ======================================== */

'use strict';

/* ============================================================
   KONFIGURASI VIDEO GITHUB
   ------------------------------------------------------------
   Isi ketiga variabel ini dengan info repo GitHub kamu:

   GITHUB_USER  → username GitHub kamu
   GITHUB_REPO  → nama repository tempat video disimpan
   GITHUB_FILE  → nama file video (harus .mp4), boleh
                  pakai subfolder: 'assets/demo.mp4'

   Contoh:
     const GITHUB_USER = 'andifadlan';
     const GITHUB_REPO = 'ayaka-assets';
     const GITHUB_FILE = 'demo.mp4';

   Setelah diisi, cukup push file MP4 ke branch main —
   video akan otomatis muncul saat tombol play diklik.
   ============================================================ */
const GITHUB_USER = 'ShrinesXY';        // ← isi username kamu
const GITHUB_REPO = 'PaymentWeb';        // ← isi nama repo kamu
const GITHUB_FILE = 'demo.mp4'; // ← isi nama file video

/* ============================================================
   Jangan ubah kode di bawah ini kecuali kamu tau yang dilakukan
   ============================================================ */

function getGithubVideoUrl() {
  if (!GITHUB_USER || !GITHUB_REPO || !GITHUB_FILE) return null;
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${GITHUB_FILE}`;
}

// ---- Boot ----
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  initNavbar();
  initMobileMenu();
  initSPA();
  initScrollReveal();
  initVideoModal();
}

// ---- Navbar scroll effect ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Mobile Menu ----
const HAMBURGER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`;
const CLOSE_ICON    = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

function initMobileMenu() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
}

function openMobileMenu() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.add('open');
  if (btn) { btn.setAttribute('aria-expanded', 'true'); btn.innerHTML = CLOSE_ICON; }
}

function closeMobileMenu() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.remove('open');
  if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.innerHTML = HAMBURGER_ICON; }
}

// ---- SPA Navigation ----
const PAGES = ['home', 'keunggulan', 'teknologi', 'harga', 'sewa', 'contact'];

function navigate(pageId) {
  if (!PAGES.includes(pageId)) return;
  PAGES.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(observeRevealElements, 80);
  }
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.classList.toggle('active', link.dataset.nav === pageId);
  });
  closeMobileMenu();
}

function initSPA() {
  const homeEl = document.getElementById('home');
  if (homeEl) homeEl.classList.add('active');
  document.querySelectorAll('[data-nav="home"]').forEach(l => l.classList.add('active'));
}

// ---- Scroll Reveal ----
let revealObserver = null;

function initScrollReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  observeRevealElements();
}

function observeRevealElements() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

// ---- Video Modal ----
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal) closeVideoModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideoModal(); });
  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
}

function showVideoState(state) {
  const map = { loading: 'video-loading', ready: 'demo-video', 'not-set': 'video-not-set', error: 'video-error' };
  Object.values(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(map[state]);
  if (target) target.style.display = state === 'ready' ? 'block' : 'block';
}

function openVideoModal() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('demo-video');
  if (!modal) return;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const url = getGithubVideoUrl();

  if (!url) {
    showVideoState('not-set');
    return;
  }

  // Sudah di-load sebelumnya
  if (videoEl && videoEl.src === url) {
    showVideoState('ready');
    videoEl.play().catch(() => {});
    return;
  }

  showVideoState('loading');

  fetch(url, { method: 'HEAD' })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status} — file tidak ditemukan di GitHub.`);
      if (!videoEl) return;
      videoEl.src = url;
      videoEl.load();
      videoEl.addEventListener('canplay', () => {
        showVideoState('ready');
        videoEl.play().catch(() => {});
      }, { once: true });
      videoEl.addEventListener('error', () => {
        showVideoState('error');
        const msg = document.getElementById('video-error-msg');
        if (msg) msg.textContent = 'Browser gagal memutar video. Pastikan format file adalah .mp4 (H.264).';
      }, { once: true });
    })
    .catch(err => {
      showVideoState('error');
      const msg = document.getElementById('video-error-msg');
      if (msg) msg.textContent = err.message || 'File tidak ditemukan di repository GitHub.';
    });
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('demo-video');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  if (videoEl) { videoEl.pause(); videoEl.currentTime = 0; }
}

function retryVideo() {
  const videoEl = document.getElementById('demo-video');
  if (videoEl) videoEl.src = '';
  openVideoModal();
}

// ---- Expose globals ----
window.navigate        = navigate;
window.closeMobileMenu = closeMobileMenu;
window.openVideoModal  = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.retryVideo      = retryVideo;
