import { Config } from 'next-i18n-router/dist/types';

const i18nConfig: Config = {
  defaultLocale: 'en',
  locales: ['en', 'ru'],
  prefixDefault: true, // Always show locale in URL (e.g., /en/...)
  localeDetector: false, // Disable automatic detection
};

export default i18nConfig;
