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

//---------------ФУНКЦІЇ-СЛУХАЧІ---------------//

form.addEventListener('submit', handleSearch);
loadMore.addEventListener('click', loadMoreImages);

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

  // Якщо запит - порожнє поле, то очищаємо галерею, просимо ввести поле запиту і виходимо з функції
  if (request === '') {
    gallery.innerHTML = '';
    loadMore.classList.add('no-visible');
    page = 1;
    noRequestNotification();
    console.log('порожній запит');
    return;
  }

  // Якщо текст в полі інпут змінився після останнього запиту,
  // то обнуляємо виведені попередні результати, ховаємо кнопку loadMore
  // в змінну tempValue вносимо нове значення пошуку для наступної перевірки
  // номер сторінки скидаємо на 1
  if (request !== tempValue) {
    gallery.innerHTML = '';
    loadMore.classList.add('no-visible');
    tempValue = request;
    page = 1;
  }

  // звернення до асинхронної функції getImagesList
  // передаємо запит і номер сторінки
  //і чекаємо, який прийде результат
  let data = await getImagesList(request, page);

  // витягаємо масив обʼєктів наших картинок
  const arrayOfResults = data.hits;
  console.log(arrayOfResults);
  console.log(data.totalHits);

  // якщо в масиві є обʼєкти картинок, то виводимо їх
  if (arrayOfResults.length > 0) {
    layOut(arrayOfResults);

    lightbox.refresh();
    loadMore.classList.remove('no-visible');
  }

  // якщо масив порожній, то виводимо повідомлення, що збігів не знайдено
  if (arrayOfResults.length === 0) {
    // якщо це перший запит з таким словом виводимо повідомлення, що збігів немає
    if (page === 1) {
      noResultsNotification();
    }

    // якщо це перший запит з таким словом виводимо повідомлення, що всі картинки уже виведені і збігів більше немає
    if (page > 1) {
      endOfPicturesNotification();
      console.log('Збіги закінчилися');
    }
  }

  //збільшуємо номер сторінки
  page += 1;
}

//---------------ФУНКЦІЯ-ЗАВАНТАЖЕННЯ ЩЕ РЕЗУЛЬТАТІВ---------------// !!!!!!!!!

async function loadMoreImages() {
  let data = await getImagesList(tempValue, page);
  // витягаємо масив обʼєктів наших картинок
  const arrayOfResults = data.hits;
  console.log(arrayOfResults);
  console.log(data.totalHits);

  // якщо в масиві є обʼєкти картинок, то виводимо їх
  if (arrayOfResults.length > 0) {
    layOut(arrayOfResults);
    lightbox.refresh();
  }

  // якщо масив порожній, то виводимо повідомлення, що збігів не знайдено
  if (arrayOfResults.length === 0) {
    // якщо це перший запит з таким словом виводимо повідомлення, що збігів немає
    if (page === 1) {
      noResultsNotification();
    }

    // якщо це перший запит з таким словом виводимо повідомлення, що всі картинки уже виведені і збігів більше немає
    if (page > 1) {
      endOfPicturesNotification();
      console.log('Збіги закінчилися');
    }
  }

  //збільшуємо номер сторінки
  page += 1;
}

//---------------ФУНКЦІЯ-ЗАПИТ КАРТИНОК НА СЕРВЕРІ---------------//

async function getImagesList(q, page) {
  const key = '34781743-09d11a08c8aa729d147b2c9f6';
  const URL = 'https://pixabay.com/api/';

  const response = await fetch(
    `${URL}?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3&page=${page}`
  );

  const promice = response.json();
  // console.log('promice', promice);
  return promice;
}

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

function noResultsNotification() {
  Notiflix.Notify.warning(
    'Вибачте, збігів за ващим запитом не виявлено./Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 4000,
    }
  );
}

//---------------ФУНКЦІЯ-ПОВІДОМЛЕННЯ КОЛИ ПУСТИЙ ЗАПИТ НА ПОШУК---------------// !!!!!!!!!!!

function noRequestNotification() {
  Notiflix.Notify.failure('Заповніть поле для пошуку ', {
    timeout: 4000,
  });
}

//---------------ФУНКЦІЯ-ПОВІДОМЛЕННЯ КОЛИ ЗАКІНЧИЛИСЯ КАРТИНКИ---------------//

function endOfPicturesNotification() {
  Notiflix.Notify.info(
    "Більше збігів за запитом немає/ We're sorry, but you've reached the end of search results.",
    {
      timeout: 4000,
    }
  );
}
