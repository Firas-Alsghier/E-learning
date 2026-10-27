// stores/wishlist.ts

import { defineStore } from 'pinia';

export const useWishlistStore = defineStore('wishlist', () => {
  const count = ref(0);
  const config = useRuntimeConfig();
  const setCount = (value: number) => {
    count.value = value;
  };

  const refresh = async () => {
    try {
      const token = useCookie('token').value;

      if (!token) {
        count.value = 0;
        return;
      }

      const wishlist = await $fetch<any[]>(`${config.public.apiBase}/api/user/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      count.value = wishlist.length;
    } catch (err) {
      console.error('Refresh wishlist failed:', err);
      count.value = 0;
    }
  };

  return {
    count,
    setCount,
    refresh,
  };
});
