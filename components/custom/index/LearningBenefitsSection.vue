<script setup lang="ts">
import { MessageCircle, Lightbulb, Clock } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';

const auth = useAuthStore();
const { t } = useI18n();

const learningBenefits = [
  { icon: MessageCircle, title: 'benefit-1-title', description: 'benefit-1-desc' },
  { icon: Lightbulb, title: 'benefit-2-title', description: 'benefit-2-desc' },
  { icon: Clock, title: 'benefit-3-title', description: 'benefit-3-desc' },
];
</script>

<template>
  <CustomContainer>
    <section class="py-16">
      <div class="max-w-2xl mx-auto mb-12" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        <h2 class="text-2xl sm:text-3xl font-bold text-primary-custom mb-4">
          {{ t('learn-every-day-title') }}
        </h2>

        <p class="text-secondary-custom text-base sm:text-lg">
          {{ t('learn-every-day-subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(benefit, index) in learningBenefits"
          :key="index"
          class="bg-card-custom border border-custom rounded-xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
        >
          <div class="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
            <component :is="benefit.icon" :size="32" class="text-orange-500" :stroke-width="1.8" />
          </div>

          <h3 class="text-primary-custom font-semibold text-lg mb-3">
            {{ t(benefit.title) }}
          </h3>

          <p class="text-secondary-custom text-sm leading-7">
            {{ t(benefit.description) }}
          </p>
        </div>
      </div>
    </section>
  </CustomContainer>
</template>
