import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();

  // If logged in, redirect away from guest-only pages
  if (auth.isLoggedIn) {
    return navigateTo('/');
  }

  // Otherwise, allow access
});
