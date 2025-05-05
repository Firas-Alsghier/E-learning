<script setup lang="ts">
defineProps<{ selected: any }>();
import { Checkbox } from '@/components/ui/checkbox';
</script>

<template>
  <div>
    <h3 class="font-semibold text-base mb-2">Course Category</h3>
    <div class="space-y-2">
      <div class="flex items-center justify-between" v-for="item in ['Commercial', 'Office', 'Shop', 'Educate', 'Academy']" :key="item">
        <div class="flex items-center gap-2">
          <Checkbox v-model:checked="selected.courseCategory" :value="item" />
          <span>{{ item }}</span>
        </div>
        <span class="text-sm font-medium text-muted-foreground">15</span>
      </div>
    </div>
  </div>
</template>
