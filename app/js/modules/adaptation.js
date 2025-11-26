let width = $(window).width()

if (width <= 750){
    $('.desk').remove()
}else{
    $('.mob').remove()
}


let resizeTimeout;
let initialWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if (Math.abs(window.innerWidth - initialWidth) > 10) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      window.location.reload();
      ScrollTrigger.refresh();
    }, 300);
  }
});
