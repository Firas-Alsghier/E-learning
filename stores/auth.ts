import { defineStore } from 'pinia';
import type { User } from '~/types/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  actions: {
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
  },
});
