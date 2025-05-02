<script setup lang="ts">
import { Calendar, GraduationCap, Gauge, FileVideo2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const { article } = defineProps<{
  article: {
    title: string;
    slug: string;
    image: string;
    author: string;
    students: number;
    duration: string;
    level: string;
    lessons: number;
    price: number;
    oldPrice: number;
    category: string;
  };
}>();

const router = useRouter();

const goToCourse = () => {
  router.push(`/articles/${article.slug}`);
};
</script>
<template>
  <div
    @click="goToCourse"
    class="w-full group hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border rounded-[20px] overflow-hidden bg-white"
  >
    <!-- Left: Course Image -->
    <div class="w-full sm:w-[45%] h-full sm:h-full flex-shrink-0 relative">
      <!-- Course Image -->
      <img src="https://www.filepicker.io/api/file/eYA6E8L3TiGl0GxpQoS6" alt="Course Image" class="w-full h-full object-cover" />
    </div>

    <!-- Right: Course Content -->
    <div class="w-full sm:w-[55%] group-hover:bg-[#F5F5F5] h-auto sm:h-full px-5 py-10 flex flex-col justify-between gap-2">
      <!-- Top -->
      <div class="space-y-2">
        <h3 class="font-semibold text-[20px] group-hover:text-[#FF782D]">Best LearnPress WordPress Theme Collection for 2023</h3>

        <div class="flex items-center text-sm text-gray-500 my-4 gap-4 flex-wrap">
          <div class="flex items-center gap-1">
            <Calendar :size="20" color="#ff782d" />
            <span>Jan 24, 22023</span>
          </div>
        </div>
        <div class="short-preview">
          <p class="text-lg text-[#555555]">Looking for an amazing & well-functional LearnPress WordPress Theme? Online education...</p>
        </div>
      </div>
    </div>
  </div>
</template>
