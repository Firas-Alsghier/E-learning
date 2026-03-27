<script setup lang="ts">
/* Logic, refs, and functions removed */
import { ref, onMounted } from 'vue';
import axios from 'axios';

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

const fetchCourse = async () => {
  try {
    isLoading.value = true;

    const token = useCookie('teacher_token').value;

    const res = await axios.get(`http://localhost:3001/api/teacher/courses/${props.courseId}/full`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    form.value.title = res.data.title;
    form.value.category = res.data.category;
    form.value.level = res.data.level;
    form.value.description = res.data.description;
    form.value.faqs = res.data.faqs?.length ? res.data.faqs : [{ question: '', answer: '' }];
    course.value = res.data;
    const levelCheck = res.data.levelCheck;

    levelCheckEnabled.value = levelCheck?.enabled || false;

    levelCheckQuestions.value = levelCheck?.questions?.length
      ? levelCheck.questions
      : [
          {
            question: '',
            answers: ['', '', '', ''],
            correctAnswerIndex: null,
          },
        ];
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
        title: form.value.title,
        description: form.value.description,
        category: form.value.category,
        level: form.value.level,
        faqs: form.value.faqs,
        levelCheck: levelCheckEnabled.value
          ? {
              enabled: true,
              questions: levelCheckQuestions.value,
            }
          : {
              enabled: false,
              questions: [],
            },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert('Course updated ✅');
  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || 'Update failed');
  } finally {
    isSaving.value = false;
  }
};

const addQuestion = () => {
  levelCheckQuestions.value.push({
    question: '',
    answers: ['', '', '', ''],
    correctAnswerIndex: null,
  });
};

const removeQuestion = (index: number) => {
  levelCheckQuestions.value.splice(index, 1);
};

const addFaq = () => {
  form.value.faqs.push({ question: '', answer: '' });
};

const removeFaq = (index: number) => {
  form.value.faqs.splice(index, 1);
};
onMounted(fetchCourse);
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans">
    <header class="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <nav class="flex items-center gap-1 overflow-x-auto scrollbar-none" style="scrollbar-width: none">
          <button
            class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 bg-orange-500 text-white shadow-[0_2px_12px_rgba(255,120,45,0.35)]"
          >
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-white/25 text-white">
              <span>1</span>
            </span>
            <span class="hidden sm:inline">Course Info & FAQ</span>
          </button>
          <ChevronRight :size="14" class="text-gray-300 shrink-0" />

          <button class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 text-gray-400 cursor-not-allowed">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-gray-100 text-gray-400">
              <span>2</span>
            </span>
            <span class="hidden sm:inline">Upload Materials</span>
          </button>
          <ChevronRight :size="14" class="text-gray-300 shrink-0" />

          <button class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 text-gray-400 cursor-not-allowed">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-gray-100 text-gray-400">
              <span>3</span>
            </span>
            <span class="hidden sm:inline">Pricing</span>
          </button>
          <ChevronRight :size="14" class="text-gray-300 shrink-0" />

          <button class="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 text-gray-400 cursor-not-allowed">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-gray-100 text-gray-400">
              <span>4</span>
            </span>
            <span class="hidden sm:inline">Publish</span>
          </button>
        </nav>

        <button
          class="shrink-0 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        >
          Preview
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <section>
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 sm:px-8 py-5 border-b border-gray-100">
            <h1 class="text-lg sm:text-xl font-bold text-gray-900">Course Information</h1>
            <p class="text-sm text-gray-500 mt-0.5">Fill in the basic details about your course.</p>
          </div>

          <div class="px-6 sm:px-8 py-7 space-y-6">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-gray-700"> Course Title <span class="text-red-400">*</span> </label>
              <input
                type="text"
                v-model="form.title"
                class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Category</label>
                <select v-model="form.category" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 appearance-none transition-colors cursor-pointer">
                  <option selected>Data Management</option>
                  <option>Web Development</option>
                  <option>Design</option>
                </select>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-700">Level</label>
                <select v-model="form.level" class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 appearance-none transition-colors cursor-pointer">
                  <option selected>All levels</option>
                  <option>Basic</option>
                  <option>Intermediate</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-gray-700"> Description <span class="text-red-400">*</span> </label>
              <ClientOnly>
                <CustomEditorQuillEditor v-model="form.description" />
              </ClientOnly>
              <p class="text-xs text-gray-400 text-right">0/2000</p>
            </div>

            <div class="pt-2">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h2 class="text-base font-bold text-gray-900">Frequently Asked Questions</h2>
                  <p class="text-xs text-gray-400 mt-0.5">Help students know what to expect.</p>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <div v-for="(faq, index) in form.faqs" :key="index" class="relative flex flex-col gap-3 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <!-- Remove -->
                  <button
                    v-if="form.faqs.length > 1"
                    @click="removeFaq(index)"
                    class="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center bg-red-50 border border-red-100 text-red-400 transition-all cursor-pointer"
                  >
                    <X :size="12" />
                  </button>

                  <!-- Question -->
                  <div class="flex flex-col gap-1.5 pr-8">
                    <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Question</label>
                    <input v-model="faq.question" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white" />
                  </div>

                  <!-- Answer -->
                  <div class="flex flex-col gap-1.5">
                    <label class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Answer</label>
                    <input v-model="faq.answer" type="text" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white" />
                  </div>
                </div>
              </div>

              <!-- Add -->
              <button @click="addFaq" class="mt-3 flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                <Plus :size="15" /> Add another FAQ
              </button>
            </div>

            <div class="pt-6 border-t border-gray-100">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h2 class="text-base font-bold text-gray-900">Level Check <span class="text-xs font-normal text-gray-400 ml-1">(Optional)</span></h2>
                  <p class="text-xs text-gray-400 mt-0.5">Quiz students before they enroll.</p>
                </div>

                <!-- Toggle -->
                <label class="flex items-center gap-2.5 cursor-pointer shrink-0">
                  <span class="text-sm text-gray-500">
                    {{ levelCheckEnabled ? 'On' : 'Off' }}
                  </span>

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
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-wide"> Question {{ qIndex + 1 }} </span>

                    <button v-if="levelCheckQuestions.length > 1" @click="removeQuestion(qIndex)" class="text-xs font-semibold text-red-400 hover:text-red-500 transition-colors cursor-pointer">
                      Remove
                    </button>
                  </div>

                  <!-- Question -->
                  <input v-model="q.question" type="text" placeholder="Enter your question..." class="w-full mb-4 px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white" />

                  <!-- Answers -->
                  <div class="flex flex-col gap-2">
                    <div v-for="(ans, aIndex) in q.answers" :key="aIndex" class="flex items-center gap-3">
                      <input
                        type="radio"
                        :name="'correct-' + qIndex"
                        :checked="q.correctAnswerIndex === aIndex"
                        @change="q.correctAnswerIndex = aIndex"
                        class="accent-orange-500 shrink-0 cursor-pointer"
                      />

                      <input v-model="q.answers[aIndex]" type="text" :placeholder="`Answer ${aIndex + 1}...`" class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white" />
                    </div>
                  </div>
                </div>

                <!-- Add Question -->
                <button @click="addQuestion" class="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">
                  <Plus :size="15" /> Add Question
                </button>
              </div>
            </div>
          </div>

          <div class="px-6 sm:px-8 py-5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              @click="updateCourse"
              :disabled="isSaving"
              class="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all cursor-pointer disabled:opacity-50"
            >
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save & Continue →</span>
            </button>
          </div>
        </div>
      </section>

      <div class="mt-10 space-y-10">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <CustomTeacherCourseMaterialsStepEdit />
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <CustomTeacherCoursePricingStepEdit />
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <CustomTeacherCoursePublishStepEdit />
        </div>
      </div>
    </main>
  </div>
</template>
