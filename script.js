/* ============================================
   DUARTE CAR - Interactive JavaScript
   Scroll animations, nav, mobile menu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === DOM Elements ===
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const headerNav = document.getElementById('headerNav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // === Header Scroll Effect ===
  let lastScrollY = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class for glassmorphism header
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // === Active Nav Link Tracking ===
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // === Mobile Menu ===
  function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    headerNav.classList.toggle('open');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = headerNav.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    headerNav.classList.remove('open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && headerNav.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // === Scroll Reveal Animations ===
  function createObserver(elements, options = {}) {
    const defaultOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay for grid items
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, mergedOptions);

    elements.forEach((el, index) => {
      // Add stagger delay for service cards
      if (el.classList.contains('service-card')) {
        el.dataset.delay = index * 100;
      }
      observer.observe(el);
    });
  }

  // Observe reveal elements
  const revealElements = document.querySelectorAll('.reveal');
  createObserver(revealElements);

  // Observe about section
  const aboutContent = document.getElementById('aboutContent');
  const aboutVisual = document.getElementById('aboutVisual');
  if (aboutContent) createObserver([aboutContent]);
  if (aboutVisual) createObserver([aboutVisual]);

  // Observe service cards
  const serviceCards = document.querySelectorAll('.service-card');
  createObserver(serviceCards);

  // Observe contact section
  const contactInfo = document.getElementById('contactInfo');
  const contactMap = document.getElementById('contactMap');
  if (contactInfo) createObserver([contactInfo]);
  if (contactMap) createObserver([contactMap]);

  // === Counter Animation for Stats ===
  function animateCounter(element, target, duration = 2000) {
    const startTime = performance.now();
    const isPercent = target.toString().includes('%');
    const numericTarget = parseInt(target.toString().replace(/[^0-9]/g, ''));

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numericTarget * eased);

      element.textContent = current.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Restore original text
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // Observe stat numbers for counter animation
  const statNumbers = document.querySelectorAll('.about-card-stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.textContent;
        animateCounter(entry.target, target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statObserver.observe(stat));

  // === Parallax Effect on Hero ===
  const heroBg = document.querySelector('.hero-bg img');

  function parallax() {
    if (heroBg && window.scrollY < window.innerHeight) {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${offset}px) scale(1.05)`;
    }
  }

  window.addEventListener('scroll', parallax, { passive: true });

  // === Accessibility: Reduce motion ===
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.reveal, .about-content, .about-visual, .service-card, .contact-info, .contact-map').forEach(el => {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('animate-in');
    });
  }

  // === Console Branding ===
  console.log(
    '%c⚙️ Duarte Car %c Site desenvolvido por <Flávia.dev />',
    'background: #E31937; color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold; font-size: 14px;',
    'background: #1A1A1A; color: #CCCCCC; padding: 8px 12px; border-radius: 0 4px 4px 0; font-size: 14px;'
  );
});
