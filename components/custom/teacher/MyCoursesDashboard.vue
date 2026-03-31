<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { Search, Plus, MoreVertical, Pencil, Trash2, Globe, BookOpen, Users, ChevronLeft, ChevronRight, LayoutGrid, List, TrendingUp } from 'lucide-vue-next';

interface Course {
  _id: string;
  title: string;
  coverImage?: string;
  status: 'draft' | 'published';
  studentsCount?: number;
  price?: number;
  createdAt?: string;
  category?: string;
  level?: string;
}

/* ── State ── */
const activeTab = ref<Course['status'] | 'all'>('all');
const searchTerm = ref('');
const currentPage = ref(1);
const coursesPerPage = 8;
const courses = ref<Course[]>([]);
const isLoading = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');
const openMenuId = ref<string | null>(null);

/* ── Hardcoded test data (replace with API call) ── */
const testCourses: Course[] = [
  {
    _id: '1',
    title: 'Complete Web Development Bootcamp',
    coverImage: 'https://placehold.co/400x220/1a1a2e/ff782d?text=Web+Dev',
    status: 'published',
    studentsCount: 1240,
    price: 89,
    createdAt: '2024-03-01',
    category: 'Development',
    level: 'Beginner',
  },
  {
    _id: '2',
    title: 'UI/UX Design Fundamentals',
    coverImage: 'https://placehold.co/400x220/1a1a2e/ff782d?text=UI+Design',
    status: 'published',
    studentsCount: 834,
    price: 69,
    createdAt: '2024-02-15',
    category: 'Design',
    level: 'All levels',
  },
  {
    _id: '3',
    title: 'Advanced React & TypeScript',
    coverImage: 'https://placehold.co/400x220/1a1a2e/ff782d?text=React',
    status: 'draft',
    studentsCount: 0,
    price: 99,
    createdAt: '2024-04-10',
    category: 'Development',
    level: 'Advanced',
  },
  {
    _id: '4',
    title: 'Data Analysis with Python',
    coverImage: 'https://placehold.co/400x220/1a1a2e/ff782d?text=Python',
    status: 'published',
    studentsCount: 512,
    price: 79,
    createdAt: '2024-01-20',
    category: 'Data',
    level: 'Intermediate',
  },
  {
    _id: '5',
    title: 'Digital Marketing Mastery',
    coverImage: 'https://placehold.co/400x220/1a1a2e/ff782d?text=Marketing',
    status: 'draft',
    studentsCount: 0,
    price: 59,
    createdAt: '2024-04-20',
    category: 'Marketing',
    level: 'Beginner',
  },
  {
    _id: '6',
    title: 'Node.js Backend Development',
    coverImage: 'https://placehold.co/400x220/1a1a2e/ff782d?text=Node.js',
    status: 'published',
    studentsCount: 390,
    price: 89,
    createdAt: '2024-03-12',
    category: 'Development',
    level: 'Intermediate',
  },
];

/* ── Fetch courses (swap test data with this when API is ready) ── */
const fetchCourses = async () => {
  try {
    isLoading.value = true;

    const token = useCookie('teacher_token').value;

    const res = await axios.get('http://localhost:3001/api/teacher/courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 IMPORTANT: map backend → frontend shape
    courses.value = res.data.map((course: any) => ({
      _id: course._id,
      title: course.title,
      coverImage: course.coverImage,
      status: course.isPublished ? 'published' : 'draft', // ✅ FIX
      studentsCount: 0, // (you don’t have it yet)
      price: course.price || 0,
      createdAt: course.createdAt,
      category: course.category,
      level: course.level,
    }));
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchCourses);

/* ── Computed ── */
const filteredCourses = computed(() => {
  let result = courses.value;
  if (activeTab.value !== 'all') {
    result = result.filter((c) => c.status === activeTab.value);
  }
  if (searchTerm.value.trim()) {
    result = result.filter((c) => c.title.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }
  return result;
});

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage;
  return filteredCourses.value.slice(start, start + coursesPerPage);
});

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / coursesPerPage));

const stats = computed(() => ({
  total: courses.value.length,
  published: courses.value.filter((c) => c.status === 'published').length,
  drafts: courses.value.filter((c) => c.status === 'draft').length,
  students: courses.value.reduce((sum, c) => sum + (c.studentsCount || 0), 0),
}));

/* ── Actions ── */
const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) currentPage.value = page;
};

const editCourse = (id: string) => navigateTo(`/teacher/courses/${id}/edit`);

const deletingId = ref<string | null>(null);

const deleteCourse = async (id: string) => {
  if (!confirm('Are you sure you want to delete this course?')) return;

  try {
    deletingId.value = id;

    const token = useCookie('teacher_token').value;

    await axios.delete(`http://localhost:3001/api/teacher/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Instant UI update
    courses.value = courses.value.filter((c) => c._id !== id);
  } catch (err) {
    console.error(err);
    alert('Delete failed');
  } finally {
    deletingId.value = null;
  }
};

const publishCourse = async (id: string) => {
  try {
    const token = useCookie('teacher_token').value;

    const res = await axios.patch(
      `http://localhost:3001/api/teacher/courses/${id}/publish`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // ✅ Update UI instantly (no refetch)
    courses.value = courses.value.map((course) =>
      course._id === id
        ? {
            ...course,
            status: res.data.isPublished ? 'published' : 'draft',
          }
        : course
    );
  } catch (err) {
    console.error(err);
  }
};

const toggleMenu = (id: string) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const closeMenus = () => {
  openMenuId.value = null;
};

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];
</script>

<template>
  <div class="min-h-screen bg-[#0d0d0f] text-white" @click="closeMenus">
    <!-- ── Page header ── -->
    <div class="border-b border-white/[0.07] bg-[#0d0d0f]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Courses</h1>
            <p class="text-sm text-zinc-500 mt-1">Manage and track all your created courses</p>
          </div>
          <button
            @click="navigateTo('/teacher/create-course')"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,120,45,0.35)] hover:shadow-[0_6px_22px_rgba(255,120,45,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer self-start sm:self-auto"
          >
            <Plus :size="16" />
            New Course
          </button>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div class="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3">
            <p class="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Total</p>
            <p class="text-2xl font-extrabold text-white mt-0.5">{{ stats.total }}</p>
          </div>
          <div class="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3">
            <p class="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Published</p>
            <p class="text-2xl font-extrabold text-emerald-400 mt-0.5">{{ stats.published }}</p>
          </div>
          <div class="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3">
            <p class="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Drafts</p>
            <p class="text-2xl font-extrabold text-yellow-400 mt-0.5">{{ stats.drafts }}</p>
          </div>
          <div class="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3">
            <p class="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Students</p>
            <p class="text-2xl font-extrabold text-orange-400 mt-0.5">{{ stats.students.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Content ── -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <!-- Tabs + Search -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <!-- Tab pills -->
          <div class="flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-xl p-1">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="
                activeTab = tab.value as any;
                currentPage = 1;
              "
              class="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
              :class="activeTab === tab.value ? 'bg-orange-500 text-white shadow-[0_2px_8px_rgba(255,120,45,0.4)]' : 'text-zinc-400 hover:text-white'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Search -->
          <div class="relative w-full sm:w-56">
            <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              type="text"
              v-model="searchTerm"
              placeholder="Search courses..."
              @input="currentPage = 1"
              class="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
        </div>

        <!-- View mode toggle -->
        <div class="flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-xl p-1 shrink-0">
          <button @click="viewMode = 'grid'" class="p-1.5 rounded-lg transition-colors cursor-pointer" :class="viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'">
            <LayoutGrid :size="15" />
          </button>
          <button @click="viewMode = 'list'" class="p-1.5 rounded-lg transition-colors cursor-pointer" :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-600 hover:text-zinc-400'">
            <List :size="15" />
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-8 h-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin"></div>
        <p class="text-sm text-zinc-500">Loading your courses...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="paginatedCourses.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div class="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <BookOpen :size="28" class="text-zinc-600" />
        </div>
        <div>
          <p class="text-base font-bold text-white">No courses found</p>
          <p class="text-sm text-zinc-500 mt-1">
            {{ searchTerm ? 'Try a different search term' : 'Create your first course to get started' }}
          </p>
        </div>
        <button
          @click="navigateTo('/teacher/create-course')"
          class="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all cursor-pointer"
        >
          <Plus :size="15" /> Create a Course
        </button>
      </div>

      <!-- ── GRID VIEW ── -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        <div
          v-for="course in paginatedCourses"
          :key="course._id"
          class="group relative bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-orange-500/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300"
        >
          <!-- Thumbnail -->
          <div class="relative aspect-video overflow-hidden">
            <img
              :src="course.coverImage || 'https://placehold.co/400x220/161618/333?text=No+Image'"
              :alt="course.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <!-- Status badge -->
            <span
              class="absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              :class="course.status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'"
            >
              {{ course.status === 'published' ? '● Published' : '○ Draft' }}
            </span>
          </div>

          <!-- Card body -->
          <div class="p-4">
            <h3 class="text-sm font-bold text-white leading-snug line-clamp-2 mb-3 group-hover:text-orange-300 transition-colors">
              {{ course.title }}
            </h3>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 text-xs text-zinc-500">
                <span class="flex items-center gap-1">
                  <Users :size="11" class="text-orange-400" />
                  {{ (course.studentsCount || 0).toLocaleString() }}
                </span>
                <span class="text-orange-400 font-bold">
                  {{ course.price === 0 ? 'Free' : `$${course.price}` }}
                </span>
              </div>

              <!-- Actions dropdown -->
              <div class="relative" @click.stop>
                <button @click="toggleMenu(course._id)" class="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                  <MoreVertical :size="14" />
                </button>

                <Transition name="fade-slide">
                  <div v-if="openMenuId === course._id" class="absolute bottom-full right-0 mb-1 w-44 bg-[#1c1c1f] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden z-20">
                    <button
                      @click="
                        editCourse(course._id);
                        closeMenus();
                      "
                      class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
                    >
                      <Pencil :size="13" class="text-orange-400" /> Edit Course
                    </button>
                    <button
                      v-if="course.status === 'draft'"
                      @click="
                        publishCourse(course._id);
                        closeMenus();
                      "
                      class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
                    >
                      <Globe :size="13" class="text-emerald-400" /> Publish
                    </button>
                    <!-- <button
                      v-if="course.status === 'published'"
                      @click="
                        publishCourse(course._id);
                        closeMenus();
                      "
                      class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
                    >
                      <Globe :size="13" class="text-yellow-400" /> Unpublish
                    </button> -->
                    <div class="h-px bg-white/[0.06] mx-2"></div>
                    <button
                      @click="
                        deleteCourse(course._id);
                        closeMenus();
                      "
                      class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 :size="13" /> Delete
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── LIST VIEW ── -->
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="course in paginatedCourses"
          :key="course._id"
          class="group flex items-center gap-4 bg-[#161618] border border-white/[0.08] rounded-xl p-3 sm:p-4 hover:border-orange-500/25 transition-all duration-200"
        >
          <!-- Thumbnail -->
          <div class="w-20 sm:w-28 aspect-video rounded-lg overflow-hidden shrink-0">
            <img :src="course.coverImage || 'https://placehold.co/400x220/161618/333?text=No+Image'" :alt="course.title" class="w-full h-full object-cover" />
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="course.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-400'">
                {{ course.status }}
              </span>
              <span v-if="course.category" class="text-[10px] text-zinc-600">{{ course.category }}</span>
            </div>
            <h3 class="text-sm font-bold text-white leading-snug truncate group-hover:text-orange-300 transition-colors">
              {{ course.title }}
            </h3>
            <div class="flex items-center gap-3 mt-1 text-xs text-zinc-500">
              <span class="flex items-center gap-1">
                <Users :size="10" class="text-orange-400" />
                {{ (course.studentsCount || 0).toLocaleString() }} students
              </span>
              <span class="text-orange-400 font-bold">{{ course.price === 0 ? 'Free' : `$${course.price}` }}</span>
            </div>
          </div>

          <!-- Action buttons (list view) -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              @click="editCourse(course._id)"
              class="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <Pencil :size="11" /> Edit
            </button>
            <button
              v-if="course.status === 'draft'"
              @click="publishCourse(course._id)"
              class="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <Globe :size="11" /> Publish
            </button>
            <button
              @click="deleteCourse(course._id)"
              class="w-7 h-7 rounded-lg flex items-center justify-center border border-white/[0.08] text-zinc-600 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>
      </div>

      <!-- ── Pagination ── -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5 mt-8">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft :size="14" />
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="w-8 h-8 rounded-full border text-xs font-bold transition-all cursor-pointer"
          :class="
            currentPage === page ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_12px_rgba(255,120,45,0.4)]' : 'border-white/[0.08] text-zinc-500 hover:text-white hover:border-white/20'
          "
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/20 disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight :size="14" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
