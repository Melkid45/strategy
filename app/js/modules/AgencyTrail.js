/*<-----Agency Trail----->*/


class AgencyTrail {
  constructor(agencyElement) {
    this.agency = agencyElement;
    this.animationContainer = this.agency.querySelector('.wrap-agency-animation');

    if (!this.animationContainer) {
      this.isValid = false;
      return;
    }

    this.isValid = true;
    this.content = this.animationContainer.querySelector('.content');

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

      if (this.hideAnimation) {
        this.hideAnimation.kill();
        this.hideAnimation = null;
      }
    });

    this.animationContainer.addEventListener('mouseleave', (e) => {
      if (!this.isCursorInAnimationContainer(e)) {
        this.isPaused = true;
        this.hideAllImagesSmoothly();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isPaused) return;

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

  }

  isCursorInAnimationContainer(e) {
    const rect = this.animationContainer.getBoundingClientRect();
    const buffer = 2;

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
    const tick = () => {
      if (!this.isPaused && document.visibilityState === 'visible') {
        this.cacheMouse.x = this.lerp(this.cacheMouse.x, this.mouse.x, 0.1);
        this.cacheMouse.y = this.lerp(this.cacheMouse.y, this.mouse.y, 0.1);
        this.checkDistanceAndSpawn();
      }
      this.raf = requestAnimationFrame(tick);
    };

    this.raf = requestAnimationFrame(tick);

    document.addEventListener('visibilitychange', () => {
      this.isPaused = document.visibilityState !== 'visible';
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

    if (this.activeAnimations.has(currentImg)) {
      this.activeAnimations.get(currentImg).kill();
    }

    const imgRect = currentImg.getBoundingClientRect();

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

    this.images.forEach(img => {
      gsap.set(img, {
        opacity: 0,
        scale: 0.2
      });
    });

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

    this.activeAnimations.forEach((animation, img) => {
      animation.kill();
    });
    this.activeAnimations.clear();

    if (this.hideAnimation) {
      this.hideAnimation.kill();
    }

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

      this.hideAnimation.to(img, {
        duration: 0.3,
        ease: "power2.out",
        opacity: 0,
        scale: currentScale * 0.5,
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
  if (window.innerWidth > 1100) {
    new AgencyTrailManager();
  }
});