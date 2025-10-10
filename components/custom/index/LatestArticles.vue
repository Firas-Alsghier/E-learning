<script setup lang="ts">
import type { Article } from '~/types';
import { Calendar } from 'lucide-vue-next';

// ✅ Strongly type the array
const articles: Article[] = [
  {
    image: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*HDJxJoL-WIc6OokcBi8rXA.jpeg',
    date: 'Jan 24, 2023',
    title: 'Ugly websites sell better.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque...',
  },
  {
    image: 'https://www.michaelthemaven.com/images/content/no_netflix-e1570237551381.jpg',
    date: 'Jan 24, 2023',
    title: '10 Things To Do In The Evening Instead Of Watching Netflix',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque...',
  },
  {
    image: 'https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ZAL4GUViMz2f-9anG_fJXg.png',
    date: 'Jan 24, 2023',
    title: 'Why No One Cares About Your Company Updates (And What To Do About It)',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque...',
  },
];
</script>

<template>
  <CustomContainer>
    <section class="py-16 text-right">
      <!-- Header Row -->
      <div class="flex flex-row-reverse items-start justify-between gap-6 mb-6">
        <div class="text-right">
          <h3 class="text-2xl mb-3 font-semibold">تصفح مقالاتنا</h3>
          <p class="text-lg sm:text-base text-[#555]">تصفح مقالاتنا المجانية.</p>
        </div>
        <div>
          <NuxtLink to="articles"><Button class="bg-transparent text-base cursor-pointer rounded-2xl hover:bg-[#FF782D] hover:text-white text-black border-2">عرض المقالات</Button></NuxtLink>
        </div>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(article, index) in articles"
          :key="index"
          class="bg-white group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group"
        >
          <!-- Image -->
          <div class="overflow-hidden">
            <img :src="article.image" alt="Article image" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>

          <!-- Content -->
          <div class="p-4 flex-1 flex flex-col justify-between">
            <h3 class="text-lg text-left font-semibold leading-snug mb-2">
              {{ article.title }}
            </h3>
            <p class="text-base text-gray-500 flex items-center gap-1 mb-2">
              <Calendar class="group-hover:text-[#FF782D] mr-1" />
              {{ article.date }}
            </p>
            <p class="text-sm text-left text-gray-700 line-clamp-2">
              {{ article.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </CustomContainer>
</template>

<style>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
