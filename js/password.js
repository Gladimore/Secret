const form = document.querySelector('form');
const keyInput = document.getElementById('key')

function onSubmit(e) {
  e.preventDefault();

  const key = keyInput.value;
  window.location.href = `./key.html?key=${key}`;
}

form.addEventListener('submit', onSubmit)