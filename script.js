/* =========================================================
   DD PRIME SOLUTION — SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll);

  /* ---------- Mobile hamburger menu ---------- */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mainNav = document.getElementById('mainNav');

  function closeMenu() {
    hamburgerBtn.classList.remove('open');
    mainNav.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('open');
    hamburgerBtn.classList.toggle('open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close mobile menu after clicking a nav link */
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Smooth scrolling for internal links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll('main section[id], main#home');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    var scrollPos = window.scrollY + 140;
    var currentId = 'home';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active-link');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active-link');
      }
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      /* Close all other FAQ items */
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Scroll reveal animation ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    /* Fallback: no IntersectionObserver support */
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Back to top button ---------- */
  var backToTopBtn = document.getElementById('backToTop');
  function toggleBackToTop() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', toggleBackToTop);
  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     CONTACT FORM — FRONTEND VALIDATION ONLY
     -----------------------------------------------------------
     This form currently only validates input in the browser.
     No data is sent anywhere. To actually RECEIVE submissions,
     connect this form to a backend, for example:
       - Formspree (https://formspree.io) — set form action to
         "https://formspree.io/f/yourFormID" and method="POST"
       - Netlify Forms — add the "netlify" attribute to the
         <form> tag if hosting on Netlify
       - Your own backend API endpoint using fetch()
     ========================================================= */

  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  var fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter your full name.';
        if (value.trim().length < 2) return 'Please enter a valid name.';
        return '';
      }
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('phoneError'),
      validate: function (value) {
        var cleaned = value.replace(/\s+/g, '');
        if (!cleaned) return 'Please enter your phone number.';
        if (!/^[6-9]\d{9}$/.test(cleaned)) return 'Please enter a valid 10-digit Indian mobile number.';
        return '';
      }
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter your email address.';
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      }
    },
    service: {
      input: document.getElementById('service'),
      error: document.getElementById('serviceError'),
      validate: function (value) {
        if (!value) return 'Please select a service.';
        return '';
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter a short message.';
        if (value.trim().length < 10) return 'Please add a little more detail (at least 10 characters).';
        return '';
      }
    }
  };

  function showFieldError(fieldKey, message) {
    var field = fields[fieldKey];
    field.error.textContent = message;
    field.input.closest('.form-group').classList.toggle('error', Boolean(message));
  }

  function validateField(fieldKey) {
    var field = fields[fieldKey];
    var message = field.validate(field.input.value);
    showFieldError(fieldKey, message);
    return !message;
  }

  /* Live validation on blur */
  Object.keys(fields).forEach(function (fieldKey) {
    fields[fieldKey].input.addEventListener('blur', function () {
      validateField(fieldKey);
    });
    fields[fieldKey].input.addEventListener('input', function () {
      if (fields[fieldKey].input.closest('.form-group').classList.contains('error')) {
        validateField(fieldKey);
      }
    });
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formSuccess.textContent = '';

    var isFormValid = true;
    Object.keys(fields).forEach(function (fieldKey) {
      var valid = validateField(fieldKey);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
      var firstError = contactForm.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    /* No backend connected — this only simulates a successful submission. */
    formSuccess.textContent = 'Thank you! Your message has been received. We will get back to you shortly.';
    contactForm.reset();

    Object.keys(fields).forEach(function (fieldKey) {
      showFieldError(fieldKey, '');
    });

    setTimeout(function () {
      formSuccess.textContent = '';
    }, 6000);
  });

});
