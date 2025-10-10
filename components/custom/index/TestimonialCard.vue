<script setup lang="ts">
defineProps<{
  StudentQuote: string;
  StudentName: string;
  Studentcountry: string;
}>();
</script>
<template>
  <div class="rounded-2xl text-right p-6 shadow-sm border bg-white flex flex-col justify-between">
    <div class="text-5xl text-gray-300 leading-none mb-4">“</div>
    <p class="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
      {{ StudentQuote }}
    </p>
    <div>
      <h3 class="font-bold text-black text-sm sm:text-base">{{ StudentName }}</h3>
      <p class="text-gray-400 text-sm">{{ Studentcountry }}</p>
      <!-- <p class="text-gray-400 text-sm">⭐⭐⭐⭐</p> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
