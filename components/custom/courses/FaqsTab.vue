<script setup lang="ts">
import { ChevronUp, ChevronDown } from 'lucide-vue-next';

const openIndexes = ref<number[]>([]);

const toggleItem = (index: number) => {
  if (openIndexes.value.includes(index)) {
    openIndexes.value = openIndexes.value.filter((i) => i !== index);
  } else {
    openIndexes.value.push(index);
  }
};

const faqs = [
  { question: 'ما المقصود بحقوق النشر المجانية؟', answer: 'تعني أنه يمكنك استخدام المحتوى بدون دفع رسوم متكررة.' },
  { question: 'هل يمكنني استخدام الكورس بعد انتهاء الاشتراك؟', answer: 'نعم، إذا قمت بشرائه، يبقى لديك مدى الحياة.' },
  { question: 'هل يوجد شهادات بعد إكمال الدورة؟', answer: 'نعم، تحصل على شهادة إتمام بعد اجتياز الدورة.' },
  { question: 'هل أستطيع تحميل الدروس؟', answer: 'نعم، يمكنك تحميلها ومشاهدتها بدون إنترنت.' },
];
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
    <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-md p-4 transition-all duration-300">
      <button @click="toggleItem(index)" class="w-full flex justify-between items-center font-semibold text-black">
        <span class="text-base">{{ faq.question }}</span>
        <span class="text-xl">
          <span v-if="openIndexes.includes(index)"><ChevronUp /></span>
          <span v-else><ChevronDown /></span>
        </span>
      </button>

      <!-- Animated answer -->
      <transition name="fade-slide">
        <p v-show="openIndexes.includes(index)" class="text-sm text-gray-600 mt-2">
          {{ faq.answer }}
        </p>
      </transition>
    </div>
  </div>

  <!-- Bottom Image -->
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
