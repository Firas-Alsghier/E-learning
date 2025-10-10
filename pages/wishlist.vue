<script setup>
import { ref } from 'vue';
import { Clock, UsersRound, Heart } from 'lucide-vue-next'; // Using Clock for Timer

// --- Mock Component Imports ---
// Mock the NuxtLink component for runnable code
const NuxtLink = {
  props: ['to'],
  template: '<a :href="to" class="text-black font-medium text-lg hover:underline"><slot></slot></a>',
};
// Use Clock as Timer based on lucide-vue-next usage
const Timer = Clock;

// --- State Management ---
const activeTab = ref('courses');

const courses = ref([
  {
    id: 'webdev-master',
    image: 'https://placehold.co/400x210/D0F7EA/000000?text=Web+Dev',
    category: 'البرمجة',
    title: 'دورة تطوير الويب الشاملة',
    author: 'محمد علي',
    duration: '25 ساعة',
    students: '4.5 ألف',
    description: 'تعلم بناء تطبيقات الويب الحديثة باستخدام Vue.js و Tailwind CSS من الصفر حتى الاحتراف.',
    oldPrice: 199,
    newPrice: 49,
    free: false,
    isWishlisted: true,
  },
  {
    id: 'data-science-intro',
    image: 'https://placehold.co/400x210/FFF5BE/000000?text=Data+Science',
    category: 'تحليل البيانات',
    title: 'مقدمة في علم البيانات',
    author: 'فاطمة الزهراء',
    duration: '10 ساعات',
    students: '12 ألف',
    description: 'تعرف على أساسيات Python و Pandas لتحليل وتصور البيانات بكفاءة.',
    oldPrice: 0,
    newPrice: 0,
    free: true,
    isWishlisted: true,
  },
  {
    id: 'graphic-design-basics',
    image: 'https://placehold.co/400x210/FFD9C0/000000?text=Design',
    category: 'التصميم الجرافيكي',
    title: 'أساسيات تصميم الشعارات',
    author: 'أحمد محمود',
    duration: '5 ساعات',
    students: '800',
    description: 'دليل عملي لإنشاء شعارات احترافية باستخدام Adobe Illustrator.',
    oldPrice: 99,
    newPrice: 29,
    free: false,
    isWishlisted: true,
  },
]);

// Placeholder content for articles
const articles = ref([
  { id: 'article-1', title: '10 طرق لتحسين مهاراتك', category: 'تطوير الذات' },
  { id: 'article-2', title: 'مستقبل الذكاء الاصطناعي', category: 'تكنولوجيا' },
]);

// --- Methods ---
const toggleWishlist = (courseId) => {
  const course = courses.value.find((c) => c.id === courseId);
  if (course) {
    // In a real app, this would trigger an API call to remove the item from the user's database
    course.isWishlisted = !course.isWishlisted;
    // For demonstration, we'll filter it out immediately if removed
    if (!course.isWishlisted) {
      courses.value = courses.value.filter((c) => c.id !== courseId);
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-right">قائمة الأمنيات</h1>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="flex space-x-4 space-x-reverse" aria-label="Tabs">
          <button
            @click="activeTab = 'courses'"
            :class="[
              activeTab === 'courses' ? 'border-b-2 border-orange-500 text-orange-600 font-semibold' : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300',
              'py-3 px-4 text-lg transition duration-200',
            ]"
          >
            الدورات ({{ courses.length }})
          </button>
          <button
            @click="activeTab = 'articles'"
            :class="[
              activeTab === 'articles' ? 'border-b-2 border-orange-500 text-orange-600 font-semibold' : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300',
              'py-3 px-4 text-lg transition duration-200',
            ]"
          >
            المقالات ({{ articles.length }})
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div>
        <!-- Courses Wishlist Content -->
        <div v-if="activeTab === 'courses'">
          <div v-if="courses.length === 0" class="text-center py-16 text-gray-500">
            <p class="text-xl">لا توجد دورات في قائمة الأمنيات حالياً.</p>
            <p class="text-sm mt-2">ابحث عن دورات جديدة لإضافتها!</p>
          </div>

          <!-- Course Grid based on your provided structure -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <div
              v-for="course in courses"
              :key="course.id"
              class="bg-white group border rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out w-full max-w-sm flex flex-col"
            >
              <!-- Image and Wishlist Icon -->
              <div class="relative">
                <img :src="course.image" :alt="course.title" class="w-full h-[210px] object-cover" />
                <button
                  @click="toggleWishlist(course.id)"
                  class="absolute top-3 left-3 p-2 rounded-full bg-white/80 text-red-500 shadow-md hover:bg-white transition"
                  aria-label="Remove from wishlist"
                >
                  <Heart :size="20" fill="currentColor" />
                </button>
              </div>

              <!-- Content -->
              <div class="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <span class="bg-black text-white text-sm px-3 py-1 rounded-full inline-block mb-2">{{ course.category }}</span>
                  <h4 class="text-lg font-semibold mb-1">{{ course.title }}</h4>
                  <p class="text-sm text-gray-500 mb-3 text-right">بواسطة {{ course.author }}</p>

                  <!-- Meta Info -->
                  <div class="flex items-center text-sm text-gray-600 gap-4 mb-3 justify-end">
                    <p class="flex items-center space-x-1 space-x-reverse">
                      <span>{{ course.students }} طلاب</span>
                      <UsersRound :size="16" class="group-hover:text-[#FF782D]" />
                    </p>
                    <p class="flex items-center space-x-1 space-x-reverse">
                      <span>{{ course.duration }}</span>
                      <Timer :size="16" class="group-hover:text-[#FF782D]" />
                    </p>
                  </div>

                  <p class="text-gray-500 text-sm mt-1 line-clamp-2 text-right">
                    {{ course.description }}
                  </p>
                </div>

                <!-- Price and Link -->
                <div class="border-t pt-3 mt-3 flex items-center justify-between text-sm">
                  <NuxtLink :to="`/courses/${course.id}`" class="text-black font-medium hover:text-[#FF782D] transition"> ← المزيد </NuxtLink>

                  <div class="flex items-center gap-2">
                    <span class="line-through text-gray-400" v-if="!course.free">${{ course.oldPrice }}</span>
                    <span :class="course.free ? 'text-green-600' : 'text-red-500'" class="font-bold text-lg">
                      {{ course.free ? 'مجاني' : `$${course.newPrice}` }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Articles Wishlist Content -->
        <div v-else-if="activeTab === 'articles'">
          <p class="text-center py-16 text-gray-500">هنا سيتم عرض المقالات المحفوظة في قائمة الأمنيات.</p>
          <!-- You can implement a similar grid for articles here -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure Arabic right-to-left alignment for the layout */
.space-x-reverse > * + * {
  margin-right: 0.5rem; /* Default Tailwind space-x-2 */
  margin-left: 0;
}
/* Flex-start on the right side for RTL */
.justify-end {
  justify-content: flex-start;
}
</style>
