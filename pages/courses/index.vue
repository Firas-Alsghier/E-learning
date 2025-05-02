<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// Fake courses array
const courses = [
  {
    title: 'Create An LMS Website With LearnPress',
    slug: 'create-an-lms-website',
    image: 'https://www.filepicker.io/api/file/eYA6E8L3TiGl0GxpQoS6',
    author: 'Determined-Poitras',
    students: 156,
    duration: '2 Weeks',
    level: 'All levels',
    lessons: 20,
    price: 0,
    oldPrice: 29,
    category: 'Programming',
  },
  {
    title: 'Mastering Vue 3 Composition API',
    slug: 'mastering-vue3-composition-api',
    image: 'https://via.placeholder.com/400x300',
    author: 'CodeMaster',
    students: 240,
    duration: '4 Weeks',
    level: 'Intermediate',
    lessons: 32,
    price: 19,
    oldPrice: 49,
    category: 'Web Development',
  },
  // Add more courses if you want
];
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
          <CustomCoursesFilterSidebar />
        </div>

        <!-- Course List + Search -->
        <div class="flex-1 w-full space-y-5">
          <!-- Top bar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="relative w-[270px] items-center">
              <Input id="search" type="text" placeholder="Search..." class="text-right border-0 border-b border-black focus:border-black focus-visible:ring-0 rounded-none pl-10" />
              <span class="absolute left-0 inset-y-0 flex items-center justify-center">
                <Search class="size-5 text-muted-foreground" />
              </span>
            </div>

            <h2 class="text-2xl font-semibold">كل الكورسات</h2>
          </div>

          <!-- Dynamic Courses -->
          <div class="space-y-6">
            <CustomCoursesCourseCard v-for="course in courses" :key="course.slug" :course="course" />
          </div>

          <!-- Pagination -->
          <div class="flex justify-center pt-4">
            <ul class="flex gap-2 text-sm">
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">‹</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center bg-black text-white">1</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">2</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">3</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">›</li>
            </ul>
          </div>
        </div>
      </div>
    </CustomContainer>
  </div>
</template>
