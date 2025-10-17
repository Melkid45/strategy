/*<------Ancor init------>*/

let isReady = false;

window.addEventListener('load', () => {
  const waitForReady = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof lenis === 'undefined') {
      console.warn('⏳ Ждем GSAP / ScrollTrigger / Lenis...');
      return requestAnimationFrame(waitForReady);
    }

    gsap.delayedCall(0.3, () => {
      ScrollTrigger.refresh(true);

      lenis.scrollTo(0, { 
        immediate: true ,
        duration: 0.1
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initAnchorLinks();
          isReady = true;
          console.log('✅ Anchor links initialized (GSAP + Lenis ready)');
        });
      });
    });
  };

  setTimeout(waitForReady, 300);
});

function initAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();

      if (!isReady) {
        console.warn('⛔ Якоря пока не готовы — ждем инициализацию Lenis/GSAP');
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      ScrollTrigger.refresh(true);

      requestAnimationFrame(() => {
        const parent = target.parentNode;
        let scrollTarget = target;

        if (parent.classList.contains('pin-spacer')) {
          const previous = parent.previousElementSibling;
          if (previous) {
            const height = previous.clientHeight || 0;
            scrollTarget = previous.offsetTop + height;
          }
        }

        lenis.scrollTo(scrollTarget, {
          lerp: 0.1,
          duration: 6,
          easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        });

        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 500);
      });
    });
  });
}

window.addEventListener("resize", () => {
  if (typeof controller !== 'undefined') controller.update(true);
  ScrollTrigger.refresh(true);
});

window.addEventListener("hashchange", () => {
  ScrollTrigger.refresh(true);
});

if (typeof lenis !== 'undefined') {
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });
}