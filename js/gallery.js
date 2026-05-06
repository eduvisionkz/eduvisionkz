// gallery.js
let currentCat = 'all';

const galleryEl = document.getElementById('gallery');

const CAT_LABELS = {
  kz: { all:'Барлығы', reading:'Оқу', creative:'Шығармашылық', technology:'Технология', results:'Нәтиже' },
  ru: { all:'Все',     reading:'Чтение', creative:'Творчество',  technology:'Технологии',  results:'Результаты' }
};

const UI = {
  kz: { title:'Галерея', desc:'Оқушылардың жұмыстары, видео және фото материалдар' },
  ru: { title:'Галерея', desc:'Работы учеников, видео и фото материалы' }
};

function renderGallery() {
  const lang = window.currentLang || 'kz';
  galleryEl.innerHTML = '';

  if (!window.MEDIA || !window.MEDIA.length) {
    galleryEl.innerHTML = '<div class="empty-state"><p>Медиа жүктелмеді.</p></div>';
    return;
  }

  const items = currentCat === 'all'
    ? window.MEDIA
    : window.MEDIA.filter(m => m.category === currentCat);

  if (!items.length) {
    galleryEl.innerHTML = '<div class="empty-state"><p>Бұл бөлімде материал жоқ.</p></div>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'media-card';
    const label = (CAT_LABELS[lang] || CAT_LABELS.kz)[item.category] || item.category;

    if (item.type === 'image') {
      card.innerHTML = `
        <img src="${item.src}" alt="${label}" loading="lazy"
             onerror="this.closest('.media-card').style.display='none'"
             onclick="openModal('${item.src}','image')">
        <div class="media-info"><span class="media-cat">${label}</span></div>`;
    } else {
      card.innerHTML = `
        <video controls preload="metadata"
               onerror="this.closest('.media-card').style.display='none'">
          <source src="${item.src}" type="video/mp4">
        </video>
        <div class="media-info"><span class="media-cat">${label}</span></div>`;
    }
    galleryEl.appendChild(card);
  });
}

function updateUI() {
  const lang = window.currentLang || 'kz';
  const L = UI[lang];
  document.getElementById('galleryTitle').textContent = L.title;
  document.getElementById('galleryDesc').textContent  = L.desc;

  document.querySelectorAll('[data-cat]').forEach(btn => {
    const key = btn.dataset.cat;
    btn.textContent = (CAT_LABELS[lang]||CAT_LABELS.kz)[key] || key;
    btn.classList.toggle('active', key === currentCat);
  });

  renderGallery();
}

document.getElementById('galleryFilters').addEventListener('click', e => {
  const btn = e.target.closest('[data-cat]');
  if (!btn) return;
  currentCat = btn.dataset.cat;
  updateUI();
});

function openModal(src, type) {
  const modal = document.getElementById('modal');
  // Remove old media
  modal.querySelectorAll('img,video').forEach(el => el.remove());
  const el = type === 'image'
    ? Object.assign(document.createElement('img'), { src, alt: 'Фото' })
    : Object.assign(document.createElement('video'), { src, controls: true, autoplay: true });
  modal.appendChild(el);
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
  modal.querySelectorAll('img,video').forEach(el => el.remove());
}

window.onLangChange = updateUI;
updateUI();
