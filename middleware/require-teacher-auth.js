// middleware/require-teacher-auth.js

/*
What it does:

Reads teacher_token cookie

If not logged in → redirect to /teacher/login

If logged in and tries to open login → redirect to /teacher/overview

*/
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('teacher_token');
  // ❌ Not logged in → redirect to teacher login
  if (!token.value && to.path !== '/teacher/login') {
    return navigateTo('/teacher/login');
  }
  // ✅ Logged in → prevent going back to login
  if (token.value && to.path === '/teacher/login') {
    return navigateTo('/teacher/overview');
  }
});
