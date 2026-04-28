/* =====================================================
   BuiltBy2 — main.js
   Vanilla JS: Navbar, Mobile Menu, Scroll Animations,
   Portfolio Filter, FAQ Accordion, Counter Animation,
   Contact Form, Smooth Scroll
===================================================== */

// ===== LUCIDE ICONS =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initCounters();
  initPortfolioFilter();
  initFAQ();
  initContactForm();
});

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  const toggle = (open) => {
    hamburger.classList.toggle('active', open);
    navLinks.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('active');
    toggle(!isOpen);
  });

  // Close when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') &&
        !hamburger.contains(e.target) &&
        !navLinks.contains(e.target)) {
      toggle(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      toggle(false);
      hamburger.focus();
    }
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ===== INTERSECTION OBSERVER — fade-in animations =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

// ===== ANIMATED COUNTER =====
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOutQuart(progress) * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

// ===== PORTFOLIO FILTER =====
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter cards with transition
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          // Small timeout so display change takes effect before opacity transition
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.classList.remove('filtering');
            });
          });
        } else {
          card.classList.add('filtering');
          const onEnd = () => {
            if (card.classList.contains('filtering')) {
              card.style.display = 'none';
            }
            card.removeEventListener('transitionend', onEnd);
          };
          card.addEventListener('transitionend', onEnd);
        }
      });
    });
  });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach(other => {
        const q = other.querySelector('.faq-question');
        const a = other.querySelector('.faq-answer');
        if (q && a && q !== question) {
          q.setAttribute('aria-expanded', 'false');
          a.classList.remove('open');
        }
      });

      // Toggle current
      const newState = !isOpen;
      question.setAttribute('aria-expanded', String(newState));
      answer.classList.toggle('open', newState);
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Loading state
    btn.disabled = true;
    btn.innerHTML = `
      <svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Enviando...
    `;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;

      if (success) {
        form.style.display = 'none';
        success.hidden = false;
        // Re-init icons in success state
        if (typeof lucide !== 'undefined') lucide.createIcons();
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  });
}

function validateForm(form) {
  let valid = true;
  const required = form.querySelectorAll('[required]');

  // Clear previous errors
  form.querySelectorAll('.field-error').forEach(el => el.remove());
  form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

  required.forEach(field => {
    let fieldValid = true;

    if (!field.value.trim()) {
      fieldValid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      fieldValid = false;
    }

    if (!fieldValid) {
      valid = false;
      field.classList.add('input-error');
      showFieldError(field);
    }
  });

  if (!valid) {
    const firstError = form.querySelector('.input-error');
    if (firstError) firstError.focus();
  }

  return valid;
}

function showFieldError(field) {
  const group = field.closest('.form-group');
  if (!group) return;

  const error = document.createElement('span');
  error.className = 'field-error';
  error.setAttribute('role', 'alert');
  error.textContent = getErrorMessage(field);
  group.appendChild(error);
}

function getErrorMessage(field) {
  if (!field.value.trim()) return 'Este campo es obligatorio.';
  if (field.type === 'email') return 'Ingresa un correo electrónico válido.';
  return 'Por favor completa este campo.';
}

// ===== DYNAMIC STYLES for form validation =====
const validationStyles = document.createElement('style');
validationStyles.textContent = `
  .input-error {
    border-color: #EF4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
  }
  .field-error {
    font-size: 0.75rem;
    color: #F87171;
    margin-top: -4px;
  }
  .spin-icon {
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(validationStyles);
