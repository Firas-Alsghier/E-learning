<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Plus, Upload, Trash } from 'lucide-vue-next';

/* =========================
        EMITS & PROPS
========================= */

const emit = defineEmits<{
  (e: 'continue'): void;
}>();

const props = defineProps<{
  courseId: string | null;
}>();

/* =========================
          TYPES
========================= */

interface Lesson {
  _id: string;
  title: string;
}

interface Section {
  _id: string;
  title: string;
  lessons: Lesson[];
}

/* =========================
          STATE
========================= */

const sections = ref<Section[]>([]);
const coverInputRef = ref<HTMLInputElement | null>(null);
const videoInputRef = ref<HTMLInputElement | null>(null);
const selectedLessonId = ref<string | null>(null);

const token = localStorage.getItem('teacher_token');

/* =========================
      FETCH FULL COURSE
========================= */

onMounted(async () => {
  if (!props.courseId || !token) return;

  try {
    const res = await axios.get(`http://localhost:3001/api/teacher/courses/${props.courseId}/full`, { headers: { Authorization: `Bearer ${token}` } });

    sections.value = res.data.sections || [];
  } catch (err) {
    console.error(err);
    alert('Failed to load course materials');
  }
});

/* =========================
        COVER UPLOAD
========================= */

const triggerCoverUpload = () => {
  coverInputRef.value?.click();
};

const handleCoverSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !props.courseId || !token) return;

  const formData = new FormData();
  formData.append('cover', file);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/${props.courseId}/cover`, formData, { headers: { Authorization: `Bearer ${token}` } });

    alert('Cover uploaded ✅');
  } catch (err) {
    console.error(err);
    alert('Cover upload failed');
  } finally {
    (event.target as HTMLInputElement).value = '';
  }
};

/* =========================
     SECTION & LESSONS
========================= */

const addSection = async () => {
  if (!props.courseId || !token) return;

  try {
    const res = await axios.post(
      `http://localhost:3001/api/teacher/courses/${props.courseId}/sections`,
      { title: `Section ${sections.value.length + 1}` },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    sections.value.push({
      _id: res.data._id,
      title: res.data.title,
      lessons: [],
    });
  } catch (err) {
    console.error(err);
    alert('Failed to add section');
  }
};

const removeSection = (index: number) => {
  sections.value.splice(index, 1);
};

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
    });
  } catch (err) {
    console.error(err);
    alert('Failed to add lesson');
  }
};

const removeLesson = (sectionIndex: number, lessonIndex: number) => {
  sections.value[sectionIndex].lessons.splice(lessonIndex, 1);
};

/* =========================
        VIDEO UPLOAD
========================= */

const triggerVideoUpload = (lessonId: string) => {
  selectedLessonId.value = lessonId;
  videoInputRef.value?.click();
};

const handleVideoSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file || !selectedLessonId.value || !token) return;

  const formData = new FormData();
  formData.append('video', file);
  console.log('Uploading video for lesson:', selectedLessonId.value);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/lessons/${selectedLessonId.value}/video`, formData, { headers: { Authorization: `Bearer ${token}` } });

    alert('Video uploaded ✅');
  } catch (err) {
    console.error(err);
    alert('Video upload failed');
  } finally {
    (event.target as HTMLInputElement).value = '';
    selectedLessonId.value = null;
  }
};

/* =========================
      SAVE & CONTINUE
========================= */

const saveAndContinue = () => {
  emit('continue');
};
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-6">Course Materials</h1>

    <!-- Media -->
    <div class="border rounded-xl p-6 mb-10">
      <h2 class="font-semibold mb-4">Media</h2>

      <div @click="triggerCoverUpload" class="h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer">
        <Upload class="w-5 h-5 mr-2" />
        Upload cover image
      </div>

      <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="handleCoverSelected" />
    </div>

    <!-- Curriculum -->
    <div v-for="(section, sIndex) in sections" :key="section._id" class="border rounded-xl p-5 mb-6">
      <div class="flex justify-between mb-4">
        <input v-model="section.title" class="font-semibold w-full border-none" />
        <button @click="removeSection(sIndex)">
          <Trash class="w-4 h-4 text-red-500" />
        </button>
      </div>

      <div v-for="(lesson, lIndex) in section.lessons" :key="lesson._id" class="flex justify-between mb-2">
        <input v-model="lesson.title" class="w-full border-none" />
        <div class="flex gap-3">
          <button @click="triggerVideoUpload(lesson._id)">
            <Upload class="w-4 h-4" />
          </button>
          <button @click="removeLesson(sIndex, lIndex)">
            <Trash class="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <button @click="addLesson(sIndex)" class="text-sm text-violet-600 mt-2">+ Add Lesson</button>
    </div>

    <button @click="addSection" class="text-violet-600 text-sm">+ Add Section</button>

    <input ref="videoInputRef" type="file" accept="video/*" class="hidden" @change="handleVideoSelected" />

    <div class="flex justify-end mt-10">
      <button @click="saveAndContinue" class="px-6 py-3 bg-violet-600 text-white rounded-lg">Save & Continue</button>
    </div>
  </div>
</template>
