export default defineNuxtPlugin(() => {
  const router = useRouter();

  const api = $fetch.create({
    onResponseError({ response }) {
      if (response.status === 401 || response.status === 403) {
        // 🔥 FORCE LOGOUT
        localStorage.removeItem('teacher_token');
        localStorage.removeItem('admin_token');
        localStorage.clear();

        // Redirect to login
        router.push('/login');
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
