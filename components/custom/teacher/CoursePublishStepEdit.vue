<script setup lang="ts">
import { CheckCircle, BookOpen, DollarSign, Layers, Rocket } from 'lucide-vue-next';
/* Logic and publishing states removed */
</script>

<template>
  <div class="flex flex-col items-center gap-8 max-w-lg mx-auto py-4 text-center">
    <div class="w-20 h-20 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
      <Rocket :size="34" class="text-orange-500" />
    </div>

    <div class="flex flex-col gap-2">
      <h1 class="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Ready to Publish?</h1>
      <p class="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">Once published, students will be able to discover and enroll in your course.</p>
    </div>

    <div class="w-full flex flex-col gap-2.5">
      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest text-left mb-1">Before you go live</p>

      <div class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
        <div class="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
          <BookOpen :size="15" class="text-orange-500" />
        </div>
        <span class="text-sm text-gray-700 font-medium">Course information is complete</span>
        <CheckCircle :size="16" class="text-emerald-400 ml-auto shrink-0" />
      </div>

      <div class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
        <div class="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
          <Layers :size="15" class="text-orange-500" />
        </div>
        <span class="text-sm text-gray-700 font-medium">At least one section and lesson added</span>
        <CheckCircle :size="16" class="text-emerald-400 ml-auto shrink-0" />
      </div>

      <div class="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left">
        <div class="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
          <DollarSign :size="15" class="text-orange-500" />
        </div>
        <span class="text-sm text-gray-700 font-medium">Pricing is set correctly</span>
        <CheckCircle :size="16" class="text-emerald-400 ml-auto shrink-0" />
      </div>
    </div>

    <div class="w-full flex flex-col items-center gap-3">
      <button
        class="w-full sm:w-auto px-10 py-3 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_20px_rgba(255,120,45,0.35)] hover:shadow-[0_8px_28px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
      >
        <span class="flex items-center gap-2"> <Rocket :size="15" /> Publish Course </span>
      </button>

      <p class="text-xs text-gray-400">You can unpublish or edit your course at any time.</p>
    </div>
  </div>
</template>

<style scoped>
/* Keeping transitions and animations in case you want to trigger the success state manually */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes grow {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>
