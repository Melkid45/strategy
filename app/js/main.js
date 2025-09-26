$('.services-frame .item').on('click', function(e){
    $('.services-frame .item').not(this).removeClass('open')
    setTimeout(() => {
        $(this).addClass('open')
    }, 200);
})
$('.faq-frame .item').on('click', function(e){
    $('.faq-frame .item').not(this).removeClass('open')
    setTimeout(() => {
        $(this).addClass('open')
    }, 200);
})

// lenis

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf);



gsap.set('.feedback-form, .guarantees-section', {
    yPercent: -85,
    scale: 0.3,
    xPercent: -35
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

// const canvas = document.getElementById('dotCanvas');
// const ctx = canvas.getContext('2d');

// let w = canvas.width = window.innerWidth;
// let h = canvas.height = window.innerHeight;

// // фоновая сетка точек
// const spacing = 50;
// const dots = [];
// for(let y=spacing/2; y<h; y+=spacing){
//   for(let x=spacing/2; x<w; x+=spacing){
//     dots.push({x, y, r:2, targetR:2, opacity:0.5, targetOpacity:0.5});
//   }
// }

// // курсор
// const cursor = {x:w/2, y:h/2, tx:w/2, ty:h/2, vx:0, vy:0, speed:0};

// window.addEventListener('mousemove', e=>{
//   cursor.tx = e.clientX;
//   cursor.ty = e.clientY;
// });

// function draw(){
//   ctx.clearRect(0,0,w,h);

//   // движение курсора
//   let dx = cursor.tx - cursor.x;
//   let dy = cursor.ty - cursor.y;
//   cursor.vx += dx*0.2;
//   cursor.vy += dy*0.2;
//   cursor.vx *= 0.7;
//   cursor.vy *= 0.7;
//   cursor.x += cursor.vx;
//   cursor.y += cursor.vy;
//   cursor.speed = Math.sqrt(cursor.vx*cursor.vx + cursor.vy*cursor.vy);

//   // рисуем точки на фоне
//   dots.forEach(dot=>{
//     const dist = Math.hypot(dot.x - cursor.x, dot.y - cursor.y);
//     if(dist < 120){
//       dot.targetR = 1 + (120-dist)/50;
//       dot.targetOpacity = 1;
//     } else {
//       dot.targetR = 0.5;
//       dot.targetOpacity = 0;
//     }
//     dot.r += (dot.targetR - dot.r)*0.1;
//     dot.opacity += (dot.targetOpacity - dot.opacity)*0.1;

//     ctx.beginPath();
//     ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI*2);
//     ctx.fillStyle = `rgba(255,255,255,${dot.opacity})`;
//     ctx.fill();
//   });

//   requestAnimationFrame(draw);
// }

// draw();

// window.addEventListener('resize', ()=>{
//   w = canvas.width = window.innerWidth;
//   h = canvas.height = window.innerHeight;
// });