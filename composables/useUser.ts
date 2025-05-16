// composables/useUser.ts
import { computed } from 'vue';
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

  // Return user data from Pinia
  const user = computed(() => auth.user);

  // Optional: add full name, or any other derived/computed fields
  const fullName = computed(() => {
    if (!auth.user || !('firstName' in auth.user)) return '';
    return `${auth.user.firstName} ${auth.user.lastName}`.trim();
  });

  const setUser = (userData: User | null) => {
    if (userData) {
      auth.setUser({
        id: userData.id,
        email: userData.email,
        // Only add additional info if needed
        ...(userData.firstName && { firstName: userData.firstName }),
        ...(userData.lastName && { lastName: userData.lastName }),
        ...(userData.createdAt && { createdAt: userData.createdAt }),
      });
    } else {
      auth.logout();
    }
  };

  return { user, fullName, setUser };
};
