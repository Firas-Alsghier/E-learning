// composables/useDirection.ts
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY = 'site_lang';
const current = ref<'en' | 'ar'>('en');

export const useDirection = () => {
  const { locale } = useI18n();

  /** Apply <html dir> and <html lang> */
  const applyDirection = (lang: 'en' | 'ar') => {
    if (!import.meta.client) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'ltr' : 'rtl';
  };

  /** Set language globally */
  const setLocale = (lang: 'en' | 'ar') => {
    current.value = lang;

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, lang);
    }

    locale.value = lang;
    applyDirection(lang);
  };

  /** Toggle EN <-> AR */
  const toggle = () => {
    const lang = current.value === 'en' ? 'ar' : 'en';
    setLocale(lang);
  };

  /** Initialize on app load */
  onMounted(() => {
    if (!import.meta.client) return;

    const saved = localStorage.getItem(STORAGE_KEY) as 'en' | 'ar' | null;

    const lang = saved || locale.value || 'en';
    current.value = lang;

    locale.value = lang;
    applyDirection(lang);
  });

  return {
    current,
    setLocale,
    toggle,
    isRTL: computed(() => current.value === 'ar'),
  };
};
