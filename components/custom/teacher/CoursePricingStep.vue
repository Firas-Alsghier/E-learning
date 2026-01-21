<script setup lang="ts">
import { ref } from 'vue';

/* ✅ DEFINE EMIT PROPERLY */
const emit = defineEmits<{
  (e: 'continue'): void;
}>();

/* ---------- Local UI State ---------- */
const isFree = ref(false);
const price = ref<number | null>(null);
const currency = ref('USD');

/* ---------- Helpers ---------- */
const handleContinue = () => {
  if (!isFree.value && (!price.value || price.value <= 0)) {
    alert('Please enter a valid price or mark the course as free');
    return;
  }

  // Fake save for now
  console.log('Pricing data:', {
    isFree: isFree.value,
    price: isFree.value ? 0 : price.value,
    currency: currency.value,
  });

  // Move to next step
  emit('continue');
};
</script>

<template>
  <div>
    <h1 class="text-xl font-bold text-gray-800 mb-6">Course Pricing</h1>

    <div class="max-w-xl space-y-6">
      <!-- Free / Paid Toggle -->
      <div class="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <h2 class="font-semibold text-gray-800">Free Course</h2>
          <p class="text-sm text-gray-500">Learners can access this course for free</p>
        </div>

        <input type="checkbox" v-model="isFree" class="w-5 h-5 accent-violet-600" />
      </div>

      <!-- Price Input -->
      <div class="p-4 border rounded-lg space-y-4" :class="isFree ? 'opacity-50 pointer-events-none' : ''">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2"> Course Price </label>

          <div class="flex gap-3">
            <input type="number" min="1" v-model.number="price" placeholder="e.g. 49" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500" />

            <select v-model="currency" class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <p class="text-xs text-gray-500">Platform fees and taxes will be calculated later</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-end pt-8 border-t border-gray-100 mt-8">
      <button @click="handleContinue" class="px-6 cursor-pointer py-3 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition shadow-md shadow-violet-300">
        Save & Continue
      </button>
    </div>
  </div>
</template>
