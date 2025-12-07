// composables/useDirection.ts
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY = 'site_lang'; // store chosen locale
const current = ref<'en' | 'ar'>('en'); // global reactive value

export const useDirection = () => {
  const { locale } = useI18n();

  /** Apply <html dir=""> + <html lang=""> */
  const applyDirection = (lang: 'en' | 'ar') => {
    if (!import.meta.client) return;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'ltr' : 'rtl';
  };

  /** Set language everywhere (direction + i18n + localStorage) */
  const setLocale = (lang: 'en' | 'ar') => {
    current.value = lang;

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, lang);
    }

    locale.value = lang;
    applyDirection(lang);
  };

  /** Toggle EN ↔ AR */
  const toggle = () => {
    const lang = current.value === 'en' ? 'ar' : 'en';
    setLocale(lang);
  };

  /** Initialize when app loads (client only) */
  onMounted(() => {
    if (!import.meta.client) return;

    const saved = (localStorage.getItem(STORAGE_KEY) as 'en' | 'ar' | null) || null;

    const lang = saved || locale.value || 'en';
    current.value = lang;

    // Apply direction + i18n
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
