export default defineNuxtRouteMiddleware((to) => {
  const userToken = useCookie('token');
  const teacherToken = useCookie('teacher_token');

  // 🎯 Protect ONLY /learn
  if (to.path.startsWith('/learn')) {
    if (!userToken.value && !teacherToken.value) {
      return navigateTo('/login');
    }
  }
});
