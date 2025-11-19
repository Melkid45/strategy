const preloader = document.querySelector('.preloader');
const progressLine = document.querySelector('.line span');
const procentElement = document.querySelector('.procent');

let progress = 0;
const targetProgress = 100;
const duration = IsDestop ? 3000 : 5000;
const interval = 30;
const increment = (targetProgress / duration) * interval;

const progressInterval = setInterval(() => {
    progress += increment;

    const currentProgress = Math.min(progress, targetProgress);
    progressLine.style.width = currentProgress + '%';
    procentElement.textContent = Math.round(currentProgress) + '%';

    if (document.readyState === 'complete') {
        progress = Math.max(progress, 0);
    }

    if (currentProgress >= targetProgress) {
        clearInterval(progressInterval);

        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }
}, interval);

function hidePreloader() {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
}

setTimeout(hidePreloader, 5000);