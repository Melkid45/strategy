// lenis
// В самом конце кода добавляем принудительный refresh
window.addEventListener('load', function() {
  setTimeout(function() {
    ScrollTrigger.refresh(true); // force refresh
    console.log('ScrollTrigger refreshed');
  }, 2000);
});

// И также после ресайза
window.addEventListener('resize', function() {
  setTimeout(function() {
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


let archorTime = false;
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    lenis.scrollTo(0);
    lenis.emit();
    lenis.resize();
    lenis.raf(0);
    setTimeout(() => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                archorTime = true;
                setTimeout(() => {
                    archorTime = false;
                }, 1000);
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                let parent = target.parentNode
                console.log(parent)
                if (parent.classList.contains('pin-spacer')) {
                    const previos = parent.previousElementSibling;
                    const height = previos.clientHeight;
                    lenis.scrollTo(previos.offsetTop + height, { lerp: 0.1, duration: 2.5 });
                } else {
                    lenis.scrollTo(target, { lerp: 0.1, duration: 2.5 });
                }
            });
        });
    }, 500);
});
window.addEventListener("resize load", () => controller.update(true));
window.addEventListener("hashchange", () => {
    ScrollTrigger.refresh();
});





$('.services-frame .item').on('click', function (e) {
  $('.services-frame .item').not(this).removeClass('open')
  setTimeout(() => {
    $(this).addClass('open')
  }, 200);
})
$('.faq-frame .item').on('click', function (e) {
  $('.faq-frame .item').not(this).removeClass('open')
  setTimeout(() => {
    $(this).addClass('open')
  }, 200);
})









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
          start: "top 80%",     // начало анимации
          end: "bottom 20%",    // конец анимации
          scrub: true,          // плавная привязка к скроллу
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

const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// фоновая сетка точек
const spacing = 48;
const dots = [];
for(let y=spacing/2; y<h; y+=spacing){
  for(let x=spacing/2; x<w; x+=spacing){
    dots.push({x, y, r:2, targetR:2, opacity:0.5, targetOpacity:0.5});
  }
}

// курсор
const cursor = {x:w/2, y:h/2, tx:w/2, ty:h/2, vx:0, vy:0, speed:0};

window.addEventListener('mousemove', e=>{
  cursor.tx = e.clientX;
  cursor.ty = e.clientY;
});

function draw(){
  ctx.clearRect(0,0,w,h);

  // движение курсора
  let dx = cursor.tx - cursor.x;
  let dy = cursor.ty - cursor.y;
  cursor.vx += dx*0.2;
  cursor.vy += dy*0.2;
  cursor.vx *= 0.7;
  cursor.vy *= 0.7;
  cursor.x += cursor.vx;
  cursor.y += cursor.vy;
  cursor.speed = Math.sqrt(cursor.vx*cursor.vx + cursor.vy*cursor.vy);

  // рисуем точки на фоне
  dots.forEach(dot=>{
    const dist = Math.hypot(dot.x - cursor.x, dot.y - cursor.y);
    if(dist < 120){
      dot.targetR = 1 + (120-dist)/50;
      dot.targetOpacity = 0.5;
    } else {
      dot.targetR = 0.5;
      dot.targetOpacity = 0;
    }
    dot.r += (dot.targetR - dot.r)*0.1;
    dot.opacity += (dot.targetOpacity - dot.opacity)*0.1;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${dot.opacity})`;
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

draw();

window.addEventListener('resize', ()=>{
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});



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
    d += ` C${points[1].x + waveWidth/4} ${points[1].y}, 
           ${points[2].x - waveWidth/6} ${points[2].y}, 
           ${points[2].x} ${points[2].y}`;
    d += ` C${points[2].x + waveWidth/6} ${points[2].y}, 
           ${points[3].x - waveWidth/4} ${points[3].y}, 
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

// Гарантии 

gsap.to('.guarantees-circle', {
  yPercent: -40,
  scale:16,
  ease: 'power1.inOut',
  rotate: 90,
  scrollTrigger: {
    trigger: '.guarantees',
    start: '+=70%',
    end: '+=200%',
    scrub: 1,
    pin: true,
    pinSpacing: true
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
    scrub: 1,
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
        this.content = this.agency.querySelector('.content');
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
        this.agencyRect = this.agency.getBoundingClientRect();
        
        this.init();
    }
    
    init() {
        // Сразу скрываем все изображения
        this.hideAllImages();
        this.setupEventListeners();
        this.startTracking();
    }
    
    setupEventListeners() {
        this.agency.addEventListener('mousemove', (e) => {
            this.updateAgencyRect();
            this.mouse.x = e.clientX - this.agencyRect.left;
            this.mouse.y = e.clientY - this.agencyRect.top;
        });
        
        this.agency.addEventListener('mouseenter', (e) => {
            this.isPaused = false;
            this.updateAgencyRect();
            this.mouse.x = e.clientX - this.agencyRect.left;
            this.mouse.y = e.clientY - this.agencyRect.top;
            this.cacheMouse.x = this.mouse.x;
            this.cacheMouse.y = this.mouse.y;
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
        });
        
        this.agency.addEventListener('mouseleave', () => {
            this.isPaused = true;
            // При выходе СКРЫВАЕМ все элементы
            this.hideAllImages();
        });
        
        this.agency.querySelectorAll('a, button, [data-no-hover]').forEach(el => {
            el.addEventListener('mouseenter', () => this.isPaused = true);
            el.addEventListener('mouseleave', () => this.isPaused = false);
        });
        
        window.addEventListener('resize', () => {
            this.updateAgencyRect();
        });
    }
    
    updateAgencyRect() {
        this.agencyRect = this.agency.getBoundingClientRect();
    }
    
    startTracking() {
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
        if (this.isPaused) return;
        
        this.activeImagesCount++;
        this.isIdle = false;
        
        this.zIndex++;
        this.activeIndex = this.activeIndex < this.images.length - 1 ? this.activeIndex + 1 : 0;
        
        const currentImg = this.images[this.activeIndex];
        const currentInner = this.imgInners[this.activeIndex];
        
        gsap.killTweensOf(currentImg);
        gsap.killTweensOf(currentInner);
        
        const imgRect = currentImg.getBoundingClientRect();
        
        // ВАЖНО: Сбрасываем позицию перед анимацией
        // Устанавливаем начальную позицию прямо под курсором
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
            onComplete: () => this.onImageComplete()
        });
        
        // Анимация начинается ИЗ ТОЧКИ КУРСОРА, а не прыгает
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
        // Полностью скрываем все изображения
        this.images.forEach(img => {
            gsap.killTweensOf(img);
            gsap.set(img, {
                opacity: 0,
                scale: 0.2
            });
        });
        this.activeImagesCount = 0;
        this.isIdle = true;
        this.zIndex = 1;
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
            if (agency.querySelector('.content')) {
                const trail = new AgencyTrail(agency);
                this.agencyTrails.push(trail);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AgencyTrailManager();
});

// Main block


// gsap.to('.circle-hero',{
//   scale: 15,
//   yPercent: -50,
//   xPercent: -70,
//   scrollTrigger: {
//     trigger: '.hero-block',
//     start: 'top top',
//     end: '+=100%',
//     scrub: 1,
//     markers: true
//   }
// })
// gsap.to('.stoke-title',{
//   opacity: 0,
//   scrollTrigger: {
//     trigger: '.hero-block',
//     start: 'top top',
//     end: '+=30%',
//     scrub: 1,
//   }
// })


