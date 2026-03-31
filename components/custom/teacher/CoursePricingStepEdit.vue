<script setup lang="ts">
import { Tag, DollarSign } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import axios from 'axios';

// ✅ DEFINE PROPS
const props = defineProps<{
  courseId: string;
}>();

// ✅ DEFINE EMIT
const emit = defineEmits(['continue']);

// STATE
const isFree = ref(true);
const price = ref<number | null>(null);

// TOGGLE
const toggleFree = () => {
  isFree.value = !isFree.value;

  if (isFree.value) {
    price.value = null;
  }
};

// FETCH
const fetchPricing = async () => {
  try {
    const token = useCookie('teacher_token').value;

    const res = await axios.get(`http://localhost:3001/api/teacher/courses/${props.courseId}/full`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const course = res.data;

    isFree.value = course.isFree;
    price.value = course.price || null;
  } catch (err) {
    console.error('Fetch pricing error:', err);
  }
};

// SAVE
const savePricing = async () => {
  try {
    const token = useCookie('teacher_token').value;

    // ✅ validation (important)
    if (!isFree.value && (!price.value || price.value <= 0)) {
      alert('Please enter a valid price');
      return;
    }

    await axios.patch(
      `http://localhost:3001/api/teacher/courses/${props.courseId}/price`,
      {
        price: isFree.value ? 0 : price.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    emit('continue');
  } catch (err) {
    console.error('Save pricing error:', err);
    alert('Failed to save pricing');
  }
};

// MOUNT
onMounted(() => {
  fetchPricing();
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-lg sm:text-xl font-bold text-gray-900">Course Pricing</h1>
      <p class="text-sm text-gray-400 mt-0.5">Set how much learners pay to access your course.</p>
    </div>

    <div class="flex flex-col gap-4 max-w-xl">
      <!-- ✅ FREE TOGGLE -->
      <div
        @click="toggleFree"
        class="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
            <Tag :size="18" class="text-gray-400" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800">Free Course</p>
            <p class="text-xs text-gray-400">Learners can access this course at no cost</p>
          </div>
        </div>

        <!-- ✅ TOGGLE UI -->
        <div class="w-11 h-6 rounded-full p-0.5 transition-colors duration-200 shrink-0" :class="isFree ? 'bg-orange-500' : 'bg-gray-200'">
          <div class="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200" :class="isFree ? 'translate-x-5' : 'translate-x-0'"></div>
        </div>
      </div>

      <!-- ✅ PRICE BOX -->
      <div class="p-4 sm:p-5 rounded-2xl border-2 bg-white transition-all duration-200" :class="isFree ? 'opacity-50 pointer-events-none border-gray-100' : 'border-gray-200'">
        <div class="flex flex-col gap-1.5 mb-4">
          <label class="text-sm font-bold text-gray-700">Course Price</label>
          <p class="text-xs text-gray-400">Set your course price in your preferred currency.</p>
        </div>

        <div class="flex gap-3">
          <select class="px-3 py-3 text-sm font-semibold border border-gray-200 rounded-xl bg-gray-50 focus:outline-none transition-colors cursor-pointer shrink-0">
            <option selected>USD</option>
            <!-- <option>EUR</option>
            <option>GBP</option> -->
          </select>

          <div class="relative flex-1">
            <DollarSign :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              v-model="price"
              type="number"
              placeholder="10$"
              class="w-full pl-8 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none placeholder:text-gray-400 transition-colors"
            />
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-3">Platform fees and taxes will be calculated later.</p>
      </div>

      <!-- ✅ SUMMARY -->
      <div class="flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide"> Price summary </span>

        <span class="text-base font-extrabold tracking-tight text-gray-900">
          {{ isFree ? 'Free' : `USD ${price || 0}` }}
        </span>
      </div>
    </div>

    <!-- ✅ SAVE BUTTON -->
    <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
      <button
        @click="savePricing"
        class="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        Save & Continue →
      </button>
    </div>
  </div>
</template>
