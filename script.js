(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var WA = '917597616454';

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // Mobile navigation
  var toggle = $('#toggle'), nav = $('#nav');
  function closeNav() { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  // Active nav link on scroll
  var links = $$('a', nav);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'services', 'about', 'portfolio', 'pricing', 'contact'].forEach(function (id) {
      var el = document.getElementById(id); if (el) io.observe(el);
    });
  }

  // FAQ accordion
  $$('.faq button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });

  // Pre-select service from card links
  var select = $('#service');
  $$('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () { select.value = a.getAttribute('data-service'); });
  });

  // Form: validate, then open WhatsApp with the details (no backend exists)
  var form = $('#form'), note = $('#note');
  function setErr(id, msg) {
    var f = document.getElementById(id), e = $('#e-' + id);
    e.textContent = msg; f.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) f.setAttribute('aria-describedby', 'e-' + id); else f.removeAttribute('aria-describedby');
    return !msg;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#name').value.trim(), email = $('#email').value.trim(),
        phone = $('#phone').value.replace(/[\s-]/g, ''), service = select.value,
        msg = $('#message').value.trim();
    var ok = [
      setErr('name', name ? '' : 'Please enter your name.'),
      setErr('phone', /^(\+?91)?[6-9]\d{9}$/.test(phone) ? '' : 'Enter a valid 10-digit Indian mobile number.'),
      setErr('email', !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.'),
      setErr('service', service ? '' : 'Please select a service.')
    ].every(Boolean);
    if (!ok) { var bad = $('[aria-invalid=true]', form); if (bad) bad.focus(); return; }
    var text = 'Hi DD PRIME, I would like to enquire about ' + service + '.\nName: ' + name +
      '\nPhone: ' + phone + (email ? '\nEmail: ' + email : '') + (msg ? '\nMessage: ' + msg : '');
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    note.textContent = 'WhatsApp should now be open. Press Send there to deliver your enquiry.';
  });
}());
