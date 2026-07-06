import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', () => {
  const count = ref(0);

  const setCount = (value: number) => {
    count.value = value;
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
    increment,
    decrement,
  };
});
