<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';
import type { Index } from '@/types/Course';
/* =======================
     Vue router
  ======================= */
const route = useRoute();
const router = useRouter();
/* =======================
     STATE
  ======================= */
const { t } = useI18n();
const auth = useAuthStore();
const currentPage = ref(1);
const coursesPerPage = 5;
const courses = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showMobileFilter = ref(false);
const searchQuery = ref('');
/* =======================
     FETCH COURSES
  ======================= */
const fetchCourses = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/courses');
    if (!res.ok) throw new Error('Failed to fetch courses');

    const data: Index[] = await res.json();
    // console.log(data[0].author);

    courses.value = data.map((course) => ({
      title: course.title,
      slug: course.slug,

      // ✅ FIX IS HERE
      image: course.image || 'http://localhost:3000/images/course-placeholder.jpg',

      author: data[0].author,

      students: course.studentsCount ?? 0,
      duration: course.totalDuration ?? '—',
      level: course.level ?? 'All levels',
      lessons: course.lessonsCount ?? 0,
      price: course.price,
      oldPrice: course.oldPrice ?? 0,
      category: course.category ?? 'General',
      isWishlisted: false,
    }));
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const activeFilters = ref({
  categories: [] as string[],
  levels: [] as string[],
  ratings: [] as number[],
  hours: [] as string[],
  price: [] as string[],
});

onMounted(() => {
  fetchCourses();

  // Restore filters from URL
  if (route.query.category) {
    activeFilters.value.categories = String(route.query.category).split(',');
  }

  if (route.query.level) {
    activeFilters.value.levels = String(route.query.level).split(',');
  }

  if (route.query.price) {
    activeFilters.value.price = String(route.query.price).split(',');
  }

  if (route.query.page) {
    currentPage.value = Number(route.query.page);
  }
});

/* =======================
     WISHLIST (FRONTEND ONLY)
  ======================= */
const toggleWishlist = (slug: string) => {
  const course = courses.value.find((c) => c.slug === slug);
  if (course) {
    course.isWishlisted = !course.isWishlisted;
  }
};

const filteredCourses = computed(() => {
  let result = courses.value;

  // 🔍 Search
  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    result = result.filter((course) => course.title.toLowerCase().includes(query));
  }

  // 📂 Category filter
  if (activeFilters.value.categories.length) {
    result = result.filter((course) => activeFilters.value.categories.includes(course.category));
  }

  // 🎓 Level filter
  if (activeFilters.value.levels.length) {
    result = result.filter((course) => activeFilters.value.levels.includes(course.level));
  }

  // 💲 Price filter
  if (activeFilters.value.price.length) {
    result = result.filter((course) => {
      if (activeFilters.value.price.includes('free') && course.price === 0) return true;
      if (activeFilters.value.price.includes('paid') && course.price > 0) return true;
      return false;
    });
  }

  return result;
});

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage;
  const end = start + coursesPerPage;

  return filteredCourses.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / coursesPerPage);
});

const handleApplyFilters = (filters: any) => {
  activeFilters.value = filters;

  router.push({
    query: {
      ...route.query,
      category: filters.categories.join(',') || undefined,
      level: filters.levels.join(',') || undefined,
      price: filters.price.join(',') || undefined,
      page: 1,
    },
  });

  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
};

watch(
  () => route.query,
  (query) => {
    activeFilters.value.categories = query.category ? String(query.category).split(',') : [];
    activeFilters.value.levels = query.level ? String(query.level).split(',') : [];
    activeFilters.value.price = query.price ? String(query.price).split(',') : [];
    currentPage.value = query.page ? Number(query.page) : 1;
  }
);

watch(currentPage, (page) => {
  router.push({
    query: {
      ...route.query,
      page,
    },
  });
});

watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<template>
  <div class="courses-page w-full bg-white">
    <CustomBreadCrumb
      :items="[
        { label: 'Home', href: '/' },
        { label: 'Courses', href: '/courses' },
      ]"
    />

    <CustomContainer>
      <div class="flex flex-col lg:flex-row-reverse gap-4 my-14">
        <!-- Filters -->
        <div class="w-full lg:max-w-[280px]">
          <CustomCoursesFilterSidebar :filters="activeFilters" @apply-filters="handleApplyFilters" />
        </div>

        <!-- MAIN -->
        <div class="flex-1 w-full space-y-5">
          <!-- TOP BAR -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="relative w-[270px] max-sm:w-full">
              <Input type="text" placeholder="Search..." v-model="searchQuery" class="border-0 border-b border-black focus-visible:ring-0 rounded-none pl-10" />
              <span class="absolute left-0 inset-y-0 flex items-center">
                <Search class="size-5 text-muted-foreground" />
              </span>
            </div>

            <div class="flex items-center gap-4">
              <button class="lg:hidden border px-3 py-2 rounded-md" @click="showMobileFilter = true">Filter</button>

              <h2 class="text-2xl font-semibold" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                {{ t('all-courses') }}
              </h2>
            </div>
          </div>

          <!-- STATES -->
          <div v-if="loading" class="text-center py-10 text-gray-500">Loading courses...</div>

          <div v-else-if="error" class="text-center py-10 text-red-500">
            {{ error }}
          </div>

          <!-- COURSES -->
          <div v-else class="space-y-6">
            <CustomCoursesCourseCard v-for="course in paginatedCourses" :key="course.slug" :course="course" @toggle-wishlist="toggleWishlist" />
          </div>

          <!-- PAGINATION (STATIC FOR NOW) -->
          <div class="flex justify-center pt-6" v-if="totalPages > 1">
            <ul class="flex gap-2 text-sm">
              <!-- Previous -->
              <li
                class="border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                @click="currentPage > 1 && currentPage--"
              >
                ‹
              </li>

              <!-- Page Numbers -->
              <li
                v-for="page in totalPages"
                :key="page"
                class="border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                :class="page === currentPage ? 'bg-black text-white' : ''"
                @click="currentPage = page"
              >
                {{ page }}
              </li>

              <!-- Next -->
              <li
                class="border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
                @click="currentPage < totalPages && currentPage++"
              >
                ›
              </li>
            </ul>
          </div>
        </div>
      </div>
    </CustomContainer>
  </div>
</template>
