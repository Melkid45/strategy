/* -------- GSAP MARQUEE (идеально плавный, без hidden и без дублей) -------- */

gsap.registerPlugin(ScrollTrigger);

function setupMarquee(container, {
  duration = 25,
  enterX = 0,
  scrollStart = 'top bottom',
  scrollEnd = '+=100%'
} = {}) {
  if (!container || !container.firstElementChild) return;

  const item = container.firstElementChild;
  const itemWidth = item.scrollWidth;
  const gap = parseFloat(getComputedStyle(container).gap) || 0;

  const totalWidth = (itemWidth + gap);

  gsap.killTweensOf(container);
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === container) st.kill();
  });

  // стартовое состояние
  gsap.set(container, { x: 0 });

  // бесконечная анимация
  gsap.to(container, {
    x: -totalWidth,
    duration,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: x => {
        const num = parseFloat(x);
        return (num % -totalWidth) + 'px';
      }
    }
  });

  // анимация появления контейнера при скролле
  gsap.fromTo(
    container,
    { xPercent: enterX },
    {
      xPercent: 0,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: container,
        start: scrollStart,
        end: scrollEnd,
        scrub: 1,
        markers: false
      }
    }
  );
}

function initMarquees() {
  const common = [
    '.stoke-title .stroke-wrap',
    '.agency-stroke:not(.special-margue-container .agency-stroke)',
    '.longest__body .stroke-wrap',
    '.case-frame .item .item-stroke-wrap',
    '.footer-stroke',
    '.about-stroke'
  ];

  // обычные
  document.querySelectorAll(common.join(', ')).forEach((el) => {
    setupMarquee(el, { duration: 15, enterX: 0 });
  });

  // специальные
  document.querySelectorAll('.special-margue-container').forEach((wrap) => {
    const el = wrap.querySelector('.agency-stroke');
    if (el) setupMarquee(el, { duration: 15, enterX: -60 });
  });
}

// пересоздание при ресайзе
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh(true);
    initMarquees();
  }, 400);
});

// запуск
window.addEventListener('load', () => {
  setTimeout(() => {
    initMarquees();
    ScrollTrigger.refresh(true);
  }, 500);
});
