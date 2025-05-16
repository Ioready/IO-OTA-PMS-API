import i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: ['en', 'tr'],
  directory: path.join(__dirname, './locales'),
  defaultLocale: 'en',
  header: 'lang',
  autoReload: true,
  updateFiles: false,
  objectNotation: true,
});

export default i18n;
