/*<-----Ancor Open----->*/

function updateScrollDelayed() {
  gsap.delayedCall(0.35, () => {

    if (typeof lenis !== "undefined") {
      if (typeof lenis.resize === "function") lenis.resize();
      lenis.scrollTo(lenis.scroll, { immediate: true });
    }

    window.dispatchEvent(new Event("resize"));
  });
}

function handleAccordionClick($item) {
  const $siblings = $item.siblings('.item');
  const isAlreadyOpen = $item.hasClass('open');
  $siblings.removeClass('open');
  if (!isAlreadyOpen) {
    $item.addClass('open');
  } else {
    $item.removeClass('open');
  }
  updateScrollDelayed();
}

$('.services-frame .item').on('click', function () {
  handleAccordionClick($(this));
});

$('.faq-frame .item').on('click', function () {
  handleAccordionClick($(this));
});
