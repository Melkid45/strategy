/*<-----Lines Animation---->*/

if (width > 750){
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

}