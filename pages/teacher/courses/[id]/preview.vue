<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDown } from 'lucide-vue-next';

definePageMeta({
  layout: false,
});

const route = useRoute();
const courseId = route.params.id as string;

// ── State ──
const course = ref<any>(null);
const curriculum = ref<any[]>([]);
const isLoading = ref(true);

// Active lesson
const activeSectionIdx = ref(0);
const activeLessonIdx = ref(0);
const openSections = ref<number[]>([0]); // first section open by default
// ── Computed ──
const activeLesson = computed(() => {
  return curriculum.value[activeSectionIdx.value]?.lessons?.[activeLessonIdx.value] || null;
});
function toggleSection(index: number) {
  if (openSections.value.includes(index)) {
    openSections.value = openSections.value.filter((i) => i !== index);
  } else {
    openSections.value.push(index);
  }
}
function nextLesson() {
  const section = curriculum.value[activeSectionIdx.value];
  if (!section) return;

  const nextLesson = section.lessons?.[activeLessonIdx.value + 1];

  // ✅ Case 1: next lesson in same section
  if (nextLesson) {
    activeLessonIdx.value++;
    return;
  }

  // ✅ Case 2: go to next section
  const nextSection = curriculum.value[activeSectionIdx.value + 1];

  if (nextSection && nextSection.lessons?.length) {
    activeSectionIdx.value++;
    activeLessonIdx.value = 0;
  }
}

function prevLesson() {
  const section = curriculum.value[activeSectionIdx.value];
  if (!section) return;

  const prevLesson = section.lessons?.[activeLessonIdx.value - 1];

  // ✅ Case 1: previous lesson in same section
  if (prevLesson) {
    activeLessonIdx.value--;
    return;
  }

  // ✅ Case 2: go to previous section (last lesson)
  const prevSection = curriculum.value[activeSectionIdx.value - 1];

  if (prevSection && prevSection.lessons?.length) {
    activeSectionIdx.value--;
    activeLessonIdx.value = prevSection.lessons.length - 1;
  }
}

function onVideoEnded() {
  // for now just go to next lesson (we’ll improve later)
  nextLesson();
}

// ── Methods ──
function selectLesson(si: number, li: number) {
  activeSectionIdx.value = si;
  activeLessonIdx.value = li;

  // ✅ ensure section is open
  if (!openSections.value.includes(si)) {
    openSections.value.push(si);
  }
}

// ── Fetch ──
onMounted(async () => {
  try {
    let data: any;

    // ✅ ALWAYS use working public endpoint
    data = await $fetch(`http://localhost:3001/api/courses/id/${courseId}`);

    course.value = data;
    curriculum.value = data.sections || [];
  } catch (err) {
    console.error('Preview error:', err);
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div class="flex flex-col h-screen bg-[#1c1d1f] text-white font-['DM_Sans',sans-serif] overflow-hidden">
    <header class="flex items-center justify-between px-4 h-12 bg-[#1c1d1f] border-b border-white/10 flex-shrink-0 z-10">
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors">
          <ChevronLeft class="w-4 h-4" />
          <a href="#" class="hidden sm:inline">Back to course</a>
        </button>
        <div class="w-px h-5 bg-white/10" />
        <span class="text-sm font-medium text-white truncate max-w-[340px]"> {{ course?.title || 'Loading...' }} </span>
      </div>

      <div class="flex items-center gap-3">
        <div class="w-px h-5 bg-white/10 hidden md:block" />
        <button class="flex cursor-pointer items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors" title="Toggle sidebar">
          <PanelRight class="w-4 h-4" />
          <span class="hidden sm:inline text-xs">Course content</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <div class="flex flex-col flex-1 overflow-y-auto min-w-0">
        <div class="bg-black w-full relative aspect-video">
          <CustomPlayerLessonPlayer
            v-if="activeLesson?.videoUrl"
            :key="activeLesson._id"
            :videoUrl="activeLesson.videoUrl"
            :title="activeLesson.title"
            :poster="activeLesson.thumbnail"
            @ended="onVideoEnded"
          />

          <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Play class="w-7 h-7 text-white ml-0.5" />
            </div>
            <p class="text-sm text-gray-400">Select a lesson to begin</p>
          </div>
        </div>

        <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <p class="text-xs text-gray-500 mb-0.5">{{ curriculum[activeSectionIdx]?.title || 'Section' }}</p>
            <h1 class="text-base font-semibold text-white leading-snug">{{ activeLesson?.title || 'Select a lesson' }}</h1>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="prevLesson"
              class="flex cursor-pointer items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition-all"
            >
              <ChevronLeft class="w-3.5 h-3.5" /> Prev
            </button>
            <button @click="nextLesson" class="flex items-center gap-1 cursor-pointer text-xs px-3 py-1.5 rounded-lg bg-[#FF782D] text-white hover:bg-[#e5691f] transition-all">
              Next <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <aside class="flex-shrink-0 flex flex-col bg-[#f7f8fa] text-gray-900 border-l border-white/10 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] w-[360px]">
        <div class="w-[360px] flex flex-col h-full overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0 bg-white">
            <span class="text-sm font-semibold text-gray-900">Course content</span>
          </div>

          <div class="overflow-y-auto flex-1">
            <div v-for="(section, si) in curriculum" :key="section._id" class="border-b border-gray-200">
              <!-- Section Header -->
              <button @click="toggleSection(si)" class="w-full cursor-pointer flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 leading-snug">
                    {{ section.title }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ section.lessons.length }} lessons</p>
                </div>
                <ChevronDown class="w-4 h-4 ml-3 flex-shrink-0 transition-transform duration-300" :class="openSections.includes(si) ? 'rotate-180 text-gray-700' : 'text-gray-400'" />
              </button>

              <!-- Lessons -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[500px] opacity-100"
                leave-from-class="max-h-[500px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
              >
                <div class="overflow-hidden" v-show="openSections.includes(si)">
                  <button
                    v-for="(lesson, li) in section.lessons"
                    :key="lesson._id"
                    @click="selectLesson(Number(si), Number(li))"
                    class="w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors"
                    :class="[activeSectionIdx === si && activeLessonIdx === li ? 'bg-[#FFF0E8] border-l-2 border-[#FF782D]' : 'bg-white hover:bg-gray-50']"
                  >
                    <div class="flex-1 min-w-0">
                      <p class="text-xs leading-snug font-semibold" :class="activeSectionIdx === si && activeLessonIdx === li ? 'text-[#FF782D]' : 'text-gray-700'">
                        {{ lesson.title }}
                      </p>

                      <div class="flex items-center gap-2 mt-0.5">
                        <Play class="w-2.5 h-2.5 text-gray-400" />
                        <span class="text-[11px] text-gray-400">
                          {{ lesson.duration || 'Video' }}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
