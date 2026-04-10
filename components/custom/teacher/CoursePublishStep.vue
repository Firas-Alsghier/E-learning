<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { CheckCircle, BookOpen, DollarSign, Layers, Rocket } from 'lucide-vue-next';

const props = defineProps<{
  courseId: string | null;
}>();

const emit = defineEmits<{
  (e: 'published'): void;
}>();

const isPublishing = ref(false);
const isPublished = ref(false);

const publishCourse = async () => {
  if (!props.courseId) {
    alert('Course ID missing');
    return;
  }

  isPublishing.value = true;

  try {
    const token = useCookie('teacher_token').value;

    if (!token) {
      alert('Not authenticated');
      return;
    }

    await axios.patch(`http://localhost:3001/api/teacher/courses/${props.courseId}/publish`, {}, { headers: { Authorization: `Bearer ${token}` } });

    isPublished.value = true;
    emit('published');

    setTimeout(() => {
      navigateTo('/courses');
    }, 2000);
  } catch (err: any) {
    console.error('Publish error:', err);
    alert(err?.response?.data?.message || 'Failed to publish course');
  } finally {
    isPublishing.value = false;
  }
};

const checklist = [
  { icon: BookOpen, label: 'Course information is complete' },
  { icon: Layers, label: 'At least one section and lesson added' },
  { icon: DollarSign, label: 'Pricing is set correctly' },
];
</script>

<template>
  <div class="flex flex-col items-center gap-8 max-w-lg mx-auto py-4 text-center">
    <!-- Success state -->
    <Transition name="fade-scale">
      <div v-if="isPublished" class="flex flex-col items-center gap-5 w-full">
        <div class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle :size="40" class="text-emerald-500" />
        </div>
        <div>
          <h2 class="text-xl font-extrabold text-gray-900">Course Sent for Review ⏳</h2>
          <p class="text-sm text-gray-400 mt-1">Your course is under review and will be published after admin approval.</p>
        </div>
        <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 rounded-full animate-[grow_2s_linear_forwards]"></div>
        </div>
      </div>
    </Transition>

    <!-- Pre-publish state -->
    <template v-if="!isPublished">
      <!-- Icon -->
      <div class="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
        <Rocket :size="34" class="text-orange-500" />
      </div>

      <!-- Title -->
      <div class="flex flex-col gap-2">
        <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Ready to Publish?</h1>
        <p class="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">Once published, students will be able to discover and enroll in your course.</p>
      </div>

      <!-- Checklist -->
      <div class="w-full flex flex-col gap-2.5">
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest text-left mb-1">Before you go live</p>
        <div v-for="(item, i) in checklist" :key="i" class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
          <div class="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
            <component :is="item.icon" :size="15" class="text-orange-500" />
          </div>
          <span class="text-sm text-gray-700 font-medium">{{ item.label }}</span>
          <CheckCircle :size="16" class="text-emerald-400 ml-auto shrink-0" />
        </div>
      </div>

      <!-- Publish button -->
      <div class="w-full flex flex-col items-center gap-3">
        <button
          @click="publishCourse"
          :disabled="isPublishing"
          class="w-full sm:w-auto px-10 py-3 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_20px_rgba(255,120,45,0.35)] hover:shadow-[0_8px_28px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all cursor-pointer"
        >
          <span v-if="isPublishing" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Publishing...
          </span>
          <span v-else class="flex items-center gap-2"> <Rocket :size="15" /> Publish Course </span>
        </button>

        <p class="text-xs text-gray-400">You can unpublish or edit your course at any time.</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes grow {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>
