/* -------- FIXED MOBILE SCRUB MARQUEE (NO LAGS + NO FLICKER) -------- */
function setupMarquee(container, {
  duration = 15,
  enterX = 0,
  scrollStart = 'top bottom',
  scrollEnd = '+=100%',
} = {}) {
  if (!container || !container.firstElementChild) return;

  const item = container.firstElementChild;
  const gap = parseFloat(getComputedStyle(container).gap) || 0;

  let formula = 0;
  let speed = 120;
  let tween;

  function recalcWidth() {
    const itemWidth = item.scrollWidth;
    formula = itemWidth + gap;
  }

  recalcWidth();
  setTimeout(recalcWidth, 50);
  setTimeout(recalcWidth, 150);

  gsap.killTweensOf(container);
  ScrollTrigger.getAll().forEach(st => {
    if (st.trigger === container) st.kill();
  });

  container.style.willChange = 'transform';
  gsap.set(container, { x: 0, force3D: true });

  function startInfiniteLoop() {
    const durationStroke = formula / speed;

    tween = gsap.to(container, {
      x: -formula,
      duration: durationStroke,
      repeat: -1,
      ease: "none",
      paused: true,
    });

    if (ScrollTrigger.isInViewport(container)) {
      tween.resume();
    }
  }


  setTimeout(startInfiniteLoop, 160);

  // ---- SCRUB (ТВОЙ КОД) ----
  ScrollTrigger.create({
    trigger: container,
    start: scrollStart,
    end: scrollEnd,
    scrub: 1,
    ease: 'power1.InOut',
    markers: false,
    onUpdate: self => {
      gsap.to(container, {
        xPercent: gsap.utils.mapRange(0, 1, enterX, 0, self.progress),
        duration: 0.25,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    },
  });

  // ---- ВИДИМОСТЬ (ДОБАВЛЕНО, НИЧЕГО НЕ ЛОМАЕТ) ----
  ScrollTrigger.create({
    trigger: container,
    start: "top bottom",
    end: "bottom top",
    onEnter: () => tween && tween.resume(),
    onEnterBack: () => tween && tween.resume(),
    onLeave: () => tween && tween.pause(),
    onLeaveBack: () => tween && tween.pause(),
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
      enterX: 0,
    });
  });

  document.querySelectorAll('.special-margue-container').forEach(wrap => {
    gsap.set(wrap, { xPercent: -60 });


    const el = wrap.querySelector('.agency-stroke');
    if (el) {
      setupMarquee(el, {
        duration: isMobile ? 12 : 10,
        enterX: 60,
      });
    }
  });

  ScrollTrigger.refresh(true);
}

function startWhenFontsReady() {
  if (document.fonts) {
    document.fonts.ready.then(() => {
      setTimeout(() => {
        initMarquees();
      }, 50);
    });
  } else {
    initMarquees();
  }
}
window.addEventListener('load', startWhenFontsReady);
