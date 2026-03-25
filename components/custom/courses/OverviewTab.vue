<script setup lang="ts">
defineProps<{
  description?: string;
}>();
</script>

<template>
  <div class="overview-tab">
    <p class="font-normal text-lg leading-normal">
      <div
  class="prose max-w-none"
  v-html="description"
></div>
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
