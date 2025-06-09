import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
  const auth = useAuthStore();

  if (!auth.user) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        auth.setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Could not parse user from localStorage', err);
      }
    }
  }
});
