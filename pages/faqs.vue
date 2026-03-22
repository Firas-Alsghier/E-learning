<script setup lang="ts">
import { ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
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
  <!--
    🎨 BACKGROUND COLOR — change bg-white below to your preferred color.
    Examples: bg-gray-50 | bg-slate-100 | bg-[#your-color]
  -->
  <div class="bg-white py-14 sm:py-20">
    <CustomContainer>
      <!-- ── Header ── -->
      <div class="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <!-- <p class="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">Support</p> -->
          <h2 class="text-3xl sm:text-4xl lg:text-5xl self-center font-extrabold text-gray-900 leading-tight tracking-tight">
            {{ t('faq-title') }}
          </h2>
        </div>

        <!-- Decorative accent line -->
        <div class="hidden self-center sm:block shrink-0">
          <div class="h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 opacity-70"></div>
        </div>
      </div>

      <!-- ── Grid ── -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="rounded-xl border transition-all duration-300 overflow-hidden"
          :class="openIndexes.includes(index) ? 'border-orange-400/40 bg-orange-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'"
        >
          <!-- Question row -->
          <button @click="toggleItem(index)" class="w-full flex items-center justify-between gap-4 px-4 sm:px-5 py-4 cursor-pointer" :class="auth.isEnglish ? 'flex-row' : 'flex-row-reverse'">
            <!-- Chevron icon box -->
            <span
              class="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 border"
              :class="openIndexes.includes(index) ? 'bg-orange-100 border-orange-300 text-orange-500 rotate-180' : 'bg-white border-gray-200 text-gray-400'"
            >
              <ChevronDown :size="15" />
            </span>

            <!-- Question text -->
            <span
              class="flex-1 text-sm sm:text-base font-semibold leading-snug transition-colors duration-200"
              :class="[openIndexes.includes(index) ? 'text-orange-500' : 'text-gray-800', auth.isEnglish ? 'text-left' : 'text-right']"
            >
              {{ t(faq.q) }}
            </span>
          </button>

          <!-- Answer -->
          <Transition name="fade-slide">
            <div v-show="openIndexes.includes(index)" class="px-4 sm:px-5 pb-4 sm:pb-5">
              <div class="h-px bg-orange-100 mb-3"></div>
              <p class="text-xs sm:text-sm text-gray-500 leading-relaxed" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                {{ t(faq.a) }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- ── Bottom illustration ── -->
      <div class="mt-12 sm:mt-16 flex" :class="auth.isEnglish ? 'justify-start' : 'justify-end'">
        <img src="/assets/images/faq.png" alt="FAQ Illustration" class="w-[220px] sm:w-[300px] lg:w-[380px] object-contain drop-shadow-md" />
      </div>
    </CustomContainer>
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
