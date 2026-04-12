<script setup lang="ts">
defineProps<{
  description?: string;
}>();
</script>

<template>
  <div class="overview-tab">
    <ClientOnly>
      <div class="font-normal text-lg leading-normal">
        <div class="prose max-w-none" v-html="description"></div>
      </div>
    </ClientOnly>
  </div>
</template>

<style lang="scss" scoped></style>
