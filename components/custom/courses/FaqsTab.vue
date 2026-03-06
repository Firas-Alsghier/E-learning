<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next';
defineProps<{
  faqs: {
    question: string;
    answer: string;
  }[];
}>();
const openIndexes = ref<number[]>([]);
const toggleItem = (index: number) => {
  if (openIndexes.value.includes(index)) {
    openIndexes.value = openIndexes.value.filter((i) => i !== index);
  } else {
    openIndexes.value.push(index);
  }
};
</script>

<template>
  <div class="grid grid-cols-1 disable md:grid-cols-1 gap-6">
    <div v-for="(faq, index) in faqs" :key="index" class="bg-white cursor-pointer rounded-md p-4 transition-all duration-300">
      <button @click="toggleItem(index)" class="w-full flex justify-between items-center font-semibold text-black">
        <span class="text-base">{{ faq.question }}</span>
        <span class="text-xl">
          <span v-if="openIndexes.includes(index)"><ChevronUp /></span>
          <span v-else><ChevronDown /></span>
        </span>
      </button>

      <!-- Animated answer -->
      <transition name="fade-slide">
        <p v-show="openIndexes.includes(index)" class="text-sm cursor-pointer text-gray-600 mt-2">
          {{ faq.answer }}
        </p>
      </transition>
    </div>
  </div>

  <!-- Bottom Image -->
</template>

<style scoped>
.disable {
  -webkit-user-select: none; /* Safari */
  user-select: none;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
