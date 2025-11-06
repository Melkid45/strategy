ScrollTrigger.normalizeScroll(true);
gsap.ticker.lagSmoothing(1000, 16);
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});
gsap.defaults({ overwrite: "auto", duration: 0.6, ease: "power2.out" });
const lenis = new Lenis({
  duration: window.innerWidth <= 750 ? 1.8 : 1.2,
  easing: e => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
  smoothWheel: true,
  smoothTouch: window.innerWidth > 750,
  touchMultiplier: window.innerWidth <= 750 ? 1.5 : 2,
  wheelMultiplier: 1,
  infinite: false,
  autoRaf: false,
  gestureOrientation: window.innerWidth <= 750 ? "vertical" : "both",
  touchInertiaMultiplier: window.innerWidth <= 750 ? 2 : 2
});

let rafId;
function raf(time) {
  lenis.raf(time);
  rafId = requestAnimationFrame(raf);
}
rafId = requestAnimationFrame(raf);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(rafId);
  } else {
    rafId = requestAnimationFrame(raf);
  }
});

let isMobile = window.innerWidth <= 750;
let ticking = false;
let lastScrollTop = 0;
let isScrollingDown = false;
const scrollThreshold = 5;
const activationThreshold = 50;
if (!isMobile) {
  lenis.on('scroll', ({ scroll }) => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ScrollTrigger.update();
        ticking = false;
      });
    }
    requestAnimationFrame(() => {
      currentScroll = scroll;
      const header = document.querySelector('.header');

      if (!header) return;

      if (Math.abs(currentScroll - lastScrollTop) > scrollThreshold) {
        isScrollingDown = currentScroll > lastScrollTop;
        lastScrollTop = currentScroll;
      }

      if (isScrollingDown && currentScroll > activationThreshold && window.innerWidth > 750) {
        header.classList.add('back');
      } else {
        header.classList.remove('back');
      }
    });
  });
}

if (isMobile) {
  gsap.config({
    force3D: false,
    autoSleep: 60,
    nullTargetWarn: false
  });
}

if (document.querySelector('.gallery')) {
  let gallery = new Splide('.gallery-splide', {
    perPage: 1,
    perMove: 1,
    autoplay: !isMobile,
    interval: 5000,
    type: 'fade',
    rewind: true,
    drag: true,
    swipe: true
  })
  gallery.mount()

  setTimeout(() => {
    let splide = document.querySelector('.gallery-splide').clientWidth
    let splides = document.querySelectorAll('.splide__pagination__page')
    let pagination = document.querySelector('.splide__pagination')

    if (pagination && splides.length > 0) {
      const gap = parseFloat(getComputedStyle(pagination).gap) || 0;
      const paginationWidth = pagination.clientWidth
      let totalWidthPag = (paginationWidth - ((splides.length + 1) * gap)) / splides.length

      $('.splide__pagination__page').css({
        width: `${totalWidthPag}`
      })
    }
  }, 100);
}

$('.menu-scrolling').on('click', function (e) {
  $(this).children('.burger').toggleClass('open')
  $('.header').toggleClass('open')
})

$('.header-menu-mob li').on('click', function (e) {
  $('.menu-scrolling').children('.burger').removeClass('open')
  $('.header').removeClass('open')
})