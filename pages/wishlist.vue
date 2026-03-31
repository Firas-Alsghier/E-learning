<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Clock, UsersRound, Heart, ArrowRight } from 'lucide-vue-next';

definePageMeta({
  layout: false,
  middleware: ['user-auth'],
});

const Timer = Clock;

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
  slug: string;
  isWishlisted: boolean;
}

type ActiveTab = 'courses' | 'articles';

const activeTab = ref<ActiveTab>('courses');

const courses = ref<Course[]>([]);

const loading = ref(true);

const error = ref<string | null>(null);

const fetchWishlist = async () => {
  try {
    const token = useCookie('token').value;

    if (!token) {
      error.value = 'You must login first';
      return;
    }

    const res = await fetch('http://localhost:3001/api/user/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch wishlist');

    const data = await res.json();

    // console.log('WISHLIST DATA:', data); // ✅ debug

    // ✅ DIRECT mapping (NO second fetch needed)
    courses.value = data.map((course: any) => ({
      id: course.id,
      image: course.image,
      category: course.category,
      title: course.title,
      author: course.author,
      duration: course.duration || '—',
      students: course.students || 0,
      oldPrice: course.oldPrice || 0,
      newPrice: course.price,
      free: course.price === 0,
      description: course.description || 'No description yet',
      isWishlisted: true,
      slug: course.slug,
    }));
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const toggleCourseWishlist = async (courseId: string) => {
  try {
    const token = useCookie('token').value;

    if (!token) {
      alert('You must login first');
      return;
    }

    // 🔥 call backend (same toggle route)
    await fetch(`http://localhost:3001/api/user/wishlist/${courseId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 update UI (remove from list)
    courses.value = courses.value.filter((c) => c.id !== courseId);
  } catch (err) {
    console.error('Remove wishlist error:', err);
  }
};
onMounted(() => {
  fetchWishlist();
});
</script>

<template>
  <div class="min-h-screen bg-[#0d0d0f] py-10 sm:py-14 px-4 sm:px-6 lg:px-8" dir="ltr">
    <!-- Glow blob -->
    <div class="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full opacity-50" style="background: radial-gradient(circle, rgba(255, 120, 45, 0.07) 0%, transparent 70%)"></div>

    <div class="max-w-6xl mx-auto relative z-10">
      <!-- Page header -->
      <div class="mb-8 sm:mb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Wishlist</h1>
        <p class="text-sm text-zinc-500 mt-1">Courses you've saved for later</p>
      </div>

      <!-- Tab nav -->
      <div class="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 w-fit mb-8 sm:mb-10">
        <button
          role="tab"
          :aria-selected="activeTab === 'courses'"
          @click="activeTab = 'courses'"
          class="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer"
          :class="activeTab === 'courses' ? 'bg-orange-500 text-white shadow-[0_2px_10px_rgba(255,120,45,0.4)]' : 'text-zinc-500 hover:text-white'"
        >
          Courses
          <span class="ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full" :class="activeTab === 'courses' ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-zinc-500'">
            {{ courses.length }}
          </span>
        </button>
      </div>

      <!-- Courses tab -->
      <div v-if="activeTab === 'courses'">
        <!-- Empty state -->
        <div v-if="courses.length === 0" class="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div class="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            <Heart :size="28" class="text-zinc-600" />
          </div>
          <div>
            <p class="text-lg font-bold text-white">Your wishlist is empty</p>
            <p class="text-sm text-zinc-500 mt-1">Browse courses and hit the heart icon to save them here.</p>
          </div>
          <a
            href="/courses"
            class="mt-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_22px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 transition-all"
          >
            Browse Courses
          </a>
        </div>

        <!-- Course grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          <div
            v-for="course in courses"
            :key="course.id"
            class="group relative bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-orange-500/25 hover:shadow-[0_8px_36px_rgba(0,0,0,0.45)] transition-all duration-300 flex flex-col"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-video overflow-hidden shrink-0">
              <img :src="course.image" :alt="course.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <!-- Overlay gradient -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              <!-- Category badge -->
              <span class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-lg border border-white/10">
                {{ course.category }}
              </span>

              <!-- Remove from wishlist -->
              <button
                @click="toggleCourseWishlist(course.id)"
                class="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500/20 border border-red-400/40 text-red-400 flex items-center justify-center hover:bg-red-500/35 hover:scale-110 transition-all duration-200 cursor-pointer"
                aria-label="Remove from wishlist"
              >
                <Heart :size="15" fill="currentColor" />
              </button>
            </div>

            <!-- Card body -->
            <div class="flex flex-col flex-1 p-4 sm:p-5 gap-3">
              <!-- Title + author -->
              <div>
                <h4 class="text-base font-bold text-white leading-snug group-hover:text-orange-300 transition-colors line-clamp-2">
                  {{ course.title }}
                </h4>
                <p class="text-xs text-zinc-500 mt-1">
                  By <span class="text-zinc-300 font-medium">{{ course.author }}</span>
                </p>
              </div>

              <!-- Meta stats -->
              <div class="flex items-center gap-4 text-xs text-zinc-500">
                <span class="flex items-center gap-1.5">
                  <Timer :size="12" class="text-orange-400 shrink-0" />
                  {{ course.duration }}
                </span>
                <span class="flex items-center gap-1.5">
                  <UsersRound :size="12" class="text-orange-400 shrink-0" />
                  {{ course.students }} Students
                </span>
              </div>

              <!-- Description -->
              <p class="text-xs text-zinc-500 leading-relaxed line-clamp-2 flex-1">
                {{ course.description }}
              </p>

              <!-- Footer: price + CTA -->
              <div class="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                <!-- Price -->
                <div class="flex items-baseline gap-1.5">
                  <span v-if="!course.free && course.oldPrice > 0" class="text-sm text-zinc-600 line-through"> ${{ course.oldPrice }} </span>
                  <span class="text-xl font-extrabold tracking-tight" :class="course.free ? 'text-emerald-400' : 'text-orange-400'">
                    {{ course.free ? 'Free' : `$${course.newPrice}` }}
                  </span>
                </div>

                <!-- View course -->
                <a
                  :href="`/courses/${course.slug}`"
                  target="_blank"
                  class="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_3px_12px_rgba(255,120,45,0.3)] hover:shadow-[0_5px_18px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  View Course <ArrowRight :size="13" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
