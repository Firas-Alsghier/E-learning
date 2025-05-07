// composables/useUser.ts
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  // Add other fields as needed
}

export const useUser = () => {
  const user = useState<User | null>('user', () => null);

  // Rehydrate from localStorage on mount
  if (import.meta.client) {
    onMounted(() => {
      const saved = localStorage.getItem('user');
      if (saved) {
        user.value = JSON.parse(saved);
      }
    });

    watch(
      user,
      (newUser) => {
        if (newUser) {
          localStorage.setItem('user', JSON.stringify(newUser));
        } else {
          localStorage.removeItem('user');
        }
      },
      { deep: true }
    );
  }

  return { user };
};
