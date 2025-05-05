<script setup lang="ts">
defineProps<{ selected: any }>();
import { Checkbox } from '@/components/ui/checkbox';
</script>

<template>
  <aside class="space-y-10 text-sm">
    <!-- Categories -->
    <div>
      <h2 class="text-lg text-right font-bold mb-4">التصنيفات</h2>
      <ul class="space-y-2 text-gray-800">
        <li v-for="item in ['Commercial', 'Office', 'Shop', 'Educate', 'Academy', 'Single family home']" :key="item" class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <Checkbox v-model:checked="selected.category" :value="item" />
            <span>{{ item }}</span>
          </div>
          <span class="text-sm font-medium text-muted-foreground">15</span>
        </li>
      </ul>
    </div>

    <!-- Tags -->
    <div>
      <h2 class="text-lg font-bold mb-4">Tags</h2>
      <div class="flex flex-wrap gap-2">
        <label v-for="tag in ['Free couses', 'Marketing', 'Idea', 'LMS', 'LearnPress', 'Instructor']" :key="tag" class="flex items-center gap-2 border rounded-full px-3 py-1 cursor-pointer">
          <Checkbox v-model:checked="selected.tags" :value="tag" />
          <span class="text-sm">{{ tag }}</span>
        </label>
      </div>
    </div>
  </aside>
</template>
