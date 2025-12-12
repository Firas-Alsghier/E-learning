// stores/auth.ts
import { defineStore } from 'pinia';
import type { User } from '~/types/user';
import { useDirection } from '~/composables/useDirection';
import { useI18n } from 'vue-i18n';

type LanguageCode = 'en' | 'ar';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    dashboardData: null as User | null,
    isEnglish: true,
  }),

  actions: {
    // ------------------------------------
    // AUTH
    // ------------------------------------
    setAppLanguage(lang: 'en' | 'ar') {
      const dir = useDirection();

      dir.setLocale(lang); // Apply locale + HTML dir + localStorage
      this.isEnglish = lang === 'en';

      if (this.user) {
        this.user.language = lang;
      }
    },
    setUser(user: User | null) {
      this.user = user;
    },

    logout() {
      this.user = null;
      if (import.meta.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    },

    // ------------------------------------
    // LANGUAGE SYSTEM
    // ------------------------------------

    /** 🔥 Called ONLY from the edit-profile Save button */
    applyUserLanguage(lang: LanguageCode) {
      const { locale } = useI18n();
      const dir = useDirection();

      // 1. Update store state
      this.isEnglish = lang === 'en';

      // 2. Update user object if exists
      if (this.user) {
        this.user.language = lang;
      }

      // 3. Update i18n reactive locale
      locale.value = lang;

      // 4. Update direction (LTR/RTL)
      dir.setLocale(lang);

      // 5. Save to localStorage
      if (import.meta.client) {
        localStorage.setItem('site_lang', lang);
      }

      // ⚠ NOT refreshing here — instant update without reload
    },

    /** 🔥 Runs ONCE in app.vue */
    initLanguage() {
      const { locale } = useI18n();
      const dir = useDirection();

      // 1. Load from DB user → highest priority
      let lang: LanguageCode = 'en';

      if (this.user?.language === 'en' || this.user?.language === 'ar') {
        lang = this.user.language as LanguageCode;
      }
      // 2. Fallback to localStorage
      else if (import.meta.client) {
        const saved = localStorage.getItem('site_lang');
        if (saved === 'en' || saved === 'ar') lang = saved;
      }

      // 3. Apply everywhere
      this.isEnglish = lang === 'en';
      locale.value = lang;
      dir.setLocale(lang);
    },
  },
});
