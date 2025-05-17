// composables/useUser.ts
import { useAuthStore } from '~/stores/auth';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

export const useUser = () => {
  const auth = useAuthStore();

  // ✅ Restore user from localStorage if available (in client only)
  if (import.meta.client && !auth.user) {
    onMounted(() => {
      const savedUser = localStorage.getItem('auth');
      const token = localStorage.getItem('token');
      console.log(savedUser, token);
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
      if (import.meta.client) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  };

  return { user, fullName, setUser };
};
