<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { ChevronDown, Lock, Check } from 'lucide-vue-next';

const currentLesson = ref<any>(null);
const showPlayer = ref(false);

const props = defineProps<{
  sections: any[];
  courseId: string;
}>();

const courseId = props.courseId;

const curriculum = ref(
  props.sections.map((s: any) => ({
    ...s,
    open: false,
    lessons: s.lessons.map((l: any, i: number) => ({
      ...l,
      active: i === 0,
      locked: i !== 0,
      completed: false,
    })),
  }))
);

function openLesson(section: any, lesson: any) {
  if (lesson.locked) return;

  window.open(`/learn/${props.courseId}?lesson=${lesson._id}`, '_blank');
}
const bodyRefs = ref<(HTMLElement | null)[]>(curriculum.value.map(() => null));
const sectionHeights = ref<number[]>(curriculum.value.map(() => 0));

// The fix: cast inside the inline ref callback so TypeScript is satisfied
function setRef(el: HTMLElement | null, index: number) {
  bodyRefs.value[index] = el;
}

function measureHeight(index: number) {
  const el = bodyRefs.value[index];
  if (el) sectionHeights.value[index] = el.scrollHeight;
}

onMounted(async () => {
  await nextTick();
  curriculum.value.forEach((_: any, i: number) => measureHeight(i));

  const progress = await $fetch<{ completedLessons: string[] }>(`http://localhost:3001/api/progress/${courseId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  curriculum.value.forEach((section) => {
    section.lessons.forEach((lesson: { _id: string; id: any; completed: boolean; locked: boolean }) => {
      if (progress.completedLessons.includes(lesson._id)) {
        lesson.completed = true;
        lesson.locked = false;
      }
    });
  });
});

const toggleSection = async (index: number) => {
  curriculum.value[index].open = !curriculum.value[index].open;
  if (curriculum.value[index].open) {
    await nextTick();
    measureHeight(index);
  }
};

function progressPercent(section: (typeof curriculum.value)[0]) {
  const unlocked = section.lessons.filter((l: { locked: any }) => !l.locked).length;
  return Math.round((unlocked / section.lessons.length) * 100);
}

function unlockNextLesson() {
  curriculum.value.forEach((section: { lessons: any[] }) => {
    section.lessons.forEach((lesson: any, index: number) => {
      if (lesson === currentLesson.value) {
        const next = section.lessons[index + 1];
        if (next) next.locked = false;
      }
    });
  });
}

async function completeLesson() {
  if (!currentLesson.value) return;

  currentLesson.value.completed = true;

  await $fetch('http://localhost:3001/api/progress/complete-lesson', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: {
      courseId: props.courseId,
      lessonId: currentLesson.value._id,
    },
  });

  unlockNextLesson();

  showPlayer.value = false;
}

function nextLesson() {
  if (!currentLesson.value) return;

  for (const section of curriculum.value) {
    const index = section.lessons.findIndex((l: any) => l === currentLesson.value);

    if (index !== -1) {
      const next = section.lessons[index + 1];
      if (next && !next.locked) {
        currentLesson.value = next;
      }
      return;
    }
  }
}

function prevLesson() {
  if (!currentLesson.value) return;

  for (const section of curriculum.value) {
    const index = section.lessons.findIndex((l: any) => l === currentLesson.value);

    if (index !== -1) {
      const prev = section.lessons[index - 1];
      if (prev) {
        currentLesson.value = prev;
      }
      return;
    }
  }
}
</script>

<template>
  <div class="space-y-2">
    <div v-for="(section, index) in curriculum" :key="index" class="border border-[#EAEAEA] rounded-xl bg-white overflow-hidden">
      <!-- Section Header -->
      <div class="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-gray-50 transition-colors duration-150" @click="toggleSection(index)">
        <div class="flex items-center gap-2">
          <ChevronDown class="w-[18px] h-[18px] text-gray-400 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" :class="{ 'rotate-180': section.open }" />
          <span class="text-sm font-semibold text-gray-900">{{ section.title }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-0.5"> {{ section.lessons.length }} lessons </span>
          <span class="text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-0.5">
            {{ section.totalTime }}
          </span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="h-0.5 bg-gray-100 mx-4">
        <div class="h-full bg-[#FF782D] rounded-full transition-all duration-500" :style="{ width: progressPercent(section) + '%' }" />
      </div>

      <!-- Animated body -->
      <div
        class="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :style="section.open ? { maxHeight: sectionHeights[index] + 'px', opacity: '1' } : { maxHeight: '0px', opacity: '0' }"
      >
        <div class="bg-[#F5F5F5] border-t border-[#EAEAEA] py-1" :ref="(el) => setRef(el as HTMLElement | null, index)">
          <div
            v-for="(lesson, i) in section.lessons"
            @click="openLesson(section, lesson)"
            class="cursor-pointer flex items-center justify-between px-4 py-2 gap-3 hover:bg-white transition-colors duration-150"
          >
            <!-- Left -->
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <!-- Dot -->
              <div
                class="w-[26px] h-[26px] rounded-full flex-shrink-0 flex items-center justify-center text-[11px]"
                :class="{
                  'bg-[#FF782D] text-white': lesson.active,
                  'bg-[#FFF0E8] text-[#FF782D]': !lesson.active && !lesson.locked,
                  'bg-gray-100 border border-gray-200 text-gray-400': !lesson.active && lesson.locked,
                }"
              >
                <span v-if="lesson.active">▶</span>
                <Lock v-else-if="lesson.locked" class="w-3 h-3" />
                <Check v-else class="w-3 h-3" />
              </div>

              <!-- Title -->
              <span
                class="text-sm truncate"
                :class="{
                  'text-[#FF782D] font-semibold': lesson.active,
                  'text-gray-400': lesson.locked && !lesson.active,
                  'text-gray-900': !lesson.active && !lesson.locked,
                }"
              >
                {{ lesson.title }}
              </span>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <button
                v-if="!lesson.locked"
                class="text-[11px] font-semibold px-3 py-1 rounded-md border border-[#FF782D] text-[#FF782D] bg-transparent hover:bg-[#FF782D] hover:text-white transition-colors duration-150 whitespace-nowrap"
              >
                Preview
              </button>
              <span class="text-xs text-gray-500 min-w-[36px] text-right">{{ lesson.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showPlayer" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl w-[900px] p-4">
      <video v-if="currentLesson" controls class="w-full rounded-lg" :src="currentLesson.videoUrl" />

      <div class="flex justify-between mt-4">
        <button class="px-4 py-2 bg-gray-200 rounded" @click="prevLesson">Previous</button>

        <button class="px-4 py-2 bg-orange-500 text-white rounded" @click="completeLesson">Mark Complete</button>

        <button class="px-4 py-2 bg-gray-200 rounded" @click="nextLesson">Next</button>
      </div>
    </div>
  </div>
</template>
