import { useAuthStore } from '@/stores/auth';
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  // ✅ Block unauthenticated users from accessing protected routes
  if (!auth.user && to.path.startsWith('/user')) {
    return navigateTo('/login');
  }
});
