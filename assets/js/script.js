const unsplashApiKey = 'bLWktsxPVSjMVXhhiTfoqMLe9QhihrBnJihprE3HfdY';
const photoGalleryContainer = document.getElementById('gallery');

async function fetchRandomPhotos() {
  const response = await fetch(`https://api.unsplash.com/photos/random?count=10&client_id=${unsplashApiKey}`);
  const photoList = await response.json();

  photoList.forEach(photoData => {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';

    const isPhotoFavorite = checkIfPhotoIsFavorite(photoData.id);
    const buttonLabel = isPhotoFavorite ? 'Favoriden Çıkar' : 'Favoriye Ekle';
    const buttonClassName = isPhotoFavorite ? 'favorite-btn favorited' : 'favorite-btn';

    photoCard.innerHTML = `
      <img src="${photoData.urls.regular}">
      <div class="info">  
        <button class="${buttonClassName}" data-id="${photoData.id}">${buttonLabel}</button>
      </div>
    `;

    photoCard.querySelector('button').addEventListener('click', () => {
      if (checkIfPhotoIsFavorite(photoData.id)) {
        removePhotoFromFavorites(photoData.id);
      } else {
        addPhotoToFavorites(photoData);
      }
      location.reload();
    });

    photoGalleryContainer.appendChild(photoCard);
  });
}

function getSavedFavorites() {
  const storedFavorites = localStorage.getItem('favorites');
  return storedFavorites ? JSON.parse(storedFavorites) : [];
}

function addPhotoToFavorites(photoObject) {
  const favoritesArray = getSavedFavorites();
  favoritesArray.push(photoObject);
  localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}

function removePhotoFromFavorites(photoId) {
  let favoritesArray = getSavedFavorites();
  favoritesArray = favoritesArray.filter(photo => photo.id !== photoId);
  localStorage.setItem('favorites', JSON.stringify(favoritesArray));
}

function checkIfPhotoIsFavorite(photoId) {
  const favoritesArray = getSavedFavorites();
  return favoritesArray.some(photo => photo.id === photoId);
}

function renderSavedFavorites() {
  const favoritesArray = getSavedFavorites();

  favoritesArray.forEach(photoData => {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';

    photoCard.innerHTML = `
      <img src="${photoData.urls.regular}">
      <div class="info">
        <button class="favorite-btn favorited" data-id="${photoData.id}">Favoriden Çıkar</button>
      </div>
    `;

    photoCard.querySelector('button').addEventListener('click', () => {
      removePhotoFromFavorites(photoData.id);
      location.reload();
    });

    photoGalleryContainer.appendChild(photoCard);
  });
}

fetchRandomPhotos();
renderSavedFavorites();
