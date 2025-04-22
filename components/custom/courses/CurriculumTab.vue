<template>
  <div class="space-y-3">
    <div v-for="(section, index) in curriculum" :key="index" class="bg-white rounded-lg">
      <div class="flex justify-between items-center px-4 py-3 cursor-pointer" @click="toggleSection(index)">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold">▼</span>
          <span class="font-semibold">Lessons With Video Content</span>
        </div>
        <div class="text-sm text-gray-500">{{ section.lessons.length }} Lessons &nbsp; {{ section.totalTime }}</div>
      </div>

      <div v-if="section.open" class="bg-[#F5F5F5] px-4 py-2 space-y-3 rounded-b-lg">
        <div v-for="(lesson, i) in section.lessons" :key="i" class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm">
            <span>📄</span>
            <span :class="lesson.active ? 'text-[#FF782D]' : 'text-black'">
              {{ lesson.title }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <button class="bg-blue-500 text-white px-3 py-1 rounded-md">Preview</button>
            <span class="text-gray-600">{{ lesson.time }}</span>
            <span v-if="lesson.locked">🔒</span>
            <span v-else>✔️</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const curriculum = ref([
  {
    open: true,
    totalTime: '45 Mins',
    lessons: [
      { title: 'Lessons with video content', time: '12:30', active: false, locked: false },
      { title: 'Lessons with video content', time: '10:05', active: true, locked: false },
      { title: 'Lessons with video content', time: '2:25', active: false, locked: true },
    ],
  },
  {
    open: false,
    totalTime: '45 Mins',
    lessons: [
      { title: 'Lessons with video content', time: '8:15', active: false, locked: false },
      { title: 'Lessons with video content', time: '7:20', active: false, locked: false },
      { title: 'Lessons with video content', time: '6:45', active: false, locked: false },
      { title: 'Lessons with video content', time: '6:40', active: false, locked: false },
      { title: 'Lessons with video content', time: '5:55', active: false, locked: false },
    ],
  },
  {
    open: false,
    totalTime: '45 Mins',
    lessons: [
      { title: 'Lessons with video content', time: '4:35', active: false, locked: false },
      { title: 'Lessons with video content', time: '6:10', active: false, locked: false },
      { title: 'Lessons with video content', time: '5:00', active: false, locked: false },
      { title: 'Lessons with video content', time: '5:15', active: false, locked: false },
      { title: 'Lessons with video content', time: '4:00', active: false, locked: false },
    ],
  },
]);

const toggleSection = (index: number) => {
  curriculum.value[index].open = !curriculum.value[index].open;
};
</script>
``
