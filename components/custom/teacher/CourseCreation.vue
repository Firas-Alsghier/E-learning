<!-- components\custom\teacher\CourseCreation.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import axios from 'axios';
import { ChevronRight, Upload, Plus, X, Check } from 'lucide-vue-next';
// import Quill from 'quill';
// import 'quill/dist/quill.snow.css';

const courseId = ref<string | null>(null);
const isSaving = ref(false);
const isAnyUploading = ref(false);
// --- Step Management ---
const currentStep = ref(1);
const quillEditor = ref<any>(null);
const quillContainer = ref<HTMLDivElement | null>(null);
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
  level: 'All levels',
  description: '',
  faqs: [{ question: '', answer: '' }],
});

// --- Level Check ---
interface LevelCheckQuestion {
  question: string;
  answers: string[];
  correctAnswerIndex: number | null;
}

const handleUploading = (val: boolean) => {
  isAnyUploading.value = val;
};

const levelCheckEnabled = ref(false);

const levelCheckQuestions = ref<LevelCheckQuestion[]>([{ question: '', answers: ['', '', '', ''], correctAnswerIndex: null }]);

const addQuestion = () => {
  levelCheckQuestions.value.push({ question: '', answers: ['', '', '', ''], correctAnswerIndex: null });
};

const removeQuestion = (index: number) => {
  levelCheckQuestions.value.splice(index, 1);
};

const coverFile = ref<File | null>(null);
const coverInputRef = ref<HTMLInputElement | null>(null);

const openCoverPicker = () => coverInputRef.value?.click();

const onCoverSelected = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !courseId.value) return;

  coverFile.value = file;

  const token = useCookie('teacher_token').value;
  if (!token) return alert('Not authenticated');

  const formData = new FormData();
  formData.append('cover', file);

  try {
    await axios.patch(`http://localhost:3001/api/teacher/courses/${courseId.value}/cover`, formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });
    alert('Cover image uploaded ✅');
  } catch (err) {
    console.error(err);
    alert('Cover upload failed');
  }
};

// --- API: Create Course ---
const createCourse = async () => {
  isSaving.value = true;
  try {
    const token = useCookie('teacher_token').value;
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
        levelCheck: levelCheckEnabled.value ? { enabled: true, questions: levelCheckQuestions.value } : { enabled: false, questions: [] },
      },
      { headers: { Authorization: `Bearer ${token}` } }
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
const levels = ['All levels', 'Basic', 'Intermediate', 'Advanced'];

// --- Helpers ---
const isStepCompleted = (step: number) => step < currentStep.value;
const goToNextStep = () => {
  if (currentStep.value < 4) currentStep.value++;
};
const goToStep = (step: number) => {
  if (isAnyUploading.value) {
    alert('Please wait until video upload is finished');
    return;
  }
  if (step <= currentStep.value) currentStep.value = step;
};
const descriptionCharCount = computed(() => courseData.value.description.length);

// --- FAQ ---
const addFaq = () => courseData.value.faqs.push({ question: '', answer: '' });
const removeFaq = (index: number) => courseData.value.faqs.splice(index, 1);

const updateCourse = async () => {
  isSaving.value = true;
  try {
    const token = useCookie('teacher_token').value;
    if (!token) {
      alert('Not authenticated');
      return;
    }

    await axios.patch(
      `http://localhost:3001/api/teacher/courses/${courseId.value}`,
      {
        title: courseData.value.title,
        description: courseData.value.description,
        category: courseData.value.category,
        level: courseData.value.level,
        faqs: courseData.value.faqs,
        levelCheck: levelCheckEnabled.value ? { enabled: true, questions: levelCheckQuestions.value } : { enabled: false, questions: [] },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    goToNextStep();
  } catch (err: any) {
    console.error('Update course error:', err);
    alert(err?.response?.data?.message || 'Failed to update course');
  } finally {
    isSaving.value = false;
  }
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

  if (!courseId.value) {
    await createCourse();
  } else {
    await updateCourse();
  }
};

onBeforeRouteLeave(() => {
  if (isAnyUploading.value) {
    return confirm('Upload in progress. Are you sure you want to leave?');
  }
});

const handleFileUpload = (type: 'cover' | 'video') => {
  alert(`Simulating ${type} file upload...`);
};

const stepLabels = ['Course Info & FAQ', 'Upload Materials', 'Pricing', 'Publish'];

// onMounted(() => {
//   if (!quillContainer.value) return;

//   quillEditor.value = new Quill(quillContainer.value, {
//     theme: 'snow',
//     placeholder: 'Describe your course...',
//     modules: {
//       toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], [{ align: [] }], ['link']],
//     },
//   });

//   // 🔥 Sync Quill → Vue
//   quillEditor.value.on('text-change', () => {
//     courseData.value.description = quillEditor.value.root.innerHTML;
//   });

//   // ✅ IMPORTANT: load existing data (edit case)
//   if (courseData.value.description) {
//     quillEditor.value.root.innerHTML = courseData.value.description;
//   }
// });
</script>

<template>
  <!--
    🎨 BACKGROUND COLOR — change bg-slate-50 below to your preferred color.
    Examples: bg-white | bg-gray-100 | bg-[#your-color]
  -->
  <div class="min-h-screen bg-slate-50 font-sans">
    <!-- ── Top header / stepper ── -->
    <header class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Step nav -->
        <nav class="flex items-center gap-1 overflow-x-auto scrollbar-none" style="scrollbar-width: none">
          <template v-for="step in 4" :key="step">
            <button
              @click="goToStep(step)"
              :disabled="step > currentStep"
              class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200"
              :class="{
                'bg-orange-500 text-white shadow-[0_2px_12px_rgba(255,120,45,0.35)]': currentStep === step,
                'text-orange-500 hover:bg-orange-50': isStepCompleted(step),
                'text-gray-400 cursor-not-allowed': step > currentStep,
              }"
            >
              <!-- Step badge -->
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                :class="{
                  'bg-white/25 text-white': currentStep === step,
                  'bg-orange-100 text-orange-500': isStepCompleted(step),
                  'bg-gray-100 text-gray-400': step > currentStep,
                }"
              >
                <Check v-if="isStepCompleted(step)" :size="10" />
                <span v-else>{{ step }}</span>
              </span>
              <span class="hidden sm:inline">{{ stepLabels[step - 1] }}</span>
            </button>
            <ChevronRight v-if="step < 4" :size="14" class="text-gray-300 shrink-0" />
          </template>
        </nav>

        <!-- Preview button -->
        <!-- <button
          class="shrink-0 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        >
          Preview
        </button> -->
      </div>
    </header>

    <!-- ── Step content ── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <!-- ════ STEP 1: Course Info ════ -->
      <div v-if="currentStep === 1">
        <!--
          🎨 CARD BACKGROUND — change bg-white below.
        -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Card header -->
          <div class="px-6 sm:px-8 text-center py-5 border-b border-gray-100">
            <h1 class="text-lg sm:text-xl font-bold text-gray-900">Course Information</h1>
            <p class="text-sm text-gray-500 mt-0.5">Fill in the basic details about your course.</p>
          </div>

          <div class="px-6 sm:px-8 text-left py-7 space-y-6">
            <!-- Title -->
            <div class="flex flex-col gap-1.5">
              <label for="title" class="text-sm font-semibold text-gray-700"> Course Title <span class="text-red-400">*</span> </label>
              <input
                :disabled="false"
                id="title"
                type="text"
                v-model="courseData.title"
                placeholder="e.g. Introduction to Data Analysis"
                class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Category + Level -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label for="category" class="text-sm font-semibold text-gray-700">Category</label>
                <select
                  id="category"
                  v-model="courseData.category"
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 appearance-none transition-colors cursor-pointer"
                >
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="level" class="text-sm font-semibold text-gray-700">Level</label>
                <select
                  id="level"
                  v-model="courseData.level"
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 appearance-none transition-colors cursor-pointer"
                >
                  <option v-for="lvl in levels" :key="lvl" :value="lvl">{{ lvl }}</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5">
              <label for="description" class="text-sm font-semibold text-gray-700"> Description <span class="text-red-400">*</span> </label>
              <!-- <textarea
                id="description"
                v-model="courseData.description"
                maxlength="2000"
                rows="5"
                placeholder="Describe what students will learn in this course..."
                class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 resize-none placeholder:text-gray-400 transition-colors"
              ></textarea> -->
              <CustomEditorQuillEditor v-model="courseData.description" />
              <p class="text-xs text-gray-400 text-right">{{ descriptionCharCount }}/2000</p>
            </div>

            <!-- ── FAQs ── -->
            <div class="pt-2">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-base font-bold text-gray-900">Frequently Asked Questions</h2>
                  <p class="text-xs text-gray-400 mt-0.5">Help students know what to expect.</p>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <div v-for="(faq, index) in courseData.faqs" :key="index" class="relative flex flex-col gap-3 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <!-- Remove FAQ -->
                  <button
                    v-if="courseData.faqs.length > 1"
                    @click="removeFaq(index)"
                    class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 hover:text-red-500 transition-all cursor-pointer"
                  >
                    <X :size="12" />
                  </button>

                  <div class="flex flex-col gap-1.5 pr-8">
                    <label :for="`faq-q-${index}`" class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Question</label>
                    <input
                      :id="`faq-q-${index}`"
                      type="text"
                      v-model="faq.question"
                      placeholder="e.g. Do you offer 1 on 1 calls?"
                      class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-400 transition-colors disabled:opacity-60"
                    />
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label :for="`faq-a-${index}`" class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Answer</label>
                    <input
                      :id="`faq-a-${index}`"
                      type="text"
                      v-model="faq.answer"
                      placeholder="e.g. Yes, at a fixed cost per call."
                      class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-400 transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <button @click="addFaq" class="mt-3 flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                <Plus :size="15" /> Add another FAQ
              </button>
            </div>

            <!-- ── Level Check ── -->
            <div class="pt-6 border-t border-gray-100">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h2 class="text-base font-bold text-gray-900">Level Check <span class="text-xs font-normal text-gray-400 ml-1">(Optional)</span></h2>
                  <p class="text-xs text-gray-400 mt-0.5">Quiz students before they enroll to confirm their readiness.</p>
                </div>

                <!-- Toggle -->
                <label class="flex items-center gap-2.5 cursor-pointer shrink-0">
                  <span class="text-sm text-gray-500">{{ levelCheckEnabled ? 'On' : 'Off' }}</span>
                  <div
                    class="w-10 h-5 rounded-full p-0.5 transition-colors duration-200 relative"
                    :class="levelCheckEnabled ? 'bg-orange-500' : 'bg-gray-200'"
                    @click="levelCheckEnabled = !levelCheckEnabled"
                  >
                    <div class="w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200" :class="levelCheckEnabled ? 'translate-x-5' : 'translate-x-0'"></div>
                  </div>
                </label>
              </div>

              <!-- Questions -->
              <div v-if="levelCheckEnabled" class="flex flex-col gap-4">
                <div v-for="(q, qIndex) in levelCheckQuestions" :key="qIndex" class="relative p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-wide">Question {{ qIndex + 1 }}</span>
                    <button v-if="levelCheckQuestions.length > 1" @click="removeQuestion(qIndex)" class="text-xs font-semibold text-red-400 hover:text-red-500 transition-colors cursor-pointer">
                      Remove
                    </button>
                  </div>

                  <input
                    v-model="q.question"
                    type="text"
                    placeholder="Enter your question..."
                    class="w-full mb-4 px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-400 transition-colors"
                  />

                  <div class="flex flex-col gap-2">
                    <div v-for="(ans, aIndex) in q.answers" :key="aIndex" class="flex items-center gap-3">
                      <input
                        type="radio"
                        :name="'correct-' + qIndex"
                        :checked="q.correctAnswerIndex === aIndex"
                        @change="q.correctAnswerIndex = aIndex"
                        class="accent-orange-500 shrink-0 cursor-pointer"
                      />
                      <input
                        v-model="q.answers[aIndex]"
                        type="text"
                        :placeholder="`Answer ${aIndex + 1}...`"
                        class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button @click="addQuestion" class="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                  <Plus :size="15" /> Add Question
                </button>
              </div>
            </div>
          </div>

          <!-- Card footer: actions -->
          <div class="px-6 sm:px-8 py-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
            <!-- <button
              @click="handleSave('draft')"
              class="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer"
            >
              Save as Draft
            </button> -->
            <button
              @click="handleSave('continue')"
              :disabled="isSaving"
              class="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_20px_rgba(255,120,45,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all cursor-pointer"
            >
              <span v-if="isSaving" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </span>
              <span v-else>Save & Continue →</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ════ STEP 2 ════ -->
      <div v-else-if="currentStep === 2" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 sm:px-8 py-5 border-b border-gray-100">
          <h1 class="text-lg sm:text-xl font-bold text-gray-900">Upload Course Materials</h1>
          <p class="text-sm text-gray-500 mt-0.5">Add your lessons, videos, and resources.</p>
        </div>
        <div class="px-6 sm:px-8 py-7">
          <CustomTeacherCourseMaterialsStep :courseId="courseId" @continue="goToNextStep" @uploading="handleUploading" />
        </div>
      </div>

      <!-- ════ STEP 3 ════ -->
      <div v-else-if="currentStep === 3" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 sm:px-8 py-5 border-b border-gray-100">
          <h1 class="text-lg sm:text-xl font-bold text-gray-900">Pricing</h1>
          <p class="text-sm text-gray-500 mt-0.5">Set your course price or offer it for free.</p>
        </div>
        <div class="px-6 sm:px-8 py-7">
          <CustomTeacherCoursePricingStep :courseId="courseId" @continue="goToNextStep" />
        </div>
      </div>

      <!-- ════ STEP 4 ════ -->
      <div v-else-if="currentStep === 4" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 sm:px-8 py-5 border-b border-gray-100">
          <h1 class="text-lg sm:text-xl font-bold text-gray-900">Publish Your Course</h1>
          <p class="text-sm text-gray-500 mt-0.5">Review everything and go live.</p>
        </div>
        <div class="px-6 sm:px-8 py-7">
          <CustomTeacherCoursePublishStep :courseId="courseId" @published="onPublished" />
        </div>
      </div>
    </main>
  </div>
</template>
