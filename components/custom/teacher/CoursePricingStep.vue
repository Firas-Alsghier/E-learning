<!-- components/custom/teacher/CoursePricingStep.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import { Tag, DollarSign, CheckCircle } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'continue'): void;
}>();

const props = defineProps<{
  courseId: string | null;
}>();

/* ---------- Local UI State ---------- */
const isFree = ref(false);
const price = ref<number | null>(null);
const currency = ref('USD');
const isSaving = ref(false);

/* ---------- Helpers ---------- */
const displayPrice = computed(() => {
  if (isFree.value) return 'Free';
  if (price.value && price.value > 0) return `${currency.value} ${price.value}`;
  return '—';
});

const handleContinue = async () => {
  if (!isFree.value && (!price.value || price.value <= 0)) {
    alert('Please enter a valid price or mark the course as free');
    return;
  }

  const token = useCookie('teacher_token').value;
  if (!token || !props.courseId) {
    alert('Missing course id or auth');
    return;
  }

  try {
    isSaving.value = true;
    await axios.patch(`http://localhost:3001/api/teacher/courses/${props.courseId}/price`, { price: isFree.value ? 0 : price.value }, { headers: { Authorization: `Bearer ${token}` } });
    emit('continue');
  } catch (err) {
    console.error(err);
    alert('Failed to save price');
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- ── Section header ── -->
    <div>
      <h1 class="text-lg sm:text-xl font-bold text-gray-900">Course Pricing</h1>
      <p class="text-sm text-gray-400 mt-0.5">Set how much learners pay to access your course.</p>
    </div>

    <div class="flex flex-col gap-4 max-w-xl">
      <!-- Free toggle card -->
      <div
        class="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
        :class="isFree ? 'border-emerald-400/50 bg-emerald-50' : 'border-gray-200 bg-white hover:border-gray-300'"
        @click="isFree = !isFree"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200" :class="isFree ? 'bg-emerald-100' : 'bg-gray-100'">
            <Tag :size="18" :class="isFree ? 'text-emerald-600' : 'text-gray-400'" />
          </div>
          <div>
            <p class="text-sm font-bold" :class="isFree ? 'text-emerald-700' : 'text-gray-800'">Free Course</p>
            <p class="text-xs" :class="isFree ? 'text-emerald-600' : 'text-gray-400'">Learners can access this course at no cost</p>
          </div>
        </div>

        <!-- Custom toggle -->
        <div class="w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0" :class="isFree ? 'bg-emerald-500' : 'bg-gray-200'">
          <div class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200" :class="isFree ? 'translate-x-5' : 'translate-x-0'"></div>
        </div>
      </div>

      <!-- Price input card -->
      <div class="p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200" :class="isFree ? 'border-gray-100 bg-gray-50 opacity-50 pointer-events-none' : 'border-gray-200 bg-white'">
        <div class="flex flex-col gap-1.5 mb-4">
          <label class="text-sm font-bold text-gray-700">Course Price</label>
          <p class="text-xs text-gray-400">Set your course price in your preferred currency.</p>
        </div>

        <div class="flex gap-3">
          <!-- Currency select -->
          <select
            v-model="currency"
            class="px-3 py-3 text-sm font-semibold border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-colors cursor-pointer shrink-0"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>

          <!-- Price input -->
          <div class="relative flex-1">
            <DollarSign :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="number"
              min="1"
              v-model.number="price"
              placeholder="e.g. 49"
              class="w-full pl-8 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-400 transition-colors"
            />
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-3">Platform fees and taxes will be calculated later.</p>
      </div>

      <!-- Price preview -->
      <div class="flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Price summary</span>
        <span class="text-base font-extrabold tracking-tight" :class="isFree ? 'text-emerald-600' : 'text-gray-900'">
          {{ displayPrice }}
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
      <button
        @click="handleContinue"
        :disabled="isSaving"
        class="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_20px_rgba(255,120,45,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all cursor-pointer"
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
</template>
