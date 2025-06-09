<script setup lang="ts">
definePageMeta({
  middleware: ['auth'], // This is enough!
  layout: false,
});
</script>

<template>
  <div>
    <h1>It works</h1>
  </div>
</template>

<style lang="scss" scoped></style>
