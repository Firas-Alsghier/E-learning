<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { Plus, Upload, Trash } from 'lucide-vue-next';

/* =========================
       EMITS & PROPS
  ========================= */

defineEmits(['continue']);

const props = defineProps<{
  courseId: string | null;
}>();

/* =========================
       TYPES
  ========================= */

interface Lesson {
  _id?: string;
  title: string;
}

interface Section {
  _id?: string;
  title: string;
  lessons: Lesson[];
}

/* =========================
       STATE
  ========================= */

const sections = ref<Section[]>([
  {
    title: 'Section 1',
    lessons: [{ title: 'Lesson 1' }],
  },
]);

const coverInputRef = ref<HTMLInputElement | null>(null);
const videoInputRef = ref<HTMLInputElement | null>(null);
const selectedLessonId = ref<string | null>(null);

/* =========================
       COVER UPLOAD
  ========================= */

const triggerCoverUpload = () => {
  coverInputRef.value?.click();
};

const handleCoverSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !props.courseId) return;

  const token = localStorage.getItem('teacher_token');
  if (!token) return alert('Not authenticated');

  const formData = new FormData();
  formData.append('cover', file);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/${props.courseId}/cover`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Cover image uploaded ✅');
  } catch (err) {
    console.error(err);
    alert('Cover upload failed');
  } finally {
    (event.target as HTMLInputElement).value = '';
  }
};

/* =========================
       SECTION & LESSON ACTIONS
  ========================= */

const addSection = () => {
  sections.value.push({
    title: `Section ${sections.value.length + 1}`,
    lessons: [],
  });
};

const removeSection = (index: number) => {
  sections.value.splice(index, 1);
};

const addLesson = (sectionIndex: number) => {
  sections.value[sectionIndex].lessons.push({
    title: `Lesson ${sections.value[sectionIndex].lessons.length + 1}`,
  });
};

const removeLesson = (sectionIndex: number, lessonIndex: number) => {
  sections.value[sectionIndex].lessons.splice(lessonIndex, 1);
};

/* =========================
       VIDEO UPLOAD (PLACEHOLDER)
  ========================= */

const triggerVideoUpload = (lessonId?: string) => {
  if (!lessonId) {
    alert('Lesson must be saved first');
    return;
  }

  selectedLessonId.value = lessonId;
  videoInputRef.value?.click();
};

const handleVideoSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !selectedLessonId.value) return;

  alert('Video upload will be implemented later');
  (event.target as HTMLInputElement).value = '';
};
</script>

<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-6">Course Materials</h1>

    <!-- ================= MEDIA ================= -->
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6 mb-10">
      <h2 class="text-lg font-semibold text-gray-800">Media</h2>

      <!-- Cover Image -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2"> Cover Image </label>

        <div
          @click="triggerCoverUpload"
          class="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-violet-500 hover:text-violet-600 transition"
        >
          <Upload class="h-6 w-6 mb-2" />
          <span class="text-sm">Upload cover image</span>
          <p class="text-xs text-gray-400 mt-2">Recommended: 1280×720 (JPG, PNG)</p>
        </div>

        <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverSelected" />
      </div>

      <!-- Sales Video -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2"> Sales Video </label>

        <div
          class="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-violet-500 hover:text-violet-600 transition"
        >
          <Upload class="h-6 w-6 mb-2" />
          <span class="text-sm">Upload sales video</span>
        </div>
      </div>
    </div>

    <!-- ================= CURRICULUM ================= -->
    <div class="space-y-6">
      <div v-for="(section, sIndex) in sections" :key="sIndex" class="border border-gray-200 rounded-xl p-5">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <input v-model="section.title" class="text-lg font-semibold w-full border-none focus:ring-0" placeholder="Section title" />

          <button @click="removeSection(sIndex)" class="text-red-500 hover:text-red-700 ml-4">
            <Trash class="w-4 h-4" />
          </button>
        </div>

        <!-- Lessons -->
        <div class="space-y-3 pl-4">
          <div v-for="(lesson, lIndex) in section.lessons" :key="lIndex" class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <input v-model="lesson.title" class="w-full bg-transparent border-none focus:ring-0" placeholder="Lesson title" />

            <div class="flex items-center gap-3">
              <button @click="triggerVideoUpload(lesson._id)" class="text-gray-500 hover:text-violet-600">
                <Upload class="w-4 h-4" />
              </button>

              <button @click="removeLesson(sIndex, lIndex)" class="text-red-500 hover:text-red-700">
                <Trash class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button @click="addLesson(sIndex)" class="flex items-center text-sm text-violet-600 font-semibold hover:text-violet-700">
            <Plus class="w-4 h-4 mr-1" />
            Add Lesson
          </button>
        </div>
      </div>
    </div>

    <button @click="addSection" class="mt-6 flex items-center text-sm font-semibold text-violet-600 hover:text-violet-700">
      <Plus class="w-4 h-4 mr-1" />
      Add Section
    </button>

    <!-- Hidden video input -->
    <input ref="videoInputRef" type="file" accept="video/*" class="hidden" @change="handleVideoSelected" />

    <!-- Footer -->
    <div class="flex justify-end pt-8 border-t border-gray-100 mt-8">
      <button @click="$emit('continue')" class="px-6 py-3 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition shadow-md shadow-violet-300">Save & Continue</button>
    </div>
  </div>
</template>
