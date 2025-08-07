// middleware/auth.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();

  if (import.meta.client) {
    if (!auth.user) {
      const savedUser = localStorage.getItem('user');
      // const token = localStorage.getItem('token');

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          auth.setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          return navigateTo('/login');
        }
      } else {
        return navigateTo('/login');
      }
    }
  }

  // Optional: If you want to add server-side auth later, add logic here.
});
