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
import { ModuleName } from './resources';



i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en', 'tr'],
  ns: [ModuleName.USER, ModuleName.PROPERTY, ModuleName.ROLE, ModuleName.FLOOR, ModuleName.ROOM_TYPE, ModuleName.RATE_PLAN, ModuleName.ROOM, ModuleName.RECENT_SEARCH, ModuleName.LOST_FOUND],
  defaultNS: ModuleName.USER,
  backend: {
    loadPath: path.join(__dirname, './locales/{{lng}}/{{ns}}.json')
  },
  interpolation: {
    escapeValue: false
  },
  saveMissing: true
});

export default i18next;

