<script setup lang="ts">
import { Calendar, Heart } from 'lucide-vue-next'; // Added Heart
import { useRouter } from 'vue-router';

// Define Props, including the new isWishlisted state
const { article } = defineProps<{
  article: {
    title: string;
    slug: string;
    image: string; // Used for the image source
    author: string;
    students: number;
    duration: string;
    level: string;
    lessons: number;
    price: number;
    oldPrice: number;
    category: string;
    isWishlisted: boolean; // New prop for wishlist state
  };
}>();

// Define emits for handling user interaction (wishlist toggle)
const emit = defineEmits(['toggle-wishlist']);

const router = useRouter();

const goToCourse = () => {
  router.push(`/articles/${article.slug}`);
};

// Function to handle the wishlist click and stop it from propagating to the main card click
const handleWishlistToggle = (event: Event) => {
  event.stopPropagation();
  emit('toggle-wishlist', article.slug);
};
</script>

<template>
  <div
    @click="goToCourse"
    class="w-full group hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border rounded-[20px] overflow-hidden bg-white"
  >
    <!-- Left: Article Image -->
    <div class="w-full sm:w-[45%] h-full sm:h-full flex-shrink-0 relative">
      <!-- Heart Icon/Button (NEW ADDITION) -->
      <button
        @click="handleWishlistToggle"
        class="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-red-500 shadow-xl hover:scale-110 transition duration-300 transform z-20"
        :aria-label="article.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'"
        :title="article.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'"
      >
        <Heart :size="24" :fill="article.isWishlisted ? 'currentColor' : 'none'" :stroke="article.isWishlisted ? 'currentColor' : 'rgb(239, 68, 68)'" stroke-width="2.5" />
      </button>

      <!-- Article Image (Now using the article prop) -->
      <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
    </div>

    <!-- Right: Article Content -->
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
