<script setup lang="ts">
import { ref } from 'vue';
// Added Calendar icon to imports
import { Clock, UsersRound, Heart, ArrowLeft, Calendar } from 'lucide-vue-next';

// --- TYPE DEFINITIONS ---
interface Course {
  id: string;
  image: string;
  category: string;
  title: string;
  author: string;
  duration: string;
  students: number | string;
  oldPrice: number;
  newPrice: number;
  free: boolean;
  description: string;
  isWishlisted: boolean;
}

// Updated Article interface to match the new card structure
interface Article {
  id: string;
  image: string;
  date: string;
  title: string;
  description: string;
  isWishlisted: boolean;
}

type ActiveTab = 'courses' | 'articles';

// Use Clock as Timer based on lucide-vue-next usage
const Timer = Clock;

// --- State Management (Explicitly Typed) ---
const activeTab = ref<ActiveTab>('courses');

const courses = ref<Course[]>([
  {
    id: 'webdev-master',
    image: 'https://img-c.udemycdn.com/course/750x422/5463624_6dc8.jpg',
    category: 'Photography',
    title: 'Create an LMS website',
    author: 'John Doe',
    duration: '2 Weeks',
    students: 156,
    oldPrice: 20,
    newPrice: 0,
    free: true,
    description: 'Learn the fundamentals and build a strong foundation in this field with easy-to-follow lessons and real-world examples.',
    isWishlisted: true,
  },
  {
    id: 'data-science-intro',
    image: 'https://miro.medium.com/v2/resize:fit:1400/1*tDvPpTA8Jw5P_B5xV8gsjw.jpeg',
    category: 'Data Analysis',
    title: 'Introduction to Data Science',
    author: 'Fatimah Zahra',
    duration: '10 Hours',
    students: '12K',
    description: 'Learn Python and Pandas fundamentals for efficient data analysis and visualization.',
    oldPrice: 0,
    newPrice: 0,
    free: true,
    isWishlisted: true,
  },
  {
    id: 'graphic-design-basics-1',
    image: 'https://img-c.udemycdn.com/course/750x422/5266090_aba5.jpg',
    category: 'Graphic Design',
    title: 'Logo Design Basics (Part 1)',
    author: 'Ahmed Mahmoud',
    duration: '5 Hours',
    students: '800',
    description: 'A practical guide to creating professional logos using Adobe Illustrator.',
    oldPrice: 99,
    newPrice: 29,
    free: false,
    isWishlisted: true,
  },
]);

// Updated Placeholder content for articles to match the new structure and English text
const articles = ref<Article[]>([
  {
    id: 'article-1',
    image: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*HDJxJoL-WIc6OokcBi8rXA.jpeg',
    date: 'Jan 24, 2023',
    title: 'Ugly websites sell better.',
    description: 'Learn how design simplicity impacts conversion rates and customer trust.',
    isWishlisted: true,
  },
  {
    id: 'article-2',
    image: 'https://www.michaelthemaven.com/images/content/no_netflix-e1570237551381.jpg',
    date: 'Jan 24, 2023',
    title: '10 Things To Do In The Evening Instead Of Watching Netflix',
    description: 'Discover new hobbies and activities to invest your time in the evening instead of TV.',
    isWishlisted: true,
  },
  {
    id: 'article-3',
    image: 'https://miro.medium.com/v2/resize:fit:2000/format:webp/1*ZAL4GUViMz2f-9anG_fJXg.png',
    date: 'Jan 24, 2023',
    title: 'Why No One Cares About Your Company Updates (And What To Do About It)',
    description: 'Strategies for writing engaging business updates that appeal to your target audience.',
    isWishlisted: true,
  },
]);

// --- Methods (Explicitly Typed) ---
const toggleCourseWishlist = (courseId: string) => {
  courses.value = courses.value.filter((c) => c.id !== courseId);
};

const toggleArticleWishlist = (articleId: string) => {
  articles.value = articles.value.filter((a) => a.id !== articleId);
};
</script>

<template>
  <!-- Switched to dir="ltr" to match the English content and card design -->
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-[Inter]" dir="ltr">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-left border-b pb-4">Wishlist</h1>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-8">
        <!-- space-x-4 is correct for LTR tabs -->
        <nav class="flex space-x-4" aria-label="Tabs" role="tablist">
          <button
            class="cursor-pointer"
            role="tab"
            id="courses-tab"
            :aria-selected="activeTab === 'courses'"
            @click="activeTab = 'courses'"
            :class="[
              activeTab === 'courses' ? 'border-b-4 border-orange-500 text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-700 hover:border-b-4 hover:border-gray-300',
              'py-3 px-4 text-xl transition duration-200 rounded-t-lg',
            ]"
          >
            Courses ({{ courses.length }})
          </button>
          <button
            class="cursor-pointer"
            role="tab"
            id="articles-tab"
            :aria-selected="activeTab === 'articles'"
            @click="activeTab = 'articles'"
            :class="[
              activeTab === 'articles' ? 'border-b-4 border-orange-500 text-orange-600 font-bold' : 'text-gray-500 hover:text-gray-700 hover:border-b-4 hover:border-gray-300',
              'py-3 px-4 text-xl transition duration-200 rounded-t-lg',
            ]"
          >
            Articles ({{ articles.length }})
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Courses Wishlist Content (Updated to English) -->
        <div v-if="activeTab === 'courses'" role="tabpanel" aria-labelledby="courses-tab">
          <div v-if="courses.length === 0" class="text-center py-20 bg-white rounded-xl shadow-lg border border-dashed text-gray-500">
            <Heart :size="48" class="mx-auto mb-4 text-red-300" />
            <p class="text-2xl font-semibold">No courses currently in your wishlist.</p>
            <p class="text-lg mt-2">Search for new courses to add!</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            <div
              v-for="course in courses"
              :key="course.id"
              class="bg-white group border border-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out w-full flex flex-col"
            >
              <div class="relative">
                <img :src="course.image" :alt="course.title" class="w-full h-[210px] object-cover" />
                <button
                  @click="toggleCourseWishlist(course.id)"
                  class="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-500 shadow-xl hover:scale-110 transition duration-300 transform ring-2 ring-red-500"
                  aria-label="Remove from wishlist"
                  title="Remove from Wishlist"
                >
                  <Heart :size="20" fill="currentColor" class="cursor-pointer" />
                </button>
              </div>

              <div class="p-4 flex flex-col justify-between h-full text-left">
                <div>
                  <span class="bg-black text-white text-sm px-3 py-1 rounded-full inline-block mb-2">{{ course.category }}</span>
                  <h4 class="text-lg font-semibold mb-1 text-gray-900">{{ course.title }}</h4>
                  <p class="text-sm text-gray-500 mb-3">
                    By <span class="font-medium">{{ course.author }}</span>
                  </p>

                  <div class="flex items-center text-sm text-gray-600 gap-4 mb-3 justify-start">
                    <p class="flex items-center space-x-1">
                      <Timer :size="16" class="text-orange-500" />
                      <span class="ml-1">{{ course.duration }}</span>
                    </p>
                    <p class="flex items-center space-x-1">
                      <UsersRound :size="16" class="text-orange-500" />
                      <span class="ml-1">{{ course.students }} Students</span>
                    </p>
                  </div>

                  <p class="text-gray-500 text-sm mt-1 line-clamp-2">
                    {{ course.description }}
                  </p>
                </div>

                <div class="border-t pt-4 mt-4 flex items-center justify-between text-sm">
                  <a
                    :href="`/courses/${course.id}`"
                    class="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold shadow-lg shadow-orange-200 transition duration-200 transform hover:scale-[1.02]"
                  >
                    View Course <ArrowLeft :size="16" class="rotate-180" />
                  </a>
                  <div class="flex items-center gap-2">
                    <span class="line-through text-gray-400 text-base" v-if="!course.free && course.oldPrice > 0">${{ course.oldPrice }}</span>
                    <span :class="course.free ? 'text-green-600' : 'text-red-500'" class="font-extrabold text-2xl">
                      {{ course.free ? 'Free' : `$${course.newPrice}` }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Articles Wishlist Content (Updated with new card design and English text) -->
        <div v-else-if="activeTab === 'articles'" role="tabpanel" aria-labelledby="articles-tab">
          <div v-if="articles.length === 0" class="text-center py-20 bg-white rounded-xl shadow-lg border border-dashed text-gray-500">
            <Heart :size="48" class="mx-auto mb-4 text-red-300" />
            <p class="text-2xl font-semibold">No articles currently in your wishlist.</p>
            <p class="text-lg mt-2">Search for new articles to add!</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Article Card using the user's requested layout -->
            <div
              v-for="article in articles"
              :key="article.id"
              class="bg-white group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <!-- Image and Wishlist Icon -->
              <div class="overflow-hidden relative">
                <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />

                <!-- Heart Button (Wishlist/Remove Icon) -->
                <button
                  @click.stop="toggleArticleWishlist(article.id)"
                  class="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-500 shadow-xl hover:scale-110 transition duration-300 transform ring-2 ring-red-500"
                  aria-label="Remove article from wishlist"
                  title="Remove from Wishlist"
                >
                  <!-- Icon is filled because it's currently in the wishlist -->
                  <Heart :size="20" fill="currentColor" class="cursor-pointer" />
                </button>
              </div>

              <!-- Content -->
              <div class="p-4 flex-1 flex flex-col justify-between text-left">
                <h3 class="text-lg font-semibold leading-snug mb-2 text-gray-900">
                  {{ article.title }}
                </h3>
                <!-- Date/Calendar -->
                <p class="text-base text-gray-500 flex items-center gap-1 mb-2">
                  <Calendar :size="18" class="text-orange-500" />
                  <span class="ml-1">{{ article.date }}</span>
                </p>
                <!-- Description -->
                <p class="text-sm text-gray-700 line-clamp-2">
                  {{ article.description }}
                </p>

                <!-- Link to Article -->
                <a :href="`/articles/${article.id}`" class="mt-4 text-orange-500 font-semibold flex items-center gap-1 hover:underline transition duration-200 justify-end">
                  Read Article <ArrowLeft :size="16" class="rotate-180" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
