<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Plus, Upload, Trash, CheckCircle, Film, Image, Loader } from 'lucide-vue-next';

const emit = defineEmits<{ (e: 'continue'): void }>();
const props = defineProps<{ courseId: string | null }>();

interface Lesson {
  _id: string;
  title: string;
  videoUploaded: boolean;
  uploadProgress: number;
  isUploading: boolean;
}

interface Section {
  _id: string;
  title: string;
  lessons: Lesson[];
}

const sections = ref<Section[]>([]);
const coverInputRef = ref<HTMLInputElement | null>(null);
const videoInputRef = ref<HTMLInputElement | null>(null);
const selectedLessonId = ref<string | null>(null);
const token = useCookie('teacher_token').value;
const coverPreviewUrl = ref<string | null>(null);
const coverUploading = ref(false);
const coverUploaded = ref(false);

/* ── Load existing course data ── */
onMounted(async () => {
  if (!props.courseId || !token) return;
  try {
    const res = await axios.get(`http://localhost:3001/api/teacher/courses/${props.courseId}/full`, { headers: { Authorization: `Bearer ${token}` } });
    sections.value = (res.data.sections || []).map((s: any) => ({
      ...s,
      lessons: (s.lessons || []).map((l: any) => ({
        ...l,
        videoUploaded: !!l.videoUrl, // mark green if video already exists
        uploadProgress: l.videoUrl ? 100 : 0,
        isUploading: false,
      })),
    }));
  } catch (err) {
    console.error(err);
  }
});

/* ── Cover upload ── */
const triggerCoverUpload = () => coverInputRef.value?.click();

const handleCoverSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !props.courseId || !token) return;

  coverPreviewUrl.value = URL.createObjectURL(file);
  coverUploading.value = true;
  coverUploaded.value = false;

  const formData = new FormData();
  formData.append('cover', file);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/${props.courseId}/cover`, formData, { headers: { Authorization: `Bearer ${token}` } });
    coverUploaded.value = true;
  } catch (err) {
    console.error(err);
    coverPreviewUrl.value = null;
    alert('Cover upload failed');
  } finally {
    coverUploading.value = false;
    (event.target as HTMLInputElement).value = '';
  }
};

/* ── Sections & lessons ── */
const addSection = async () => {
  if (!props.courseId || !token) return;
  try {
    const res = await axios.post(
      `http://localhost:3001/api/teacher/courses/${props.courseId}/sections`,
      { title: `Section ${sections.value.length + 1}` },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    sections.value.push({ _id: res.data._id, title: res.data.title, lessons: [] });
  } catch (err) {
    console.error(err);
    alert('Failed to add section');
  }
};

const removeSection = (index: number) => sections.value.splice(index, 1);

const addLesson = async (sectionIndex: number) => {
  const section = sections.value[sectionIndex];
  if (!section._id || !token) return;
  try {
    const res = await axios.post(
      `http://localhost:3001/api/teacher/courses/${section._id}/lessons`,
      { title: `Lesson ${section.lessons.length + 1}` },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    section.lessons.push({
      _id: res.data._id,
      title: res.data.title,
      videoUploaded: false,
      uploadProgress: 0,
      isUploading: false,
    });
  } catch (err) {
    console.error(err);
    alert('Failed to add lesson');
  }
};

const removeLesson = (si: number, li: number) => sections.value[si].lessons.splice(li, 1);

/* ── Video upload ── */
const triggerVideoUpload = (lessonId: string) => {
  selectedLessonId.value = lessonId;
  videoInputRef.value?.click();
};

const handleVideoSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !selectedLessonId.value || !token) return;

  const lessonId = selectedLessonId.value;

  // Find the lesson by index (not reference) so Vue reactivity works correctly
  let lesson: Lesson | null = null;
  for (const section of sections.value) {
    const found = section.lessons.find((l) => l._id === lessonId);
    if (found) {
      lesson = found;
      break;
    }
  }
  if (!lesson) return;

  lesson.isUploading = true;
  lesson.uploadProgress = 0;
  lesson.videoUploaded = false;

  const formData = new FormData();
  formData.append('video', file);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/lessons/${lessonId}/video`, formData, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 0, // no timeout — Cloudinary uploads can take a while
      maxContentLength: Infinity,
      maxBodyLength: Infinity,

      // This tracks bytes going from your browser to your server.
      // It reaches ~100% fast (local server). We cap it at 90 so the
      // bar doesn't falsely show 100% before Cloudinary is done.
      // When the server finally responds, we snap it to 100%.
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          lesson!.uploadProgress = Math.min(pct, 90); // cap at 90
        }
      },
    });

    // Server responded — Cloudinary upload is fully done
    lesson.uploadProgress = 100;
    lesson.videoUploaded = true;
  } catch (err: any) {
    console.error('Video upload error:', err);
    alert(err?.response?.data?.message || 'Video upload failed');
    lesson.uploadProgress = 0;
  } finally {
    lesson.isUploading = false;
    (event.target as HTMLInputElement).value = '';
    selectedLessonId.value = null;
  }
};

const saveAndContinue = () => emit('continue');
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Cover Image -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Cover Image</h2>
          <p class="text-xs text-gray-400 mt-0.5">This is the first thing students will see.</p>
        </div>
        <button v-if="coverPreviewUrl" @click="triggerCoverUpload" class="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">Change image</button>
      </div>

      <div
        @click="!coverPreviewUrl && triggerCoverUpload()"
        class="relative w-full rounded-2xl overflow-hidden border-2 transition-all duration-200"
        :class="coverPreviewUrl ? 'border-transparent cursor-default' : 'border-dashed border-gray-200 bg-gray-50 hover:border-orange-400/50 hover:bg-orange-50/30 cursor-pointer'"
        style="aspect-ratio: 16/7"
      >
        <img v-if="coverPreviewUrl" :src="coverPreviewUrl" alt="Cover preview" class="w-full h-full object-cover" />

        <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <Image :size="22" class="text-orange-400" />
          </div>
          <div class="text-center">
            <p class="text-sm font-semibold text-gray-600">Click to upload cover image</p>
            <p class="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — 16:9 ratio recommended</p>
          </div>
        </div>

        <div v-if="coverUploading" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
          <Loader :size="28" class="text-white animate-spin" />
          <p class="text-sm font-semibold text-white">Uploading...</p>
        </div>
      </div>

      <Transition name="fade-slide">
        <div v-if="coverUploaded && !coverUploading" class="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
          <CheckCircle :size="16" class="shrink-0" />
          Cover image uploaded successfully
        </div>
      </Transition>

      <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverSelected" />
    </div>

    <!-- Curriculum -->
    <div class="flex flex-col gap-3">
      <div>
        <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Curriculum</h2>
        <p class="text-xs text-gray-400 mt-0.5">Organize your course into sections and lessons.</p>
      </div>

      <div v-if="sections.length === 0" class="flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
        <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Film :size="20" class="text-gray-400" />
        </div>
        <p class="text-sm font-semibold text-gray-600">No sections yet</p>
        <p class="text-xs text-gray-400">Click "Add Section" to get started</p>
      </div>

      <div class="flex flex-col gap-3">
        <div v-for="(section, sIndex) in sections" :key="section._id" class="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <!-- Section header -->
          <div class="flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <span class="text-[11px] font-bold text-orange-500">{{ sIndex + 1 }}</span>
            </div>
            <input v-model="section.title" class="flex-1 min-w-0 text-sm font-bold text-gray-800 bg-transparent border-none outline-none" placeholder="Section title..." />
            <button @click="removeSection(sIndex)" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer shrink-0">
              <Trash :size="14" />
            </button>
          </div>

          <!-- Lessons -->
          <div class="divide-y divide-gray-100">
            <div v-for="(lesson, lIndex) in section.lessons" :key="lesson._id" class="flex flex-col gap-2 px-4 sm:px-5 py-3">
              <div class="flex items-center gap-3">
                <!-- Status icon -->
                <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center">
                  <CheckCircle v-if="lesson.videoUploaded" :size="18" class="text-emerald-500" />
                  <Loader v-else-if="lesson.isUploading" :size="16" class="text-orange-400 animate-spin" />
                  <div v-else class="w-5 h-5 rounded-full border-2 border-gray-200"></div>
                </div>

                <input v-model="lesson.title" class="flex-1 min-w-0 text-sm text-gray-700 bg-transparent border-none outline-none" placeholder="Lesson title..." />

                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    @click="triggerVideoUpload(lesson._id)"
                    :disabled="lesson.isUploading"
                    class="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="lesson.videoUploaded ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100'"
                  >
                    <Upload :size="11" />
                    <span>{{ lesson.videoUploaded ? 'Replace' : 'Upload' }}</span>
                  </button>

                  <button
                    @click="removeLesson(sIndex, lIndex)"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <Trash :size="13" />
                  </button>
                </div>
              </div>

              <!-- Progress bar -->
              <Transition name="fade-slide">
                <div v-if="lesson.isUploading || lesson.videoUploaded" class="pl-9">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] text-gray-500 font-medium">
                      <template v-if="lesson.isUploading && lesson.uploadProgress < 90"> Sending to server... {{ lesson.uploadProgress }}% </template>
                      <template v-else-if="lesson.isUploading"> Processing video... (this may take a minute) </template>
                      <template v-else> ✓ Upload complete </template>
                    </span>
                    <span class="text-[11px] font-bold" :class="lesson.videoUploaded ? 'text-emerald-500' : 'text-orange-500'"> {{ lesson.uploadProgress }}% </span>
                  </div>

                  <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-300"
                      :class="lesson.videoUploaded ? 'bg-emerald-500' : 'bg-orange-500'"
                      :style="{ width: lesson.uploadProgress + '%' }"
                    ></div>
                  </div>

                  <!-- Pulsing dots when waiting for Cloudinary -->
                  <div v-if="lesson.isUploading && lesson.uploadProgress >= 90" class="flex items-center gap-1 mt-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce" style="animation-delay: 300ms"></div>
                    <span class="text-[10px] text-gray-400 ml-1">Waiting for Cloudinary...</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <div class="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <button @click="addLesson(sIndex)" class="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
              <Plus :size="14" /> Add Lesson
            </button>
          </div>
        </div>
      </div>

      <button
        @click="addSection"
        class="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-orange-400/50 hover:text-orange-500 hover:bg-orange-50/20 transition-all duration-200 cursor-pointer mt-1"
      >
        <Plus :size="15" /> Add Section
      </button>
    </div>

    <input ref="videoInputRef" type="file" accept="video/*" class="hidden" @change="handleVideoSelected" />

    <div class="flex justify-end pt-4 border-t border-gray-100">
      <button
        @click="saveAndContinue"
        class="px-6 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        Save & Continue →
      </button>
    </div>
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
  transform: translateY(-4px);
}
</style>
