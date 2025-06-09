import { useAuthStore } from '~/stores/auth';
export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();

  if (auth.user) {
    return navigateTo('/'); // ✅ safer than using window.location.href
  }
});
