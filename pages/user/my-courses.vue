<script setup lang="ts">
import { ref, computed } from 'vue';
import { BookOpen, Clock, Play, CheckCircle, Search, LayoutGrid, List, Trophy, TrendingUp, Filter } from 'lucide-vue-next';

definePageMeta({
  middleware: ['user-auth'],
  layout: false,
});

interface EnrolledCourse {
  id: string;
  title: string;
  author: string;
  image: string;
  category: string;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  lastAccessed: string;
  slug: string;
  expiresAt: string;
}

const token = useCookie('token');
// ── Hardcoded test data ──────────────────────────────────────────────────────
// Replace with your real API call when ready
const courses = ref<EnrolledCourse[]>([]);

const loadCourses = async () => {
  try {
    const data: any = await $fetch('http://localhost:3001/api/purchases/my-courses', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    courses.value = data.map((purchase: any) => ({
      id: purchase.course._id,
      title: purchase.course.title,
      author: `${purchase.course.teacher.firstName} ${purchase.course.teacher.lastName}`,
      image: purchase.course.coverImage,
      category: purchase.course.category,
      totalLessons: purchase.course.totalLessons || 0,
      completedLessons: 0,
      duration: purchase.course.accessDuration ? `${purchase.course.accessDuration} days` : 'N/A',
      lastAccessed: purchase.purchaseDate,
      slug: purchase.course.slug,
      expiresAt: purchase.expiresAt,
    }));
    console.log(courses.value);
  } catch (err) {
    console.error(err);
  }
};

// ── State ────────────────────────────────────────────────────────────────────
const searchQuery = ref('');
const activeFilter = ref<'all' | 'in-progress' | 'completed' | 'not-started'>('all');
const viewMode = ref<'grid' | 'list'>('grid');

// ── Helpers ──────────────────────────────────────────────────────────────────
const getProgress = (course: EnrolledCourse) => (course.totalLessons === 0 ? 0 : Math.round((course.completedLessons / course.totalLessons) * 100));

const getStatus = (course: EnrolledCourse) => {
  const p = getProgress(course);
  if (p === 100) return 'completed';
  if (p === 0) return 'not-started';
  return 'in-progress';
};

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const hasExpired = (course: EnrolledCourse) => {
  return new Date(course.expiresAt) < new Date();
};

// ── Stats ────────────────────────────────────────────────────────────────────
const stats = computed(() => ({
  total: courses.value.length,
  completed: courses.value.filter((c) => getStatus(c) === 'completed').length,
  inProgress: courses.value.filter((c) => getStatus(c) === 'in-progress').length,
  notStarted: courses.value.filter((c) => getStatus(c) === 'not-started').length,
}));

// ── Filtered list ─────────────────────────────────────────────────────────────
const filteredCourses = computed(() => {
  let result = courses.value;

  if (activeFilter.value !== 'all') {
    result = result.filter((c) => getStatus(c) === activeFilter.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((c) => c.title.toLowerCase().includes(q) || c.author.toLowerCase().includes(q));
  }

  return result;
});

const filters = [
  { value: 'all', label: 'All Courses' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'not-started', label: 'Not Started' },
];

// ── Progress bar color ────────────────────────────────────────────────────────
const progressColor = (course: EnrolledCourse) => {
  const p = getProgress(course);
  if (p === 100) return 'bg-emerald-500';
  if (p >= 50) return 'bg-orange-500';
  return 'bg-orange-500/70';
};

onMounted(() => {
  loadCourses();
});
</script>

<template>
  <div class="min-h-screen bg-[#0d0d0f] text-white">
    <!-- Glow -->
    <div class="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-40" style="background: radial-gradient(circle, rgba(255, 120, 45, 0.07) 0%, transparent 70%)"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
      <!-- ── Page header ── -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Courses</h1>
          <p class="text-sm text-zinc-500 mt-0.5">Track your learning progress</p>
        </div>
        <a
          href="/courses"
          class="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_22px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 transition-all"
        >
          <BookOpen :size="15" /> Browse More Courses
        </a>
      </div>

      <!-- ── Stats row ── -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3 flex flex-col gap-1">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Total</p>
          <p class="text-2xl font-extrabold text-white">{{ stats.total }}</p>
        </div>
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3 flex flex-col gap-1">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">In Progress</p>
          <p class="text-2xl font-extrabold text-orange-400">{{ stats.inProgress }}</p>
        </div>
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3 flex flex-col gap-1">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Completed</p>
          <p class="text-2xl font-extrabold text-emerald-400">{{ stats.completed }}</p>
        </div>
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3 flex flex-col gap-1">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Not Started</p>
          <p class="text-2xl font-extrabold text-zinc-500">{{ stats.notStarted }}</p>
        </div>
      </div>

      <!-- ── Toolbar ── -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <!-- Filter tabs -->
          <div class="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 overflow-x-auto max-w-full" style="scrollbar-width: none">
            <button
              v-for="f in filters"
              :key="f.value"
              @click="activeFilter = f.value as any"
              class="px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer"
              :class="activeFilter === f.value ? 'bg-orange-500 text-white shadow-[0_2px_10px_rgba(255,120,45,0.4)]' : 'text-zinc-500 hover:text-white'"
            >
              {{ f.label }}
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full sm:w-52">
            <Search :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search courses..."
              class="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
        </div>

        <!-- View toggle -->
        <div class="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 shrink-0">
          <button @click="viewMode = 'grid'" class="p-1.5 rounded-lg transition-colors cursor-pointer" :class="viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'">
            <LayoutGrid :size="15" />
          </button>
          <button @click="viewMode = 'list'" class="p-1.5 rounded-lg transition-colors cursor-pointer" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'">
            <List :size="15" />
          </button>
        </div>
      </div>

      <!-- ── Empty state ── -->
      <div v-if="filteredCourses.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 text-center bg-[#161618] border border-white/[0.07] rounded-2xl">
        <div class="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <BookOpen :size="24" class="text-zinc-600" />
        </div>
        <div>
          <p class="text-base font-bold text-white">No courses found</p>
          <p class="text-sm text-zinc-500 mt-1">
            {{ searchQuery ? 'Try a different search term.' : 'You have no courses in this category yet.' }}
          </p>
        </div>
      </div>

      <!-- ── GRID VIEW ── -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="group bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-orange-500/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col"
        >
          <!-- Thumbnail -->
          <div class="relative aspect-video overflow-hidden shrink-0">
            <img :src="course.image" :alt="course.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

            <!-- Category -->
            <span class="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/10">
              {{ course.category }}
            </span>

            <!-- Completed badge -->
            <div v-if="getStatus(course) === 'completed'" class="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-2.5 py-1">
              <CheckCircle :size="11" class="text-emerald-400" />
              <span class="text-[10px] font-bold text-emerald-400">Done</span>
            </div>

            <!-- Progress % overlay on bottom -->
            <div class="absolute bottom-3 left-3 right-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[11px] font-bold text-white/90">
                  {{ getProgress(course) === 0 ? 'Not started' : `${getProgress(course)}% complete` }}
                </span>
                <span class="text-[11px] text-white/60">{{ course.completedLessons }}/{{ course.totalLessons }}</span>
              </div>
              <div class="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :class="progressColor(course)" :style="{ width: getProgress(course) + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Card body -->
          <div class="flex flex-col flex-1 p-4 sm:p-5 gap-3">
            <div class="flex-1">
              <h3 class="text-sm font-bold text-white leading-snug group-hover:text-orange-300 transition-colors line-clamp-2">
                {{ course.title }}
              </h3>
              <p class="text-xs text-zinc-500 mt-1">
                By <span class="text-zinc-300 font-medium">{{ course.author }}</span>
              </p>
            </div>

            <div class="flex items-center gap-3 text-xs text-zinc-600">
              <span class="flex items-center gap-1"> <Clock :size="11" class="text-zinc-700" /> {{ course.duration }} </span>
              <span>·</span>
              <span>Last: {{ formatDate(course.lastAccessed) }}</span>
            </div>

            <!-- CTA -->
            <a
              :href="`/learn/${course.id}`"
              class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
              :class="
                getStatus(course) === 'completed'
                  ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25'
                  : getStatus(course) === 'not-started'
                  ? 'bg-orange-500 text-white shadow-[0_3px_12px_rgba(255,120,45,0.3)] hover:bg-orange-600 hover:shadow-[0_5px_18px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-orange-500 text-white shadow-[0_3px_12px_rgba(255,120,45,0.3)] hover:bg-orange-600 hover:shadow-[0_5px_18px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 active:translate-y-0'
              "
            >
              <template v-if="getStatus(course) === 'completed'"> <CheckCircle :size="14" /> Review Course </template>
              <template v-else-if="getStatus(course) === 'not-started'"> <Play :size="14" fill="currentColor" /> Start Learning </template>
              <template v-else> <Play :size="14" fill="currentColor" /> Continue </template>
            </a>
          </div>
        </div>
      </div>

      <!-- ── LIST VIEW ── -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="course in filteredCourses"
          :key="course.id"
          class="group flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#161618] border border-white/[0.08] rounded-2xl p-4 hover:border-orange-500/20 transition-all duration-200"
        >
          <!-- Thumbnail -->
          <div class="relative w-full sm:w-32 aspect-video sm:aspect-auto sm:h-20 rounded-xl overflow-hidden shrink-0">
            <img :src="course.image" :alt="course.title" class="w-full h-full object-cover" />
          </div>

          <!-- Info + progress -->
          <div class="flex-1 min-w-0 flex flex-col gap-2">
            <div>
              <h3 class="text-sm font-bold text-white leading-snug truncate group-hover:text-orange-300 transition-colors">
                {{ course.title }}
              </h3>
              <p class="text-xs text-zinc-500 mt-0.5">
                By <span class="text-zinc-400">{{ course.author }}</span>
                <span class="mx-1.5 text-zinc-700">·</span>
                <span class="text-zinc-600">{{ course.category }}</span>
              </p>
            </div>

            <!-- Progress bar -->
            <div class="flex items-center gap-3">
              <div class="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :class="progressColor(course)" :style="{ width: getProgress(course) + '%' }"></div>
              </div>
              <span class="text-[11px] font-bold tabular-nums shrink-0" :class="getStatus(course) === 'completed' ? 'text-emerald-400' : 'text-orange-400'"> {{ getProgress(course) }}% </span>
            </div>

            <p class="text-[11px] text-zinc-600">{{ course.completedLessons }}/{{ course.totalLessons }} lessons · Last accessed {{ formatDate(course.lastAccessed) }}</p>
          </div>

          <!-- CTA -->
          <a
            :href="`/learn/${course.id}`"
            class="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl shrink-0 transition-all cursor-pointer"
            :class="getStatus(course) === 'completed' ? 'bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25' : 'bg-orange-500 text-white hover:bg-orange-600'"
          >
            <CheckCircle v-if="getStatus(course) === 'completed'" :size="12" />
            <Play v-else :size="12" fill="currentColor" />
            {{ getStatus(course) === 'completed' ? 'Review' : getStatus(course) === 'not-started' ? 'Start' : 'Continue' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
