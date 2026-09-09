(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-question");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        var otherBtn = other.querySelector(".faq-question");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Contact form validation + WhatsApp/mailto handoff ---------- */
  var form = document.getElementById("contact-form");
  if (form) {
    var noteEl = document.getElementById("form-note");

    function setError(fieldId, message) {
      var errEl = document.getElementById("err-" + fieldId);
      if (errEl) errEl.textContent = message || "";
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidPhone(value) {
      var digits = value.replace(/\D/g, "");
      return digits.length >= 10;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var service = form.service.value;
      var message = form.message.value.trim();

      var valid = true;
      setError("name", "");
      setError("phone", "");
      setError("email", "");
      setError("service", "");

      if (!name) {
        setError("name", "Please enter your name.");
        valid = false;
      }
      if (!phone || !isValidPhone(phone)) {
        setError("phone", "Please enter a valid phone number.");
        valid = false;
      }
      if (email && !isValidEmail(email)) {
        setError("email", "Please enter a valid email address.");
        valid = false;
      }
      if (!service) {
        setError("service", "Please select a service.");
        valid = false;
      }

      if (!valid) {
        if (noteEl) {
          noteEl.textContent = "Please fix the highlighted fields.";
          noteEl.style.color = "#B3422A";
        }
        return;
      }

      var lines = [
        "New enquiry from ddprime.in",
        "Name: " + name,
        "Phone: " + phone,
        email ? "Email: " + email : null,
        "Service: " + service,
        message ? "Message: " + message : null
      ].filter(Boolean);

      var waText = encodeURIComponent(lines.join("\n"));
      var waUrl = "https://wa.me/917597616454?text=" + waText;

      if (noteEl) {
        noteEl.textContent = "Opening WhatsApp with your details filled in\u2026";
        noteEl.style.color = "#0B6B6B";
      }

      window.open(waUrl, "_blank", "noopener");
      form.reset();
    });
  }
})();
