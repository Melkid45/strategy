// lenis
// В самом конце кода добавляем принудительный refresh
window.addEventListener('load', function () {
  setTimeout(function () {
    ScrollTrigger.refresh(true); // force refresh
    console.log('ScrollTrigger refreshed');
  }, 2000);
});

// И также после ресайза
window.addEventListener('resize', function () {
  setTimeout(function () {
    ScrollTrigger.refresh(true);
  }, 500);
});
ScrollTrigger.normalizeScroll(true);
gsap.ticker.lagSmoothing(0);
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
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


class ScrollManager {
  constructor() {
    this.isLenisAvailable = false;
    this.init();
  }

  init() {
    this.checkLenis();

    window.addEventListener('load', () => {
      this.scrollToTop();
    });
  }

  checkLenis() {
    if (typeof lenis !== 'undefined' && lenis.scrollTo) {
      this.isLenisAvailable = true;
      return true;
    }
    return false;
  }

  scrollToTop() {
    if (this.checkLenis()) {
      try {
        ScrollTrigger.getAll().forEach((trigger) => trigger.disable());

        lenis.scrollTo(0, {
          immediate: true,
          lock: false,
          onComplete: () => {
            this.enableScrollTriggers();
          },
        });

        setTimeout(() => {
          if (lenis.scroll > 10) {
            lenis.scrollTo(0, {
              immediate: true,
              onComplete: () => this.enableScrollTriggers(),
            });
          }
        }, 100);
      } catch (error) {
        console.warn('Lenis scroll failed, using native scroll');
        window.scrollTo(0, 0);
        this.enableScrollTriggers();
      }
    } else {
      window.scrollTo(0, 0);
      this.enableScrollTriggers();
    }
  }

  enableScrollTriggers() {
    setTimeout(() => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
      ScrollTrigger.refresh();
    }, 50);
  }
}

new ScrollManager();

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


let isReady = false;

// === ИНИЦИАЛИЗАЦИЯ после полной загрузки ===
window.addEventListener('load', () => {
  const waitForReady = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof lenis === 'undefined') {
      console.warn('⏳ Ждем GSAP / ScrollTrigger / Lenis...');
      return requestAnimationFrame(waitForReady);
    }

    // Убеждаемся, что GSAP уже все зарегистрировал
    gsap.delayedCall(0.3, () => {
      ScrollTrigger.refresh(true);

      lenis.scrollTo(0, { immediate: true });

      // Двойной кадр — ждём пока все layout'ы инициализируются
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initAnchorLinks();
          isReady = true;
          console.log('✅ Anchor links initialized (GSAP + Lenis ready)');
        });
      });
    });
  };

  // Даем 300 мс буфера после window.load
  setTimeout(waitForReady, 300);
});

// === ФУНКЦИЯ для якорных ссылок ===
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

      // На всякий случай перед прыжком пересчитываем триггеры
      ScrollTrigger.refresh(true);

      requestAnimationFrame(() => {
        const parent = target.parentNode;
        let scrollTarget = target;

        // Если это pinned элемент
        if (parent.classList.contains('pin-spacer')) {
          const previous = parent.previousElementSibling;
          if (previous) {
            const height = previous.clientHeight || 0;
            scrollTarget = previous.offsetTop + height;
          }
        }

        lenis.scrollTo(scrollTarget, {
          lerp: 0.1,
          duration: 6
        });

        // Повторный рефреш после прокрутки
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 500);
      });
    });
  });
}

// === РЕАКЦИЯ НА resize и hashchange ===
window.addEventListener("resize", () => {
  if (typeof controller !== 'undefined') controller.update(true);
  ScrollTrigger.refresh(true);
});

window.addEventListener("hashchange", () => {
  ScrollTrigger.refresh(true);
});

// === СВЯЗКА Lenis и GSAP ===
if (typeof lenis !== 'undefined') {
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });
}







function updateScrollDelayed() {
  // Даем браузеру закончить layout + GSAP пересчитать позиции
  gsap.delayedCall(0.35, () => { // чуть больше 0.1
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh(true);
    }

    if (typeof lenis !== "undefined") {
      if (typeof lenis.resize === "function") lenis.resize();
      lenis.scrollTo(lenis.scroll, { immediate: true });
    }

    // В крайнем случае, заставляем всё обновиться
    window.dispatchEvent(new Event("resize"));
  });
}

// Общая функция для аккордионов
function handleAccordionClick($item) {
  const $siblings = $item.siblings('.item');
  const isAlreadyOpen = $item.hasClass('open');

  // Закрываем все
  $siblings.removeClass('open');

  // Тогглим текущее
  if (!isAlreadyOpen) {
    $item.addClass('open');
  } else {
    $item.removeClass('open');
  }

  // Обновляем после короткой задержки
  updateScrollDelayed();
}

// Привязка обработчиков
$('.services-frame .item').on('click', function () {
  handleAccordionClick($(this));
});

$('.faq-frame .item').on('click', function () {
  handleAccordionClick($(this));
});














function updateMarqueeAnimation(container, index) {
  if (!container || !container.firstElementChild) return;

  const item = container.firstElementChild;
  const itemWidth = item.scrollWidth;
  const containerWidth = container.offsetWidth;

  const gap = parseFloat(getComputedStyle(container).gap) || 0;
  const totalItemWidth = itemWidth + gap;

  const translateValue = -((totalItemWidth / containerWidth) * 100);

  // уникальные id для стилей и анимаций
  const styleId = `dynamic-marquee-${index}`;
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }

  style.innerHTML = `
    @keyframes animPartners-${index} {
      0% { 
        transform: translateX(0);
        opacity: 1;
      }
      95% {
        opacity: 1;
      }
      100% { 
        transform: translateX(${translateValue}%);
        opacity: 1;
      }
    }

    .marquee-${index} {
      animation: animPartners-${index} 15s linear infinite;
      animation-fill-mode: both;
    }
  `;

  container.classList.add(`marquee-${index}`);

  // перезапуск анимации
  container.style.animation = 'none';
  setTimeout(() => {
    container.style.animation = '';
  }, 10);
}

function initMarquees() {
  const selectors = [
    '.stoke-title .stroke-wrap',
    '.agency-stroke',
    '.longest__body .stroke-wrap',
    '.case-frame .item .item-stroke-wrap',
    '.footer-stroke'
  ];

  const containers = document.querySelectorAll(selectors.join(', '));

  containers.forEach((container, index) => {
    updateMarqueeAnimation(container, index);

    container.addEventListener('animationiteration', function () {
      this.style.opacity = '1';
    });
  });

  // ресайз с дебаунсом
  let resizeTimeout;
  function debouncedUpdate() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      containers.forEach((container, index) => updateMarqueeAnimation(container, index));
    }, 250);
  }
  window.addEventListener('resize', debouncedUpdate);
}

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(initMarquees, 500);
  initMarquees();
});




// Color Text

function splitLetters() {
  const sections = document.querySelectorAll('.split-light, .split-dark');

  sections.forEach(section => {
    section.querySelectorAll('span').forEach(span => {
      const letters = span.textContent.split('');
      span.innerHTML = letters
        .map(letter => `<span class="char">${letter}</span>`)
        .join('');
    });
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



// Icon Rotate


document.addEventListener("DOMContentLoaded", () => {
  const icons = document.querySelectorAll(".item-rotate");
  if (!icons.length) return;

  const maxRotation = 15; // максимальный угол поворота

  window.addEventListener("mousemove", (e) => {
    const centerX = window.innerWidth / 2;
    const offsetX = e.clientX - centerX;
    const percentX = offsetX / centerX; // от -1 до 1
    const rotation = percentX * maxRotation;

    icons.forEach(icon => {
      gsap.to(icon, {
        rotate: rotation,
        duration: 0.5,
        ease: "power3.out"
      });
    });
  });

  // возврат при уходе мыши
  window.addEventListener("mouseleave", () => {
    icons.forEach(icon => {
      gsap.to(icon, {
        rotate: 0,
        duration: 1,
        ease: "power3.out"
      });
    });
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const pupil = document.getElementById("pupil");
  const svg = pupil.closest("svg");
  if (!pupil || !svg) return;

  const maxOffset = 8; // максимум смещения от центра глаза
  const cx0 = 60; // исходный центр глаза
  const cy0 = 60;

  window.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    // нормируем и ограничиваем смещение
    const angle = Math.atan2(offsetY, offsetX);
    const distance = Math.min(maxOffset, Math.hypot(offsetX, offsetY));

    const x = cx0 + Math.cos(angle) * distance;
    const y = cy0 + Math.sin(angle) * distance;

    gsap.to(pupil, {
      attr: { cx: x, cy: y },
      duration: 0.2,
      ease: "power2.out"
    });
  });

  window.addEventListener("mouseleave", () => {
    gsap.to(pupil, {
      attr: { cx: cx0, cy: cy0 },
      duration: 0.3,
      ease: "power2.out"
    });
  });
});




// Custom Cursor

class DotCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.w = this.canvas.width = this.canvas.offsetWidth;
    this.h = this.canvas.height = this.canvas.offsetHeight;

    // фоновая сетка точек
    this.spacing = 48;
    this.dots = [];
    this.initDots();

    // курсор
    this.cursor = { x: this.w / 2, y: this.h / 2, tx: this.w / 2, ty: this.h / 2, vx: 0, vy: 0, speed: 0 };

    this.setupEventListeners();
    this.animate();
  }

  initDots() {
    for (let y = this.spacing / 2; y < this.h; y += this.spacing) {
      for (let x = this.spacing / 2; x < this.w; x += this.spacing) {
        this.dots.push({
          x,
          y,
          r: 2,
          targetR: 2,
          opacity: 0.5,
          targetOpacity: 0.5
        });
      }
    }
  }

  setupEventListeners() {
    // Обработчик движения мыши
    this.handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
        this.cursor.tx = e.clientX - rect.left;
        this.cursor.ty = e.clientY - rect.top;
      }
    };

    window.addEventListener('mousemove', this.handleMouseMove);

    // Обработчик ресайза
    this.handleResize = () => {
      this.w = this.canvas.width = this.canvas.offsetWidth;
      this.h = this.canvas.height = this.canvas.offsetHeight;
      this.dots = [];
      this.initDots();
    };

  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    // движение курсора
    let dx = this.cursor.tx - this.cursor.x;
    let dy = this.cursor.ty - this.cursor.y;
    this.cursor.vx += dx * 0.2;
    this.cursor.vy += dy * 0.2;
    this.cursor.vx *= 0.7;
    this.cursor.vy *= 0.7;
    this.cursor.x += this.cursor.vx;
    this.cursor.y += this.cursor.vy;
    this.cursor.speed = Math.sqrt(this.cursor.vx * this.cursor.vx + this.cursor.vy * this.cursor.vy);

    // рисуем точки на фоне
    this.dots.forEach(dot => {
      const dist = Math.hypot(dot.x - this.cursor.x, dot.y - this.cursor.y);
      if (dist < 120) {
        dot.targetR = 1 + (120 - dist) / 50;
        dot.targetOpacity = 0.5;
      } else {
        dot.targetR = 0.5;
        dot.targetOpacity = 0;
      }
      dot.r += (dot.targetR - dot.r) * 0.1;
      dot.opacity += (dot.targetOpacity - dot.opacity) * 0.1;

      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
      this.ctx.fill();
    });
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  destroy() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
  }
}

// Инициализация всех canvas на странице
class DotCanvasManager {
  constructor() {
    this.canvases = new Map();
    this.init();
  }

  init() {
    const canvasElements = document.querySelectorAll('#dotCanvas, .dotCanvas, canvas[data-dot-canvas]');

    canvasElements.forEach((canvas, index) => {
      // Даем уникальный ID если его нет
      if (!canvas.id) {
        canvas.id = `dotCanvas-${index}`;
      }

      const dotCanvas = new DotCanvas(canvas);
      this.canvases.set(canvas.id, dotCanvas);
    });
  }

  getCanvas(id) {
    return this.canvases.get(id);
  }

  destroy() {
    this.canvases.forEach(canvas => canvas.destroy());
    this.canvases.clear();
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.dotCanvasManager = new DotCanvasManager();
});

// Если нужно добавить canvas динамически
function addDotCanvas(canvasElement) {
  if (!window.dotCanvasManager) {
    window.dotCanvasManager = new DotCanvasManager();
  }

  const dotCanvas = new DotCanvas(canvasElement);
  window.dotCanvasManager.canvases.set(canvasElement.id || `dotCanvas-${Date.now()}`, dotCanvas);
  return dotCanvas;
}



// Lines

const lines = document.querySelectorAll('.line path');

const lineAnimations = new Map();
lines.forEach(path => {
  const animationData = {
    depth: 0,
    x: 1000,
    tween: null
  };
  lineAnimations.set(path, animationData);
});

function updateLinePath(path, depth, x) {
  const viewBoxHeight = 200;
  const centerY = viewBoxHeight / 2;
  const waveWidth = 500;

  const effectiveX = Math.max(0, Math.min(2000, x));

  const points = [
    { x: 0, y: centerY },
    { x: effectiveX - waveWidth / 2, y: centerY },
    { x: effectiveX, y: centerY + depth },
    { x: effectiveX + waveWidth / 2, y: centerY },
    { x: 2000, y: centerY }
  ];

  let d = `M${points[0].x} ${points[0].y}`;
  d += ` L${points[1].x} ${points[1].y}`;
  d += ` C${points[1].x + waveWidth / 4} ${points[1].y}, 
           ${points[2].x - waveWidth / 6} ${points[2].y}, 
           ${points[2].x} ${points[2].y}`;
  d += ` C${points[2].x + waveWidth / 6} ${points[2].y}, 
           ${points[3].x - waveWidth / 4} ${points[3].y}, 
           ${points[3].x} ${points[3].y}`;
  d += ` L${points[4].x} ${points[4].y}`;

  path.setAttribute('d', d);
}

document.addEventListener('mousemove', e => {
  lines.forEach(path => {
    const animationData = lineAnimations.get(path);
    const svg = path.closest('svg');
    const rect = svg.getBoundingClientRect();

    const lineCenterY = rect.top + rect.height / 2;
    const distY = Math.abs(e.clientY - lineCenterY);

    const maxDepth = 80;
    const activationDistance = 80;

    const isActive = distY < activationDistance;
    const proximity = 1 - Math.pow(distY / activationDistance, 1.5);
    const targetDepth = isActive ?
      Math.max(-maxDepth, Math.min(maxDepth, (lineCenterY - e.clientY) * proximity * 2.5)) : 0;

    const scaleX = 2000 / rect.width;
    const targetX = (e.clientX - rect.left) * scaleX;

    if (animationData.tween) {
      animationData.tween.kill();
    }

    animationData.tween = gsap.to(animationData, {
      duration: 0.4,
      depth: targetDepth,
      x: targetX,
      ease: "power2.out",
      onUpdate: () => {
        updateLinePath(path, animationData.depth, animationData.x);
      }
    });
  });
});

document.addEventListener('mouseleave', () => {
  lines.forEach(path => {
    const animationData = lineAnimations.get(path);

    if (animationData.tween) {
      animationData.tween.kill();
    }

    animationData.tween = gsap.to(animationData, {
      duration: 0.8,
      depth: 0,
      x: 1000,
      ease: "elastic.out(1, 0.4)",
      onUpdate: () => {
        updateLinePath(path, animationData.depth, animationData.x);
      }
    });
  });
});
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
  }
})

// Cards Xcode


let xcodeContainer = document.querySelector('.xcode-cards');
let xcodeItems = gsap.utils.toArray('.xcode-cards .item');
let xcodeItemWidth, xcodeGap, formula;

function updateXcodeMetrics() {
  xcodeItemWidth = xcodeItems[0].offsetWidth;
  xcodeGap = parseFloat(getComputedStyle(xcodeContainer).gap) || 0;
  formula = (xcodeItemWidth + xcodeGap) * (xcodeItems.length - 1);
}
updateXcodeMetrics();

// Основная анимация движения карточек
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

// Активная карточка
function setActive(index) {
  if (!xcodeContainer.dataset.activeIndex || xcodeContainer.dataset.activeIndex != index) {
    xcodeItems.forEach(el => el.classList.remove('active'));
    xcodeItems[index].classList.add('active');
    xcodeContainer.dataset.activeIndex = index;
  }
}

// Обновление при ресайзе
window.addEventListener('resize', () => {
  updateXcodeMetrics();
  ScrollTrigger.refresh();
});




// Гарантии 

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
  }
})

gsap.set('.feedback-form, .guarantees-section', {
  yPercent: -85,
  scale: 0.3,
  xPercent: -35
})
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



// Agency



class AgencyTrail {
  constructor(agencyElement) {
    this.agency = agencyElement;
    this.animationContainer = this.agency.querySelector('.wrap-agency-animation');

    // Если контейнер анимации не найден, отключаем функциональность
    if (!this.animationContainer) {
      this.isValid = false;
      return;
    }

    this.isValid = true;
    this.content = this.animationContainer.querySelector('.content');

    // Если внутри контейнера нет content, ищем в родительских элементах
    if (!this.content) {
      this.content = this.agency.querySelector('.content');
    }

    this.images = Array.from(this.content.querySelectorAll('.content__img'));
    this.imgInners = Array.from(this.content.querySelectorAll('.content__img-inner'));

    this.mouse = { x: 0, y: 0 };
    this.lastMouse = { x: 0, y: 0 };
    this.cacheMouse = { x: 0, y: 0 };

    this.zIndex = 1;
    this.activeIndex = 0;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.isPaused = false;

    this.activationDistance = 80;
    this.animationRect = this.animationContainer.getBoundingClientRect();

    // Для управления анимациями
    this.activeAnimations = new Map();
    this.hideAnimation = null;

    this.init();
  }

  init() {
    if (!this.isValid) return;

    this.hideAllImages();
    this.setupEventListeners();
    this.startTracking();
  }

  setupEventListeners() {
    if (!this.isValid) return;

    // Основные события мыши на контейнере анимации
    this.animationContainer.addEventListener('mousemove', (e) => {
      this.updateAnimationRect();
      this.mouse.x = e.clientX - this.animationRect.left;
      this.mouse.y = e.clientY - this.animationRect.top;
    });

    this.animationContainer.addEventListener('mouseenter', (e) => {
      this.isPaused = false;
      this.updateAnimationRect();
      this.mouse.x = e.clientX - this.animationRect.left;
      this.mouse.y = e.clientY - this.animationRect.top;
      this.cacheMouse.x = this.mouse.x;
      this.cacheMouse.y = this.mouse.y;
      this.lastMouse.x = this.mouse.x;
      this.lastMouse.y = this.mouse.y;

      // Отменяем анимацию скрытия
      if (this.hideAnimation) {
        this.hideAnimation.kill();
        this.hideAnimation = null;
      }
    });

    this.animationContainer.addEventListener('mouseleave', (e) => {
      // Проверяем, что курсор действительно вышел из контейнера анимации
      if (!this.isCursorInAnimationContainer(e)) {
        this.isPaused = true;
        this.hideAllImagesSmoothly();
      }
    });

    // Для фиксированной шапки - отслеживаем движение по всему документу
    document.addEventListener('mousemove', (e) => {
      if (!this.isPaused) return;

      // Если анимация на паузе (мышь покинула контейнер), но курсор вернулся в контейнер
      if (this.isCursorInAnimationContainer(e)) {
        this.isPaused = false;
        if (this.hideAnimation) {
          this.hideAnimation.kill();
          this.hideAnimation = null;
        }

        this.updateAnimationRect();
        this.mouse.x = e.clientX - this.animationRect.left;
        this.mouse.y = e.clientY - this.animationRect.top;
        this.cacheMouse.x = this.mouse.x;
        this.cacheMouse.y = this.mouse.y;
        this.lastMouse.x = this.mouse.x;
        this.lastMouse.y = this.mouse.y;
      }
    });

    window.addEventListener('resize', () => {
      this.updateAnimationRect();
    });
  }

  // Точная проверка нахождения курсора в контейнере анимации
  isCursorInAnimationContainer(e) {
    const rect = this.animationContainer.getBoundingClientRect();
    const buffer = 2; // Небольшой буфер для предотвращения ложных срабатываний

    return (
      e.clientX >= rect.left - buffer &&
      e.clientX <= rect.right + buffer &&
      e.clientY >= rect.top - buffer &&
      e.clientY <= rect.bottom + buffer
    );
  }

  updateAnimationRect() {
    this.animationRect = this.animationContainer.getBoundingClientRect();
  }

  startTracking() {
    if (!this.isValid) return;

    gsap.ticker.add(() => {
      if (!this.isPaused) {
        this.cacheMouse.x = this.lerp(this.cacheMouse.x, this.mouse.x, 0.1);
        this.cacheMouse.y = this.lerp(this.cacheMouse.y, this.mouse.y, 0.1);
        this.checkDistanceAndSpawn();
      }
    });
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  getDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
  }

  checkDistanceAndSpawn() {
    const distance = this.getDistance(this.lastMouse, this.mouse);

    if (distance > this.activationDistance) {
      this.spawnImage();
      this.lastMouse = { ...this.mouse };
    }

    if (this.isIdle && this.zIndex !== 1) {
      this.zIndex = 1;
    }
  }

  spawnImage() {
    if (this.isPaused || !this.isValid) return;

    this.activeImagesCount++;
    this.isIdle = false;

    this.zIndex++;
    this.activeIndex = this.activeIndex < this.images.length - 1 ? this.activeIndex + 1 : 0;

    const currentImg = this.images[this.activeIndex];
    const currentInner = this.imgInners[this.activeIndex];

    // Останавливаем предыдущие анимации для этого элемента
    if (this.activeAnimations.has(currentImg)) {
      this.activeAnimations.get(currentImg).kill();
    }

    const imgRect = currentImg.getBoundingClientRect();

    // Устанавливаем начальную позицию относительно контейнера анимации
    gsap.set(currentImg, {
      x: this.mouse.x - imgRect.width / 2,
      y: this.mouse.y - imgRect.height / 2,
      scale: 0,
      opacity: 1,
      zIndex: this.zIndex
    });

    gsap.set(currentInner, {
      scale: 2.8,
      filter: "brightness(150%)"
    });

    const timeline = gsap.timeline({
      onStart: () => this.onImageActivate(),
      onComplete: () => {
        this.onImageComplete();
        this.activeAnimations.delete(currentImg);
      }
    });

    // Сохраняем анимацию для возможности отмены
    this.activeAnimations.set(currentImg, timeline);

    timeline.to(currentImg, {
      duration: 0.4,
      ease: "power1.out",
      scale: 1
    }, 0)

      .to(currentInner, {
        duration: 0.6,
        ease: "power1.out",
        scale: 1,
        filter: "brightness(100%)"
      }, 0)

      .to(currentImg, {
        duration: 0.4,
        ease: "power2.in",
        opacity: 0,
        scale: 0.2
      }, 0.45);
  }

  hideAllImages() {
    if (!this.isValid) return;

    // Мгновенное скрытие всех изображений
    this.images.forEach(img => {
      gsap.set(img, {
        opacity: 0,
        scale: 0.2
      });
    });

    // Останавливаем все активные анимации
    this.activeAnimations.forEach((animation, img) => {
      animation.kill();
    });
    this.activeAnimations.clear();

    if (this.hideAnimation) {
      this.hideAnimation.kill();
      this.hideAnimation = null;
    }

    this.activeImagesCount = 0;
    this.isIdle = true;
    this.zIndex = 1;
  }

  hideAllImagesSmoothly() {
    if (!this.isValid) return;

    // Останавливаем все активные анимации появления
    this.activeAnimations.forEach((animation, img) => {
      animation.kill();
    });
    this.activeAnimations.clear();

    // Останавливаем предыдущую анимацию скрытия
    if (this.hideAnimation) {
      this.hideAnimation.kill();
    }

    // Плавно скрываем все видимые изображения
    const visibleImages = this.images.filter(img => {
      const opacity = gsap.getProperty(img, "opacity");
      return opacity > 0;
    });

    if (visibleImages.length === 0) {
      this.activeImagesCount = 0;
      this.isIdle = true;
      return;
    }

    this.hideAnimation = gsap.timeline({
      onComplete: () => {
        this.activeImagesCount = 0;
        this.isIdle = true;
        this.zIndex = 1;
        this.hideAnimation = null;
      }
    });

    visibleImages.forEach(img => {
      const currentScale = gsap.getProperty(img, "scale");
      const currentOpacity = gsap.getProperty(img, "opacity");

      // Продолжаем с текущего состояния, а не начинаем заново
      this.hideAnimation.to(img, {
        duration: 0.3,
        ease: "power2.out",
        opacity: 0,
        scale: currentScale * 0.5, // Плавно уменьшаем от текущего размера
        overwrite: true
      }, 0);
    });
  }

  onImageActivate() {
    this.activeImagesCount++;
  }

  onImageComplete() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class AgencyTrailManager {
  constructor() {
    this.agencyTrails = [];
    this.init();
  }

  init() {
    const agencySections = document.querySelectorAll('.agency');

    agencySections.forEach((agency) => {
      // Проверяем наличие контейнера анимации
      if (agency.querySelector('.wrap-agency-animation')) {
        const trail = new AgencyTrail(agency);
        if (trail.isValid) {
          this.agencyTrails.push(trail);
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AgencyTrailManager();
});

// Main block



gsap.to('.hero-block .stoke-title', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.hero-block__body',
    start: 'top top',
    end: '+=10%',
    scrub: 1,
  }
})

gsap.to('.implementation .stoke-title', {
  opacity: 0,
  scrollTrigger: {
    trigger: '.implementation__body',
    start: 'top top',
    end: '+=10%',
    scrub: 1,
  }
})



// TextArea


function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  updateScroll()
}

// Использование
const textarea = document.querySelector('textarea');

// При загрузке страницы
autoResize(textarea);

// При вводе текста
textarea.addEventListener('input', () => autoResize(textarea));



// Cursor Trail

// (function () {
//   const DOTS = 10;
//   const FOLLOW_SPEED = 0.15;
//   const SPEED_THRESHOLD = 1.5;

//   const pointer = {
//     x: window.innerWidth / 2,
//     y: window.innerHeight / 2,
//     prevX: window.innerWidth / 2,
//     prevY: window.innerHeight / 2,
//     speed: 0,
//     isHovering: false // Добавляем флаг для отслеживания наведения
//   };

//   const trailRoot = document.getElementById('cursorTrail');
//   const dots = [];

//   // Первая точка
//   const first = document.createElement('div');
//   first.className = 'cursor-dot center';
//   trailRoot.appendChild(first);
//   dots.push({ el: first, x: pointer.x, y: pointer.y, scale: 1, opacity: 1 });

//   // Хвост
//   for (let i = 0; i < DOTS; i++) {
//     const el = document.createElement('div');
//     el.className = 'cursor-dot tail';
//     trailRoot.appendChild(el);
//     dots.push({ el, x: pointer.x, y: pointer.y, scale: 1, opacity: 0 });
//   }

//   function onPointerMove(e) {
//     const x = e.clientX || (e.touches && e.touches[0].clientX) || pointer.x;
//     const y = e.clientY || (e.touches && e.touches[0].clientY) || pointer.y;

//     pointer.speed = Math.hypot(x - pointer.prevX, y - pointer.prevY);
//     pointer.prevX = pointer.x;
//     pointer.prevY = pointer.y;

//     pointer.x = x;
//     pointer.y = y;

//     // Проверяем, наведен ли курсор на интерактивный элемент
//     checkHoverState(x, y);
//   }

//   function checkHoverState(x, y) {
//     const element = document.elementFromPoint(x, y);
    
//     if (element) {
//       const isInteractive = 
//         element.tagName === 'A' || 
//         element.tagName === 'BUTTON' || 
//         element.style.cursor === 'pointer' ||
//         window.getComputedStyle(element).cursor === 'pointer';
      
//       pointer.isHovering = isInteractive;
//     } else {
//       pointer.isHovering = false;
//     }
//   }

//   window.addEventListener('pointermove', onPointerMove, { passive: true });
//   window.addEventListener('touchmove', onPointerMove, { passive: true });

//   // Также обрабатываем события для элементов, которые могут появляться/исчезать
//   document.addEventListener('mouseover', (e) => {
//     const target = e.target;
//     const isInteractive = 
//       target.tagName === 'A' || 
//       target.tagName === 'BUTTON' || 
//       target.style.cursor === 'pointer' ||
//       window.getComputedStyle(target).cursor === 'pointer';
    
//     if (isInteractive) {
//       pointer.isHovering = true;
//     }
//   });

//   document.addEventListener('mouseout', (e) => {
//     const target = e.target;
//     const isInteractive = 
//       target.tagName === 'A' || 
//       target.tagName === 'BUTTON' || 
//       target.style.cursor === 'pointer' ||
//       window.getComputedStyle(target).cursor === 'pointer';
    
//     if (isInteractive) {
//       pointer.isHovering = false;
//     }
//   });

//   function lerp(a, b, t) { return a + (b - a) * t; }

//   // плавное затухание скорости
//   function updateSpeedDecay() {
//     pointer.speed *= 0.85;
//     requestAnimationFrame(updateSpeedDecay);
//   }
//   updateSpeedDecay();

//   function animate() {
//     // Первая точка всегда на месте, но с учетом наведения
//     dots[0].x = lerp(dots[0].x, pointer.x, FOLLOW_SPEED * 1.5);
//     dots[0].y = lerp(dots[0].y, pointer.y, FOLLOW_SPEED * 1.5);
    
//     // Масштаб первой точки зависит от состояния наведения
//     const targetScale = pointer.isHovering ? 1.2 : 1;
//     dots[0].scale = lerp(dots[0].scale, targetScale, 0.15);
    
//     dots[0].el.style.transform = `translate3d(${dots[0].x}px, ${dots[0].y}px,0) translate(-50%, -50%) scale(${dots[0].scale})`;

//     const fastMove = pointer.speed > SPEED_THRESHOLD;

//     for (let i = 1; i < dots.length; i++) {
//       const prev = dots[i - 1];
//       const cur = dots[i];

//       cur.x = lerp(cur.x, prev.x, FOLLOW_SPEED + i * 0.015);
//       cur.y = lerp(cur.y, prev.y, FOLLOW_SPEED + i * 0.015);

//       let targetTailScale = 1;
//       if (fastMove) {
//         const speedFactor = Math.min(pointer.speed / 25, 1);
//         targetTailScale += speedFactor * (1 - i / dots.length) * 1.6;
//       }
//       cur.scale = lerp(cur.scale, targetTailScale, 0.08);

//       cur.el.style.transform = `translate3d(${cur.x}px, ${cur.y}px,0) translate(-50%, -50%) scale(${cur.scale})`;

//       // плавное исчезновение хвоста
//       const targetOpacity = pointer.speed < 0.1 ? 0 : 0.2 * (1 - i / dots.length);
//       cur.opacity = lerp(cur.opacity, targetOpacity, 0.1);
//       cur.el.style.opacity = cur.opacity.toFixed(1);
//     }

//     requestAnimationFrame(animate);
//   }

//   requestAnimationFrame(animate);
// })();



// Ancor

document.querySelector('.ancor-form').addEventListener('click', function () {
  gsap.to(window, {
    duration: 1,
    ease: 'power1.inOut',
    scrollTo: { y: "#feedback-form", offsetY: -500 }
  });
});


// File


document.addEventListener('DOMContentLoaded', function () {
  const fileWrap = document.querySelector('.file-wrap');
  const fileInput = fileWrap.querySelector('input[type="file"]');
  const clearBtn = fileWrap.querySelector('.clear-file');
  const fileName = fileWrap.querySelector('.file-name');

  fileInput.addEventListener('change', function () {
    if (this.files && this.files.length > 0) {
      fileWrap.classList.add('has-file');
      fileName.textContent = this.files[0].name;
    } else {
      fileWrap.classList.remove('has-file');
      fileName.textContent = 'Прикрепить файл';
    }
  });

  clearBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    fileInput.value = '';

    fileWrap.classList.remove('has-file');
    fileName.textContent = 'Прикрепить файл';
  });

});

$('.wrap-answer .item').on('click', function (e) {
  let text = $(this).text()
  $('#custom-select').val(text)
})


let col = 0;
$('.form-action button').on('click', function (e) {
  let $items = document.querySelectorAll('.input-wrap input, .input-wrap textarea')
  $items.forEach(($element, index) => {
    if ($element.value === '') {
      $element.classList.add('error')
      $element.classList.remove('has-val')
    } else {
      col++
      $element.classList.remove('error')
      $element.classList.add('has-val')
    }
  })
  if (col == 5) {
    $('.feedback-form-main').remove()
    $('.form-send').fadeIn(300)
    $('.form-default').remove()
  }
})



// Ancor Indicator


// Функция для определения видимости секции
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight * 0.6 &&
    rect.bottom >= window.innerHeight * 0.4
  );
}

// Функция обновления активного пункта навигации
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar .ancor-item');
  const homeLink = document.querySelector('.home-btn');
  
  // Если вверху страницы - активна домашняя ссылка
  if (window.scrollY < 50) {
    navLinks.forEach(link => link.parentElement.classList.remove('current'));
    if (homeLink) homeLink.parentElement.classList.add('current');
    return;
  }
  
  let foundActive = false;
  
  // Проверяем секции сверху вниз
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (isElementInViewport(section)) {
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.navbar .ancor-item[href="#${sectionId}"]`);
      
      // Удаляем класс current со всех элементов
      navLinks.forEach(link => link.parentElement.classList.remove('current'));
      
      // Добавляем класс current к активному элементу
      if (correspondingLink) {
        correspondingLink.parentElement.classList.add('current');
        homeLink.parentElement.classList.remove('current')
        foundActive = true;
      }
      break;
    }
  }
  
  // Если не найдено активной секции
  if (!foundActive) {
    navLinks.forEach(link => link.parentElement.classList.remove('current'));
  }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
  updateActiveNav();
});

// Обновляем при скролле Lenis
if (typeof lenis !== 'undefined') {
  lenis.on('scroll', updateActiveNav);
}

// Обновляем при ресайзе
window.addEventListener('resize', updateActiveNav);