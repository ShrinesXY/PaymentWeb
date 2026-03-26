/* ========================================
   AYAKA KAMISATO — APP LOGIC
   ======================================== */

'use strict';

// ---- Icon Init ----
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initApp();
});

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

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
}

// ---- Mobile Menu ----
function initMobileMenu() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      // Swap icon to X
      btn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
      lucide.createIcons();
    }
  });
}

function closeMobileMenu() {
  const btn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.remove('open');
  if (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
    lucide.createIcons();
  }
}

// ---- SPA Navigation ----
const PAGES = ['home', 'keunggulan', 'teknologi', 'harga', 'sewa', 'contact'];

function navigate(pageId) {
  if (!PAGES.includes(pageId)) return;

  // Hide all sections
  PAGES.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  // Show target
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-run reveal for newly visible elements
    setTimeout(() => observeRevealElements(), 80);
  }

  // Update nav link states
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.nav === pageId) link.classList.add('active');
  });

  // Close mobile menu
  closeMobileMenu();

  // Re-init icons in new section
  setTimeout(() => lucide.createIcons(), 50);
}

function initSPA() {
  // Set home as default active
  const homeEl = document.getElementById('home');
  if (homeEl) homeEl.classList.add('active');

  // Mark home nav as active
  document.querySelectorAll('[data-nav="home"]').forEach(l => l.classList.add('active'));
}

// ---- Scroll Reveal ----
let revealObserver = null;

function initScrollReveal() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  observeRevealElements();
}

function observeRevealElements() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// ---- Video Modal ----
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('modal-close');
  const videoEl = document.getElementById('demo-video');

  if (!modal) return;

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideoModal();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeVideoModal);
  }
}

function openVideoModal() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('demo-video');
  if (!modal) return;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (videoEl && videoEl.src) {
    videoEl.play().catch(() => {}); // autoplay if src set
  }
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('demo-video');
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';

  if (videoEl) {
    videoEl.pause();
    videoEl.currentTime = 0;
  }
}

// Expose to global scope for inline onclick
window.navigate = navigate;
window.closeMobileMenu = closeMobileMenu;
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
