<script setup lang="ts">
import { ref } from 'vue';
import { Search } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
interface Article {
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
}

const selected = ref({
  category: ['Shop'],
  tags: [],
});

const showMobileFilter = ref(false);

const articles: Article[] = [
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
];
</script>

<template>
  <div class="w-full bg-white">
    <CustomBreadCrumb :items="[{ label: 'Home', href: '/' }, { label: 'Articles' }]" />

    <CustomContainer>
      <div class="flex flex-col lg:flex-row-reverse gap-4 my-14">
        <!-- Desktop Sidebar -->
        <aside class="hidden lg:block w-full max-w-[280px]">
          <CustomArticlesBlogSidebar :selected="selected" />
        </aside>

        <!-- Mobile Drawer -->
        <transition name="fade">
          <div v-if="showMobileFilter" class="fixed inset-0 bg-black/50 z-40" @click.self="showMobileFilter = false">
            <aside class="absolute right-0 top-0 w-4/5 max-w-xs h-full bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-6">
              <CustomArticlesBlogSidebar :selected="selected" />
              <button class="w-full mt-6 bg-purple-600 text-white py-2 rounded-md font-medium" @click="showMobileFilter = false">تم</button>
            </aside>
          </div>
        </transition>

        <!-- Article List -->
        <div class="flex-1 w-full space-y-5">
          <!-- Top Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="relative w-[270px] items-center">
              <Input id="search" type="text" placeholder="Search..." class="text-right border-0 border-b border-black focus:border-black focus-visible:ring-0 rounded-none pl-10" />
              <span class="absolute left-0 inset-y-0 flex items-center justify-center">
                <Search class="size-5 text-muted-foreground" />
              </span>
            </div>
            <div class="flex justify-between items-center">
              <div class="lg:hidden p-4">
                <button @click="showMobileFilter = true" class="flex items-center gap-2 border px-3 py-2 rounded-md">
                  <span class="text-sm font-semibold">Filter</span>
                </button>
              </div>
              <h2 class="text-2xl text-right font-semibold">كل المقالات</h2>
            </div>
          </div>

          <!-- Articles -->
          <div class="space-y-6">
            <CustomArticlesCard v-for="article in articles" :key="article.slug" :article="article" />
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
