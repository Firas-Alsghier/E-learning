<script setup lang="ts">
import { Plus, Upload, Trash, CheckCircle, Film, Image, Loader } from 'lucide-vue-next';
import { ref, onMounted, computed, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';

const props = defineProps<{
  courseId: string;
}>();
const emit = defineEmits(['continue']);
const sections = ref<any[]>([]);
const isLoading = ref(false);
const coverUrl = ref<string | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);
const coverUploading = ref(false);
const coverUploaded = ref(false);
const videoInputRef = ref<HTMLInputElement | null>(null);
const selectedLessonId = ref<string | null>(null);
const loadingSections = ref(false);
const isAnyUploading = computed(() => {
  return sections.value.some((section) => section.lessons?.some((lesson: any) => lesson.isUploading));
});

const triggerCoverUpload = () => {
  coverInputRef.value?.click();
};

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (isAnyUploading.value) {
    event.preventDefault();
    event.returnValue = '';
  }
};

const fetchCurriculum = async () => {
  try {
    loadingSections.value = true;

    // ✅ get token
    const token = useCookie('teacher_token').value;

    // ✅ fetch the full course
    const res = await axios.get(`http://localhost:3001/api/teacher/courses/${props.courseId}/full`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('FULL RESPONSE:', res.data);

    const course = res.data;
    coverUrl.value = course.coverImage || null;
    // ✅ make sure sections exist
    const rawSections = course.sections || [];
    sections.value = rawSections.map((section: any) => ({
      _id: section._id,
      title: section.title,
      order: section.order,
      isNew: false,
      isDeleted: false,

      lessons: (section.lessons || []).map((lesson: any) => ({
        _id: lesson._id,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
        isFreePreview: lesson.isFreePreview,

        isNew: false,
        isDeleted: false,
        newVideoFile: null,

        // 🔥 for upload UI
        isUploading: false,
        uploadProgress: lesson.videoUrl ? 100 : 0,
      })),
    }));

    console.log('MAPPED SECTIONS:', sections.value); // ✅ check UI-ready state
  } catch (err) {
    console.error('Fetch curriculum error:', err);
  } finally {
    loadingSections.value = false;
  }
};

const fetchSections = async () => {
  try {
    isLoading.value = true;

    const token = useCookie('teacher_token').value;

    const res = await axios.get(`http://localhost:3001/api/teacher/courses/${props.courseId}/full`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
    coverUrl.value = res.data.coverImage || null;
    sections.value = (res.data.sections || []).map((section: any) => ({
      ...section,
      lessons: (section.lessons || []).map((lesson: any) => ({
        ...lesson,
        isUploading: false,
        uploadProgress: lesson.videoUrl ? 100 : 0,
      })),
    }));
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const handleCoverSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const token = useCookie('teacher_token').value;

  // 🔥 instant preview
  coverUrl.value = URL.createObjectURL(file);
  coverUploading.value = true;
  coverUploaded.value = false;

  const formData = new FormData();
  formData.append('cover', file);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/${props.courseId}/cover`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    coverUploaded.value = true;
  } catch (err) {
    console.error(err);
    alert('Cover upload failed');
  } finally {
    coverUploading.value = false;
    (event.target as HTMLInputElement).value = '';
  }
};

const triggerVideoUpload = (lessonId: string) => {
  selectedLessonId.value = lessonId;
  videoInputRef.value?.click();
};
const addSection = async () => {
  try {
    const token = useCookie('teacher_token').value;

    const res = await axios.post(
      `http://localhost:3001/api/teacher/courses/${props.courseId}/sections`,
      {
        title: 'New Section',
        order: sections.value.length,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔥 instantly update UI
    sections.value.push({
      ...res.data,
      lessons: [],
      isNew: false,
      isDeleted: false,
    });
  } catch (err) {
    console.error(err);
    alert('Failed to add section');
  }
};

const addLesson = async (sectionId: string, sectionIndex: number) => {
  try {
    const token = useCookie('teacher_token').value;

    const res = await axios.post(
      `http://localhost:3001/api/teacher/courses/${sectionId}/lessons`,
      {
        title: 'New Lesson',
        order: sections.value[sectionIndex].lessons.length,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // 🔥 update UI instantly
    sections.value[sectionIndex].lessons.push({
      ...res.data,
      isNew: false,
      isDeleted: false,
      newVideoFile: null,
      isUploading: false,
      uploadProgress: 0,
    });
  } catch (err) {
    console.error(err);
    alert('Failed to add lesson');
  }
};

const deleteSection = async (sectionId: string, index: number) => {
  try {
    const token = useCookie('teacher_token').value;

    await axios.delete(`http://localhost:3001/api/teacher/courses/sections/${sectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 update UI instantly
    sections.value.splice(index, 1);
  } catch (err) {
    console.error(err);
    alert('Failed to delete section');
  }
};

const deleteLesson = async (lessonId: string, sectionIndex: number, lessonIndex: number) => {
  try {
    const token = useCookie('teacher_token').value;

    await axios.delete(`http://localhost:3001/api/teacher/courses/lessons/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 update UI instantly
    sections.value[sectionIndex].lessons.splice(lessonIndex, 1);
  } catch (err) {
    console.error(err);
    alert('Failed to delete lesson');
  }
};

const updateSection = async (section: any) => {
  try {
    const token = useCookie('teacher_token').value;

    await axios.patch(
      `http://localhost:3001/api/teacher/courses/sections/${section._id}`,
      {
        title: section.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error(err);
    alert('Failed to update section');
  }
};
const updateLesson = async (lesson: any) => {
  try {
    const token = useCookie('teacher_token').value;

    await axios.patch(
      `http://localhost:3001/api/teacher/courses/lessons/${lesson._id}`,
      {
        title: lesson.title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error(err);
    alert('Failed to update lesson');
  }
};

const handleVideoSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !selectedLessonId.value) return;

  const token = useCookie('teacher_token').value;
  const lessonId = selectedLessonId.value;

  // 🔍 find lesson
  let lesson: any = null;
  let sectionIndex = -1;
  let lessonIndex = -1;

  sections.value.forEach((section, si) => {
    const li = section.lessons.findIndex((l: any) => l._id === lessonId);
    if (li !== -1) {
      lesson = section.lessons[li];
      sectionIndex = si;
      lessonIndex = li;
    }
  });

  if (!lesson) return;

  // 🔥 UI state
  lesson.isUploading = true;
  lesson.uploadProgress = 0;
  lesson.videoUrl = null;

  try {
    // 1️⃣ Upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'course_videos');

    const res = await axios.post(`https://api.cloudinary.com/v1_1/ddptjfnlp/video/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          lesson.uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        }
      },
    });

    const videoUrl = res.data.secure_url;

    // 2️⃣ Save to backend
    await axios.patch(
      `http://localhost:3001/api/teacher/courses/lessons/${lessonId}/video-url`,
      { videoUrl },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    lesson.videoUrl = videoUrl;
    lesson.uploadProgress = 100;
  } catch (err) {
    console.error(err);
    lesson.uploadProgress = 0;
    alert('Upload failed');
  } finally {
    lesson.isUploading = false;
    (event.target as HTMLInputElement).value = '';
    selectedLessonId.value = null;
  }
};

const saveAndContinue = async () => {
  try {
    const token = useCookie('teacher_token').value;

    await axios.patch(
      `http://localhost:3001/api/teacher/courses/${props.courseId}/curriculum`,
      {
        sections: sections.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    emit('continue'); // 🔥 VERY IMPORTANT
  } catch (err) {
    console.error(err);
    alert('Failed to save curriculum');
  }
};

onMounted(() => {
  fetchCurriculum();
  // fetchSections();
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Cover Image</h2>
          <p class="text-xs text-gray-400 mt-0.5">This is the first thing students will see.</p>
        </div>
        <button @click="triggerCoverUpload" class="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">Change image</button>
      </div>

      <div class="relative w-full rounded-2xl overflow-hidden border-2 border-transparent cursor-default" style="aspect-ratio: 16/7">
        <img v-if="coverUrl" :src="coverUrl" alt="Cover preview" class="w-full h-full object-cover" />

        <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No cover image</div>
      </div>

      <div v-if="coverUploaded" class="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
        <CheckCircle class="text-emerald-500" />
        Cover image uploaded successfully
      </div>
    </div>
    <!-- Cover input -->

    <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverSelected" />
    <!-- ✅ Video input (HERE, only once) -->
    <input ref="videoInputRef" type="file" accept="video/*" class="hidden" @change="handleVideoSelected" />

    <div class="flex flex-col gap-3">
      <div>
        <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Curriculum</h2>
        <p class="text-xs text-gray-400 mt-0.5">Organize your course into sections and lessons.</p>
      </div>

      <div class="flex flex-col gap-3">
        <div v-for="(section, sIndex) in sections" :key="section._id" class="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <!-- SECTION HEADER -->
          <div class="flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <span class="text-[11px] font-bold text-orange-500">
                {{ sIndex + 1 }}
              </span>
            </div>

            <input v-model="section.title" @blur="updateSection(section)" class="flex-1 min-w-0 text-sm font-bold text-gray-800 bg-transparent border-none outline-none" />

            <button
              @click="deleteSection(section._id, sIndex)"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer shrink-0"
            >
              <Trash :size="14" />
            </button>
          </div>

          <!-- LESSONS -->
          <div class="divide-y divide-gray-100">
            <div v-for="(lesson, lIndex) in section.lessons || []" :key="lesson._id" class="flex flex-col gap-2 px-4 sm:px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center">
                  <CheckCircle v-if="lesson.videoUrl && !lesson.isUploading" :size="18" class="text-emerald-500" />
                  <Loader v-else-if="lesson.isUploading" :size="16" class="text-orange-400 animate-spin" />
                  <div v-else class="w-5 h-5 rounded-full border-2 border-gray-200"></div>
                </div>
                <input v-model="lesson.title" @blur="updateLesson(lesson)" class="flex-1 min-w-0 text-sm text-gray-700 bg-transparent border-none outline-none" />
                <p v-if="lesson.videoUrl" class="text-[11px] text-emerald-500 font-semibold">Video attached ✔</p>
                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    @click="triggerVideoUpload(lesson._id)"
                    class="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer"
                    :class="lesson.videoUrl ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100'"
                  >
                    <Upload :size="11" />
                    <span>{{ lesson.videoUrl ? 'Replace' : 'Upload' }}</span>
                  </button>

                  <button
                    @click="deleteLesson(lesson._id, Number(sIndex), Number(lIndex))"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <Trash :size="13" />
                  </button>
                </div>
              </div>
              <Transition name="fade-slide">
                <div v-if="lesson.isUploading || lesson.videoUrl" class="pl-9">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] text-gray-500 font-medium">
                      <template v-if="lesson.isUploading && lesson.uploadProgress < 90"> Uploading... {{ lesson.uploadProgress }}% </template>
                      <template v-else-if="lesson.isUploading"> Processing video... </template>
                      <template v-else> ✓ Upload complete </template>
                    </span>

                    <span class="text-[11px] font-bold" :class="lesson.videoUrl ? 'text-emerald-500' : 'text-orange-500'"> {{ lesson.uploadProgress }}% </span>
                  </div>

                  <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-300" :class="lesson.videoUrl ? 'bg-emerald-500' : 'bg-orange-500'" :style="{ width: lesson.uploadProgress + '%' }"></div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- ADD LESSON -->
          <div class="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <button @click="addLesson(section._id, sIndex)" class="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
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

    <div class="flex justify-end pt-4 border-t border-gray-100">
      <button
        @click="!isAnyUploading && saveAndContinue()"
        :disabled="isAnyUploading"
        :class="isAnyUploading ? 'opacity-50 cursor-not-allowed' : ''"
        class="px-6 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        Save & Continue →
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Animations kept for the progress bars */
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
