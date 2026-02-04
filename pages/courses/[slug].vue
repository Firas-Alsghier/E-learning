<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Heart } from 'lucide-vue-next';
import type { Course } from '@/types/Course';

const selectedTab = ref('overview');
const route = useRoute();

const slug = computed(() => route.params.slug as string);

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'curriculum', label: 'المنهج الدراسي' },
  { id: 'instructor', label: 'المُدرّس' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
  { id: 'reviews', label: 'التقييمات' },
];

/* ----------------------------------
     DATA FETCH (SSR SAFE)
  ---------------------------------- */
const { data, error } = await useAsyncData<Course>(`course-${slug.value}`, () => $fetch(`http://localhost:3001/api/courses/${slug.value}`));

// ✅ THIS LINE FIXES ALL `{}` ERRORS
const course = computed(() => data.value);
console.log(course);
</script>

<template>
  <CustomBreadCrumb :items="[{ label: 'Home', href: '/' }, { label: 'Courses', href: '/courses' }, { label: slug }]" />

  <!-- ERROR -->
  <div v-if="error" class="text-red-500 p-10">Failed to load course</div>

  <!-- ================= HERO ================= -->
  <div v-else-if="course" class="bg-black h-[290px] text-white pt-8">
    <CustomContainer>
      <div class="flex flex-col lg:flex-row justify-between gap-6">
        <!-- Left -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="bg-[#555555] text-white text-sm px-3 py-2 rounded-[8px] inline-block">
              <!-- Tag -->
              photoshop
            </span>

            <p class="text-lg">
              <span class="text-[#9D9D9D]">by</span>
              {{ course.author }}
            </p>

            <Heart :size="20" fill="currentColor" class="cursor-pointer" />
          </div>

          <h1 class="text-4xl font-bold">
            {{ course.title }}
          </h1>

          <div class="flex flex-wrap gap-4 text-sm text-orange-400 mt-4">
            <span>🕒 {{ course.duration }}</span>
            <span>🎓 {{ course.studentsCount }} Students</span>
            <span>📊 {{ course.level }}</span>
            <span>📚 {{ course.lessons }} Lesson</span>
            <span>📝 {{ course.quizzesCount }} Quizzes</span>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="bg-white text-black rounded-xl p-4 w-full lg:w-[320px] shrink-0">
          <img :src="course.coverImage || '/assets/images/error.png'" alt="LMS" class="rounded-lg mb-4" />

          <div class="text-center space-y-2">
            <p v-if="course.oldPrice" class="text-sm text-gray-600 line-through">${{ course.oldPrice }}</p>

            <p class="text-2xl text-orange-500 font-bold">${{ course.price }}</p>

            <button class="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-full px-4 py-2 mt-2">البدء الآن</button>
          </div>
        </div>
      </div>
    </CustomContainer>
  </div>

  <!-- ================= TABS ================= -->
  <CustomContainer v-if="course">
    <div class="flex justify-start my-12">
      <div class="bg-gray-100 rounded-xl w-[850px] h-[340px]">
        <!-- Tabs -->
        <div class="flex justify-between rounded-t-xl bg-white border border-[#EAEAEA] overflow-hidden">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="selectedTab = tab.id"
            class="px-7 cursor-pointer w-full text-sm font-semibold py-5 border-l border-[#EAEAEA] first:rounded-tl-xl last:rounded-tr-xl first:border-l-0 transition-colors duration-300"
            :class="{
              'bg-[#F5F5F5] text-[#FF782D] font-bold': selectedTab === tab.id,
              'text-gray-700': selectedTab !== tab.id,
            }"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <Transition name="fade" mode="out-in">
          <div :key="selectedTab" class="mt-4 text-right bg-[#F5F5F5] leading-loose text-gray-800 overflow-y-auto h-[250px] px-4 py-3 rounded-b-xl">
            <CustomCoursesOverviewTab :description="course.description" v-if="selectedTab === 'overview'" />
            <CustomCoursesCurriculumTab v-if="selectedTab === 'curriculum'" />
            <CustomCoursesInstructorTab v-if="selectedTab === 'instructor'" />
            <CustomCoursesFaqsTab v-if="selectedTab === 'faq'" />
            <CustomCoursesReviewsTab v-if="selectedTab === 'reviews'" />
          </div>
        </Transition>
      </div>
    </div>
  </CustomContainer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
