/*<---------Gsap All--------->*/



let IsDestop = width > 750;
// Hero Block
if (document.querySelector('.hero-block')) {
  let HeroConfig = {
    scale: IsDestop ? 15 : 30,
    yPercent: IsDestop ? 150 : 450,
    xPercent: IsDestop ? -70 : -0,
    end: IsDestop ? '+=75%' : '+=100%'
  }
  gsap.to('.hero-block .circle-hero', {
    scale: HeroConfig.scale,
    yPercent: HeroConfig.yPercent,
    xPercent: HeroConfig.xPercent,
    scrollTrigger: {
      trigger: '.hero-block',
      start: 'top+=0.1%',
      end: HeroConfig.end,
      scrub: 1,
      pin: true,
      pinSpacing: false,
      onUpdate: (process) => {
        let StartProgress = process.progress
        let Opacity = 1 - (StartProgress * 10)
        let OpacityScroll = 1 - (StartProgress * 10)
        $('.hero-block .stoke-title').css({ opacity: Opacity })
        $('.hero-block-scroll').css({ opacity: OpacityScroll })
      }
    }
  })
}



// Cards Xcode

if (document.querySelector('.xcode')) {
  let xcodeContainer = document.querySelector('.xcode-cards');
  let xcodeItems = gsap.utils.toArray('.xcode-cards .item');
  let xcodeItemWidth, xcodeGap, formula, formulaMobile;

  function updateXcodeMetrics() {
    xcodeItemWidth = xcodeItems[0].offsetWidth;
    xcodeGap = parseFloat(getComputedStyle(xcodeContainer).gap) || 0;
    formula = (xcodeItemWidth + xcodeGap) * (xcodeItems.length - 1);
    formulaMobile = (xcodeItemWidth + xcodeGap) * (xcodeItems.length - 1) - (xcodeItemWidth - (xcodeGap * 8 - 10));
  }
  updateXcodeMetrics();
  let XcodeConsig = {
    start: IsDestop ? 'top+=40%' : 'top+=30%'
  }
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.xcode',
      start: XcodeConsig.start,
      end: () => `+=${IsDestop ? formula : formulaMobile}`,
      pin: true,
      scrub: 1,
      onUpdate: self => {
        const progress = self.progress; // 0 → 1
        const index = Math.min(xcodeItems.length - 1, Math.floor(progress * xcodeItems.length));
        setActive(index);
      }
    }
  });

  tl.to('.xcode-cards', {
    x: -(IsDestop ? formula : formulaMobile),
    ease: 'none'
  });

  function setActive(index) {
    if (!xcodeContainer.dataset.activeIndex || xcodeContainer.dataset.activeIndex != index) {
      xcodeItems.forEach(el => el.classList.remove('active'));
      xcodeItems[index].classList.add('active');
      xcodeContainer.dataset.activeIndex = index;
    }
  }

  window.addEventListener('resize', () => {
    updateXcodeMetrics();
    ScrollTrigger.refresh();
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
  gsap.to('.guarantees-section', {
    yPercent: 0,
    xPercent: 0,
    scale: 1,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '.guarantees__wrap',
      start: 'top center',
      end: '+=70%',
      scrub: true,
    }
  })
  let GuaranteesConfig = {
    scale: IsDestop ? 16 : 25,
    yPercent: IsDestop ? -60 : -80,
    start: IsDestop ? '+=45%' : '+=20%',
    end: IsDestop ? '+=200%' : '+=50%'
  }
  gsap.to('.guarantees-circle', {
    yPercent: GuaranteesConfig.yPercent,
    scale: GuaranteesConfig.scale,
    ease: 'power1.inOut',
    rotate: 90,
    scrollTrigger: {
      trigger: '.guarantees',
      start: GuaranteesConfig.start,
      end: GuaranteesConfig.end,
      scrub: 1,
      pin: true,
      pinSpacing: false,
    }
  })
}


// Implementation Block
if (document.querySelector('.implementation')) {
  let ImplementationConfig = {
    scale: IsDestop ? 15 : 30,
    yPercent: IsDestop ? 100 : 450,
    xPercent: IsDestop ? -70 : -0,
    end: IsDestop ? '+=75%' : '+=100%'
  }
  gsap.to('.implementation .circle-hero', {
    scale: ImplementationConfig.scale,
    yPercent: ImplementationConfig.yPercent,
    xPercent: ImplementationConfig.xPercent,
    scrollTrigger: {
      trigger: '.implementation',
      start: 'top top',
      end: ImplementationConfig.end,
      scrub: 1,
      pin: true,
      pinSpacing: false,
      onUpdate: (process) => {
        let StartProgress = process.progress
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
      start: 'top center',
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

    const text = section.textContent;
    let newHTML = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === ' ' || char === '\n' || char === '\t') {
        newHTML += char;
      } else {
        newHTML += `<span class="char">${char}</span>`;
      }
    }

    section.innerHTML = newHTML;
  });
}

function initScrollAnimations() {
  const Config = { colorLight: "#BEBFC3", colorDark: "#8F919A" };
  const sections = document.querySelectorAll('.split-light, .split-dark');

  sections.forEach(section => {
    const chars = section.querySelectorAll('.char');
    const color = section.classList.contains('split-light') ? Config.colorLight : Config.colorDark;


    gsap.to(chars, {
      color: '#fff',
      ease: "power2.out",
      stagger: { amount: 0.5, from: "start" },
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    })
  });
}

document.addEventListener('DOMContentLoaded', () => {
  splitLetters();
  setTimeout(() => {
    initScrollAnimations();
  }, 100);
});



if (document.querySelector('.wrap-agency-animation') && !IsDestop) {
  const xcodeContainers = document.querySelectorAll('.wrap-agency-animation .content');

  xcodeContainers.forEach((container, containerIndex) => {
    let xcodeItems = container.querySelectorAll('.content__img');
    let xcodeItemWidth, xcodeGap, formula;

    function updateXcodeMetrics() {
      xcodeItemWidth = xcodeItems[0].offsetWidth;
      xcodeGap = parseFloat(getComputedStyle(container).gap) || 0;
      formula = (xcodeItemWidth + xcodeGap) * (xcodeItems.length - 1) - (xcodeItemWidth - xcodeGap * 2);
    }
    updateXcodeMetrics();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: () => `+=100%`,
        scrub: 1,
      }
    });
    tl.to(container, {
      x: -formula,
      ease: 'none',
    });
  });
}
