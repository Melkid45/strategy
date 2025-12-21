/*<------Ancor init------>*/

let isReady = false;
let isRedirectingFromCase = false;

window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  isRedirectingFromCase = urlParams.get('fromCase') === 'true' ||
    document.referrer.includes('case-page');

  const waitForReady = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof lenis === 'undefined') {
      console.warn('⏳ Ждем GSAP / ScrollTrigger / Lenis...');
      return requestAnimationFrame(waitForReady);
    }

    gsap.delayedCall(0.3, () => {
      if (!isRedirectingFromCase) {
        lenis.scrollTo(0, {
          immediate: true,
          duration: 0.1
        });
        ScrollTrigger.refresh();
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initAnchorLinks();
          isReady = true;

          if (isRedirectingFromCase && window.location.hash) {
            setTimeout(() => {
              scrollToAnchor(window.location.hash);
            }, 100);
          }

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
      lenis.start()
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const currentPath = window.location.pathname;
      const isHomePage = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html');
      const isCasePage = currentPath.includes('case-page') || document.body.classList.contains('case-page');

      if (isCasePage) {
        const anchorPart = href.split('?')[0];
        const homeUrl = `${window.location.origin}/index.html${anchorPart}?fromCase=true`;
        window.location.href = homeUrl;
        return;
      }

      const anchorPart = href.split('?')[0];
      console.log('Scrolling to anchor:', anchorPart);
      scrollToAnchor(anchorPart);
    });
  });
}

function scrollToAnchor(anchorId) {
  if (!isReady) {
    setTimeout(() => scrollToAnchor(anchorId), 100);
    return;
  }

  const cleanAnchorId = anchorId.split('?')[0];

  const target = document.querySelector(cleanAnchorId);
  if (!target) {
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