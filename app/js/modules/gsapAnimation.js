/*<---------Gsap All--------->*/

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let IsDestop = width > 1100;
let isTouch = window.innerWidth < 1100 && window.innerWidth > 750;

// Hero Block
if (document.querySelector('.hero-block') && IsDestop) {
  let HeroConfig = {
    scale: IsDestop ? 15 : 30,
    yPercent: IsDestop ? 150 : 150,
    xPercent: IsDestop ? -70 : -0,
    end: IsDestop ? '+=75%' : '+=100%'
  }
  gsap.to('.hero-block .circle-hero', {
    scale: HeroConfig.scale,
    yPercent: HeroConfig.yPercent,
    xPercent: HeroConfig.xPercent,
    scrollTrigger: {
      trigger: '.hero-block',
      start: 'top top',
      end: HeroConfig.end,
      scrub: 1,
      pin: true,
      pinSpacing: false,
      onUpdate: (process) => {
        let fullProcess = process.progress * 10;
        if (IsDestop) {
          if (fullProcess > 1.5 && fullProcess < 10) {
            document.querySelector('.cursor-trail').style.zIndex = '5';
          } else {
            document.querySelector('.cursor-trail').style.zIndex = '1';
          }
        }
        let StartProgress = process.progress
        let Opacity = 1 - (StartProgress * 10)
        let OpacityScroll = 1 - (StartProgress * 10)
        $('.hero-block .stoke-title').css({ opacity: Opacity })
        $('.hero-block-scroll').css({ opacity: OpacityScroll })
      }
    },
  })
}




// Cards Xcode
let lastIndex = 0;
if (document.querySelector('.xcode')) {
  let xcodeSplider = new Splide('.xcode-cards', {
    perMove: 1,
    arrows: false,
    pagination: false,
    type: 'loop',
    autoplay: true,
    interval: 3000,
  });

  // Mount the auto scroll extension
  xcodeSplider.mount();
}


if (document.querySelector('.wrap-agency-animation') && !IsDestop) {
  const xcodeContainers = document.querySelectorAll('.wrap-agency-animation .content');

  xcodeContainers.forEach((container, containerIndex) => {
    let xcodeItems = container.querySelectorAll('.content__img');
    let xcodeItemWidth, xcodeGap, formula, formulaTouch;

    function updateXcodeMetrics() {
      xcodeItemWidth = xcodeItems[0].offsetWidth;
      xcodeGap = parseFloat(getComputedStyle(container).gap) || 0;
      formulaTouch = (xcodeItemWidth + xcodeGap) * (xcodeItems.length - 1) - (xcodeItemWidth) - xcodeItemWidth - xcodeGap * 5;
      formula = (xcodeItemWidth + xcodeGap) * (xcodeItems.length - 1) - (xcodeItemWidth - xcodeGap * 2);
    }
    updateXcodeMetrics();
    const AgencyConfig = {
      start: isTouch ? 'top center+=10%' : 'top bottom',
      end: isTouch ? '+=100%' : '+=100%'
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: AgencyConfig.start,
        end: () => AgencyConfig.end,
        scrub: 1,
      }
    });
    tl.to(container, {
      x: isTouch ? -formulaTouch : -formula,
      ease: 'power1.inOut',
      overwrite: 'auto',
    });
  });
}



// Guarantees Block
if (document.querySelector('.feedback') && width > 750) {
  gsap.set('.feedback-form, .guarantees-section', {
    yPercent: -92,
    scale: 0.3,
    xPercent: -35
  })

}
if (document.querySelector('.guarantees')) {
  let IsSmallMobile = window.innerWidth < 380;
  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
  const isChrome = /chrome/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);
  let GuaranteesCircleStart;
  function getStartGua() {
    let circle = document.querySelector('.guarantees-circle');
    if (!circle) {
      return 'top bottom';
    }
    let circleHeight = circle.clientHeight;
    if (circleHeight === 0) {
      return 'top bottom';
    }
    return `top bottom-=${circleHeight / 2}px`;
  }
  function getUserDevice() {
    if (isChrome && isIOS) {
      return `+=${window.innerHeight * 3}`
    } else {
      return `+=${window.innerHeight * 2.5}`
    }
  }
  gsap.to('.guarantees-section', {
    yPercent: 0,
    xPercent: 0,
    scale: 1,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.guarantees__wrap',
      start: isTouch ? 'top center+=20%' : 'top center',
      end: '+=70%',
      scrub: true,
    }
  })
  const GuaranteesConfig = {
    scale: IsDestop ? 22 : 25,
    yPercent: IsDestop ? -60 : -80,
    start: GuaranteesCircleStart
  };
  gsap.to('.guarantees-circle', {
    yPercent: GuaranteesConfig.yPercent,
    scale: isTouch ? 30 : GuaranteesConfig.scale,
    ease: 'none',
    rotate: 90,
    scrollTrigger: {
      trigger: '.guarantees-circle',
      pin: '.guarantees',
      start: getStartGua(),
      end: () => IsDestop ? `+=${window.innerHeight * 1.2}` : isTouch ? `+=${window.innerHeight * 2}` : getUserDevice(),
      scrub: 1,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const canvas = document.querySelector('.guarantees-canvas');
        if (canvas) canvas.style.opacity = progress >= 0.4 ? "1" : "0";
      }
    },
  });

}


// Implementation Block
if (document.querySelector('.implementation') && IsDestop) {
  let blockHight = document.querySelector('.implementation').clientHeight
  let ImpFormula = 5 + ((windowHeight - blockHight) / 10)
  let ImplementationConfig = {
    scale: IsDestop ? 15 : 30,
    yPercent: IsDestop ? 450 : 450,
    xPercent: IsDestop ? -70 : -0,
    end: IsDestop ? '+=75%' : '+=100%',
    start: windowWidth >= 1920 ? 'top top+=20%' : `top top+=${ImpFormula}%`
  }
  gsap.to('.implementation .circle-hero', {
    scale: ImplementationConfig.scale,
    yPercent: ImplementationConfig.yPercent,
    xPercent: ImplementationConfig.xPercent,
    scrollTrigger: {
      trigger: '.implementation',
      start: ImplementationConfig.start,
      end: ImplementationConfig.end,
      scrub: 1,
      onUpdate: (process) => {
        let StartProgress = process.progress
        if (IsDestop) {
          if (StartProgress >= 0.2) {
            document.querySelector('#imp-canvas').style.opacity = '1';
          } else {
            document.querySelector('#imp-canvas').style.opacity = '0';
          }
        }

        let Opacity = 1 - (StartProgress * 5)
        $('.implementation .stoke-title').css({ opacity: Opacity })
      }
    },
  })
}




// Feedback Block

if (document.querySelector('.feedback-form') && width > 750) {
  gsap.to('.feedback-form', {
    yPercent: 0,
    xPercent: 0,
    scale: 1,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.feedback-wrap',
      start: isTouch ? 'top center+=20%' : 'top center',
      end: '+=70%',
      scrub: 1,
    }
  })
}



// Text Color

function splitLetters() {
  const sections = document.querySelectorAll('.split-light, .split-dark');

  sections.forEach(section => {
    if (section.querySelector('.char')) return;

    const text = section.textContent.trim();
    const frag = document.createDocumentFragment();

    for (const char of text) {
      if (/\s/.test(char)) {
        frag.append(char);
      } else {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        frag.append(span);
      }
    }

    section.textContent = '';
    section.appendChild(frag);
  });
}

function initScrollAnimations() {
  const Config = { colorLight: "#BEBFC3", colorDark: "#8F919A" };
  const sections = document.querySelectorAll('.split-light, .split-dark');

  sections.forEach(section => {
    const chars = section.querySelectorAll('.char');
    if (!chars.length) return;

    const isLight = section.classList.contains('split-light');
    const baseColor = isLight ? Config.colorLight : Config.colorDark;

    gsap.set(chars, { color: baseColor, willChange: 'color' });

    gsap.to(chars, {
      color: '#fff',
      ease: 'power2.out',
      stagger: {
        each: 0.02,
        from: 'start',
      },
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    });
  });
}

function initSplitAnimation() {
  splitLetters();

  requestAnimationFrame(() => {
    initScrollAnimations();
  });
}

if (window.innerWidth > 750) {
  initSplitAnimation();
}
