<script setup lang="ts">
import { Calendar, GraduationCap, Gauge, FileVideo2, Heart } from 'lucide-vue-next'; // Added Heart icon
import { useRouter } from 'vue-router';

// Define Props, including the new isWishlisted state
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
    isWishlisted: boolean; // New prop to determine heart state
  };
}>();

// Define emits for handling user interaction (wishlist toggle)
const emit = defineEmits(['toggle-wishlist']);

const router = useRouter();

const goToCourse = () => {
  router.push(`/courses/${course.slug}`);
};

// Function to emit the wishlist toggle event
const handleWishlistToggle = () => {
  // The parent component should listen to this event and update the course's wishlist status
  emit('toggle-wishlist', course.slug);
};
</script>

<template>
  <div class="w-full max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border rounded-[20px] overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
    <!-- Left: Course Image -->
    <div class="w-full sm:w-[45%] h-full sm:h-full flex-shrink-0 relative">
      <!-- Category Label -->
      <span class="absolute top-4 left-4 bg-black font-medium text-sm text-white px-3 py-1 rounded-lg z-10">
        {{ course.category }}
      </span>

      <!-- Heart Icon/Button (NEW ADDITION) -->
      <button
        @click.stop="handleWishlistToggle"
        class="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-red-500 shadow-xl hover:scale-110 transition duration-300 transform z-20"
        :aria-label="course.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'"
        :title="course.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'"
      >
        <Heart :size="24" :fill="course.isWishlisted ? 'currentColor' : 'none'" :stroke="course.isWishlisted ? 'currentColor' : 'rgb(239, 68, 68)'" stroke-width="2.5" />
      </button>

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
        <h3 class="font-semibold text-[20px] text-gray-900">{{ course.title }}</h3>

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
            <span class="text-gray-500 line-through font-light text-lg" v-if="course.oldPrice > 0">${{ course.oldPrice }}</span>
            <span v-if="course.price === 0" class="text-green-600 text-lg font-bold">Free</span>
            <span v-else class="text-red-500 text-lg font-bold">${{ course.price }}</span>
          </div>

          <button class="text-lg cursor-pointer text-black font-medium hover:text-orange-600 transition" @click="goToCourse">المزيد</button>
        </div>
      </div>
    </div>
  </div>
</template>
