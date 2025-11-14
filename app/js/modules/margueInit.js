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

  // === ЗАМЕНА ЛОГИКИ БЕСКОНЕЧНОЙ ПРОКРУТКИ НА ЛОГИКУ ИЗ ВТОРОГО КОДА ===
  let speed = 120;
  let formula = totalWidth;
  let durationStroke = formula / speed;
  
  gsap.to(container, {
    x: -formula,
    duration: durationStroke,
    repeat: -1,
    ease: "none",
  });

  // === Главный фикс против дергания ===
  const st = ScrollTrigger.create({
    trigger: container,
    start: scrollStart,
    end: scrollEnd,
    scrub: 1,
    markers: false,
    onUpdate: self => {
      const mapped = gsap.utils.mapRange(0, 1, 0.4, 1.4, self.progress);
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

  // Обрабатываем обычные маракесы с НОВОЙ логикой бесконечной прокрутки
  document.querySelectorAll(commonSelectors.join(', ')).forEach(el => {
    setupMarquee(el, {
      enterX: 0,
    });
  });

  // special-margue-container оставляем БЕЗ ИЗМЕНЕНИЙ (старая логика)
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