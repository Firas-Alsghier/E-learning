// Use import instead of require
import { defineI18nConfig } from '#imports';
import en from '@/i18n/locales/en.json';
import ar from '@/i18n/locales/ar.json';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    ar,
  },
}));
