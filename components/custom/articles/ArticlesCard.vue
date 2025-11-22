<script setup lang="ts">
import { Calendar, Heart } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const { article } = defineProps<{
  article: {
    _id?: string;
    title: string;
    slug?: string;
    image: string;
    author: string;
    isWishlisted?: boolean;
    createdAt?: string;
    description?: string;
  };
}>();

const emit = defineEmits(['toggle-wishlist']);
const router = useRouter();

const goToArticle = () => {
  router.push(`/articles/${article.slug || article._id}`);
};

const handleWishlistToggle = (event: Event) => {
  event.stopPropagation();
  emit('toggle-wishlist', article.slug || article._id);
};
</script>

<template>
  <div
    @click="goToArticle"
    class="w-full group hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border rounded-[20px] overflow-hidden bg-white"
  >
    <!-- Left: Article Image -->
    <div class="w-full sm:w-[45%] h-full relative">
      <button
        @click="handleWishlistToggle"
        class="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-red-500 shadow-xl hover:scale-110 transition duration-300 transform z-20"
        :aria-label="article.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'"
      >
        <Heart :size="24" :fill="article.isWishlisted ? 'currentColor' : 'none'" />
      </button>

      <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
    </div>

    <!-- Right: Article Content -->
    <div class="w-full sm:w-[55%] px-5 py-10 flex flex-col justify-between gap-2 group-hover:bg-[#F5F5F5]">
      <div class="space-y-2">
        <h3 class="font-semibold text-[20px] group-hover:text-[#FF782D]">
          {{ article.title }}
        </h3>

        <div class="flex items-center text-sm text-gray-500 my-4 gap-4 flex-wrap">
          <div class="flex items-center gap-1">
            <Calendar :size="20" color="#ff782d" />
            <span>{{ new Date(article.createdAt || '').toLocaleDateString() }}</span>
          </div>
          <div>✍️ {{ article.author }}</div>
        </div>

        <div class="short-preview">
          <p class="text-lg text-[#555555] line-clamp-2">
            {{ article.description || 'No description available.' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
