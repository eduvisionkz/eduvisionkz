// nav.js — shared navigation + language logic
(function () {
  const NAV_HTML = `
  <nav class="nav">
    <a class="nav-brand" href="index.html">
      <div class="nav-brand-icon">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <span class="nav-brand-name">EduVision KZ</span>
    </a>
    <div class="nav-links">
      <a href="index.html"        data-nav="index">Басты бет</a>
      <a href="stories.html"      data-nav="stories">Мәтіндер</a>
      <a href="instructions.html" data-nav="instructions">Нұсқаулық</a>
      <a href="gallery.html"      data-nav="gallery">Галерея</a>
      <a href="teacher.html"      data-nav="teacher">Мұғалім</a>
    </div>
    <div class="nav-right">
      <div class="lang-toggle">
        <button class="lang-btn" data-lang="kz">ҚАЗ</button>
        <button class="lang-btn" data-lang="ru">РУС</button>
      </div>
    </div>
  </nav>`;

  // Inject nav
  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) placeholder.outerHTML = NAV_HTML;
  else document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // Mark active link
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.dataset.nav === page) a.classList.add('active');
  });

  // Language
  window.currentLang = localStorage.getItem('lang') || 'kz';

  function applyLang(lang) {
    window.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.querySelectorAll('.lang-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang));
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (btn && btn.dataset.lang) applyLang(btn.dataset.lang);
  });

  applyLang(window.currentLang);
})();
