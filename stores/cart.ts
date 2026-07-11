import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', () => {
  const count = ref(0);

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

      const cart: any = await $fetch('http://localhost:3001/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      count.value = cart.items.length;
    } catch (err) {
      console.error('Refresh cart failed:', err);
      count.value = 0;
    }
  };

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    if (count.value > 0) {
      count.value--;
    }
  };

  return {
    count,
    setCount,
    refresh,
    increment,
    decrement,
  };
});
