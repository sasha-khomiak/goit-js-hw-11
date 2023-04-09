//---------------ФУНКЦІЯ-ЗАПИТ КАРТИНОК НА СЕРВЕРІ КЛАСИЧНИЙ ГЕТ---------------//

// export default async function getImagesList(q, page) {
//   const key = '34781743-09d11a08c8aa729d147b2c9f6';
//   const URL = 'https://pixabay.com/api/';

//   const response = await fetch(
//     `${URL}?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
//   );

//   const promice = response.json();
//   console.log('promice', promice);
//   return promice;
// }

//---------------ФУНКЦІЯ-ЗАПИТ КАРТИНОК НА СЕРВЕРІ VER 2 НЕПРАЦЮЄ---------------//

// підключаємо бібліотеку
import axios from 'axios';

export default async function getImagesList(q, page) {
  const key = '34781743-09d11a08c8aa729d147b2c9f6';
  const URL = 'https://pixabay.com/api/';
  const response = await axios.get(
    `${URL}?key=${key}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );

  console.log(response.data);
  return response.data;
}
