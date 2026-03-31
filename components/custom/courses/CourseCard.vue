<script setup lang="ts">
import { Calendar, GraduationCap, Gauge, FileVideo2, Heart } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';

// 1. Remove axios and isProcessing logic from here.
// The Parent (index.vue) will handle the "Loading/Processing" state.
const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();

const props = defineProps<{
  course: {
    id: string;
    createdAt: string;
    title: string;
    slug: string;
    image: string;
    author?: string;
    students: number;
    duration: string;
    level: string;
    lessons: number;
    price: number;
    oldPrice: number;
    category: string;
    isWishlisted: boolean;
  };
}>();

const emit = defineEmits<{
  (e: 'toggle-wishlist', id: string): void;
}>();

// 2. Simplified handler: Just tell the parent which ID was clicked.
const handleWishlistToggle = () => {
  emit('toggle-wishlist', props.course.id);
};

const goToCourse = () => {
  router.push(`/courses/${props.course.slug}`);
};
</script>

<template>
  <div class="w-full max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border rounded-[20px] overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
    <div class="w-full sm:w-[45%] relative">
      <span class="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-lg z-10">
        {{ props.course.category }}
      </span>

      <button @click.stop.prevent="handleWishlistToggle" class="absolute cursor-pointer top-4 right-4 p-2 rounded-full bg-white/90 text-red-500 shadow-xl hover:scale-110 transition z-20">
        <Heart :size="24" :fill="props.course.isWishlisted ? 'currentColor' : 'none'" :stroke="props.course.isWishlisted ? 'currentColor' : 'rgb(239, 68, 68)'" stroke-width="2.5" />
      </button>

      <img :src="props.course.image || '/images/course-placeholder.jpeg'" class="w-full h-full object-cover" />
    </div>

    <div class="w-full sm:w-[55%] px-4 py-5 flex flex-col justify-between">
      <div class="space-y-2">
        <p class="text-sm text-gray-500" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          by
          <span class="font-medium text-black">
            {{ props.course.author || 'Unknown Instructor' }}
          </span>
        </p>

        <h3 class="font-semibold text-[20px] text-gray-900">
          {{ props.course.title }}
        </h3>

        <div class="flex gap-4 text-sm text-gray-500 flex-wrap">
          <div class="flex items-center gap-1">
            <Calendar :size="20" color="#ff782d" />
            {{ props.course.createdAt.slice(0, 10) }}
          </div>
          <div class="flex items-center gap-1">
            <GraduationCap :size="20" color="#ff782d" />
            {{ props.course.students }} Students
          </div>
          <div class="flex items-center gap-1">
            <Gauge :size="20" color="#ff782d" />
            {{ props.course.level }}
          </div>
          <div class="flex items-center gap-1">
            <FileVideo2 :size="20" color="#ff782d" />
            {{ props.course.lessons }} Lessons
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <hr />
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <span v-if="props.course.oldPrice > 0" class="line-through text-gray-400 text-lg"> ${{ props.course.oldPrice }} </span>

            <span v-if="props.course.price === 0" class="text-green-600 text-lg font-bold"> Free </span>
            <span v-else class="text-red-500 text-lg font-bold"> ${{ props.course.price }} </span>
          </div>

          <button class="text-lg cursor-pointer font-medium hover:text-orange-600" @click="goToCourse">
            {{ t('more') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
