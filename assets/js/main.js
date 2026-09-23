/* ==========================================================================
   360 Party Wheel — Site behavior
   Nav, scroll reveals, counters, carousel, gallery lightbox, FAQ, forms
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js-ready');
  if (reduceMotion) document.documentElement.classList.add('reduce-motion');

  var hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Active nav link ---------------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-desktop a, .nav-drawer-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------------- Mobile nav drawer ---------------- */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.nav-drawer');
  var drawerClose = document.querySelector('.nav-drawer-close');
  var drawerScrim = document.querySelector('.nav-drawer-scrim');
  var lastFocused = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.setAttribute('data-open', 'true');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var firstLink = drawer.querySelector('.nav-drawer-links a');
    if (firstLink) firstLink.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.setAttribute('data-open', 'false');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      open ? closeDrawer() : openDrawer();
    });
    drawerScrim && drawerScrim.addEventListener('click', closeDrawer);
    drawerClose && drawerClose.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.nav-drawer-links a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') closeDrawer();
    });
  }

  /* ---------------- Scroll reveal animations ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !revealEls.length) {
    revealEls.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  } else if (hasGsap && window.ScrollTrigger) {
    revealEls.forEach(function (el, i) {
      var group = el.closest('[data-reveal-group]');
      var delay = 0;
      if (group) {
        var siblings = Array.prototype.slice.call(group.querySelectorAll('.reveal'));
        delay = siblings.indexOf(el) * 0.08;
      }
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });
  } else {
    // Fallback: IntersectionObserver
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'none';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- Animated counters ---------------- */
  var counters = document.querySelectorAll('[data-counter]');
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    var obj = { val: 0 };
    if (hasGsap) {
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: function () { el.textContent = obj.val.toFixed(decimals) + suffix; }
      });
    } else {
      var start = null;
      var duration = 1400;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        el.textContent = (target * progress).toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }
  if (counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------------- Testimonial carousel ---------------- */
  var carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.testimonial-slide'));
    var dotsWrap = carousel.querySelector('.testimonial-dots');
    var idx = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () { goTo(i); resetTimer(); });
      dotsWrap && dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

    function goTo(i) {
      slides[idx].classList.remove('is-active');
      dots[idx] && dots[idx].classList.remove('is-active');
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
      dots[idx] && dots[idx].classList.add('is-active');
    }
    function resetTimer() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { goTo(idx + 1); }, 6000);
    }
    if (slides.length > 1) resetTimer();
  }

  /* ---------------- Gallery filter ---------------- */
  var filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    var chips = Array.prototype.slice.call(filterBar.querySelectorAll('.filter-chip'));
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        var filter = chip.getAttribute('data-filter');
        items.forEach(function (item) {
          var match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('.lightbox-caption');
    var lbClose = lightbox.querySelector('.lightbox-close');
    var lbPrev = lightbox.querySelector('.lightbox-prev');
    var lbNext = lightbox.querySelector('.lightbox-next');
    var galleryImgs = [];
    var lbIndex = 0;
    var lbLastFocused = null;

    function refreshGalleryImgs() {
      galleryImgs = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'))
        .filter(function (el) { return el.style.display !== 'none'; });
    }

    function showLightbox(i) {
      refreshGalleryImgs();
      if (!galleryImgs.length) return;
      lbIndex = (i + galleryImgs.length) % galleryImgs.length;
      var el = galleryImgs[lbIndex];
      var img = el.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      if (lbCaption) lbCaption.textContent = el.getAttribute('data-caption') || img.alt;
      lbLastFocused = document.activeElement;
      lightbox.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }
    function hideLightbox() {
      lightbox.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
      if (lbLastFocused) lbLastFocused.focus();
    }
    document.querySelectorAll('.gallery-item').forEach(function (el) {
      function openFromElement() {
        refreshGalleryImgs();
        var idx = galleryImgs.indexOf(el);
        showLightbox(idx === -1 ? 0 : idx);
      }
      el.addEventListener('click', openFromElement);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFromElement(); }
      });
    });
    lbClose && lbClose.addEventListener('click', hideLightbox);
    lightbox.querySelector('.lightbox-scrim') && lightbox.querySelector('.lightbox-scrim').addEventListener('click', hideLightbox);
    lbPrev && lbPrev.addEventListener('click', function () { showLightbox(lbIndex - 1); });
    lbNext && lbNext.addEventListener('click', function () { showLightbox(lbIndex + 1); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') hideLightbox();
      if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
      if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    btn.addEventListener('click', function () {
      var isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item[data-open="true"]').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.setAttribute('data-open', 'false');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      item.setAttribute('data-open', String(!isOpen));
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

  /* ---------------- Contact / quote form ---------------- */
  var form = document.querySelector('#quote-form');
  if (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    function setStatus(state, message) {
      if (!statusEl) return;
      statusEl.setAttribute('data-state', state);
      statusEl.querySelector('span').textContent = message;
    }
    function validateField(field) {
      var input = field.querySelector('input, select, textarea');
      if (!input) return true;
      var valid = input.checkValidity();
      field.classList.toggle('has-error', !valid);
      return valid;
    }
    form.querySelectorAll('.field').forEach(function (field) {
      var input = field.querySelector('input, select, textarea');
      if (!input) return;
      input.addEventListener('blur', function () { validateField(field); });
      input.addEventListener('input', function () {
        if (field.classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = Array.prototype.slice.call(form.querySelectorAll('.field'));
      var allValid = fields.reduce(function (acc, f) { return validateField(f) && acc; }, true);
      if (!allValid) {
        setStatus('error', 'Please fill in the highlighted fields before submitting.');
        var firstError = form.querySelector('.field.has-error input, .field.has-error select, .field.has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      submitBtn.setAttribute('disabled', 'true');
      setStatus('loading', 'Sending your request...');

      var accessKeyInput = form.querySelector('input[name="access_key"]');
      var accessKey = accessKeyInput ? accessKeyInput.value : '';
      if (!accessKey || accessKey.indexOf('YOUR_') === 0) {
        // No live form backend configured yet — see README "Activate the quote form".
        setTimeout(function () {
          submitBtn.removeAttribute('disabled');
          setStatus('success', 'Thanks! This is a demo form — connect it to Web3Forms (see README) to start receiving real quote requests.');
          form.reset();
        }, 700);
        return;
      }

      var payload = new FormData(form);
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          submitBtn.removeAttribute('disabled');
          if (data.success) {
            setStatus('success', 'Thanks! Your quote request is in — we\'ll reply within one business day.');
            form.reset();
          } else {
            setStatus('error', 'Something went wrong sending your request. Please call or email us directly.');
          }
        })
        .catch(function () {
          submitBtn.removeAttribute('disabled');
          setStatus('error', 'Network error — please call or email us directly.');
        });
    });
  }

  /* ---------------- Floating decorative parallax (subtle, transform-only) ---------------- */
  if (!reduceMotion && hasGsap && window.ScrollTrigger) {
    document.querySelectorAll('.decor-blob').forEach(function (blob, i) {
      gsap.to(blob, {
        y: i % 2 === 0 ? 60 : -60,
        ease: 'none',
        scrollTrigger: { trigger: blob.closest('section') || blob.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });
    });
  }
})();
