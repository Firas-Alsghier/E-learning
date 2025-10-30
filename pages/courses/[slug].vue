<script setup lang="ts">
const selectedTab = ref('overview');
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { Heart } from 'lucide-vue-next'; // Added Heart icon

const route = useRoute();

// Safer: make slug computed
const slug = computed(() => route.params.slug as string);
const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'curriculum', label: 'المنهج الدراسي' },
  { id: 'instructor', label: 'المُدرّس' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
  { id: 'reviews', label: 'التقييمات' },
];
</script>
<template>
  <CustomBreadCrumb :items="[{ label: 'Home', href: '/' }, { label: 'Courses', href: '/courses' }, { label: slug }]" />
  <div class="bg-black h-[290px] text-white pt-8">
    <CustomContainer>
      <div class="flex flex-col lg:flex-row justify-between gap-6">
        <!-- Left: Course Info -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="bg-[#555555] text-white text-sm px-3 py-2 rounded-[8px] inline-block">Photography</span>
            <p class="text-lg"><span class="text-[#9D9D9D]">by</span> Determined-Poitras</p>
            <Heart :size="20" fill="currentColor" class="cursor-pointer" />
          </div>
          <h1 class="text-4xl font-bold">The Ultimate Guide To The Best WordPress LMS Plugin</h1>

          <div class="flex flex-wrap gap-4 text-sm text-orange-400 mt-4">
            <span>🕒 2Weeks</span>
            <span>🎓 156 Students</span>
            <span>📊 All levels</span>
            <span>📚 20 Lessons</span>
            <span>📝 3 Quizzes</span>
          </div>
        </div>

        <!-- Sidebar Card -->
        <div class="bg-white text-black rounded-xl p-4 w-full lg:w-[320px] shrink-0">
          <img src="/assets/images/error.png" alt="LMS" class="rounded-lg mb-4" />
          <div class="text-center space-y-2">
            <p class="text-sm text-gray-600 line-through">$59.0</p>
            <p class="text-2xl text-orange-500 font-bold">$49.0</p>
            <button class="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 mt-2">البدء الآن</button>
          </div>
        </div>
      </div>
    </CustomContainer>
  </div>

  <!-- Tabs Section -->
  <CustomContainer>
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
        <!-- Tab Content with fade transition -->
        <Transition name="fade" mode="out-in">
          <div :key="selectedTab" class="mt-4 text-right bg-[#F5F5F5] leading-loose text-gray-800 overflow-y-auto h-[250px] px-4 py-3 rounded-b-xl">
            <CustomCoursesOverviewTab v-if="selectedTab === 'overview'" />
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
