//---------------MODULES---------------//

// модуль сповіщень Notiflix
import Notiflix from 'notiflix';

// модуль перегляду великої картинки
import SimpleLightbox from 'simplelightbox';

// Додатковий імпорт стилів для модуля перегляду великих картинок
import 'simplelightbox/dist/simple-lightbox.min.css';

//---------------НАЛАШТУВАННЯ МОДУЛЯ ПЕРЕГЛЯДУ ВЕЛИКИХ КАРТИНОК---------------//

var lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  // captionsData: 'alt',
  // captionPosition: 'bottom',
  // captionDelay: 250,
});

//---------------ELEMENTS---------------//

const form = document.querySelector('#search-form'); // форма
const gallery = document.querySelector('.gallery'); // галерея
const loadMore = document.querySelector('.load-more'); // кнопка

// змінна в якій тримаємо значення останнього пошукового значення
let tempValue = '';

// змінна в якій зберігаємо номер запиту наступної стоірнки
let page = 1;

// додаткова змінна знадобиться для безкінечного скролу
// коли закінчуються картинки, то всеодно відбувається повідомлення, що картинки закінчились
// тільки но картинки за запитом закінчуються  робимо цю змінну тру
// і при першому ж новому запиті знову добимо фолс
let secondRequestOutofData = false;

//---------------ФУНКЦІЇ-СЛУХАЧІ---------------//

form.addEventListener('submit', handleSearch);
loadMore.addEventListener('click', loadImages);

//---------------ФУНКЦІЯ-ОБРОБНИК ПОШУКУ (SUBMIT ФОРМИ)---------------//

async function handleSearch(event) {
  // відміняємо дії за замовчанням, щоб не перезавантажилась сторінка
  event.preventDefault();

  // деструктуризуємо отриманий івент на карент.таргет
  const {
    elements: { searchQuery },
  } = event.currentTarget;

  // отримуємо значення введеного в поле пошуку тексту відкинувши пробіли напочатку і вкінці
  let request = searchQuery.value.trim();

  // Якщо запит - порожнє поле, то очищаємо галерею, прибираємо кнопку loadMore,
  // скидаємо сторінку на 1, просимо ввести поле запиту і виходимо з функції
  if (request === '') {
    gallery.innerHTML = '';
    loadMore.classList.add('is-hidden');
    page = 1;
    secondRequestOutofData = false;
    noRequestNotification();
    console.log('порожній запит');
    return;
  }

  // Якщо текст в полі інпут змінився після останнього запиту,
  // то обнуляємо виведені попередні результати, ховаємо кнопку loadMore
  // в змінну tempValue вносимо нове значення пошуку для наступної перевірки
  // при повторному натисканні кнопки шукати
  // номер сторінки скидаємо на 1
  if (request !== tempValue) {
    gallery.innerHTML = '';
    loadMore.classList.add('is-hidden');
    tempValue = request;
    page = 1;
    secondRequestOutofData = false;
  }

  // тепер коли пройшли перевірки на пустий запит і нозве значення запиту
  // можемо завантажувати картинки
  loadImages();
}

//---------------ФУНКЦІЯ-ЗАВАНТАЖЕННЯ РЕЗУЛЬТАТІВ---------------// !!!!!!!!!

async function loadImages() {
  // звернення до асинхронної функції getImagesList
  // передаємо запит і номер сторінки
  //і чекаємо, який прийде результат
  let data = await getImagesList(tempValue, page);
  console.log(data);
  // витягаємо масив обʼєктів наших картинок
  const arrayOfResults = data.hits;

  // const arrayOfResults = await getImagesList(tempValue, page);

  console.log(arrayOfResults);
  console.log(data.totalHits);

  // якщо в масиві є обʼєкти картинок, то виводимо їх
  if (arrayOfResults.length > 0) {
    layOut(arrayOfResults);

    lightbox.refresh();
    loadMore.classList.remove('is-hidden');

    if (page === 1) {
      numberOfResultsNotification(data.totalHits);
    }

    page += 1;
  }

  // якщо масив порожній, то виводимо повідомлення, що збігів не знайдено
  if (arrayOfResults.length === 0) {
    // якщо це перший запит з таким словом виводимо повідомлення, що збігів взагалі немає
    if (page === 1) {
      noResultsNotification();
    }

    // якщо це перший запит з таким словом виводимо повідомлення, що всі картинки уже виведені і збігів уже більше немає
    if (page > 1 && secondRequestOutofData === false) {
      endOfPicturesNotification();
      console.log('Збіги закінчилися');
      secondRequestOutofData = true;
    }
  }

  //збільшуємо номер сторінки
}

//---------------ФУНКЦІЯ-ЗАПИТ КАРТИНОК НА СЕРВЕРІ---------------//

import getImagesList from './get-images-request';

//---------------ФУНКЦІЯ-ВЕРСТКА РЕЗУЛЬТАТУ---------------//

 function layOut(data) {
  let marrkup = data
    .map(
      item =>
        `<div class="photo-card">
              <a href="${item.largeImageURL}">      
              <div class="thumb">  
              <img
                src="${item.webformatURL}"
                alt=" ${item.webformatURL}"
                loading="lazy"
                />
                </div>
              </a>
              <div class="info">
                <p class="info-item"><b>Likes</b><br> ${item.likes}</p>
                <p class="info-item"><b>Views</b><br> ${item.views}</p>
                <p class="info-item"><b>Comments</b><br> ${item.comments}</p>
                <p class="info-item"><b>Downloads</b><br> ${item.downloads}</p>
              </div>
            </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', marrkup);
}

//---------------ФУНКЦІЯ-ПОВІДОМЛЕННЯ ВІДСУТНОСТІ ЗБІГІВ ЗА ЗАПИТОМ---------------//
// жовта
function noResultsNotification() {
  Notiflix.Notify.warning(
    'Вибачте, збігів за ващим запитом не виявлено./Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 4000,
    }
  );
}

//---------------ФУНКЦІЯ-ПОВІДОМЛЕННЯ КОЛИ ПУСТИЙ ЗАПИТ НА ПОШУК---------------// моя ініціатива
// червона

function noRequestNotification() {
  Notiflix.Notify.failure('Заповніть поле для пошуку ', {
    timeout: 4000,
  });
}

//---------------ФУНКЦІЯ-ПОВІДОМЛЕННЯ КОЛИ ЗАКІНЧИЛИСЯ КАРТИНКИ---------------//
// синя
function endOfPicturesNotification() {
  loadMore.classList.add('is-hidden'); // прибираємо кнопку завантажити ще
  Notiflix.Notify.info(
    "Більше збігів за запитом немає/ We're sorry, but you've reached the end of search results.",
    {
      timeout: 4000,
    }
  );
}

//---------------ФУНКЦІЯ-ПОВІДОМЛЕННЯ ПРИ ПЕРШОМУ ЗАПИТІ---------------//
// синя
function numberOfResultsNotification(quantity) {
  Notiflix.Notify.info(
    `Ми знайшли ${quantity} зображень. / Hooray! We found ${quantity} images.`,
    {
      timeout: 4000,
    }
  );
}

//---------------------------------------
// ЩОСЬ ВЗАГАДІ НЕ ЗРОЗУМІВ ЩО ЦЕЙ ФУНКЦІОНАЛ МАЄ РОБИТИ

//Прокручування сторінки
// Зробити плавне прокручування сторінки після запиту і відтворення кожної
// наступної групи зображень.Ось тобі код - підказка, але розберися у ньому самостійно.

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

//---------------БЕЗКІНЕЧНИЙ СКРОЛЛ---------------//
// https://youtu.be/CpIa7EdfW0g

// підключаю виклик функції тільки через 300 мс після закінчення скролу,
// а то функція без нього викликається по кілька разів
import debounce from 'lodash.debounce';
// затримка 300 мс
const DEBOUNCE_DELAY = 300;

//функція-слухач скролу
window.addEventListener(
  'scroll',
  debounce(() => {
    //змінна зберігає координати нашого документа, які потрапили у вйю-порт
    const documentRect = document.documentElement.getBoundingClientRect();
    // за двісті пікселів до кінця нашого документа викличемо ф-ію загрузки картинок
    if (documentRect.bottom < document.documentElement.clientHeight + 200) {
      loadImages();
    }
  }, DEBOUNCE_DELAY)
);
