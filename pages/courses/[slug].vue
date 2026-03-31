<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Heart, Clock, Users, BarChart2, BookOpen, FileText, Play } from 'lucide-vue-next';
import type { Course } from '@/types/Course';
import { useI18n } from 'vue-i18n';
import CustomCoursesContactInstructorTab from '@/components/custom/courses/ContactInstructorTab.vue';

const selectedTab = ref('overview');
const isWishlisted = ref(false);
const route = useRoute();
const { t } = useI18n();
const slug = computed(() => route.params.slug as string);

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'curriculum', label: 'المنهج الدراسي' },
  { id: 'instructor', label: 'المُدرّس' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
  { id: 'contact', label: 'التواصل' },
];

const toggleWishlist = async () => {
  try {
    const token = useCookie('token').value;

    if (!token) {
      alert('You must login first');
      return;
    }

    if (!course.value?.id) return;

    const res = await fetch(`http://localhost:3001/api/user/wishlist/${course.value.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // ✅ real update
    isWishlisted.value = data.wishlist.includes(course.value.id);

    console.log('UPDATED WISHLIST:', data.wishlist);
  } catch (err) {
    console.error('Wishlist error:', err);
  }
};

const checkIfWishlisted = async () => {
  try {
    const token = useCookie('token').value;

    if (!token || !course.value?.id) return;

    const res = await fetch('http://localhost:3001/api/user/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    isWishlisted.value = data.some((c: any) => c.id === course.value!.id);
  } catch (err) {
    console.error('Wishlist check error:', err);
  }
};
/* ----------------------------------
     DATA FETCH (SSR SAFE)
  ---------------------------------- */
const { data, error } = await useAsyncData<Course>(`course-${slug.value}`, () => $fetch<any>(`http://localhost:3001/api/courses/${slug.value}` as string));

const course = computed(() => data.value);
watch(
  () => course.value,
  (val) => {
    if (val) {
      checkIfWishlisted();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-screen text-white">
    <CustomBreadCrumb :items="[{ label: 'Home', href: '/' }, { label: 'Courses', href: '/courses' }, { label: slug }]" />

    <!-- ERROR -->
    <div v-if="error" class="flex flex-col items-center justify-center py-24 gap-4 text-red-400">
      <span class="text-5xl">⚠</span>
      <p class="text-base">Failed to load course. Please try again.</p>
    </div>

    <template v-else-if="course">
      <!-- ================= HERO ================= -->
      <section class="relative overflow-hidden pt-8 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 lg:pb-24 bg-[#0d0d0f]">
        <!-- Grid overlay -->
        <div
          class="pointer-events-none absolute inset-0"
          style="background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 48px 48px"
        ></div>

        <!-- Glow blob -->
        <div
          class="pointer-events-none absolute -top-32 -left-20 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full"
          style="background: radial-gradient(circle, rgba(255, 120, 45, 0.13) 0%, transparent 70%)"
        ></div>

        <CustomContainer>
          <div class="relative z-10 flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-14">
            <!-- Left: content -->
            <div class="flex-1 flex flex-col gap-5 sm:gap-6">
              <!-- Meta row -->
              <div class="flex items-center flex-wrap gap-2 sm:gap-3">
                <span class="bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold tracking-widest uppercase px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
                  {{ course.category }}
                </span>
                <span class="w-1 h-1 rounded-full bg-zinc-600 hidden sm:inline-block"></span>
                <span class="text-sm text-zinc-400">
                  {{ t('by') }}
                  <strong class="text-white font-semibold mr-1">{{ course.author }}</strong>
                </span>
                <button
                  @click="toggleWishlist"
                  :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
                  class="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-200"
                  :class="isWishlisted ? 'border-red-400/40 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-zinc-400 hover:text-red-400 hover:border-red-400/40 hover:bg-red-500/10'"
                >
                  <Heart :size="14" :fill="isWishlisted ? 'currentColor' : 'none'" />
                </button>
              </div>

              <!-- Title -->
              <h1 class="text-2xl sm:text-3xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white" dir="rtl">
                {{ course.title }}
              </h1>

              <!-- Stats pills -->
              <div class="flex flex-wrap gap-2 sm:gap-2.5">
                <div
                  class="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/[0.08] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-zinc-400 transition-colors duration-200 hover:border-orange-500/40 hover:text-orange-300"
                >
                  <Clock :size="12" class="shrink-0" />
                  <span>{{ course.duration }}</span>
                </div>
                <div
                  class="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/[0.08] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-zinc-400 transition-colors duration-200 hover:border-orange-500/40 hover:text-orange-300"
                >
                  <Users :size="12" class="shrink-0" />
                  <span>{{ course.studentsCount }} Students</span>
                </div>
                <div
                  class="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/[0.08] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-zinc-400 transition-colors duration-200 hover:border-orange-500/40 hover:text-orange-300"
                >
                  <BarChart2 :size="12" class="shrink-0" />
                  <span>{{ course.level }}</span>
                </div>
                <div
                  class="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/[0.08] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-zinc-400 transition-colors duration-200 hover:border-orange-500/40 hover:text-orange-300"
                >
                  <BookOpen :size="12" class="shrink-0" />
                  <span>{{ course.lessons }} Lessons</span>
                </div>
                <div
                  class="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/[0.08] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs text-zinc-400 transition-colors duration-200 hover:border-orange-500/40 hover:text-orange-300"
                >
                  <FileText :size="12" class="shrink-0" />
                  <span>{{ course.quizzesCount }} Quizzes</span>
                </div>
              </div>
            </div>

            <!-- Right: Course card -->
            <!-- Mobile: full width centered. sm: constrained + centered. lg: fixed sidebar -->
            <div
              class="w-full sm:max-w-sm sm:mx-auto lg:mx-0 lg:w-[340px] shrink-0 lg:self-start rounded-2xl overflow-hidden bg-[#161618] border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.5)] group"
            >
              <!-- Thumbnail -->
              <div class="relative aspect-video overflow-hidden">
                <img :src="course.coverImage" alt="Course cover" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <!-- Play overlay -->
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-[0_0_0_12px_rgba(255,120,45,0.2)] scale-90 group-hover:scale-100 transition-transform duration-300"
                  >
                    <Play :size="18" fill="currentColor" />
                  </div>
                </div>
              </div>

              <!-- Card body -->
              <div class="p-5 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 text-center">
                <div class="flex items-baseline gap-3 justify-center">
                  <span v-if="course.oldPrice" class="text-sm text-zinc-500 line-through">${{ course.oldPrice }}</span>
                  <span class="text-2xl sm:text-3xl font-extrabold text-orange-400 tracking-tight">${{ course.price }}</span>
                </div>

                <button
                  class="w-full py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm sm:text-base cursor-pointer shadow-[0_4px_20px_rgba(255,120,45,0.35)] hover:shadow-[0_8px_30px_rgba(255,120,45,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  البدء الآن
                </button>

                <p class="text-xs text-zinc-500 tracking-wide">30-day money-back guarantee</p>
              </div>
            </div>
          </div>
        </CustomContainer>
      </section>

      <!-- ================= TABS ================= -->
      <section class="py-6 sm:py-8 lg:py-10">
        <CustomContainer>
          <div class="rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08] bg-[#161618] shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
            <!-- Tab nav -->
            <div class="flex overflow-x-auto bg-[#1c1c1f] border-b border-white/[0.08]" style="scrollbar-width: none; -webkit-overflow-scrolling: touch">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                role="tab"
                :aria-selected="selectedTab === tab.id"
                @click="selectedTab = tab.id"
                class="relative flex-1 min-w-max px-4 sm:px-6 py-4 sm:py-5 border-l border-white/[0.08] first:border-l-0 text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors duration-200"
                :class="selectedTab === tab.id ? 'text-orange-400 bg-orange-500/[0.06]' : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'"
              >
                {{ tab.label }}
                <span v-if="selectedTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 rounded-t"></span>
              </button>
            </div>

            <!-- Tab panel -->
            <div class="min-h-[240px] sm:min-h-[300px] max-h-[360px] sm:max-h-[420px] overflow-y-auto" style="scrollbar-width: thin; scrollbar-color: rgba(249, 115, 22, 0.3) transparent">
              <Transition name="fade" mode="out-in">
                <div :key="selectedTab" class="px-4 sm:px-6 lg:px-8 py-5 sm:py-7 text-right leading-loose text-zinc-300 text-sm" dir="rtl">
                  <CustomCoursesOverviewTab :description="course.description" v-if="selectedTab === 'overview'" />
                  <CustomCoursesCurriculumTab v-if="selectedTab === 'curriculum' && course?.id" :sections="course.sections" :courseId="course.id" />
                  <CustomCoursesInstructorTab
                    :facebook="course.social.facebook"
                    :instagram="course.social.instagram"
                    :site="course.social.website"
                    :linkedin="course.social.linkedin"
                    v-if="selectedTab === 'instructor'"
                  >
                    <template v-slot:name>{{ course.author }}</template>
                    <template v-slot:about>{{ course.bio }}</template>
                    <template v-slot:students>510</template>
                    <template v-slot:lessons>10</template>
                  </CustomCoursesInstructorTab>
                  <CustomCoursesContactInstructorTab v-if="selectedTab === 'contact'" :teacherId="course.teacherId" :courseId="course.id" />
                  <CustomCoursesFaqsTab :faqs="course.faqs" v-if="selectedTab === 'faq'" />
                </div>
              </Transition>
            </div>
          </div>
        </CustomContainer>
      </section>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
