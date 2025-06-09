<script setup lang="ts">
import CustomCoursesFilterContent from './FilterContent.vue';

defineProps<{ show: boolean }>();
const emit = defineEmits(['close']);

const selected = ref({
  courseCategory: ['Shop', 'Academy'],
  instructors: [],
  price: ['All'],
  review: ['★★★★☆'],
  level: ['Intermidiate'],
});
</script>

<template>
  <!-- Desktop Filter -->
  <aside class="hidden lg:block w-full max-w-xs p-4 space-y-6">
    <CustomCoursesFilterContent :selected="selected" />
  </aside>

  <!-- Mobile Drawer -->
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black/50 z-40" @click.self="emit('close')">
      <aside class="absolute right-0 top-0 w-4/5 max-w-xs h-full bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-6">
        <CustomCoursesFilterContent :selected="selected" />
        <button class="w-full mt-6 bg-purple-600 text-white py-2 rounded-md font-medium" @click="emit('close')">Done</button>
      </aside>
    </div>
  </transition>
</template>
