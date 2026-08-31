"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.getElementById("primary-menu");
  const backToTop = document.getElementById("back-to-top");
  const form = document.getElementById("enquiry-form");
  const formStatus = document.getElementById("form-status");
  const currentYear = document.getElementById("current-year");

  // Dynamic footer year
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Sticky navbar and back-to-top visibility
  const updateScrollState = () => {
    const hasScrolled = window.scrollY > 20;

    if (header) {
      header.classList.toggle("scrolled", hasScrolled);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    }
  };

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  // Mobile navigation
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight +
          2;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll(".accordion-question").forEach((question) => {
    question.addEventListener("click", () => {
      const currentItem = question.closest(".accordion-item");
      const currentAnswer = currentItem.querySelector(".accordion-answer");
      const isExpanded = question.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".accordion-question").forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        const answer = item.closest(".accordion-item").querySelector(".accordion-answer");
        answer.style.maxHeight = null;
      });

      if (!isExpanded) {
        question.setAttribute("aria-expanded", "true");
        currentAnswer.style.maxHeight = `${currentAnswer.scrollHeight}px`;
      }
    });
  });

  // Scroll reveal animations
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // Back to top
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // WhatsApp enquiry form
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const service = document.getElementById("service").value.trim();
      const message = document.getElementById("message").value.trim();

      const phonePattern = /^[+0-9\s()-]{7,20}$/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !phone || !email || !service || !message) {
        formStatus.textContent = "Please complete all fields before submitting.";
        return;
      }

      if (!phonePattern.test(phone)) {
        formStatus.textContent = "Please enter a valid phone number.";
        return;
      }

      if (!emailPattern.test(email)) {
        formStatus.textContent = "Please enter a valid email address.";
        return;
      }

      const whatsappMessage = [
        "Hello DD Prime Solutions,",
        "",
        "I would like to enquire about your services.",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Service required: ${service}`,
        `Message: ${message}`
      ].join("\n");

      const whatsappUrl = `https://wa.me/917597616454?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      formStatus.textContent = "Opening WhatsApp...";
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }
});
