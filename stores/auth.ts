import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    setUser(userData: User) {
      this.user = userData;
    },
    logout() {
      this.user = null;
    },
  },

  persist: true,
});
