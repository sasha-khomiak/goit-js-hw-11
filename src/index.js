//---------------MODULES---------------//

import Notiflix from 'notiflix';

//---------------ELEMENTS---------------//

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');

//---------------ФУНКЦІЯ-СЛУХАЧ---------------//

form.addEventListener('submit', handleSubmit);

//---------------ФУНКЦІЯ-ОБРОБНИК ПОШУКУ---------------//

async function handleSubmit(event) {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  console.log(searchQuery.value);

  let promise = await getImagesList(searchQuery.value);

  // promise.then(data => console.log(data));
  const arrayOfResults = promise.hits;
  console.log(arrayOfResults);
  layOut(arrayOfResults);
  noResultsNotification();
}

//---------------ФУНКЦІЯ-ЗАПИТ КАРТИНОК НА СЕРВЕРІ---------------//

async function getImagesList(q) {
  const key = '34781743-09d11a08c8aa729d147b2c9f6';
  const URL = 'https://pixabay.com/api/';

  const response = await fetch(
    `${URL}?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true`
  );

  const data = response.json();
  return data;
}

//---------------ФУНКЦІЯ-ВЕРСТКА РЕЗУЛЬТАТУ---------------//

function layOut(data) {
  let marrkup = data
    .map(
      item =>
        `<div class="photo-card">
  <img src="${item.webformatURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`
    )
    .join('');

  gallery.innerHTML = marrkup;
}

//---------------ФУНКЦІЯ-ПОВІДОМЛЕННЯ ВІДСУТНОСТІ ЗБІГІВ---------------//

function noResultsNotification() {
  Notiflix.Notify.info(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 1000,
    }
  );
}
