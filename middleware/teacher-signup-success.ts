export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    const allowed = sessionStorage.getItem('teacher_signup_success');
    if (!allowed) {
      return navigateTo('/');
    }
    sessionStorage.removeItem('teacher_signup_success');
  }
});
