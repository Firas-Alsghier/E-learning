<script setup lang="ts">
defineProps<{
  description?: string;
}>();
</script>

<template>
  <div class="overview-tab">
    <p class="font-normal text-lg leading-normal">
      {{ description }}
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
