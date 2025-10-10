/*<---------Gsap All--------->*/




// Hero Block
if (document.querySelector('.hero-block')) {
  gsap.to('.hero-block .circle-hero', {
    scale: 15,
    yPercent: -50,
    xPercent: -70,
    scrollTrigger: {
      trigger: '.hero-block',
      start: 'top top',
      end: '+=100%',
      scrub: 1,
      pin: true,
      pinSpacing: false,
      onUpdate: (process) => {
        let StartProgress = process.progress
        let Opacity = 1 - (StartProgress * 5)
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
  let xcodeItemWidth, xcodeGap, formula;

  function updateXcodeMetrics() {
    xcodeItemWidth = xcodeItems[0].offsetWidth;
    xcodeGap = parseFloat(getComputedStyle(xcodeContainer).gap) || 0;
    formula = (xcodeItemWidth + xcodeGap) * (xcodeItems.length - 1);
  }
  updateXcodeMetrics();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.xcode',
      start: 'top+=40%',
      end: () => `+=${formula}`,
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
    x: -formula,
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
if (document.querySelector('.feedback')) {
  gsap.set('.feedback-form, .guarantees-section', {
    yPercent: -85,
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
  gsap.to('.guarantees-circle', {
    yPercent: -60,
    scale: 16,
    ease: 'power1.inOut',
    rotate: 90,
    scrollTrigger: {
      trigger: '.guarantees',
      start: '+=45%',
      end: '+=200%',
      scrub: 1,
      pin: true,
      pinSpacing: false
    }
  })
}


// Implementation Block
if (document.querySelector('.implementation')) {
  gsap.to('.implementation .circle-hero', {
    scale: 15,
    yPercent: -50,
    xPercent: -70,
    scrollTrigger: {
      trigger: '.implementation',
      start: 'top top',
      end: '+=75%',
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

if (document.querySelector('.feedback-form')) {
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
    const letters = section.textContent.split('');
    section.innerHTML = letters
      .map(letter => `<span class="char">${letter}</span>`)
      .join('');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  splitLetters();
  let Config = {
    colorLight: "#BEBFC3",
    colorDark: "#8F919A"
  };
  const sections = document.querySelectorAll('.split-light, .split-dark');

  sections.forEach(section => {
    const chars = section.querySelectorAll('.char');
    let color = section.classList.contains('split-light') ? Config.colorLight : Config.colorDark;
    gsap.fromTo(
      chars,
      { color: color },
      {
        color: "#fff",
        ease: "none",
        stagger: 0.05,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
        }
      }
    );
  });
});