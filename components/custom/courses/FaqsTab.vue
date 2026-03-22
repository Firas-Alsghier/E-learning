<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

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
  <div class="flex flex-col gap-2 sm:gap-3 select-none" dir="rtl">
    <div
      v-for="(faq, index) in faqs"
      :key="index"
      class="rounded-xl border transition-all duration-300 overflow-hidden"
      :class="openIndexes.includes(index) ? 'border-orange-500/30 bg-orange-500/[0.04]' : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]'"
    >
      <!-- Question row -->
      <button @click="toggleItem(index)" class="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5 sm:py-4 text-right cursor-pointer">
        <span class="text-sm sm:text-base font-semibold leading-snug transition-colors duration-200" :class="openIndexes.includes(index) ? 'text-orange-400' : 'text-white'">
          {{ faq.question }}
        </span>

        <span
          class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 border"
          :class="openIndexes.includes(index) ? 'bg-orange-500/15 border-orange-500/30 text-orange-400 rotate-180' : 'bg-white/5 border-white/[0.08] text-zinc-500'"
        >
          <ChevronDown :size="15" />
        </span>
      </button>

      <!-- Answer -->
      <Transition name="fade-slide">
        <div v-show="openIndexes.includes(index)" class="px-4 sm:px-5 pb-4 sm:pb-5">
          <div class="h-px bg-white/[0.06] mb-3 sm:mb-4"></div>
          <p class="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {{ faq.answer }}
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
