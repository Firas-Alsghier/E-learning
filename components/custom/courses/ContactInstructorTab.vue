<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  teacherId: string;
  courseId: string;
}>();

const message = ref('');
const loading = ref(false);
const success = ref(false);
const selectedFile = ref<File | null>(null);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > MAX_FILE_SIZE) {
    alert('File must be smaller than 100MB');
    return;
  }
  selectedFile.value = file;
}

function removeFile() {
  selectedFile.value = null;
}

const sendMessage = async () => {
  if (!message.value.trim() && !selectedFile.value) return;

  try {
    loading.value = true;

    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('teacherId', props.teacherId);
    formData.append('courseId', props.courseId);
    formData.append('text', message.value);

    if (selectedFile.value) {
      formData.append('attachment', selectedFile.value);
    }

    await $fetch('http://localhost:3001/api/messages/contact-teacher', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    message.value = '';
    selectedFile.value = null;
    success.value = true;
  } catch (err) {
    console.error('Send message error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-5 sm:gap-6 w-full max-w-xl mx-auto" dir="ltr">
    <!-- Header -->
    <div class="text-center">
      <h3 class="text-base sm:text-lg font-bold text-white">Contact Instructor</h3>
      <p class="text-xs sm:text-sm text-zinc-500 mt-1">Send a message directly to the course instructor.</p>
    </div>

    <!-- Success banner -->
    <Transition name="fade-slide">
      <div v-if="success" class="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm">
        <span class="text-base shrink-0">✓</span>
        <span>تم إرسال الرسالة بنجاح</span>
      </div>
    </Transition>

    <!-- Message textarea -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-semibold text-zinc-400 uppercase tracking-widest">رسالتك</label>
      <textarea
        v-model="message"
        placeholder="اكتب رسالتك للمدرس..."
        rows="4"
        dir="rtl"
        class="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-orange-500/50 focus:bg-orange-500/[0.03] transition-colors duration-200"
      />
    </div>

    <!-- File upload -->
    <div class="flex flex-col gap-2">
      <label class="text-xs font-semibold text-zinc-400 uppercase tracking-widest"> Attachment <span class="normal-case font-normal text-zinc-600">(optional)</span> </label>

      <!-- Drop zone / file input -->
      <label
        class="relative flex flex-col items-center justify-center gap-2 w-full border border-dashed border-white/[0.12] rounded-xl px-4 py-5 cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] hover:border-orange-500/30 transition-all duration-200 group"
      >
        <span class="text-2xl">📎</span>
        <span class="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors text-center">
          Click to choose a file
          <span class="block text-zinc-600 mt-0.5">Max 100MB</span>
        </span>
        <input type="file" @change="handleFile" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </label>

      <!-- File preview -->
      <Transition name="fade-slide">
        <div v-if="selectedFile" class="flex items-center justify-between gap-3 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-orange-400 shrink-0">📄</span>
            <span class="text-xs text-zinc-300 truncate">{{ selectedFile.name }}</span>
          </div>
          <button @click="removeFile" class="text-xs text-zinc-500 hover:text-red-400 transition-colors duration-200 shrink-0 cursor-pointer">Remove</button>
        </div>
      </Transition>
    </div>

    <!-- Send button -->
    <button
      @click="sendMessage"
      :disabled="loading"
      class="w-full sm:w-auto sm:self-center py-2.5 px-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm cursor-pointer shadow-[0_4px_20px_rgba(255,120,45,0.3)] hover:shadow-[0_8px_28px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
    >
      <span v-if="loading" class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        جاري الإرسال...
      </span>
      <span v-else>إرسال الرسالة</span>
    </button>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
