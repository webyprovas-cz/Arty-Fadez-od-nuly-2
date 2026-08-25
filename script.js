(function () {
  'use strict';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav shrink on scroll */
  var nav = document.getElementById('siteNav');
  if (nav) {
    var ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          nav.classList.toggle('is-scrolled', window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  var burger = document.getElementById('burgerBtn');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    function closeMenu() {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* Reveal on scroll, staggered per group */
  document.querySelectorAll('.card-grid').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (el, i) {
      if (el.classList.contains('reveal')) el.style.transitionDelay = Math.min(i * 60, 420) + 'ms';
    });
  });

  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Floating booking CTA, hidden while hero is in view */
  var floatCta = document.getElementById('floatingCta');
  var heroEl = document.getElementById('top');
  if (floatCta && heroEl && 'IntersectionObserver' in window) {
    var heroIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          floatCta.classList.toggle('is-visible', !entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    heroIo.observe(heroEl);
  } else if (floatCta && !heroEl) {
    floatCta.classList.add('is-visible');
  }

})();
