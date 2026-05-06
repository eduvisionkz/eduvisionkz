// story.js
const params  = new URLSearchParams(location.search);
const storyId = params.get('id');

const UI = {
  kz: {
    back:      'Артқа',
    author:    'Автор',
    grade:     'Сынып',
    type:      'Түрі',
    tasks:     'Тапсырмалар',
    formTitle: 'Жауап жіберу',
    nameLabel: 'Аты-жөні',
    nameP:     'Аты-жөніңізді жазыңыз',
    answerLabel:'Жауап',
    answerP:   'Тапсырмаға жауабыңызды жазыңыз...',
    fileLabel: 'Файл (фото / видео)',
    submitBtn: 'Жіберу',
    sending:   'Жіберілуде...',
    success:   '✓ Жұмыс сәтті жіберілді!',
    errName:   'Аты-жөніңізді жазыңыз',
    errAnswer: 'Жауап немесе файл қосыңыз',
    notFound:  'Мәтін табылмады.'
  },
  ru: {
    back:      'Назад',
    author:    'Автор',
    grade:     'Класс',
    type:      'Тип',
    tasks:     'Задания',
    formTitle: 'Отправить ответ',
    nameLabel: 'Имя и фамилия',
    nameP:     'Введите ваше имя',
    answerLabel:'Ответ',
    answerP:   'Напишите ответ на задание...',
    fileLabel: 'Файл (фото / видео)',
    submitBtn: 'Отправить',
    sending:   'Отправка...',
    success:   '✓ Работа успешно отправлена!',
    errName:   'Введите ваше имя',
    errAnswer: 'Добавьте ответ или файл',
    notFound:  'Текст не найден.'
  }
};

function unique(arr) {
  const seen = new Set();
  return arr.filter(i => seen.has(i.id) ? false : seen.add(i.id));
}

function renderStory(lang) {
  const L = UI[lang];
  const data  = unique(window.STORIES || []);
  const story = data.find(s => s.id === storyId);

  // Update static labels
  document.getElementById('backLabel').textContent    = L.back;
  document.getElementById('tasksTitle').textContent   = L.tasks;
  document.getElementById('formTitle').textContent    = L.formTitle;
  document.getElementById('nameLabel').textContent    = L.nameLabel;
  document.getElementById('answerLabel').textContent  = L.answerLabel;
  document.getElementById('fileLabel').textContent    = L.fileLabel;
  document.getElementById('submitBtnText').textContent= L.submitBtn;
  document.getElementById('studentName').placeholder  = L.nameP;
  document.getElementById('studentAnswer').placeholder= L.answerP;

  if (!story) {
    document.getElementById('storyTitle').textContent = L.notFound;
    return;
  }

  document.title = (story.title?.[lang] || story.title?.ru || '') + ' | EduVision KZ';

  // Meta chips
  const metaEl = document.getElementById('storyMeta');
  metaEl.innerHTML = [
    story.type?.[lang]   || story.type?.ru   ? `<span class="story-chip">${story.type?.[lang] || story.type?.ru}</span>` : '',
    story.author ? `<span class="story-chip">${L.author}: ${story.author}</span>` : '',
    story.grade  ? `<span class="story-chip">${L.grade}: ${story.grade}</span>`   : ''
  ].join('');

  // Title
  document.getElementById('storyTitle').textContent = story.title?.[lang] || story.title?.ru || '';

  // Text
  const raw = (story.text?.[lang] || story.text?.ru || '').trim();
  document.getElementById('storyText').innerHTML = raw
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${p}</p>`)
    .join('');

  // Tasks
  const tasks   = story.tasks?.[lang] || [];
  const tasksList = document.getElementById('storyTasks');
  tasksList.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    tasksList.appendChild(li);
  });
}

window.onLangChange = renderStory;
renderStory(window.currentLang || 'kz');

// ===================== SUBMIT =====================
async function submitWork() {
  const lang   = window.currentLang || 'kz';
  const L      = UI[lang];
  const name   = document.getElementById('studentName').value.trim();
  const answer = document.getElementById('studentAnswer').value.trim();
  const file   = document.getElementById('studentFile').files[0];
  const btnText= document.getElementById('submitBtnText');
  const status = document.getElementById('submitStatus');

  status.className = 'submit-status';
  status.textContent = '';

  if (!name)          { alert(L.errName);   return; }
  if (!answer && !file){ alert(L.errAnswer); return; }

  btnText.textContent = L.sending;
  document.querySelector('[onclick="submitWork()"]').disabled = true;

  const story     = unique(window.STORIES||[]).find(s=>s.id===storyId);
  const storyTitle= story?.title?.[lang] || story?.title?.ru || storyId || '';

  const submission = { name, answer, storyId, storyTitle, date: new Date().toISOString(), fileUrl: null };

  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      if (file) {
        const ref  = firebase.storage().ref(`student-work/${Date.now()}_${file.name}`);
        const snap = await ref.put(file);
        submission.fileUrl = await snap.ref.getDownloadURL();
      }
      await firebase.firestore().collection('submissions').add({
        ...submission,
        date: firebase.firestore.FieldValue.serverTimestamp()
      });
    } else {
      // localStorage fallback
      const works = JSON.parse(localStorage.getItem('works') || '[]');
      works.unshift(submission);
      localStorage.setItem('works', JSON.stringify(works));
    }

    status.className = 'submit-status success';
    status.textContent = L.success;
    document.getElementById('studentName').value  = '';
    document.getElementById('studentAnswer').value= '';
    document.getElementById('studentFile').value  = '';
  } catch (err) {
    console.error(err);
    const works = JSON.parse(localStorage.getItem('works') || '[]');
    works.unshift(submission);
    localStorage.setItem('works', JSON.stringify(works));
    status.className = 'submit-status success';
    status.textContent = L.success;
  }

  btnText.textContent = L.submitBtn;
  document.querySelector('[onclick="submitWork()"]').disabled = false;
  setTimeout(() => { status.className='submit-status'; }, 5000);
}
