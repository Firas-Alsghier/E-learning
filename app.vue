<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();

/**
 * ❗ Only call initLanguage()
 * Do NOT manually reassign locale.value here.
 */
onMounted(() => {
  auth.initLanguage();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
