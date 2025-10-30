/*<-------Ancor Indicator------>*/



function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= window.innerHeight * 0.6 &&
    rect.bottom >= window.innerHeight * 0.4
  );
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar .ancor-item');
  const homeLink = document.querySelector('.home-btn');
  
  if (window.scrollY < 50) {
    navLinks.forEach(link => link.parentElement.classList.remove('current'));
    if (homeLink) homeLink.parentElement.classList.add('current');
    return;
  }
  
  let foundActive = false;
  
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (isElementInViewport(section)) {
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector(`.navbar .ancor-item[href="#${sectionId}"]`);
      
      navLinks.forEach(link => link.parentElement.classList.remove('current'));
      
      if (correspondingLink) {
        correspondingLink.parentElement.classList.add('current');
        homeLink.parentElement.classList.remove('current')
        foundActive = true;
      }
      break;
    }
  }
  
}

document.addEventListener('DOMContentLoaded', function() {
  updateActiveNav();
});

if (typeof lenis !== 'undefined' && width > 750) {
  lenis.on('scroll', updateActiveNav);
}

window.addEventListener('resize', updateActiveNav);