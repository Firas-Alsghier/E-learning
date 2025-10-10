<script setup lang="ts">
import type { Stat } from '~/types';

import { useElementVisibility } from '@vueuse/core';
// @ts-ignore
import { CountUp } from 'countup.js';

const stats: Stat[] = [
  { number: 4.9, label: 'معدل التقييم' },
  { number: 12, label: 'المعلّم' },
  { number: 72, label: 'مجموع الدورات' },
  { number: 1200, label: 'الطلاب النشطين' },
];

// DOM reference for the section
const statsSection = ref<HTMLElement | null>(null);
const isVisible = useElementVisibility(statsSection);

// reactive state
const animatedNumbers = ref<number[]>(stats.map(() => 0));
const hasCounted = ref(false); // prevents re-triggering animation

watch(isVisible, (visible) => {
  if (visible && !hasCounted.value) {
    hasCounted.value = true;
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
