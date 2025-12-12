<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="text-center">
    <div class="text-title mb-4">
      <h1 class="text-2xl font-bold">{{ t('close-account') }}</h1>
      <p class="text-base">{{ t('close-permanently') }}</p>
    </div>
    <hr />
  </div>
</template>

<style lang="scss" scoped></style>
