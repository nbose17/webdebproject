import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'en'
});

// Export locales for easier access - defineRouting returns a routing config object
export const locales = ['en', 'ru'] as const;
export type Locale = typeof locales[number];

