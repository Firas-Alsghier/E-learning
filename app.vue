<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
const auth = useAuthStore();
// :class="auth.isEnglish ? 'text-left' : 'text-right'"
const { locale } = useI18n();

onMounted(() => {
  auth.initLanguage();
  locale.value = auth.isEnglish ? 'en' : 'ar';
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts"></script>
