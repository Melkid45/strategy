class DotGrid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.mouse = { x: 0, y: 0, active: false };
    this.spacing = 36;
    this.baseR = 1.2;
    this.maxR = 2.8;

    this.resize();
    this.createDots();
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener("mousemove", e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.active = true;
    });

    window.addEventListener("mouseleave", () => this.mouse.active = false);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * dpr;
    this.canvas.height = this.canvas.offsetHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createDots() {
    this.dots = [];

    const width = this.canvas.offsetWidth;
    const height = this.canvas.offsetHeight;

    const offset = this.spacing / 2;

    for (let x = offset; x < width - offset; x += this.spacing) {
      for (let y = offset; y < height - offset; y += this.spacing) {
        this.dots.push({
          x,
          y,
          r: this.baseR,
          opacity: 0
        });
      }
    }
  }


  animate() {
    this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

    const rect = this.canvas.getBoundingClientRect();
    const influence = 110;

    for (const dot of this.dots) {
      const dx = this.mouse.x - (rect.left + dot.x);
      const dy = this.mouse.y - (rect.top + dot.y);
      const dist = Math.hypot(dx, dy);
      const minOpacity = 0;

      if (dist < influence && this.mouse.active) {
        dot.r = this.baseR + (this.maxR - this.baseR) * (1 - dist / influence);
        dot.opacity += (0.2 - dot.opacity) * 0.15;
      } else {
        dot.r += (this.baseR - dot.r) * 0.1;
        dot.opacity += (minOpacity - dot.opacity) * 0.08;
      }

      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(143,145,154,${dot.opacity})`;
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 750) {
    document.querySelectorAll(".dot-canvas").forEach(c => new DotGrid(c));
  }
});
