// middleware/auth.ts
import { useAuthStore } from '@/stores/auth';
export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn === false) {
    return navigateTo('/login');
  }
});
