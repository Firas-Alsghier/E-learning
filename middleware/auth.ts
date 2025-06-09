// middleware/auth.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  // Only block on client after mounted (hydration done)
  if (process.client && !auth.user) {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        auth.setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    } else {
      return navigateTo('/login');
    }
  }

  // On SSR, just allow it (don’t redirect — wait until client checks)
});
