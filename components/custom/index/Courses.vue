<script setup lang="ts">
import { Timer, UsersRound, Heart } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
const auth = useAuthStore();
const { t } = useI18n();

const courses = [
  {
    id: 1,
    image: 'https://img-c.udemycdn.com/course/750x422/5463624_6dc8.jpg',
    category: 'Photography',
    title: 'Create an LMS website',
    author: 'John Doe',
    duration: '2Weeks',
    students: 156,
    oldPrice: 20,
    newPrice: 0,
    free: true,
    description: 'Learn the fundamentals and build a strong foundation in this field with easy-to-follow lessons and real-world examples.',
  },
  {
    id: 2,
    image: 'https://miro.medium.com/v2/resize:fit:1400/1*tDvPpTA8Jw5P_B5xV8gsjw.jpeg',
    category: 'Photography',
    title: 'Design A Website With ThimPress',
    author: 'Determined-Poitras',
    duration: '2Weeks',
    students: 156,
    oldPrice: 59,
    newPrice: 49,
    free: false,
    description: 'This beginner-friendly course guides you step by step to help you develop the essential skills you need to succeed.',
  },
  {
    id: 2,
    image: 'https://img-c.udemycdn.com/course/750x422/5266090_aba5.jpg',
    category: 'Photography',
    title: 'Design A Website With ThimPress',
    author: 'Determined-Poitras',
    duration: '2Weeks',
    students: 156,
    oldPrice: 59,
    newPrice: 49,
    free: false,
    description: 'Gain practical knowledge and hands-on experience through interactive projects and clear expert guidance.',
  },
  {
    id: 2,
    image: 'https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg',
    category: 'Photography',
    title: 'Design A Website With ThimPress',
    author: 'Determined-Poitras',
    duration: '2Weeks',
    students: 156,
    oldPrice: 59,
    newPrice: 49,
    free: false,
    description: 'Start your learning journey with confidence, and explore key concepts in a simple and engaging way.',
  },
  {
    id: 2,
    image: 'https://img-c.udemycdn.com/course/750x422/5099336_7855_3.jpg',
    category: 'Photography',
    title: 'Design A Website With ThimPress',
    author: 'Determined-Poitras',
    duration: '2Weeks',
    students: 156,
    oldPrice: 59,
    newPrice: 49,
    free: false,
    description: 'Build valuable, in-demand skills at your own pace and take the next step toward your personal or professional goals.',
  },
  {
    id: 2,
    image: 'https://img-c.udemycdn.com/course/750x422/4359576_b9e1_2.jpg',
    category: 'Photography',
    title: 'Design A Website With ThimPress',
    author: 'Determined-Poitras',
    duration: '2Weeks',
    students: 156,
    oldPrice: 59,
    newPrice: 49,
    free: false,
    description: 'Dive into this course to understand the basics, work on real tasks, and grow your abilities with ease.',
  },
  // المزيد...
];
</script>
<template>
  <section class="py-10">
    <CustomContainer>
      <!-- العنوان والزر -->
      <div class="flex flex-row-reverse items-start justify-between gap-6 mb-6">
        <div class="text-right">
          <h3 class="text-2xl text-primary-custom mb-3 font-semibold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('most-requested') }}</h3>
          <p class="text-lg sm:text-base text-secondary-custom" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('choose-course') }}</p>
        </div>
        <div>
          <NuxtLink to="courses"
            ><Button class="btn-custom text-primary-custom border-custom border-custom text-base cursor-pointer rounded-2xl">{{ t('all-courses') }}</Button></NuxtLink
          >
        </div>
      </div>

      <!-- شبكة الكروت -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <div
          v-for="(course, index) in courses"
          :key="index"
          class="bg-card-custom group border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ease-in-out w-[400px] h-[470px] flex flex-col justify-between"
        >
          <!-- صورة -->
          <!-- <img :src="course.image" alt="" class="w-full h-[210px] object-cover" /> -->
          <div class="relative">
            <img :src="course.image" :alt="course.title" class="w-full h-[210px] object-cover" />
            <button
              class="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-500 shadow-xl hover:scale-110 transition duration-300 transform ring-2 ring-red-500"
              aria-label="Remove from wishlist"
              title="Remove from Wishlist"
            >
              <Heart :size="20" fill="currentColor" class="cursor-pointer" />
            </button>
          </div>
          <!-- المحتوى -->
          <div class="p-4 flex flex-col justify-between h-full">
            <div>
              <span class="btn-custom text-white text-sm px-3 py-1 rounded-full inline-block mb-2">{{ course.category }}</span>
              <h4 class="text-lg text-primary-custom font-semibold mb-1">{{ course.title }}</h4>
              <p class="text-sm text-secondary-custom mb-3">by {{ course.author }}</p>
              <div class="flex items-center text-sm text-primary-custom gap-4 mb-3">
                <p class="flex items-center"><Timer class="mr-1 text-secondary-custom" /> {{ course.duration }}</p>
                <p class="flex items-center"><UsersRound class="mr-1 text-secondary-custom" /> {{ course.students }} {{ t('student') }}</p>
              </div>
            </div>
            <p class="text-secondary-custom text-sm mt-1 line-clamp-2">
              {{ course.description }}
            </p>
            <!-- السعر والرابط -->
            <div class="border-t pt-2 mt-2 flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="line-through text-secondary-custom" v-if="!course.free">${{ course.oldPrice }}</span>
                <span :class="course.free ? 'text-green-600 font-medium text-lg' : 'text-primary-custom font-medium text-lg'" class="font-medium text-lg">
                  {{ course.free ? 'Free' : `$${course.newPrice}` }}
                </span>
              </div>
              <NuxtLink :to="`/courses/${course.id}`" class="text-secondary-custom font-medium text-lg hover:underline" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                → {{ t('more') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </CustomContainer>
  </section>
</template>
