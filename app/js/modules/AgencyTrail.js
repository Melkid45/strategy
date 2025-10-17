/*<-----Agency Trail----->*/


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
  if (width > 750) {
    new AgencyTrailManager();
  }
});