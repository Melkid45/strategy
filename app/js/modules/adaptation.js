let width = $(window).width()

if (width < 750){
    $('.desk').remove()
}else{
    $('.mob').remove()
}

let currentWidth = window.innerWidth;

window.addEventListener('resize', function() {
    if (window.innerWidth !== currentWidth) {
        currentWidth = window.innerWidth;
        location.reload();
    }
});