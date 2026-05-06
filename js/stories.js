// stories.js
let currentCategory = 'all';

const grid       = document.getElementById('storiesGrid');
const searchInput= document.getElementById('searchInput');

const UI = {
  kz: {
    pageTitle: 'Мәтіндер жинағы',
    pageDesc:  'Ертегі, притча және өсиеттер — оқушыға арналған',
    catAll:    'Барлығы',
    catStory:  'Ертегі / Әңгіме',
    catParable:'Притча',
    catWisdom: 'Өсиет',
    author:    'Автор',
    grade:     'Сынып',
    read:      'Оқу',
    notFound:  'Мәтін табылмады.'
  },
  ru: {
    pageTitle: 'Сборник текстов',
    pageDesc:  'Сказки, притчи и назидания — для учеников',
    catAll:    'Все',
    catStory:  'Сказки / Рассказы',
    catParable:'Притчи',
    catWisdom: 'Назидания',
    author:    'Автор',
    grade:     'Класс',
    read:      'Читать',
    notFound:  'Тексты не найдены.'
  }
};

const CAT_KEYS = { all:'catAll', story:'catStory', parable:'catParable', wisdom:'catWisdom' };

const BADGE_CLASS = { story:'', parable:'badge-parable', wisdom:'badge-wisdom' };

function unique(arr) {
  const seen = new Set();
  return arr.filter(i => seen.has(i.id) ? false : seen.add(i.id));
}

function getStories() {
  return unique(window.STORIES || []);
}

function renderCards(items) {
  grid.innerHTML = '';
  const lang = window.currentLang || 'kz';
  const L = UI[lang];

  if (!items.length) {
    grid.innerHTML = `<div class="empty-state"><p>${L.notFound}</p></div>`;
    return;
  }

  items.forEach(item => {
    const title  = item.title?.[lang]  || item.title?.ru  || '';
    const type   = item.type?.[lang]   || item.type?.ru   || '';
    const theme  = item.theme?.[lang]  || item.theme?.ru  || '';
    const author = item.author || '';
    const grade  = item.grade  || '';
    const bclass = BADGE_CLASS[item.category] || '';

    const card = document.createElement('article');
    card.className = 'story-card';
    card.innerHTML = `
      <span class="story-badge ${bclass}">${type}</span>
      <h3>${title}</h3>
      <div class="meta">
        <span>${L.author}: <strong>${author}</strong></span>
        <span>${L.grade}: <strong>${grade}</strong></span>
      </div>
      <p class="theme">${theme}</p>
      <a class="btn btn-ghost btn-sm" href="story.html?id=${encodeURIComponent(item.id)}">${L.read} →</a>
    `;
    grid.appendChild(card);
  });
}

function applyFilters() {
  const lang = window.currentLang || 'kz';
  const q = (searchInput?.value || '').trim().toLowerCase();
  let data = getStories();

  if (currentCategory !== 'all')
    data = data.filter(i => i.category === currentCategory);

  if (q)
    data = data.filter(i => {
      const title = (i.title?.[lang] || i.title?.ru || '').toLowerCase();
      const theme = (i.theme?.[lang] || i.theme?.ru || '').toLowerCase();
      return title.includes(q) || theme.includes(q);
    });

  renderCards(data);
}

function updateUI() {
  const lang = window.currentLang || 'kz';
  const L = UI[lang];

  const titleEl = document.getElementById('pageTitle');
  const descEl  = document.getElementById('pageDesc');
  if (titleEl) titleEl.textContent = L.pageTitle;
  if (descEl)  descEl.textContent  = L.pageDesc;

  if (searchInput) searchInput.placeholder = lang === 'kz' ? 'Іздеу...' : 'Поиск...';

  document.querySelectorAll('[data-category]').forEach(btn => {
    const key = CAT_KEYS[btn.dataset.category];
    if (key) btn.textContent = L[key];
    btn.classList.toggle('active', btn.dataset.category === currentCategory);
  });

  applyFilters();
}

// Category buttons
document.getElementById('catFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('[data-category]');
  if (!btn) return;
  currentCategory = btn.dataset.category;
  updateUI();
});

// Search
searchInput?.addEventListener('input', applyFilters);

// Language hook from nav.js
window.onLangChange = updateUI;

// Init
updateUI();
