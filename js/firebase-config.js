// firebase-config.js
// Замените значения на свои из Firebase Console → Project Settings → Your apps
// После заполнения раскомментируйте теги <script> в story.html и teacher.html

const firebaseConfig = {
  apiKey:            "ВСТАВЬТЕ_API_KEY",
  authDomain:        "ВСТАВЬТЕ.firebaseapp.com",
  projectId:         "ВСТАВЬТЕ_PROJECT_ID",
  storageBucket:     "ВСТАВЬТЕ.appspot.com",
  messagingSenderId: "ВСТАВЬТЕ_SENDER_ID",
  appId:             "ВСТАВЬТЕ_APP_ID"
};

firebase.initializeApp(firebaseConfig);
