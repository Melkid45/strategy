/*<-----Feedback----->*/
document.addEventListener('DOMContentLoaded', function () {
  const fileWrap = document.querySelector('.file-wrap');
  if (!fileWrap) return;
  const fileInput = fileWrap.querySelector('input[type="file"]');
  const clearBtn = fileWrap.querySelector('.clear-file');
  const fileName = fileWrap.querySelector('.file-name');

  fileInput.addEventListener('change', function () {
    if (this.files && this.files.length > 0) {
      fileWrap.classList.add('has-file');
      fileName.textContent = this.files[0].name;
    } else {
      fileWrap.classList.remove('has-file');
      fileName.textContent = 'Прикрепить файл';
    }
  });

  clearBtn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    fileInput.value = '';

    fileWrap.classList.remove('has-file');
    fileName.textContent = 'Прикрепить файл';
  });

});

$('.wrap-answer .item').on('click', function (e) {
  let text = $(this).text()
  $('#custom-select').val(text)
})


let col = 0;
$('.form-action button').on('click', function (e) {
  let $items = document.querySelectorAll('.input-wrap input, .input-wrap textarea')
  $items.forEach(($element, index) => {
    if ($element.value === '') {
      $element.classList.add('error')
      $element.classList.remove('has-val')
    } else {
      col++
      $element.classList.remove('error')
      $element.classList.add('has-val')
    }
  })

})