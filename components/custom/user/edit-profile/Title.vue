<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
const auth = useAuthStore();
const { t } = useI18n();
</script>

<template>
  <div class="text-center">
    <div class="text-title mb-4">
      <h1 class="text-2xl font-bold">{{ t('profile-title') }}</h1>
      <p class="text-base">{{ t('profile-sub-title') }}</p>
    </div>
    <hr />
  </div>
</template>

<style lang="scss" scoped></style>
