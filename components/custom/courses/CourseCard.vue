<script setup lang="ts">
import { Calendar, GraduationCap, Gauge, FileVideo2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const { course } = defineProps<{
  course: {
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
  router.push(`/courses/${course.slug}`);
};
</script>

<template>
  <div class="w-full max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border rounded-[20px] overflow-hidden bg-white">
    <!-- Left: Course Image -->
    <div class="w-full sm:w-[45%] h-full sm:h-full flex-shrink-0 relative">
      <!-- Label -->
      <span class="absolute top-2 left-2 bg-black font-medium text-sm text-white px-3 py-3 rounded-lg z-10">
        {{ course.category }}
      </span>

      <!-- Course Image -->
      <img :src="course.image" alt="Course Image" class="w-full h-full object-cover" />
    </div>

    <!-- Right: Course Content -->
    <div class="w-full sm:w-[55%] h-auto sm:h-full px-4 py-5 flex flex-col justify-between gap-2">
      <!-- Top -->
      <div class="space-y-2">
        <p class="text-sm text-gray-500">
          by <span class="font-medium text-black">{{ course.author }}</span>
        </p>
        <h3 class="font-semibold text-[20px]">{{ course.title }}</h3>

        <div class="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
          <div class="flex items-center gap-1">
            <Calendar :size="20" color="#ff782d" />
            <span>{{ course.duration }}</span>
          </div>
          <div class="flex items-center gap-1">
            <GraduationCap :size="20" color="#ff782d" />
            <span>{{ course.students }} Students</span>
          </div>
          <div class="flex items-center gap-1">
            <Gauge :size="20" color="#ff782d" />
            <span>{{ course.level }}</span>
          </div>
          <div class="flex items-center gap-1">
            <FileVideo2 :size="20" color="#ff782d" />
            <span>{{ course.lessons }} Lessons</span>
          </div>
        </div>
      </div>

      <!-- Price and Button -->
      <div class="flex flex-col gap-4">
        <hr />
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="text-gray-500 line-through font-light text-lg">${{ course.oldPrice }}</span>
            <span v-if="course.price === 0" class="text-green-600 text-lg font-medium">Free</span>
            <span v-else class="text-green-600 text-lg font-medium">${{ course.price }}</span>
          </div>

          <button class="text-lg cursor-pointer text-black font-medium" @click="goToCourse">المزيد</button>
        </div>
      </div>
    </div>
  </div>
</template>
