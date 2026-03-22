// middleware/user-auth.js

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token');

  // 🎯 ONLY protect /learn routes
  if (to.path.startsWith('/learn')) {
    if (!token.value) {
      return navigateTo('/login');
    }
  }

  // ✅ Prevent logged-in users from going back to auth pages
  if (token.value && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/user/edit-profile');
  }
});
