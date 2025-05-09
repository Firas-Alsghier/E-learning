export interface User {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export const useUser = () => {
  const user = useState<User | null>('user', () => {
    if (process.client) {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const setUser = (newUser: User | null) => {
    user.value = newUser;
    if (process.client) {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user');
      }
    }
  };

  return { user, setUser };
};
