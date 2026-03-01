// middleware/user-auth.js

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token');
  // ❌ Not logged in → redirect to teacher login
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login');
  }
  // ✅ Logged in → prevent going back to login
  if ((token.value && to.path === '/login') || to.path === '/signup') {
    return navigateTo('/user/edit-profile');
  }
});
