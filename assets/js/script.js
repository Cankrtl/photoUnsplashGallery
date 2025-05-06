const accessKey = 'bLWktsxPVSjMVXhhiTfoqMLe9QhihrBnJihprE3HfdY';
const gallery = document.getElementById('gallery');
const favoriteCounter = document.getElementById('favoriteCount');
const favoriteModal = document.getElementById('favoriteModal');
const modalGallery = document.getElementById('modalGallery');
const closeButton = document.querySelector('.close-button');

function getStoredFavorites() {
  const data = localStorage.getItem('favorites');
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorited(id) {
  const favorites = getStoredFavorites();
  return favorites.some(photo => photo.id === id);
}

function addToFavorites(photo) {
  const favorites = getStoredFavorites();
  if (!isFavorited(photo.id)) {
    favorites.push(photo);
    saveFavorites(favorites);
  }
}

function removeFromFavorites(id) {
  let favorites = getStoredFavorites();
  favorites = favorites.filter(photo => photo.id !== id);
  saveFavorites(favorites);
}

function updateFavoriteCounter() {
  const count = getStoredFavorites().length;
  if (count === 0) {
    favoriteCounter.textContent = '❤️ Favori Yok';
  } else {
    favoriteCounter.textContent = `❤️ Favoriler: ${count}`;
  }

  favoriteCounter.classList.add('animate');
  setTimeout(() => favoriteCounter.classList.remove('animate'), 300);
}

function createPhotoCard(photo) {
    const isFav = isFavorited(photo.id);
  const img = document.createElement('img');
  img.src = '/assests/img/loader.gif';
  const card = document.createElement('div');
  card.className = 'photo-card';

  card.innerHTML = `
  <img src="${photo.urls.regular}"/>
  <div class="favorite-click-button">
    <button class="favorite-btn add-btn" title="Favoriye Ekle">➕</button>
    <button class="favorite-btn remove-btn" title="Favoriden Çıkar">❌</button>
  </div>
`;

  const addBtn = card.querySelector('.add-btn');
  const removeBtn = card.querySelector('.remove-btn');

  if (isFav) {
    addBtn.classList.add('show');
    addBtn.classList.remove('hide');
  } else {
    addBtn.classList.add('show');
    addBtn.classList.remove('hide');
  }

  addBtn.addEventListener('click', () => {
    addToFavorites(photo);
    card.remove(); // favoriye eklendiyse sayfadan kaldır
    updateFavoriteCounter();
  });

  removeBtn.addEventListener('click', () => {
    removeFromFavorites(photo.id);
    card.remove(); // favoriden çıkarıldıysa sil
    updateFavoriteCounter();
  });

  return card;
}

async function fetchPhotos() {
  try {
    gallery.innerHTML='<div class="loading">loading...</div>'
    const response = await fetch(`https://api.unsplash.com/photos/random?count=20&client_id=${accessKey}`);
    const photos = await response.json();
    const galleryLoading = document.querySelector('.loading');
    if(photos){
      galleryLoading.remove();
    }
    photos.forEach(photo => {
      const card = createPhotoCard(photo);
      gallery.appendChild(card);
    });
  } catch (error) {
    console.error('Hata:', error);
  }
}

favoriteCounter.addEventListener('click', () => {
  modalGallery.innerHTML = '';
  const favorites = getStoredFavorites();
  favoriteModal.classList.add('show');
  if (favorites.length === 0) {
    modalGallery.innerHTML='<div class="modal-empty-photo">Henüz favori fotoğraf yok.</div>';
    return;
  }

  favorites.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'photo-card';

    card.innerHTML = `
      <img src="${photo.urls.regular}" />
      <div class="modal-favorite-click-button">
        <button class="favorite-btn remove-btn" title="Favoriden Çıkar">❌</button>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
      removeFromFavorites(photo.id);
      card.remove();
      updateFavoriteCounter();
    });

    modalGallery.appendChild(card);
  });
});

closeButton.addEventListener('click', () => {
  favoriteModal.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === favoriteModal) {
    favoriteModal.classList.remove('show');
  }
});

fetchPhotos();
updateFavoriteCounter();
