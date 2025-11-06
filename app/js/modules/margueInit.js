/* -------- FIXED MOBILE GSAP MARQUEE -------- */
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

  // Очистка предыдущих анимаций
  gsap.killTweensOf(container);
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === container) st.kill();
  });

  // GPU-ускорение
  container.style.willChange = 'transform';
  gsap.set(container, { x: 0 });

  // 🔥 Используем GSAP timeline вместо чистого to — надёжнее на iOS
  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
  tl.to(container, {
    x: -totalWidth,
    duration,
    modifiers: {
      x: x => (parseFloat(x) % -totalWidth) + 'px',
    },
  });

  // Скролл-вход (мягкий старт)
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
      duration: isMobile ? 35 : 15,
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

let marqueesInitialized = false;
function onPageReady() {
  if (marqueesInitialized) return;
  marqueesInitialized = true;

  // ❌ не используем requestIdleCallback — он глючит на iOS
  // ✅ используем requestAnimationFrame для гарантии запуска
  requestAnimationFrame(() => {
    initMarquees();
    setTimeout(() => ScrollTrigger.refresh(true), 300);
  });
}

// ✅ гарантия запуска и на мобильных браузерах
window.addEventListener('DOMContentLoaded', onPageReady);
window.addEventListener('load', onPageReady);

// перестраховка для iOS, если вкладка “проснулась”
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    ScrollTrigger.refresh(true);
  }
});
