<!-- components\custom\teacher\CourseCreation.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import { ChevronRight, Upload, Plus } from 'lucide-vue-next';

const courseId = ref<string | null>(null);
const isSaving = ref(false);

// --- Step Management ---
const currentStep = ref(1);
const onPublished = () => {
  window.alert('Done!');
};
// --- Course Model ---
interface CourseInfo {
  title: string;
  category: string;
  level: string;
  description: string;
  faqs: { question: string; answer: string }[];
}

const courseData = ref<CourseInfo>({
  title: '',
  category: 'Data Management',
  level: 'Basic',
  description: '',
  faqs: [
    {
      question: 'Do you offer 1 on 1 calls',
      answer: 'Yes, at a fixed cost per call',
    },
  ],
});

const coverFile = ref<File | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);

const openCoverPicker = () => {
  coverInputRef.value?.click();
};

const onCoverSelected = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !courseId.value) return;

  coverFile.value = file;

  const token = localStorage.getItem('teacher_token');
  if (!token) return alert('Not authenticated');

  const formData = new FormData();
  formData.append('cover', file);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/${courseId.value}/cover`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Cover image uploaded ✅');
  } catch (err) {
    console.error(err);
    alert('Cover upload failed');
  }
};

// --- API: Create Course (STEP 1) ---
const createCourse = async () => {
  isSaving.value = true;

  try {
    const token = localStorage.getItem('teacher_token');

    if (!token) {
      alert('Not authenticated');
      return;
    }

    const res = await axios.post(
      'http://localhost:3001/api/teacher/courses',
      {
        title: courseData.value.title,
        description: courseData.value.description,
        category: courseData.value.category,
        level: courseData.value.level,
        faqs: courseData.value.faqs,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    courseId.value = res.data._id;
    goToNextStep();
  } catch (err: any) {
    console.error('Create course error:', err);
    alert(err?.response?.data?.message || 'Failed to create course');
  } finally {
    isSaving.value = false;
  }
};

// --- Dropdown Data ---
const categories = ['Data Management', 'Web Development', 'Design', 'Marketing', 'Finance'];
const levels = ['Basic', 'Intermediate', 'Advanced', 'Expert'];

// --- Helpers ---
const isStepCompleted = (step: number) => step < currentStep.value;

const goToNextStep = () => {
  if (currentStep.value < 4) currentStep.value++;
};

const goToStep = (step: number) => {
  if (step <= currentStep.value) currentStep.value = step;
};

const descriptionCharCount = computed(() => courseData.value.description.length);

// --- FAQ ---
const addFaq = () => {
  courseData.value.faqs.push({ question: '', answer: '' });
};

const removeFaq = (index: number) => {
  courseData.value.faqs.splice(index, 1);
};

// --- Save Handler ---
const handleSave = async (action: 'continue' | 'draft') => {
  if (action === 'draft') {
    alert('Draft saved (not implemented yet)');
    return;
  }

  if (!courseData.value.title || !courseData.value.description) {
    alert('Title and description are required');
    return;
  }

  await createCourse();
};

// --- Upload Placeholder ---
const handleFileUpload = (type: 'cover' | 'video') => {
  alert(`Simulating ${type} file upload...`);
};
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen font-sans">
    <!-- Header & Step Navigation -->
    <header class="mb-8 flex justify-between items-center">
      <!-- Step Indicators -->
      <nav class="flex items-center space-x-2 text-sm font-medium">
        <template v-for="step in 4" :key="step">
          <button
            @click="goToStep(step)"
            :class="[
              'px-4 py-2 rounded-full transition-all duration-300',
              currentStep === step ? 'bg-violet-600 text-white shadow-md' : isStepCompleted(step) ? 'text-violet-600 hover:bg-violet-50' : 'text-gray-400 cursor-not-allowed',
            ]"
            :disabled="step > currentStep"
          >
            <span class="mr-1 font-bold">{{ step }}</span>
            <span v-if="step === 1">Course Information & FAQ</span>
            <span v-else-if="step === 2">Upload Course Materials</span>
            <span v-else-if="step === 3">Pricing</span>
            <span v-else-if="step === 4">Publish</span>
          </button>
          <ChevronRight v-if="step < 4" class="h-4 w-4 text-gray-400" />
        </template>
      </nav>
      <button class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition">Preview</button>
    </header>

    <!-- Step Content Area -->
    <main class="bg-white p-8 rounded-xl shadow-lg">
      <!-- Step 1: Course Information & FAQ -->
      <div v-if="currentStep === 1">
        <h1 class="text-xl font-bold text-gray-800 mb-6">Course Information</h1>

        <div class="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <!-- Left Column: Text Inputs -->
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                :disabled="!!courseId"
                id="title"
                type="text"
                v-model="courseData.title"
                placeholder="e.g. Introduction to Data Analysis"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-400"
              />
            </div>

            <!-- Category & Level -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  id="category"
                  v-model="courseData.category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div>
                <label for="level" class="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                <select id="level" v-model="courseData.level" class="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option v-for="lvl in levels" :key="lvl" :value="lvl">{{ lvl }}</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                v-model="courseData.description"
                maxlength="2000"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none h-32 placeholder:text-gray-400"
              ></textarea>
              <p class="text-xs text-right text-gray-500 mt-1">{{ descriptionCharCount }}/2000 characters</p>
            </div>

            <!-- Frequently Asked Questions -->
            <div class="pt-4">
              <h2 class="text-lg font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

              <div v-for="(faq, index) in courseData.faqs" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg relative">
                <!-- Remove button -->
                <button v-if="courseData.faqs.length > 1" @click="removeFaq(index)" class="absolute top-2 right-2 text-red-500 hover:text-red-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                </button>

                <label :for="`faq-q-${index}`" class="block text-xs font-semibold text-gray-700 mb-1">Question</label>
                <input
                  :disabled="!!courseId"
                  :id="`faq-q-${index}`"
                  type="text"
                  v-model="faq.question"
                  placeholder="e.g. Do you offer 1 on 1 calls"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 mb-2"
                />

                <label :for="`faq-a-${index}`" class="block text-xs font-semibold text-gray-700 mb-1">Answer</label>
                <input
                  :disabled="!!courseId"
                  :id="`faq-a-${index}`"
                  type="text"
                  v-model="faq.answer"
                  placeholder="e.g. Yes, at a fixed cost per call"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <button @click="addFaq" class="text-sm text-violet-600 font-semibold hover:text-violet-700 transition flex items-center mt-2"><Plus class="h-4 w-4 mr-1" /> Add another FAQ</button>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex justify-end pt-8 border-t border-gray-100 mt-8 space-x-4">
          <button @click="handleSave('draft')" class="px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Save as draft</button>
          <button @click="handleSave('continue')" class="px-6 cursor-pointer py-3 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition shadow-md shadow-violet-300">
            Save & Continue
          </button>
        </div>
      </div>

      <!-- future steps -->
      <!-- STEP 2 -->
      <div v-else-if="currentStep === 2">
        <CustomTeacherCourseMaterialsStep :courseId="courseId" @continue="goToNextStep" />
      </div>

      <!-- STEP 3 -->
      <div v-else-if="currentStep === 3" class="text-center p-20">
        <CustomTeacherCoursePricingStep @continue="goToNextStep" />
      </div>

      <!-- STEP 4 -->
      <div v-else-if="currentStep === 4">
        <CustomTeacherCoursePublishStep :courseId="courseId" @published="onPublished" />
      </div>
    </main>
  </div>
</template>
