/*<-----MouseMove Animation----->*/

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
  if (!pupil) return;
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
