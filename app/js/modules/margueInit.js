/* -------- GSAP MARQUEE -------- */

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

  gsap.set(container, { x: 0 });

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

  document.querySelectorAll(common.join(', ')).forEach((el) => {
    setupMarquee(el, { duration: 15, enterX: 0 });
  });

  document.querySelectorAll('.special-margue-container').forEach((wrap) => {
    let wrapElement = wrap;
    wrapElement.style.transform = 'translateX(-60%)';
    const el = wrap.querySelector('.agency-stroke');
    if (el) setupMarquee(el, { duration: 15, enterX: 60 });
  });
}


window.addEventListener('load', () => {
  setTimeout(() => {
    initMarquees();
    ScrollTrigger.refresh(true);
  }, 500);
});
