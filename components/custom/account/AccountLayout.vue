<script setup lang="ts"></script>

<template>
  <div class="flex flex-col lg:flex-row">
    <CustomAccountSidebar />
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
