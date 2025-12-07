<script setup lang="ts">
import type { Stat } from '~/types';

import { useElementVisibility } from '@vueuse/core';
// @ts-ignore
import { CountUp } from 'countup.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const stats: Stat[] = [
  { number: 4.9, key: 'rating-rate' },
  { number: 12, key: 'teacher' },
  { number: 72, key: 'total-courses' },
  { number: 1200, key: 'active-students' },
];

const statsSection = ref<HTMLElement | null>(null);
const isVisible = useElementVisibility(statsSection);

const animatedNumbers = ref<number[]>(stats.map(() => 0));
const hasCounted = ref(false);

watch(isVisible, (visible) => {
  if (visible && !hasCounted.value) {
    hasCounted.value = true;

    stats.forEach((stat, index) => {
      const counter = new CountUp(`stat-${index}`, stat.number, {
        duration: 3,
        separator: ',',
      });

      if (!counter.error) {
        counter.start(() => {
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
        <div v-for="(stat, index) in stats" :key="index" class="bg-card-custom border-custom rounded-2xl py-10 shadow-sm">
          <h2 class="text-4xl font-bold text-primary-custom mb-2" :id="`stat-${index}`">
            {{ animatedNumbers[index] }}
          </h2>

          <!-- translate using the key -->
          <p class="text-base font-medium text-secondary-custom">
            {{ t(stat.key) }}
          </p>
        </div>
      </div>
    </CustomContainer>
  </section>
</template>
