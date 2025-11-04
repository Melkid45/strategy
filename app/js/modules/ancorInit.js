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

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const currentPath = window.location.pathname;
      const isHomePage = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html');
      const isCasePage = currentPath.includes('case-page') || document.body.classList.contains('case-page');

      if (isCasePage) {
        const homeUrl = `${window.location.origin}/index.html${href}`;
        window.location.href = homeUrl;
        return;
      }

      if (isHomePage) {
        scrollToAnchor(href);
      }
    });
  });
}

function scrollToAnchor(anchorId) {
  if (!isReady) {
    console.warn('⛔ Ожидаем инициализацию...');
    setTimeout(() => scrollToAnchor(anchorId), 100);
    return;
  }

  const target = document.querySelector(anchorId);
  if (!target) {
    console.warn(`⛔ Якорь ${anchorId} не найден`);
    return;
  }

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
    duration: 3,
    easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  });
}
