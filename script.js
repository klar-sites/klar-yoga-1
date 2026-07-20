/* Stillwater Yoga — script.js
   Progressive enhancement: mobile nav, sticky header state, theme toggle,
   schedule day filter, scroll reveal, and form status messages. */

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Mobile navigation ---------- */
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (header && navToggle) {
    navToggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the menu when a link inside it is activated
    if (navLinks) {
      navLinks.addEventListener('click', function (event) {
        if (event.target.closest('a')) {
          header.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
        }
      });
    }

    // Close on Escape and return focus to the toggle
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        navToggle.focus();
      }
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Theme toggle (persisted) ---------- */
  var themeToggle = document.querySelector('.theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('swy-theme', next);
      } catch (error) {
        /* Storage unavailable — theme still flips for this visit. */
      }
    });
  }

  /* ---------- Schedule day filter ---------- */
  var filterGroup = document.querySelector('.schedule-filters');

  if (filterGroup) {
    var chips = Array.prototype.slice.call(filterGroup.querySelectorAll('[data-day]'));
    var rows = Array.prototype.slice.call(document.querySelectorAll('.schedule-table tbody tr[data-day]'));
    var emptyNote = document.querySelector('.schedule-empty');

    filterGroup.addEventListener('click', function (event) {
      var chip = event.target.closest('[data-day]');
      if (!chip) return;

      var day = chip.getAttribute('data-day');

      chips.forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === chip));
      });

      var visibleCount = 0;
      rows.forEach(function (row) {
        var show = day === 'all' || row.getAttribute('data-day') === day;
        row.classList.toggle('is-hidden', !show);
        if (show) visibleCount += 1;
      });

      if (emptyNote) {
        emptyNote.classList.toggle('is-visible', visibleCount === 0);
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealItems.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* ---------- Contact form (front-end only demo) ---------- */
  var contactForm = document.querySelector('[data-contact-form]');

  if (contactForm) {
    var status = contactForm.querySelector('.form-status');

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      var nameInput = contactForm.querySelector('#contact-name');
      var firstName = nameInput && nameInput.value.trim() ? nameInput.value.trim().split(' ')[0] : 'there';

      if (status) {
        status.textContent = 'Thanks, ' + firstName + ' — your message is on its way. Someone from the front desk will reply within one working day.';
        status.classList.add('is-visible');
        status.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
      }

      contactForm.reset();
    });
  }

  /* ---------- Newsletter forms (footer, every page) ---------- */
  var newsletterForms = document.querySelectorAll('[data-newsletter]');

  newsletterForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var input = form.querySelector('input[type="email"]');

      if (button) {
        button.textContent = 'Joined ✓';
        button.disabled = true;
      }
      if (input) {
        input.value = '';
        input.placeholder = 'Welcome to the list';
      }
    });
  });
})();
