/* ============================================
   DROLLS — Neon Frost Interactive Behaviors
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll-triggered Animations ----
  const animElements = document.querySelectorAll('.anim');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animElements.forEach(el => animObserver.observe(el));

  // ---- Sticky Navigation ----
  const nav = document.getElementById('navbar');
  const hero = document.getElementById('hero');

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    const heroH = hero.offsetHeight - 100;

    if (scrollY > heroH) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Mobile Navigation ----
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Active Nav Link ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const highlightNav = () => {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('[data-counter]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'));
        animateCounter(el, 0, target, 1500);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Flavor Card Tilt Effect ----
  const flavorCards = document.querySelectorAll('.flavor');

  flavorCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  // ---- Parallax on Hero Background ----
  const heroBg = document.querySelector('.hero__bg-img');

  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > window.innerHeight) return;
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
    }, { passive: true });
  }

  // ---- Business Contact Form ----
  const bizForm = document.getElementById('bizForm');
  const bizSuccess = document.getElementById('bizSuccess');
  const bizSubmitBtn = document.getElementById('bizSubmitBtn');

  if (bizForm) {
    bizForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      bizSubmitBtn.disabled = true;
      bizSubmitBtn.innerHTML = 'Lähetetään...';

      try {
        const response = await fetch(bizForm.action, {
          method: 'POST',
          body: new FormData(bizForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          bizForm.style.display = 'none';
          bizSuccess.style.display = 'block';
        } else {
          throw new Error('server error');
        }
      } catch {
        bizSubmitBtn.disabled = false;
        bizSubmitBtn.innerHTML = 'Lähetä tarjouspyyntö <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        alert('Virhe lähetyksessä. Ota yhteyttä sähköpostitse: info@drolls.fi');
      }
    });
  }

  // ---- Keyboard Accessibility ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

});
