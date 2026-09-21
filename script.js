/* E-JUST Cyber Security Club — framework-free progressive enhancement. */
'use strict';

// Official club community destination.
const COMMUNITY_LINKS = { whatsapp: 'https://chat.whatsapp.com/GLzj9mukotrLXghBbmgIoj' };

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const header = $('#navbar');
  const hero = $('#home');
  const progress = $('#scroll-progress-bar');
  const backToTop = $('#back-to-top');
  const toggle = $('#nav-toggle');
  const drawer = $('#mobile-drawer');
  const backdrop = $('#drawer-backdrop');
  const closeButton = $('#drawer-close');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');
  let scrollQueued = false;
  let drawerOpen = false;

  /* Sticky header, scroll progress, active anchors, and restrained hero depth. */
  function updateScroll() {
    const y = window.scrollY;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${available > 0 ? y / available * 100 : 0}%`;
    header.classList.toggle('scrolled', y > 20);
    backToTop.classList.toggle('visible', y > 450);
    if (!reducedMotion.matches && y < hero.offsetHeight) {
      hero.style.setProperty('--hero-depth', `${Math.min(y * .08, 35)}px`);
    }
    const current = sections.filter(section => section.offsetTop <= y + header.offsetHeight + 110).at(-1);
    navLinks.forEach(link => {
      const active = link.hash === `#${current?.id || 'home'}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  updateScroll();
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    $('.nav-brand').focus({ preventScroll: true });
  });

  /* Mobile navigation: inert when closed, focus containment, Escape, resize. */
  function setDrawer(open, restoreFocus = true) {
    drawerOpen = open;
    drawer.classList.toggle('open', open);
    drawer.inert = !open;
    drawer.setAttribute('aria-hidden', String(!open));
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    backdrop.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
    header.inert = open;
    document.querySelector('main').inert = open;
    document.querySelector('footer').inert = open;
    if (open) closeButton.focus();
    else if (restoreFocus) toggle.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => setDrawer(!drawerOpen));
  closeButton.addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));
  $$('.drawer-link, .drawer-btn').forEach(link => link.addEventListener('click', () => {
    setDrawer(false, false);
    const destination = document.querySelector(link.hash);
    if (destination) { destination.tabIndex = -1; destination.focus({ preventScroll: true }); }
  }));
  document.addEventListener('keydown', event => {
    if (!drawerOpen) return;
    if (event.key === 'Escape') setDrawer(false);
    if (event.key === 'Tab') {
      const focusable = [...drawer.querySelectorAll('a,button')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1200 && drawerOpen) setDrawer(false, false);
    updateScroll();
  }, { passive: true });

  /* Reveal once; the static document stays visible if JavaScript is unavailable. */
  function observeOnce(element, callback, threshold = .12) {
    if (!element) return;
    if (!('IntersectionObserver' in window) || reducedMotion.matches) { callback(element); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { callback(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold });
    observer.observe(element);
  }
  if (!reducedMotion.matches && 'IntersectionObserver' in window) document.documentElement.classList.add('js-motion');
  $$('.reveal').forEach(element => observeOnce(element, target => {
    target.style.transitionDelay = `${Math.min(Number(target.dataset.delay) || 0, 180)}ms`;
    target.classList.add('revealed');
  }, .06));

  /* NSE accordion: one expanded level, proper button/panel associations. */
  const accordions = $$('.accordion-item');
  function setAccordion(item, expanded) {
    item.classList.toggle('active', expanded);
    item.querySelector('button').setAttribute('aria-expanded', String(expanded));
    const content = item.querySelector('.accordion-content');
    content.inert = !expanded;
    content.setAttribute('aria-hidden', String(!expanded));
  }
  accordions.forEach((item, index) => {
    const button = item.querySelector('button');
    const content = item.querySelector('.accordion-content');
    button.id = `nse-trigger-${index + 1}`;
    content.id = `nse-panel-${index + 1}`;
    button.setAttribute('aria-controls', content.id);
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', button.id);
    setAccordion(item, item.classList.contains('active'));
    button.addEventListener('click', () => {
      const wasOpen = item.classList.contains('active');
      accordions.forEach(other => setAccordion(other, other === item && !wasOpen));
    });
  });

  /* Certification counter. */
  observeOnce($('#ccna-discount-counter'), element => {
    const target = Number(element.dataset.target) || 68;
    if (reducedMotion.matches) { element.textContent = target; return; }
    const start = performance.now();
    function tick(now) {
      const fraction = Math.min((now - start) / 1300, 1);
      element.textContent = Math.round(target * (1 - (1 - fraction) ** 3));
      if (fraction < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  /* Linux demo: runs only once, when the terminal becomes visible. */
  const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
  async function type(element, text) {
    element.textContent = '';
    for (const character of text) {
      element.textContent += character;
      if (!reducedMotion.matches) await pause(60);
    }
  }
  ['#type-out-1', '#term-row-2', '#type-out-2'].forEach(selector => $(selector).style.display = 'none');
  $('#type-cmd-1').textContent = '';
  $('#type-cmd-2').textContent = '';
  observeOnce($('#linux-terminal'), async () => {
    await type($('#type-cmd-1'), 'whoami');
    $('#cursor-1').style.display = 'none';
    $('#type-out-1').style.display = 'block';
    $('#term-row-2').style.display = 'flex';
    await type($('#type-cmd-2'), 'sudo learn linux');
    $('#type-out-2').style.display = 'block';
  });

  /* Lifecycle: keyboard/click selection, and progression only while in view. */
  const steps = $$('.lifecycle-step');
  let stepIndex = 0;
  let lifecycleVisible = false;
  let manuallySelected = false;
  function selectStep(index) {
    stepIndex = index;
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
      step.setAttribute('aria-pressed', String(i === index));
    });
  }
  steps.forEach((step, index) => step.addEventListener('click', () => { manuallySelected = true; selectStep(index); }));
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    lifecycleVisible = entries[0].isIntersecting;
  }).observe($('#lifecycle-timeline'));
  setInterval(() => {
    if (lifecycleVisible && !manuallySelected && !reducedMotion.matches && !document.hidden) selectStep((stepIndex + 1) % steps.length);
  }, 3500);

  /* Deliberately unset community URLs never redirect to unrelated homepages. */
  let noticeTimer;
  $$('[data-community]').forEach(link => {
    const destination = COMMUNITY_LINKS[link.dataset.community];
    if (destination) { link.href = destination; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else link.addEventListener('click', event => {
      event.preventDefault();
      const notice = $('#site-notice');
      notice.textContent = 'The club will announce this community link soon. Please check with the organizers.';
      notice.classList.add('visible');
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(() => notice.classList.remove('visible'), 6500);
    });
  });

  /* Low-density network nodes; suspend rendering offscreen and in hidden tabs. */
  const canvas = $('#cyber-canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  let width, height, animationId = null, heroVisible = true;
  const nodes = Array.from({ length: 24 }, () => ({ x: Math.random(), y: Math.random(), speed: .00003 + Math.random() * .00002 }));
  function resizeCanvas() {
    width = hero.clientWidth; height = hero.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio; canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  let lastTime = 0;
  function render(time = 0) {
    animationId = null;
    if (reducedMotion.matches || !heroVisible || document.hidden) return;
    const delta = Math.min(time - lastTime, 50); lastTime = time;
    context.clearRect(0, 0, width, height);
    nodes.forEach((node, i) => {
      node.y = (node.y + node.speed * delta / 16) % 1;
      const x = node.x * width, y = node.y * height;
      context.fillStyle = '#b7bab0'; context.beginPath(); context.arc(x, y, 1.4, 0, Math.PI * 2); context.fill();
      nodes.slice(i + 1).forEach(other => {
        const distance = Math.hypot(x - other.x * width, y - other.y * height);
        if (distance < 140) {
          context.strokeStyle = `rgba(190,194,179,${(1 - distance / 140) * .4})`;
          context.beginPath(); context.moveTo(x, y); context.lineTo(other.x * width, other.y * height); context.stroke();
        }
      });
    });
    animationId = requestAnimationFrame(render);
  }
  function syncCanvas() {
    if (animationId !== null) cancelAnimationFrame(animationId);
    animationId = null;
    if (!reducedMotion.matches && heroVisible && !document.hidden) animationId = requestAnimationFrame(render);
    else context.clearRect(0, 0, width, height);
  }
  resizeCanvas(); syncCanvas();
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting; syncCanvas();
  }).observe(hero);
  window.addEventListener('resize', resizeCanvas, { passive: true });
  document.addEventListener('visibilitychange', syncCanvas);
  reducedMotion.addEventListener('change', () => {
    document.documentElement.classList.toggle('js-motion', !reducedMotion.matches);
    hero.style.setProperty('--hero-depth', '0px');
    syncCanvas();
  });
});
