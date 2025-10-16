document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.querySelector('.preloader');
    const progressLine = document.querySelector('.line span');
    const procentElement = document.querySelector('.procent');
    
    let progress = 0;
    
    const resources = window.performance.getEntriesByType('resource');
    const totalResources = resources.length;
    let loadedResources = 0;
    
    function updateProgress() {
        loadedResources++;
        progress = Math.min(70, (loadedResources / totalResources) * 70); // Макс 70% для ресурсов
        
        progressLine.style.width = progress + '%';
        procentElement.textContent = Math.round(progress) + '%';
    }
    
    // Отслеживаем загрузку изображений
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            updateProgress();
        } else {
            img.addEventListener('load', updateProgress);
            img.addEventListener('error', updateProgress);
        }
    });
    
    // Базовый прогресс при DOM ready
    progress = 30;
    progressLine.style.width = progress + '%';
    procentElement.textContent = Math.round(progress) + '%';
    
    // Когда все загружено
    window.addEventListener('load', function() {
        progress = 100;
        progressLine.style.width = progress + '%';
        procentElement.textContent = Math.round(progress) + '%';
        
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => preloader.style.display = 'none', 500);
        }, 500);
    });
    
    // На всякий случай скрываем через 4 секунды
    setTimeout(function() {
        if (preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }, 4000);
});