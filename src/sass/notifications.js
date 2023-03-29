
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
  loadMore.classList.add('no-visible'); // прибираємо кнопку завантажити ще
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
