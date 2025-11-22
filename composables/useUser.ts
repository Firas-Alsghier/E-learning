import { useAuthStore } from '~/stores/auth';
import type { User } from '~/types/user';

export const useUser = () => {
  const auth = useAuthStore();

  // ✅ Restore from localStorage only in browser
  if (import.meta.client && !auth.user) {
    onMounted(() => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (savedUser && token) {
        try {
          const parsedUser = JSON.parse(savedUser);
          auth.setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse saved user:', e);
        }
      }
    });
  }

  const user = computed(() => auth.user);

  const isLoggedIn = computed(() => !!auth.user); // 🔥 Add this line

  const fullName = computed(() => {
    if (!auth.user || !auth.user.firstName) return '';
    return `${auth.user.firstName} ${auth.user.lastName ?? ''}`.trim();
  });

  const setUser = (userData: User | null) => {
    if (userData) {
      auth.setUser(userData);
      if (import.meta.client) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } else {
      auth.logout();
    }
  };

  return { user, fullName, setUser, isLoggedIn }; // 🔥 Return it
};
