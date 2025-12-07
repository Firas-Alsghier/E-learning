import { defineStore } from 'pinia';
import type { User } from '~/types/user';
import { useDirection } from '~/composables/useDirection';
import { useI18n } from 'vue-i18n';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    dashboardData: null as User | null,

    // true = English, false = Arabic
    isEnglish: true,
  }),

  actions: {
    // --------------------------
    // AUTH
    // --------------------------
    setUser(user: User | null) {
      this.user = user;
    },

    setDashboardData(dashboardData: User | null) {
      this.dashboardData = dashboardData;
    },

    logout() {
      this.user = null;
      if (import.meta.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },

    // --------------------------
    // LANGUAGE SYSTEM
    // --------------------------

    /** Run ONCE in app.vue — loads saved language + applies direction */
    initLanguage() {
      const dir = useDirection();
      const { locale } = useI18n();

      // Load saved language (must be 'en' or 'ar')
      const saved = import.meta.client ? localStorage.getItem('site_lang') : null;

      let currentLang: 'en' | 'ar' = 'en'; // default

      if (saved === 'en' || saved === 'ar') {
        currentLang = saved;
      }

      this.isEnglish = currentLang === 'en';

      // apply direction
      dir.setLocale(currentLang);

      // sync i18n
      locale.value = currentLang;
    },

    /** Change language to English */
    setEnglish() {
      const dir = useDirection();
      const { locale } = useI18n();

      this.isEnglish = true;

      dir.setLocale('en');
      locale.value = 'en';

      if (import.meta.client) {
        localStorage.setItem('site_lang', 'en');
        // window.location.reload(); // 🔥
      }
    },

    /** Change language to Arabic */
    setArabic() {
      const dir = useDirection();
      const { locale } = useI18n();

      this.isEnglish = false;

      dir.setLocale('ar');
      locale.value = 'ar';

      if (import.meta.client) {
        localStorage.setItem('site_lang', 'ar');
        // window.location.reload(); // 🔥
      }
    },

    /** Toggle EN ↔ AR */
    toggleLanguage() {
      const dir = useDirection();
      const { locale } = useI18n();

      this.isEnglish = !this.isEnglish;

      const lang: 'en' | 'ar' = this.isEnglish ? 'en' : 'ar';

      dir.setLocale(lang);
      locale.value = lang;

      if (import.meta.client) {
        localStorage.setItem('site_lang', lang);
        window.location.reload(); // 🔥 FULL reload
      }
    },
  },
});
