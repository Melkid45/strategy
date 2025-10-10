/*<------Text Area----->*/


function autoResize(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  updateScrollDelayed()
}

const textarea = document.querySelector('textarea');

autoResize(textarea);
if (textarea) {
  textarea.addEventListener('input', () => autoResize(textarea));
}