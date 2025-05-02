<template>
  <section class="py-10" ref="statsSection">
    <CustomContainer>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div v-for="(stat, index) in stats" :key="index" class="bg-gray-50 rounded-2xl py-10 shadow-sm">
          <h2 class="text-4xl font-bold text-orange-500 mb-2" :id="`stat-${index}`">
            {{ animatedNumbers[index] }}
          </h2>
          <p class="text-base font-medium text-black">{{ stat.label }}</p>
        </div>
      </div>
    </CustomContainer>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useElementVisibility } from '@vueuse/core';
import { CountUp } from 'countup.js';

const stats = [
  { number: 4.9, label: 'معدل التقييم' },
  { number: 12, label: 'المعلّم' },
  { number: 72, label: 'مجموع الدورات' },
  { number: 1200, label: 'الطلاب النشطين' },
];

const statsSection = ref(null);
const isVisible = useElementVisibility(statsSection);

const animatedNumbers = ref(stats.map(() => 0));
const hasCounted = ref(false); // ✅ This prevents re-triggering

watch(isVisible, (visible) => {
  if (visible && !hasCounted.value) {
    hasCounted.value = true; // ✅ Mark as done
    stats.forEach((stat, index) => {
      const countUp = new CountUp(`stat-${index}`, stat.number, {
        duration: 3,
        separator: ',',
      });
      if (!countUp.error) {
        countUp.start(() => {
          animatedNumbers.value[index] = stat.number;
        });
      }
    });
  }
});
</script>
