/* ═══════════════════════════════════════════════════════════════
   DUOne ESport Championship — main.js
   Micro-interactions & animations
   ══════════════════════════════════════════════════════════════= */

/* ─── Smooth active nav highlight on scroll ──────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => observer.observe(s));

/* ─── Fade-in on scroll ──────────────────────────────────────── */
const fadeEls = document.querySelectorAll(
  '.stat-card, .info-card, .org-card, .dayof-item, ' +
  '.risk-card, .setting-item, .tl-task, .group-box, ' +
  '.prize-card, .setup-step'
);

const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
  fadeObs.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.visible, [class]').forEach(el => {});
});

// make visible
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .nav-links a.active {
      color: var(--text);
      position: relative;
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0; right: 0;
      height: 2px;
      background: var(--primary);
      border-radius: 1px;
    }
  </style>
`);

/* ─── Stat counter animation ─────────────────────────────────── */
function animateCount(el, target, prefix = '', suffix = '') {
  const duration = 1200;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.trim();
      const match = raw.match(/^([~><]?)\s*(\d+)\s*([A-Za-z\+]?)$/);
      
      if (match) {
        const prefix = match[1];
        const target = parseInt(match[2], 10);
        const suffix = match[3];
        animateCount(el, target, prefix, suffix);
      } else {
        const target = parseInt(raw, 10);
        if (!isNaN(target)) {
          animateCount(el, target);
        }
      }
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObs.observe(el));

/* ─── Nav scroll blur ────────────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(6,8,16,0.9)';
    nav.style.backdropFilter = 'blur(12px)';
    nav.style.position = 'sticky';
    nav.style.top = '0';
    nav.style.zIndex = '100';
  } else {
    nav.style.background = '';
    nav.style.backdropFilter = '';
  }
}, { passive: true });

/* ─── Match Schedule Tab Switching ───────────────────────────── */
const matchTabs = document.querySelectorAll('.match-tab');
const matchPanels = document.querySelectorAll('.match-panel');

matchTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active from all tabs and panels
    matchTabs.forEach(t => t.classList.remove('active'));
    matchPanels.forEach(p => p.classList.remove('active'));

    // Activate clicked tab
    tab.classList.add('active');

    // Activate corresponding panel
    const targetId = 'panel-' + tab.dataset.tab;
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      // Subtle fade-in animation
      targetPanel.style.opacity = '0';
      targetPanel.style.transform = 'translateY(8px)';
      requestAnimationFrame(() => {
        targetPanel.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        targetPanel.style.opacity = '1';
        targetPanel.style.transform = 'translateY(0)';
      });
    }
  });
});
