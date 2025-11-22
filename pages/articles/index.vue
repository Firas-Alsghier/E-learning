<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

// ✅ Type definition for an Article
interface Article {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  author: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

// ✅ Reactive states
const articles = ref<Article[]>([]);
const loading = ref(false);
const page = ref(1);
const totalPages = ref(1);

const selected = ref({
  category: ['Shop'],
  tags: [],
});

const showMobileFilter = ref(false);

// ✅ Fetch blogs from backend (Nuxt-friendly)
const fetchArticles = async (pageNumber = 1) => {
  try {
    loading.value = true;
    const res: any = await $fetch(`http://localhost:5000/api/blogs?page=${pageNumber}&limit=5`);
    // Support both array and paginated objects
    if (Array.isArray(res)) {
      articles.value = res;
      totalPages.value = 1;
      page.value = 1;
    } else {
      articles.value = res.blogs;
      totalPages.value = res.totalPages;
      page.value = res.page;
    }
  } catch (error) {
    console.error('❌ Error fetching articles:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchArticles();
});

// ✅ Pagination control
const goToPage = (num: number) => {
  if (num > 0 && num <= totalPages.value) {
    fetchArticles(num);
  }
};
</script>

<template>
  <div class="w-full bg-white">
    <CustomBreadCrumb :items="[{ label: 'Home', href: '/' }, { label: 'Articles' }]" />

    <CustomContainer>
      <div class="flex flex-col lg:flex-row-reverse gap-4 my-14">
        <!-- Sidebar (Desktop) -->
        <aside class="hidden lg:block w-full max-w-[280px]">
          <ClientOnly>
            <CustomArticlesBlogSidebar :selected="selected" />
          </ClientOnly>
        </aside>

        <!-- Mobile Filter Drawer -->
        <transition name="fade">
          <div v-if="showMobileFilter" class="fixed inset-0 bg-black/50 z-40" @click.self="showMobileFilter = false">
            <aside class="absolute right-0 top-0 w-4/5 max-w-xs h-full bg-white shadow-lg p-4 z-50 overflow-y-auto space-y-6">
              <ClientOnly>
                <CustomArticlesBlogSidebar :selected="selected" />
              </ClientOnly>
              <button class="w-full mt-6 bg-purple-600 text-white py-2 rounded-md font-medium" @click="showMobileFilter = false">تم</button>
            </aside>
          </div>
        </transition>

        <!-- Articles Section -->
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

          <!-- Loading / Empty / Articles -->
          <div v-if="loading" class="text-center py-10">جارٍ تحميل المقالات...</div>
          <div v-else-if="articles.length === 0" class="text-center py-10 text-gray-500">لا توجد مقالات بعد</div>
          <div v-else class="space-y-6">
            <CustomArticlesCard
              v-for="article in articles"
              :key="article._id"
              :article="{
                title: article.title,
                slug: article._id,
                image: article.coverImage,
                author: article.author.firstName + ' ' + article.author.lastName,
              }"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center pt-4">
            <ul class="flex gap-2 text-sm">
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer" @click="goToPage(page - 1)">‹</li>

              <li
                v-for="n in totalPages"
                :key="n"
                class="border rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                :class="page === n ? 'bg-black text-white' : 'hover:bg-gray-100'"
                @click="goToPage(n)"
              >
                {{ n }}
              </li>

              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer" @click="goToPage(page + 1)">›</li>
            </ul>
          </div>
        </div>
      </div>
    </CustomContainer>
  </div>
</template>
