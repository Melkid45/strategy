
if (width > 750) {
(function () {
  const DOTS = 10;
  const FOLLOW_SPEED = 0.15;
  const SPEED_THRESHOLD = 1.5;

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    prevX: window.innerWidth / 2,
    prevY: window.innerHeight / 2,
    speed: 0,
    isHovering: false
  };

  const trailRoot = document.getElementById('cursorTrail');
  const cursorDot = document.getElementById('cursorDot');
  const dots = [];

  for (let i = 0; i < DOTS; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-dot tail';
    trailRoot.appendChild(el);
    dots.push({ el, x: pointer.x, y: pointer.y, scale: 1, opacity: 0 });
  }

  function onPointerMove(e) {
    const x = e.clientX || (e.touches && e.touches[0].clientX) || pointer.x;
    const y = e.clientY || (e.touches && e.touches[0].clientY) || pointer.y;

    pointer.speed = Math.hypot(x - pointer.prevX, y - pointer.prevY);
    pointer.prevX = pointer.x;
    pointer.prevY = pointer.y;

    pointer.x = x;
    pointer.y = y;
    checkHoverState(x, y);
  }

  function checkHoverState(x, y) {
    const element = document.elementFromPoint(x, y);
    if (element) {
      const isInteractive =
        element.tagName === 'A' ||
        element.tagName === 'BUTTON' ||
        element.style.cursor === 'pointer' ||
        window.getComputedStyle(element).cursor === 'pointer';
      pointer.isHovering = isInteractive;
    } else {
      pointer.isHovering = false;
    }
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateSpeedDecay() {
    pointer.speed *= 0.85;
    requestAnimationFrame(updateSpeedDecay);
  }
  updateSpeedDecay();

  function animate() {
    const dotScale = lerp(
      parseFloat(cursorDot.dataset.scale || 1),
      pointer.isHovering ? 1.2 : 1,
      0.2
    );
    cursorDot.dataset.scale = dotScale;
    cursorDot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px,0) translate(-50%, -50%) scale(${dotScale})`;

    const fastMove = pointer.speed > SPEED_THRESHOLD;
    for (let i = 0; i < dots.length; i++) {
      const prev = i === 0 ? { x: pointer.x, y: pointer.y } : dots[i - 1];
      const cur = dots[i];

      cur.x = lerp(cur.x, prev.x, FOLLOW_SPEED + i * 0.015);
      cur.y = lerp(cur.y, prev.y, FOLLOW_SPEED + i * 0.015);

      let targetScale = 1;
      if (fastMove) {
        const speedFactor = Math.min(pointer.speed / 25, 1);
        targetScale += speedFactor * (1 - i / dots.length) * 1.6;
      }
      cur.scale = lerp(cur.scale, targetScale, 0.08);
      cur.el.style.transform = `translate3d(${cur.x}px, ${cur.y}px,0) translate(-50%, -50%) scale(${cur.scale})`;

      const targetOpacity = pointer.speed < 0.1 ? 0 : 0.2 * (1 - i / dots.length);
      cur.opacity = lerp(cur.opacity, targetOpacity, 0.1);
      cur.el.style.opacity = cur.opacity.toFixed(2);
    }

    requestAnimationFrame(animate);
  }
    requestAnimationFrame(animate);
})();


}