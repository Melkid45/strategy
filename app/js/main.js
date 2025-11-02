ScrollTrigger.normalizeScroll(true);
gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

const lenis = new Lenis({
  duration: window.innerWidth <= 750 ? 1.5 : 1.2,
  easing: e => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
  smoothWheel: !0,
  smoothTouch: window.innerWidth > 750,
  touchMultiplier: window.innerWidth <= 750 ? 0.8 : 2,
  wheelMultiplier: 1,
  infinite: !1,
  autoRaf: !1,
  gestureOrientation: window.innerWidth <= 750 ? 'vertical' : 'both',
  touchInertiaMultiplier: window.innerWidth <= 750 ? 1.5 : 2
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

let lastScrollTop = 0;
let isScrollingDown = false;
const scrollThreshold = 5;
const activationThreshold = 50;

lenis.on('scroll', ({ scroll }) => {
  ScrollTrigger.update();
  
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

let isMobile = window.innerWidth <= 750;

if (isMobile) {
  gsap.config({
    force3D: false,
    autoSleep: 60,
    nullTargetWarn: false
  });
}

window.addEventListener('resize', () => {
  isMobile = window.innerWidth <= 750;
  
  lenis.options.duration = isMobile ? 0.8 : 1.2;
  lenis.options.smoothTouch = !isMobile;
  lenis.options.touchMultiplier = isMobile ? 1 : 2;
  
  ScrollTrigger.refresh();
});

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
  $('.header-menu-mob').toggleClass('open')
})

$('.header-menu-mob li').on('click', function (e) {
  $('.menu-scrolling').children('.burger').removeClass('open')
  $('.header-menu-mob').removeClass('open')
})