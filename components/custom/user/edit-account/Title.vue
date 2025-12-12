<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n(); // 💡 Destructured locale to check current language
</script>

<template>
  <div class="text-center">
    <div class="text-title mb-4">
      <h1 class="text-2xl font-bold">{{ t('account-title') }}</h1>
      <p class="text-base">{{ t('edit-account') }}</p>
    </div>
    <hr />
  </div>
</template>
