/* =============================================
   ATLAS ROBOTICS CAPITAL — App Logic
   ============================================= */

(function () {
  'use strict';

  // ---- Intersection Observer: Reveal on Scroll ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---- Animated Counters ----
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = new Set();

  function formatNumber(num, format) {
    if (format === 'comma') {
      return Math.round(num).toLocaleString('en-US');
    }
    // Determine decimal places from target
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1].length;
      return num.toFixed(decimals);
    }
    return Math.round(num).toLocaleString('en-US');
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const format = el.dataset.format || '';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const current = target * easedProgress;

      el.textContent = formatNumber(current, format);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure final value is exact
        el.textContent = formatNumber(target, format);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
          countersAnimated.add(entry.target);
          animateCounter(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  counters.forEach((el) => counterObserver.observe(el));

  // ---- Subtle Parallax on Hero ----
  const heroImg = document.querySelector('.hero__bg-img');
  let ticking = false;

  function updateParallax() {
    if (!heroImg) return;
    const scrolled = window.pageYOffset;
    const heroHeight = window.innerHeight;
    if (scrolled < heroHeight * 1.5) {
      const offset = scrolled * 0.3;
      heroImg.style.transform = `scale(1.05) translateY(${offset}px)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // ---- Smooth Scroll for Hero Indicator ----
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.style.cursor = 'pointer';
    scrollIndicator.addEventListener('click', function () {
      const thesis = document.getElementById('thesis');
      if (thesis) {
        thesis.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---- Staggered reveal for grid children ----
  function addStaggerDelay() {
    const grids = document.querySelectorAll('.opportunity__grid, .fleet__grid, .investment__explainer, .steps');
    grids.forEach((grid) => {
      const children = grid.querySelectorAll('.reveal');
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
      });
    });
  }
  addStaggerDelay();

  // ---- Timeline item stagger ----
  const timelineItems = document.querySelectorAll('.timeline__item.reveal');
  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.12}s`;
  });

})();
