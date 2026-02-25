<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Search } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';
import type { Index } from '@/types/Course';

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
    console.log(data[0].author);

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
    console.log(courses.value);
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCourses);

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
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) return courses.value;

  return courses.value.filter((course) => course.title.toLowerCase().includes(query));
});

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage;
  const end = start + coursesPerPage;

  return filteredCourses.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / coursesPerPage);
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
          <CustomCoursesFilterSidebar :show="showMobileFilter" @close="showMobileFilter = false" />
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
