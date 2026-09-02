/**
 * DD Prime Solutions – Vanilla JS
 * Mobile menu & FAQ accordion toggles
 * Accessibility-first, framework-free
 */

document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------
       Mobile Menu Toggle
       ------------------------------------------------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.getAttribute('data-open') === 'true';
            navLinks.setAttribute('data-open', !isOpen);
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.innerHTML = isOpen ? '☰' : '×';

            // Prevent page scroll when menu is open
            if (!isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.setAttribute('data-open', 'false');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '☰';
                document.body.style.overflow = '';
            });
        });
    }

    /* -------------------------------------------------
       FAQ Accordion Toggle
       ------------------------------------------------- */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Toggle current item
            item.classList.toggle('active', !isActive);
            btn.setAttribute('aria-expanded', !isActive);

            // Optional: close all other items (keep only one open)
            // document.querySelectorAll('.faq-item.active').forEach(other => {
            //     if (other !== item) {
            //         other.classList.remove('active');
            //         other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            //     }
            // });
        });
    });

    /* -------------------------------------------------
       Smooth Scroll for Anchor Links
       ------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* -------------------------------------------------
       Form Submission Feedback
       ------------------------------------------------- */
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic validation + feedback
            const inputs = form.querySelectorAll('input[required], textarea[required');
            let valid = true;

            inputs.forEach inp => {
                if (!inp.value.trim()) {
                    valid = false;
                    inp.style.borderColor = '#e74c3c';
                } else {
                    inp.style.borderColor = '';
                }
            };

            if (valid) {
                alert('Thank you! We will get back to you shortly.');
                form.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
});
