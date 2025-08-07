// This file checks if a user is logged in, then navigate him back to home page if he tried to access logging || signup pages
import { useAuthStore } from '~/stores/auth';
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();

  if (auth.user) {
    return navigateTo('/'); // ✅ safer than using window.location.href
  }
});
