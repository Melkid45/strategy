let width = $(window).width()

if (width < 750){
    $('.desk').remove()
}else{
    $('.mob').remove()
}


function isAppleDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isAndroidDevice() {
  return /Android/.test(navigator.userAgent);
}


if (isAppleDevice()) {
    document.querySelector('.menu-scrolling').style.bottom = '0rem';
} else if (isAndroidDevice()) {
    document.querySelector('.menu-scrolling').style.bottom = '20rem';
}