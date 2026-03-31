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
const searchQuery = ref('');

// ✅ FIX: Added missing mobile filter state
const showMobileFilter = ref(false);

// ✅ FIX: Added missing properties to match sidebar requirements
const activeFilters = ref({
  categories: [] as string[],
  levels: [] as string[],
  ratings: [] as number[], // Added
  hours: [] as string[], // Added
  price: [] as string[],
});

/* =======================
     FETCH LOGIC
  ======================= */
const getUserWishlist = async (): Promise<string[]> => {
  try {
    const token = useCookie('token').value;
    if (!token) return [];

    const res = await fetch('http://localhost:3001/api/user/wishlist', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.map((course: any) => course.id);
  } catch (err) {
    console.error('Wishlist fetch error:', err);
    return [];
  }
};

const fetchCourses = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/courses');
    if (!res.ok) throw new Error('Failed to fetch courses');

    const data: Index[] = await res.json();
    const wishlistIds = await getUserWishlist();

    courses.value = data.map((course) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      createdAt: course.createdAt,
      image: course.image || '/images/course-placeholder.jpeg',
      author: course.author,
      students: course.studentsCount ?? 0,
      level: course.level ?? 'All levels',
      lessons: course.lessonsCount ?? 0,
      price: course.price,
      oldPrice: course.oldPrice ?? 0,
      category: course.category ?? 'General',
      isWishlisted: wishlistIds.includes(course.id),
    }));
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

/* =======================
     WISHLIST ACTION
  ======================= */
const toggleWishlist = async (id: string) => {
  try {
    const course = courses.value.find((c) => c.id === id);
    if (!course) return;

    const token = useCookie('token').value;
    if (!token) {
      alert('You must login first');
      return;
    }

    const res = await fetch(`http://localhost:3001/api/user/wishlist/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to update wishlist');

    const data = await res.json();
    course.isWishlisted = data.wishlist.includes(id);
  } catch (err) {
    console.error('Wishlist error:', err);
  }
};

/* =======================
     FILTERS & PAGINATION
  ======================= */
const filteredCourses = computed(() => {
  let result = courses.value;
  const query = searchQuery.value.trim().toLowerCase();

  if (query) {
    result = result.filter((course) => course.title.toLowerCase().includes(query));
  }
  if (activeFilters.value.categories.length) {
    result = result.filter((course) => activeFilters.value.categories.includes(course.category));
  }
  if (activeFilters.value.levels.length) {
    result = result.filter((course) => activeFilters.value.levels.includes(course.level));
  }
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
  return filteredCourses.value.slice(start, start + coursesPerPage);
});

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / coursesPerPage));

const handleApplyFilters = (filters: any) => {
  activeFilters.value = filters;
  router.push({
    query: {
      ...route.query,
      category: filters.categories.join(',') || undefined,
      level: filters.levels.join(',') || undefined,
      price: filters.price.join(',') || undefined,
      ratings: filters.ratings?.join(',') || undefined, // Sync added fields to URL
      hours: filters.hours?.join(',') || undefined, // Sync added fields to URL
      page: 1,
    },
  });
  currentPage.value = 1;
};

onMounted(() => {
  fetchCourses();
  if (route.query.category) activeFilters.value.categories = String(route.query.category).split(',');
  if (route.query.level) activeFilters.value.levels = String(route.query.level).split(',');
  if (route.query.price) activeFilters.value.price = String(route.query.price).split(',');

  // ✅ Restore missing fields from URL on mount
  if (route.query.ratings) activeFilters.value.ratings = String(route.query.ratings).split(',').map(Number);
  if (route.query.hours) activeFilters.value.hours = String(route.query.hours).split(',');

  if (route.query.page) currentPage.value = Number(route.query.page);
});

watch(
  () => route.query,
  (query) => {
    activeFilters.value.categories = query.category ? String(query.category).split(',') : [];
    activeFilters.value.levels = query.level ? String(query.level).split(',') : [];
    activeFilters.value.price = query.price ? String(query.price).split(',') : [];
    // ✅ Keep sync for new fields
    activeFilters.value.ratings = query.ratings ? String(query.ratings).split(',').map(Number) : [];
    activeFilters.value.hours = query.hours ? String(query.hours).split(',') : [];
    currentPage.value = query.page ? Number(query.page) : 1;
  }
);

watch(currentPage, (page) => {
  router.push({ query: { ...route.query, page } });
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
        <div class="w-full lg:max-w-[280px]">
          <CustomCoursesFilterSidebar :filters="activeFilters" @apply-filters="handleApplyFilters" />
        </div>

        <div class="flex-1 w-full space-y-5">
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

          <div v-if="loading" class="text-center py-10 text-gray-500">Loading courses...</div>

          <div v-else-if="error" class="text-center py-10 text-red-500">
            {{ error }}
          </div>

          <div v-else class="space-y-6">
            <CustomCoursesCourseCard v-for="course in paginatedCourses" :key="course.id" :course="course" @toggle-wishlist="toggleWishlist" />

            <div v-if="paginatedCourses.length === 0" class="text-center py-10 text-gray-400">No courses found matching your criteria.</div>
          </div>

          <div class="flex justify-center pt-6" v-if="totalPages > 1">
            <ul class="flex gap-2 text-sm">
              <li
                class="border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer select-none"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
                @click="currentPage > 1 && currentPage--"
              >
                ‹
              </li>

              <li
                v-for="page in totalPages"
                :key="page"
                class="border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
                :class="page === currentPage ? 'bg-black text-white' : 'hover:bg-gray-100'"
                @click="currentPage = page"
              >
                {{ page }}
              </li>

              <li
                class="border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer select-none"
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
