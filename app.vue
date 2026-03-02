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
  if (!localStorage.getItem('token') || !useCookie('token').value) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    useCookie('token').value = null;
    auth.user = null;
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
