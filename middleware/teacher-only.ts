// middleware/teacher-only.ts
export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser(); // assuming useUser composable returns user state

  if (!user.value || (user.value.role !== 'teacher' && user.value.role !== 'admin')) {
    return navigateTo('/'); // redirect if not authorized
  }
});
