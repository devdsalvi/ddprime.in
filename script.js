document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const backToTop = document.querySelector(".back-to-top");
  const contactForm = document.querySelector("#contactForm");
  const formStatus = document.querySelector(".form-status");

  // Mobile hamburger menu
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  // Close mobile menu after selecting a navigation link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    });
  });

  // Active navigation link based on the visible section
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });

  sections.forEach(section => sectionObserver.observe(section));

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const isExpanded = question.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-question").forEach(item => {
        item.setAttribute("aria-expanded", "false");
        item.nextElementSibling.style.maxHeight = null;
      });

      if (!isExpanded) {
        question.setAttribute("aria-expanded", "true");
        question.nextElementSibling.style.maxHeight =
          `${question.nextElementSibling.scrollHeight}px`;
      }
    });
  });

  // Scroll reveal animation
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

  // Back-to-top button
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Frontend-only contact form validation
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = contactForm.elements.name.value.trim();
    const phone = contactForm.elements.phone.value.trim();
    const email = contactForm.elements.email.value.trim();
    const service = contactForm.elements.service.value;
    const message = contactForm.elements.message.value.trim();

    const phonePattern = /^[+()\d\s-]{8,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !phone || !email || !service || !message) {
      showFormMessage("Please complete all fields before submitting.", "error");
      return;
    }

    if (!phonePattern.test(phone)) {
      showFormMessage("Please enter a valid phone number.", "error");
      return;
    }

    if (!emailPattern.test(email)) {
      showFormMessage("Please enter a valid email address.", "error");
      return;
    }

    showFormMessage(
      "Thank you! Your enquiry has been prepared successfully. Please connect the form to Formspree, Netlify Forms or a backend to receive real submissions.",
      "success"
    );

    contactForm.reset();
  });

  function showFormMessage(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
  }

  // Automatically display the current year
  document.querySelector("#currentYear").textContent = new Date().getFullYear();
});
