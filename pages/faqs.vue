<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';

const openIndexes = ref<number[]>([]);
const { t } = useI18n();
const auth = useAuthStore();

const toggleItem = (index: number) => {
  if (openIndexes.value.includes(index)) {
    openIndexes.value = openIndexes.value.filter((i) => i !== index);
  } else {
    openIndexes.value.push(index);
  }
};

// store i18n keys (call t(...) in template so it's reactive)
const faqs = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  { q: 'faq.q6', a: 'faq.a6' },
  { q: 'faq.q7', a: 'faq.a7' },
  { q: 'faq.q8', a: 'faq.a8' },
];
</script>

<template>
  <div class="py-10">
    <CustomContainer>
      <!-- Title -->
      <h2 class="text-3xl font-bold mb-8" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        {{ t('faq-title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(faq, index) in faqs" :key="index" class="bg-gray-100 rounded-md p-4 transition-all duration-300">
          <!-- Question -->
          <button @click="toggleItem(index)" class="w-full flex justify-between items-center font-semibold text-black">
            <span class="text-xl">
              <span v-if="openIndexes.includes(index)">
                <ChevronUp />
              </span>
              <span v-else>
                <ChevronDown />
              </span>
            </span>
            <span>{{ t(faq.q) }}</span>
          </button>

          <!-- Answer (animated) -->
          <transition name="fade-slide">
            <p v-show="openIndexes.includes(index)" class="text-sm text-gray-600 mt-2" :class="auth.isEnglish ? 'text-left' : 'text-right'">
              {{ t(faq.a) }}
            </p>
          </transition>
        </div>
      </div>

      <!-- Bottom Image -->
      <div class="mt-10 flex justify-start">
        <img src="/assets/images/faq.png" alt="FAQ Illustration" class="w-[300px] sm:w-[400px] object-contain" />
      </div>
    </CustomContainer>
  </div>
</template>

<style scoped>
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
