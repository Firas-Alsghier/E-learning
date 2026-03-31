<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ChevronRight, Plus, X, Check, BookOpen, Layers, DollarSign, Rocket } from 'lucide-vue-next';

const props = defineProps<{
  courseId: string;
}>();

const course = ref<any>(null);
const isLoading = ref(false);
const isSaving = ref(false);
const currentStep = ref(1);

const form = ref({
  title: '',
  category: '',
  level: '',
  description: '',
  faqs: [] as { question: string; answer: string }[],
});

const levelCheckEnabled = ref(false);
const levelCheckQuestions = ref<{ question: string; answers: string[]; correctAnswerIndex: number | null }[]>([]);

// --- Navigation Helpers ---
const stepLabels = ['Course Info & FAQ', 'Upload Materials', 'Pricing', 'Publish'];

const isStepCompleted = (step: number) => step < currentStep.value;

const goToStep = (step: number) => {
  if (step <= currentStep.value) {
    currentStep.value = step;
  }
};

const goToNextStep = () => {
  if (currentStep.value < 4) currentStep.value++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- FAQ & Question Helpers ---
const addFaq = () => form.value.faqs.push({ question: '', answer: '' });
const removeFaq = (index: number) => form.value.faqs.splice(index, 1);

const addQuestion = () => {
  levelCheckQuestions.value.push({
    question: '',
    answers: ['', '', '', ''],
    correctAnswerIndex: null,
  });
};
const removeQuestion = (index: number) => levelCheckQuestions.value.splice(index, 1);

// --- API Calls ---
const fetchCourse = async () => {
  try {
    isLoading.value = true;
    const token = useCookie('teacher_token').value;
    const res = await axios.get(`http://localhost:3001/api/teacher/courses/${props.courseId}/full`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    form.value.title = res.data.title;
    form.value.category = res.data.category;
    form.value.level = res.data.level;
    form.value.description = res.data.description;
    form.value.faqs = res.data.faqs?.length ? res.data.faqs : [{ question: '', answer: '' }];

    levelCheckEnabled.value = res.data.levelCheck?.enabled || false;
    levelCheckQuestions.value = res.data.levelCheck?.questions?.length ? res.data.levelCheck.questions : [{ question: '', answers: ['', '', '', ''], correctAnswerIndex: null }];

    course.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const updateCourse = async () => {
  try {
    isSaving.value = true;
    const token = useCookie('teacher_token').value;

    await axios.patch(
      `http://localhost:3001/api/teacher/courses/${props.courseId}`,
      {
        ...form.value,
        levelCheck: {
          enabled: levelCheckEnabled.value,
          questions: levelCheckEnabled.value ? levelCheckQuestions.value : [],
        },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    goToNextStep();
  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || 'Update failed');
  } finally {
    isSaving.value = false;
  }
};

onMounted(fetchCourse);
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <header class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <nav class="flex items-center gap-1 overflow-x-auto scrollbar-none" style="scrollbar-width: none">
          <template v-for="step in 4" :key="step">
            <button
              @click="goToStep(step)"
              :disabled="step > currentStep"
              class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all"
              :class="currentStep === step ? 'bg-orange-500 text-white shadow-lg' : isStepCompleted(step) ? 'text-orange-500' : 'text-gray-400'"
            >
              <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-black/10">
                <Check v-if="isStepCompleted(step)" :size="10" />
                <span v-else>{{ step }}</span>
              </div>
              <span class="hidden sm:inline">{{ stepLabels[step - 1] }}</span>
            </button>
            <ChevronRight v-if="step < 4" :size="14" class="text-gray-300 shrink-0" />
          </template>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <section v-if="currentStep === 1" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100">
          <h1 class="text-xl font-bold text-gray-900">Course Information</h1>
          <p class="text-sm text-gray-500">Edit the basics and student requirements.</p>
        </div>

        <div class="p-6 sm:p-8 space-y-8">
          <div class="grid gap-6">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-gray-700">Course Title</label>
              <input v-model="form.title" type="text" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400/40 outline-none" />
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Category</label>
                <select v-model="form.category" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50">
                  <option>Data Management</option>
                  <option>Web Development</option>
                  <option>Design</option>
                </select>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Level</label>
                <select v-model="form.level" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50">
                  <option>All levels</option>
                  <option>Basic</option>
                  <option>Intermediate</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-gray-700">Description</label>
              <ClientOnly>
                <CustomEditorQuillEditor v-model="form.description" />
              </ClientOnly>
            </div>
          </div>

          <div class="pt-6 border-t border-gray-100">
            <div class="mb-4">
              <h2 class="text-base font-bold text-gray-900">Frequently Asked Questions</h2>
              <p class="text-xs text-gray-400 mt-0.5">Help students know what to expect.</p>
            </div>

            <div class="flex flex-col gap-3">
              <div v-for="(faq, index) in form.faqs" :key="index" class="relative flex flex-col gap-3 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl">
                <button
                  v-if="form.faqs.length > 1"
                  @click="removeFaq(index)"
                  class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-red-50 text-red-400 border border-red-100 cursor-pointer"
                >
                  <X :size="12" />
                </button>
                <div class="flex flex-col gap-1.5 pr-8">
                  <label class="text-xs font-semibold text-gray-600 uppercase">Question</label>
                  <input v-model="faq.question" type="text" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold text-gray-600 uppercase">Answer</label>
                  <input v-model="faq.answer" type="text" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white" />
                </div>
              </div>
            </div>

            <button @click="addFaq" class="mt-3 flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 cursor-pointer"><Plus :size="15" /> Add another FAQ</button>
          </div>

          <div class="pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h2 class="text-base font-bold text-gray-900">Level Check <span class="text-xs font-normal text-gray-400 ml-1">(Optional)</span></h2>
                <p class="text-xs text-gray-400 mt-0.5">Quiz students before they enroll.</p>
              </div>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <span class="text-sm text-gray-500">{{ levelCheckEnabled ? 'On' : 'Off' }}</span>
                <div class="w-10 h-5 rounded-full p-0.5 transition-colors" :class="levelCheckEnabled ? 'bg-orange-500' : 'bg-gray-200'" @click="levelCheckEnabled = !levelCheckEnabled">
                  <div class="w-4 h-4 bg-white rounded-full shadow-sm transition-transform" :class="levelCheckEnabled ? 'translate-x-5' : 'translate-x-0'"></div>
                </div>
              </label>
            </div>

            <div v-if="levelCheckEnabled" class="flex flex-col gap-4">
              <div v-for="(q, qIndex) in levelCheckQuestions" :key="qIndex" class="p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl relative">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-bold text-gray-500 uppercase">Question {{ qIndex + 1 }}</span>
                  <button v-if="levelCheckQuestions.length > 1" @click="removeQuestion(qIndex)" class="text-xs font-semibold text-red-400 cursor-pointer">Remove</button>
                </div>
                <input v-model="q.question" type="text" placeholder="Enter your question..." class="w-full mb-4 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white" />
                <div class="flex flex-col gap-2">
                  <div v-for="(ans, aIndex) in q.answers" :key="aIndex" class="flex items-center gap-3">
                    <input type="radio" :name="'correct-' + qIndex" :checked="q.correctAnswerIndex === aIndex" @change="q.correctAnswerIndex = aIndex" class="accent-orange-500 cursor-pointer" />
                    <input v-model="q.answers[aIndex]" type="text" :placeholder="`Answer ${aIndex + 1}...`" class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white" />
                  </div>
                </div>
              </div>
              <button @click="addQuestion" class="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 cursor-pointer"><Plus :size="15" /> Add Question</button>
            </div>
          </div>
        </div>

        <div class="px-6 py-5 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            @click="updateCourse"
            :disabled="isSaving"
            class="px-8 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all cursor-pointer"
          >
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save & Continue →</span>
          </button>
        </div>
      </section>

      <section v-else-if="currentStep === 2">
        <CustomTeacherCourseMaterialsStepEdit :courseId="courseId" @continue="goToNextStep" />
      </section>

      <section v-else-if="currentStep === 3">
        <CustomTeacherCoursePricingStepEdit :courseId="courseId" @continue="goToNextStep" />
      </section>

      <section v-else-if="currentStep === 4">
        <CustomTeacherCoursePublishStepEdit :courseId="courseId" />
      </section>
    </main>
  </div>
</template>
