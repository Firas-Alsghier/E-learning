export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('teacher_token');
  // ✅ Logged in → prevent going back to login
  if (token.value && to.path === '/teacher/signup') {
    return navigateTo('/teacher/overview');
  }
});
