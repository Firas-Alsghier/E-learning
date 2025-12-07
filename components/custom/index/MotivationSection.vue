<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
const auth = useAuthStore();
const { t } = useI18n();
</script>

<template>
  <CustomContainer>
    <section class="py-16">
      <div class="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        <!-- Image Placeholder -->
        <div class="w-full lg:w-1/2">
          <img src="/assets/images/motivation.png" alt="Learning Illustration" class="w-full max-w-[600px] mx-auto" />
        </div>

        <!-- Text Content -->
        <div class="w-full lg:w-1/2 text-right max-lg:text-center">
          <h2 class="text-2xl md:text-3xl text-primary-custom font-semibold mb-4 leading-relaxed" :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('join-community') }}
          </h2>
          <ul class="mb-6 space-y-2 text-secondary-custom font-medium">
            <li class="flex items-center gap-2 max-lg:justify-center justify-end">
              <span>✔</span>
              <span>{{ t('learn-anytime') }}</span>
            </li>
            <li class="flex items-center max-lg:justify-center gap-2 justify-end">
              <span>✔</span>
              <span>{{ t('pro-content') }}</span>
            </li>
            <li class="flex items-center max-lg:justify-center gap-2 justify-end">
              <span>✔</span>
              <span>{{ t('huge-courses') }}</span>
            </li>
          </ul>
          <!-- <Button class="btn-custom text-primary-custom border-custom px-6 py-2 cursor-pointer rounded-2xl transition"> استكشاف الدورة </Button> -->
        </div>
      </div>
    </section>
  </CustomContainer>
</template>
