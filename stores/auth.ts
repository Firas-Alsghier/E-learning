// stores/auth.ts
import { defineStore } from 'pinia';
import type { User } from '~/types/user';
import { useDirection } from '~/composables/useDirection';
import { useI18n } from 'vue-i18n';

// Define the type for better consistency
type LanguageCode = 'en' | 'ar';

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

    /** 💡 NEW: Centralized action to update the Pinia store's language flag
     * This is called by the Profile Edit page after successful save.
     */
    setAppLanguage(lang: LanguageCode) {
      const dir = useDirection();

      // 1. Update the store state
      this.isEnglish = lang === 'en';

      // 2. Delegate the actual heavy lifting (i18n, HTML, localStorage) to the composable
      dir.setLocale(lang);
    },

    /** Run ONCE in app.vue — loads saved language + applies direction */
    initLanguage() {
      const dir = useDirection();

      // The composable handles initialization. We just synchronize Pinia state.
      this.isEnglish = dir.current.value === 'en';

      // Ensure the composable runs its initialization if not already done.
      dir.setLocale(dir.current.value);
    },

    /** Change language to English (simplified) */
    setEnglish() {
      this.setAppLanguage('en');
    },

    /** Change language to Arabic (simplified) */
    setArabic() {
      this.setAppLanguage('ar');
    },

    /** Toggle EN ↔ AR (simplified) */
    toggleLanguage() {
      const dir = useDirection();

      // The composable handles the toggling and state change internally.
      dir.toggle();

      // Synchronize Pinia state
      this.isEnglish = dir.current.value === 'en';

      // Keep full page reload here for the dedicated toggle button
      if (import.meta.client) {
        window.location.reload();
      }
    },
  },
});
