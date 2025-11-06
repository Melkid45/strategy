/* -------- OPTIMIZED GSAP MARQUEE -------- */
gsap.registerPlugin(ScrollTrigger);

function setupMarquee(container, {
  duration = 25,
  enterX = 0,
  scrollStart = 'top bottom',
  scrollEnd = '+=100%',
} = {}) {
  if (!container || !container.firstElementChild) return;

  const item = container.firstElementChild;
  const itemWidth = item.scrollWidth;
  const gap = parseFloat(getComputedStyle(container).gap) || 0;
  const totalWidth = itemWidth + gap;

  // Очистка предыдущих анимаций и ScrollTriggers
  gsap.killTweensOf(container);
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === container) st.kill();
  });

  // Оптимизация: используем will-change для GPU
  container.style.willChange = 'transform';
  gsap.set(container, { x: 0 });

  // Бесконечный бегунок
  const marqueeTween = gsap.to(container, {
    x: -totalWidth,
    duration,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: x => (parseFloat(x) % -totalWidth) + 'px',
    },
  });

  // Скролл-триггер для плавного входа
  ScrollTrigger.create({
    trigger: container,
    start: scrollStart,
    end: scrollEnd,
    scrub: 1,
    markers: false,
    onUpdate: self => {
      gsap.to(container, {
        xPercent: gsap.utils.mapRange(0, 1, enterX, 0, self.progress),
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    },
  });

  // Возвращаем tween (можно использовать если нужно убивать потом)
  return marqueeTween;
}

function initMarquees() {
  const commonSelectors = [
    '.stoke-title .stroke-wrap',
    '.agency-stroke:not(.special-margue-container .agency-stroke)',
    '.longest__body .stroke-wrap',
    '.case-frame .item .item-stroke-wrap',
    '.footer-stroke',
    '.about-stroke',
  ];

  const isMobile = window.matchMedia('(max-width: 750px)').matches;

  document.querySelectorAll(commonSelectors.join(', ')).forEach(el => {
    setupMarquee(el, {
      duration: isMobile ? 35 : 15, // медленнее на мобилках
      enterX: 0,
    });
  });

  document.querySelectorAll('.special-margue-container').forEach(wrap => {
    wrap.style.transform = 'translateX(-60%)';
    const el = wrap.querySelector('.agency-stroke');
    if (el) {
      setupMarquee(el, {
        duration: isMobile ? 35 : 15,
        enterX: 60,
      });
    }
  });
}

// Используем requestIdleCallback для экономии CPU
let marqueesInitialized = false;
function onPageReady() {
  if (marqueesInitialized) return;
  marqueesInitialized = true;
  requestIdleCallback(() => {
    initMarquees();
    ScrollTrigger.refresh(true);
  });
}


window.addEventListener('load', onPageReady);
