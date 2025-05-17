// middleware/guest-only.ts
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return navigateTo('/'); // redirect logged-in users away from /login
  }
});
