// middleware/teacher.ts

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('teacher_token');

  // ✅ allow access to login page
  if (to.path === '/teacher/login') {
    return;
  }

  // ❌ not logged in → redirect
  if (!token.value) {
    return navigateTo('/teacher/login');
  }
});
