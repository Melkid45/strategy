/* -------- FIXED MOBILE SCRUB MARQUEE (NO LAGS + NO FLICKER) -------- */
gsap.registerPlugin(ScrollTrigger);

function setupMarquee(container, {
  duration = 15,
  enterX = 0,
  scrollStart = 'top bottom',
  scrollEnd = '+=100%',
} = {}) {
  if (!container || !container.firstElementChild) return;

  const item = container.firstElementChild;
  const itemWidth = item.scrollWidth;
  const gap = parseFloat(getComputedStyle(container).gap) || 0;
  const totalWidth = itemWidth + gap;

  // Убираем старые, если есть
  gsap.killTweensOf(container);
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === container) st.kill();
  });

  container.style.willChange = 'transform';
  gsap.set(container, { x: 0, force3D: true });

  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
  tl.to(container, {
    x: -totalWidth,
    duration,
    modifiers: {
      x: x => (parseFloat(x) % -totalWidth) + 'px',
    },
  });

  // === Главный фикс против дергания ===
  // Вместо сброса, просто приостанавливаем timeline, не трогая transform
  const st = ScrollTrigger.create({
    trigger: container,
    start: scrollStart,
    end: scrollEnd,
    scrub: 1,
    markers: false,
    onUpdate: self => {
      const mapped = gsap.utils.mapRange(0, 1, 0.4, 1.4, self.progress);
      tl.timeScale(mapped);
      gsap.to(container, {
        xPercent: gsap.utils.mapRange(0, 1, enterX, 0, self.progress),
        duration: 0.25,
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
      duration: isMobile ? 12 : 10,
      enterX: 0,
    });
  });

  document.querySelectorAll('.special-margue-container').forEach(wrap => {
    wrap.style.transform = 'translateX(-60%)';
    const el = wrap.querySelector('.agency-stroke');
    if (el) {
      setupMarquee(el, {
        duration: isMobile ? 12 : 10,
        enterX: 60,
      });
    }
  });
}

let marqueesInitialized = false;
function onPageReady() {
  if (marqueesInitialized) return;
  marqueesInitialized = true;

  requestAnimationFrame(() => {
    initMarquees();
    setTimeout(() => ScrollTrigger.refresh(true), 200);
  });
}

window.addEventListener('DOMContentLoaded', onPageReady);
window.addEventListener('load', onPageReady);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    gsap.delayedCall(0.2, () => ScrollTrigger.refresh(true));
  }
});
