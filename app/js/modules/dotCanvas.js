// // /*<-----DotCanvas Animation----->*/

class DotCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.resize();
    this.spacing = 48;
    this.dots = [];
    this.initDots();

    this.cursor = {
      x: this.w / 2,
      y: this.h / 2,
      tx: this.w / 2,
      ty: this.h / 2,
      vx: 0, vy: 0, speed: 0
    };

    this.setupEventListeners();
    this.animate();
  }

  resize() {
    this.w = this.canvas.width = this.canvas.offsetWidth;
    this.h = this.canvas.height = this.canvas.offsetHeight;
  }

  initDots() {
    if (this.w === 0 || this.h === 0) return;
    for (let y = this.spacing / 2; y < this.h; y += this.spacing) {
      for (let x = this.spacing / 2; x < this.w; x += this.spacing) {
        this.dots.push({ x, y, r: 2, targetR: 2, opacity: 0.5, targetOpacity: 0.5 });
      }
    }
  }

  setupEventListeners() {
    this.handleMouseMove = e => {
      const rect = this.canvas.getBoundingClientRect();
      this.cursor.tx = e.clientX - rect.left;
      this.cursor.ty = e.clientY - rect.top;
    };
    this.handleResize = () => {
      this.resize();
      this.dots = [];
      this.initDots();
    };
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    let dx = this.cursor.tx - this.cursor.x;
    let dy = this.cursor.ty - this.cursor.y;
    this.cursor.vx += dx * 0.2;
    this.cursor.vy += dy * 0.2;
    this.cursor.vx *= 0.7;
    this.cursor.vy *= 0.7;
    this.cursor.x += this.cursor.vx;
    this.cursor.y += this.cursor.vy;

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
      this.ctx.fillStyle = `rgba(255,255,255,${dot.opacity})`;
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

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('dotCanvas');
  if (canvas) new DotCanvas(canvas);
});
