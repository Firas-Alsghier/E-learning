// (Prevents logged-in users from accessing login/signup)(updated)
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('token');

  if (token.value) {
    return navigateTo('/');
  }
});
