<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronDown, Play, PanelRight, X, Check, Lock } from 'lucide-vue-next';

definePageMeta({
  layout: false,
});
// ── Props ──────────────────────────────────────────────
interface Lesson {
  title: string;
  time: string;
  active: boolean;
  locked: boolean;
  completed: boolean;
  videoUrl?: string;
  description?: string;
}

interface Section {
  open: boolean;
  title: string;
  totalTime: string;
  lessons: Lesson[];
}

const props = withDefaults(
  defineProps<{
    courseTitle?: string;
    initialSection?: number;
    initialLesson?: number;
    sections?: Section[];
  }>(),
  {
    courseTitle: 'Course Player',
    initialSection: 0,
    initialLesson: 0,
    sections: () => [],
  }
);

// ── State ──────────────────────────────────────────────
const sidebarOpen = ref(true);
const infoTab = ref('Overview');
const videoEl = ref<HTMLVideoElement | null>(null);

const curriculum = ref<Section[]>(
  props.sections.length
    ? props.sections
    : [
        {
          open: true,
          title: 'Getting Started',
          totalTime: '45 Mins',
          lessons: [
            {
              title: 'Course introduction & setup',
              time: '12:30',
              active: false,
              locked: false,
              completed: true,
              description: 'Welcome to the course! In this lesson we set up our development environment and walk through the project structure.',
            },
            {
              title: 'Project overview & tools',
              time: '10:05',
              active: true,
              locked: false,
              completed: false,
              description: 'An overview of the tools and frameworks we will be using throughout the course.',
            },
            { title: 'Environment configuration', time: '2:25', active: false, locked: true, completed: false, description: 'Deep dive into configuring your local environment for optimal DX.' },
          ],
        },
        {
          open: true,
          title: 'Core Concepts',
          totalTime: '45 Mins',
          lessons: [
            {
              title: 'Vue 3 reactivity system',
              time: '8:15',
              active: false,
              locked: false,
              completed: true,
              description: "Understand how Vue 3's proxy-based reactivity system works under the hood.",
            },
            {
              title: 'Composition API deep dive',
              time: '7:20',
              active: false,
              locked: false,
              completed: false,
              description: 'A practical walkthrough of the Composition API and when to prefer it over Options API.',
            },
            {
              title: 'Props & emits patterns',
              time: '6:45',
              active: false,
              locked: false,
              completed: false,
              description: 'Best practices for passing data down and emitting events back up the component tree.',
            },
            { title: 'Provide / inject', time: '6:40', active: false, locked: false, completed: false },
            { title: 'Slots & scoped slots', time: '5:55', active: false, locked: false, completed: false },
          ],
        },
        {
          open: false,
          title: 'Advanced Patterns',
          totalTime: '45 Mins',
          lessons: [
            { title: 'Pinia state management', time: '4:35', active: false, locked: false, completed: false },
            { title: 'Custom composables', time: '6:10', active: false, locked: false, completed: false },
            { title: 'Performance optimisation', time: '5:00', active: false, locked: false, completed: false },
            { title: 'Testing with Vitest', time: '5:15', active: false, locked: false, completed: false },
            { title: 'Final project walkthrough', time: '4:00', active: false, locked: false, completed: false },
          ],
        },
      ]
);

const activeSectionIdx = ref(props.initialSection);
const activeLessonIdx = ref(props.initialLesson);

// ── Computed ───────────────────────────────────────────
const activeLesson = computed<Lesson | null>(() => curriculum.value[activeSectionIdx.value]?.lessons[activeLessonIdx.value] ?? null);

const activeSectionTitle = computed(() => curriculum.value[activeSectionIdx.value]?.title ?? '');

const allLessons = computed(() => curriculum.value.flatMap((s, si) => s.lessons.map((l, li) => ({ si, li, lesson: l }))));

const totalLessons = computed(() => allLessons.value.length);
const completedCount = computed(() => allLessons.value.filter((x) => x.lesson.completed).length);
const overallProgress = computed(() => (totalLessons.value ? Math.round((completedCount.value / totalLessons.value) * 100) : 0));

const currentFlatIdx = computed(() => allLessons.value.findIndex((x) => x.si === activeSectionIdx.value && x.li === activeLessonIdx.value));

const canGoPrev = computed(() => currentFlatIdx.value > 0);
const canGoNext = computed(() => currentFlatIdx.value < allLessons.value.length - 1);

// ── Methods ────────────────────────────────────────────
function isActive(si: number, li: number) {
  return si === activeSectionIdx.value && li === activeLessonIdx.value;
}

function selectLesson(si: number, li: number) {
  const lesson = curriculum.value[si]?.lessons[li];
  if (!lesson || lesson.locked) return;
  activeSectionIdx.value = si;
  activeLessonIdx.value = li;
}

function sectionCompletedCount(section: Section) {
  return section.lessons.filter((l) => l.completed).length;
}

function nextLesson() {
  const next = allLessons.value[currentFlatIdx.value + 1];
  if (!next || next.lesson.locked) return;
  // Mark current as completed
  curriculum.value[activeSectionIdx.value].lessons[activeLessonIdx.value].completed = true;
  selectLesson(next.si, next.li);
}

function prevLesson() {
  const prev = allLessons.value[currentFlatIdx.value - 1];
  if (!prev) return;
  selectLesson(prev.si, prev.li);
}

function onVideoEnded() {
  curriculum.value[activeSectionIdx.value].lessons[activeLessonIdx.value].completed = true;
}
</script>

<template>
  <div class="flex flex-col h-screen bg-[#1c1d1f] text-white font-['DM_Sans',sans-serif] overflow-hidden">
    <!-- ── Top navbar ── -->
    <header class="flex items-center justify-between px-4 h-12 bg-[#1c1d1f] border-b border-white/10 flex-shrink-0 z-10">
      <div class="flex items-center gap-4">
        <!-- Back to course -->
        <button @click="$router.back()" class="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors">
          <ChevronLeft class="w-4 h-4" />
          <span class="hidden sm:inline">Back to course</span>
        </button>
        <div class="w-px h-5 bg-white/10" />
        <span class="text-sm font-medium text-white truncate max-w-[340px]">{{ courseTitle }}</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- Progress -->
        <div class="hidden md:flex items-center gap-2">
          <div class="w-28 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-[#FF782D] rounded-full transition-all duration-500" :style="{ width: overallProgress + '%' }" />
          </div>
          <span class="text-xs text-gray-400">{{ completedCount }}/{{ totalLessons }} complete</span>
        </div>
        <div class="w-px h-5 bg-white/10 hidden md:block" />
        <!-- Toggle sidebar -->
        <button @click="sidebarOpen = !sidebarOpen" class="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors" :title="sidebarOpen ? 'Hide sidebar' : 'Show sidebar'">
          <PanelRight class="w-4 h-4" />
          <span class="hidden sm:inline text-xs">Course content</span>
        </button>
      </div>
    </header>

    <!-- ── Main layout ── -->
    <div class="flex flex-1 overflow-hidden">
      <!-- ── Video + info area ── -->
      <div class="flex flex-col flex-1 overflow-y-auto min-w-0">
        <!-- Video player -->
        <div class="bg-black w-full relative" style="aspect-ratio: 16/9; max-height: 72vh">
          <video v-if="activeLesson" :src="activeLesson.videoUrl || undefined" class="w-full h-full object-contain" controls autoplay ref="videoEl" @ended="onVideoEnded" />

          <!-- Placeholder when no video src -->
          <div v-if="!activeLesson?.videoUrl" class="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <Play class="w-7 h-7 text-white ml-0.5" />
            </div>
            <p class="text-sm text-gray-400">{{ activeLesson?.title ?? 'Select a lesson to begin' }}</p>
          </div>
        </div>

        <!-- Lesson info bar -->
        <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <p class="text-xs text-gray-500 mb-0.5">{{ activeSectionTitle }}</p>
            <h1 class="text-base font-semibold text-white leading-snug">{{ activeLesson?.title ?? 'No lesson selected' }}</h1>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="prevLesson"
              :disabled="!canGoPrev"
              class="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft class="w-3.5 h-3.5" /> Prev
            </button>
            <button
              @click="nextLesson"
              :disabled="!canGoNext"
              class="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#FF782D] text-white hover:bg-[#e5691f] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Lesson description / tabs -->
        <!-- <div class="px-6 py-5 flex-1">
          <div class="flex gap-6 border-b border-white/10 mb-5">
            <button
              v-for="t in ['Overview', 'Resources']"
              :key="t"
              @click="infoTab = t"
              class="text-sm pb-3 transition-colors"
              :class="infoTab === t ? 'text-white font-semibold border-b-2 border-[#FF782D]' : 'text-gray-500 hover:text-gray-300'"
            >
              {{ t }}
            </button>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed max-w-2xl">
            {{ activeLesson?.description ?? 'Select a lesson from the sidebar to get started.' }}
          </p>
        </div> -->
      </div>

      <!-- ── Sidebar ── -->
      <aside
        class="flex-shrink-0 flex flex-col bg-[#f7f8fa] text-gray-900 border-l border-white/10 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :class="sidebarOpen ? 'w-[360px]' : 'w-0'"
      >
        <div class="w-[360px] flex flex-col h-full overflow-hidden">
          <!-- Sidebar header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0 bg-white">
            <span class="text-sm font-semibold text-gray-900">Course content</span>
            <button @click="sidebarOpen = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Sections -->
          <div class="overflow-y-auto flex-1">
            <div v-for="(section, si) in curriculum" :key="si" class="border-b border-gray-200">
              <!-- Section header -->
              <button class="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left" @click="section.open = !section.open">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 leading-snug">{{ section.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ sectionCompletedCount(section) }}/{{ section.lessons.length }} | {{ section.totalTime }}</p>
                </div>
                <ChevronDown class="w-4 h-4 text-gray-400 ml-3 flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-180': section.open }" />
              </button>

              <!-- Lessons -->
              <div class="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" :style="section.open ? { maxHeight: '1000px' } : { maxHeight: '0px' }">
                <button
                  v-for="(lesson, li) in section.lessons"
                  :key="li"
                  :disabled="lesson.locked"
                  @click="selectLesson(si, li)"
                  class="w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors"
                  :class="{
                    'bg-[#FFF0E8] border-l-2 border-[#FF782D]': isActive(si, li),
                    'hover:bg-gray-100': !isActive(si, li) && !lesson.locked,
                    'opacity-50 cursor-not-allowed': lesson.locked,
                    'bg-white': !isActive(si, li),
                  }"
                >
                  <!-- Completion dot -->
                  <div class="flex-shrink-0 mt-0.5">
                    <div
                      class="w-4 h-4 rounded-full border flex items-center justify-center"
                      :class="{
                        'bg-[#FF782D] border-[#FF782D]': lesson.completed,
                        'border-gray-300 bg-white': !lesson.completed && !lesson.locked,
                        'border-gray-200 bg-gray-100': lesson.locked,
                      }"
                    >
                      <Check v-if="lesson.completed" class="w-2.5 h-2.5 text-white" />
                      <Lock v-else-if="lesson.locked" class="w-2 h-2 text-gray-400" />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <p
                      class="text-xs leading-snug"
                      :class="{
                        'text-[#FF782D] font-semibold': isActive(si, li),
                        'text-gray-700': !isActive(si, li) && !lesson.locked,
                        'text-gray-400': lesson.locked,
                      }"
                    >
                      {{ lesson.title }}
                    </p>
                    <div class="flex items-center gap-2 mt-0.5">
                      <Play class="w-2.5 h-2.5 text-gray-400" />
                      <span class="text-[11px] text-gray-400">{{ lesson.time }}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
