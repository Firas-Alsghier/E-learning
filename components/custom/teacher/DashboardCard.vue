<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const auth = useAuthStore();

defineProps<{
  title?: string;
  number?: number | string;
  percent?: string;
  link?: string;
}>();
</script>

<template>
  <div class="rounded-xl bg-white p-6 shadow-md transition-transform duration-200 hover:-translate-y-1">
    <div class="flex items-center gap-5">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
        <img :src="link" alt="Money bag icon" class="h-8 w-8 text-purple-600" />
      </div>
      <div class="flex flex-col">
        <h3 class="text-sm font-medium text-gray-500" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ title }}</h3>
        <p class="text-2xl font-bold text-gray-800" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ number }}</p>
        <div class="mt-1 flex items-center gap-1"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
