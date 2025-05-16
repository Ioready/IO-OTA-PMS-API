// import i18n from 'i18n';
// import path from 'path';
// i18n.configure({
//   locales: ['en', 'tr'],
//   directory: path.join(__dirname, './locales'),
//   defaultLocale: 'en',
//   header: 'lang',
//   autoReload: true,
//   updateFiles: false,
//   objectNotation: true,
//   register: global, // important for global use
// });

// export default i18n;

// src/i18n.ts
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';

i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en', 'tr'],
  ns: ['user', 'property'],
  defaultNS: 'user',
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json')
  },
  interpolation: {
    escapeValue: false
  }
});

export default i18next;

