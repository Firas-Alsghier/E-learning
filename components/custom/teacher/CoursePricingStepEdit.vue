<script setup lang="ts">
import { Tag, DollarSign } from 'lucide-vue-next';
/* Logic and state removed */
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h1 class="text-lg sm:text-xl font-bold text-gray-900">Course Pricing</h1>
      <p class="text-sm text-gray-400 mt-0.5">Set how much learners pay to access your course.</p>
    </div>

    <div class="flex flex-col gap-4 max-w-xl">
      <div class="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gray-100">
            <Tag :size="18" class="text-gray-400" />
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800">Free Course</p>
            <p class="text-xs text-gray-400">Learners can access this course at no cost</p>
          </div>
        </div>

        <div class="w-11 h-6 rounded-full p-0.5 bg-gray-200 transition-colors duration-200 shrink-0">
          <div class="w-5 h-5 bg-white rounded-full shadow-sm"></div>
        </div>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl border-2 border-gray-200 bg-white transition-all duration-200">
        <div class="flex flex-col gap-1.5 mb-4">
          <label class="text-sm font-bold text-gray-700">Course Price</label>
          <p class="text-xs text-gray-400">Set your course price in your preferred currency.</p>
        </div>

        <div class="flex gap-3">
          <select class="px-3 py-3 text-sm font-semibold border border-gray-200 rounded-xl bg-gray-50 focus:outline-none transition-colors cursor-pointer shrink-0">
            <option selected>USD</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>

          <div class="relative flex-1">
            <DollarSign :size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="number"
              placeholder="e.g. 49"
              value="49"
              class="w-full pl-8 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none placeholder:text-gray-400 transition-colors"
            />
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-3">Platform fees and taxes will be calculated later.</p>
      </div>

      <div class="flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Price summary</span>
        <span class="text-base font-extrabold tracking-tight text-gray-900"> USD 49 </span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
      <button
        class="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        Save & Continue →
      </button>
    </div>
  </div>
</template>
