<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const auth = useAuthStore();

defineProps<{
  StudentQuote: string;
  StudentName: string;
  Studentcountry: string;
}>();
</script>
<template>
  <div class="rounded-2xl text-right p-6 shadow-sm border bg-white flex flex-col justify-between">
    <div class="text-5xl text-gray-300 leading-none mb-4">“</div>
    <p class="text-gray-700 text-sm sm:text-base leading-relaxed mb-6" :class="auth.isEnglish ? 'text-left' : 'text-right'">
      {{ StudentQuote }}
    </p>
    <div>
      <h3 class="font-bold text-black text-sm sm:text-base" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ StudentName }}</h3>
      <p class="text-gray-400 text-sm" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ Studentcountry }}</p>
      <!-- <p class="text-gray-400 text-sm">⭐⭐⭐⭐</p> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
