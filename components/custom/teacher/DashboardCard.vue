<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const auth = useAuthStore();

defineProps<{
  title?: string;
  number?: string;
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
        <div class="mt-1 flex items-center gap-1">
          <span class="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </span>
          <span class="text-sm font-semibold text-green-500"> +12.05% </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
