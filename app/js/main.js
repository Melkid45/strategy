// lenis
ScrollTrigger.normalizeScroll(true);
gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
  autoRaf: false,
})

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

let lastScrollTop = 0;
let isScrollingDown = false;
const scrollThreshold = 5;
const activationThreshold = 50;
lenis.on('scroll', ({ scroll }) => {
  ScrollTrigger.update()
  currentScroll = scroll;
  const header = document.querySelector('.header');
  if (Math.abs(currentScroll - lastScrollTop) > scrollThreshold) {
    isScrollingDown = currentScroll > lastScrollTop;
    lastScrollTop = currentScroll;
  }

  if (isScrollingDown && currentScroll > activationThreshold) {
    header.classList.add('back');
  } else {
    header.classList.remove('back');
  }
});

if (document.querySelector('.gallery')) {
  let gallery = new Splide('.gallery-splide', {
    perPage: 1,
    perMove: 1,
    autoplay: 1,
    interval: 5000,
    type: 'fade',
    rewind: true
  })
  gallery.mount()

  let splide = document.querySelector('.gallery-splide').clientWidth
  let splides = document.querySelectorAll('.splide__pagination__page')
  let pagination = document.querySelector('.splide__pagination')
  const gap = parseFloat(getComputedStyle(pagination).gap) || 0;
  const paginationWidth = pagination.clientWidth
  let totalWidthPag = (paginationWidth - ((splides.length + 1) * gap)) / splides.length
  $('.splide__pagination__page').css({
    width: `${totalWidthPag}`
  })
}




const items = document.querySelectorAll('.case-frame .item');
const overlay = document.querySelector('.page-transition');
items.forEach((element, index) => {
  element.addEventListener('click', () => {
    gsap.to(element, {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    });

    gsap.to(overlay, {
      y: 0,
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.2,
      onComplete: () => {
        window.location.href = 'newpage.html';
      },
    });
  });
})
