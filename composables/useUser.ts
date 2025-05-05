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
  return { user };
};
