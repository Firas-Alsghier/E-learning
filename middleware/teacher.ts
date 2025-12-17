export default defineNuxtRouteMiddleware(() => {
  if (!import.meta.client) return;

  const token = localStorage.getItem('teacher_token');

  if (!token) {
    return navigateTo('/teacher/login');
  }
});
