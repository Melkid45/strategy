
class PageTransition {
    constructor() {
        this.overlay = document.querySelector('.transition-overlay');
        this.preloader = document.querySelector('.preloader');
        this.init();
    }
    
    init() {
        this.setupBarba();
        this.hidePreloaderOnLoad();
    }
    
    setupBarba() {
        barba.init({
            transitions: [
                {
                    name: 'cover-transition',
                    sync: true,
                    from: {},
                    to: {},
                    leave(data) {
                        return this.coverLeave(data);
                    },
                    enter(data) {
                        return this.coverEnter(data);
                    }
                }
            ]
        });
    }
    
    coverLeave(data) {
        return new Promise((resolve) => {
            const tl = gsap.timeline({
                onComplete: resolve
            });
            
            // Анимация ухода - страница "схлопывается" к центру
            tl.to(data.current.container, {
                scale: 0.8,
                rotationY: 15,
                opacity: 0,
                duration: 1.2,
                ease: "power3.inOut"
            })
            .to(this.overlay, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.inOut"
            }, '-=0.8');
        });
    }
    
    coverEnter(data) {
        return new Promise((resolve) => {
            const tl = gsap.timeline({
                onComplete: resolve
            });
            
            // Начальное состояние новой страницы
            gsap.set(data.next.container, {
                scale: 1.2,
                rotationY: -15,
                opacity: 0
            });
            
            // Анимация входа - страница "разворачивается" из центра
            tl.to(this.overlay, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            })
            .to(data.next.container, {
                scale: 1,
                rotationY: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out"
            }, '-=0.4');
        });
    }
    
    hidePreloaderOnLoad() {
        window.addEventListener('load', () => {
            this.hidePreloader();
        });
        
        // На всякий случай скрываем через 3 секунды
        setTimeout(() => {
            this.hidePreloader();
        }, 3000);
    }
    
    hidePreloader() {
        if (this.preloader) {
            gsap.to(this.preloader, {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    this.preloader.style.display = 'none';
                }
            });
        }
    }
}

// Инициализация
new PageTransition();