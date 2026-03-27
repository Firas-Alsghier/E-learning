<script setup lang="ts">
import { Plus, Upload, Trash, CheckCircle, Film, Image, Loader } from 'lucide-vue-next';
/* Logic, API calls, and reactive variables removed */
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Cover Image</h2>
          <p class="text-xs text-gray-400 mt-0.5">This is the first thing students will see.</p>
        </div>
        <button class="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer">Change image</button>
      </div>

      <div class="relative w-full rounded-2xl overflow-hidden border-2 border-transparent cursor-default" style="aspect-ratio: 16/7">
        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop" alt="Cover preview" class="w-full h-full object-cover" />
      </div>

      <div class="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
        <CheckCircle :size="16" class="shrink-0" />
        Cover image uploaded successfully
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div>
        <h2 class="text-sm font-bold text-gray-800 uppercase tracking-wide">Curriculum</h2>
        <p class="text-xs text-gray-400 mt-0.5">Organize your course into sections and lessons.</p>
      </div>

      <div class="flex flex-col gap-3">
        <div class="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div class="flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <div class="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
              <span class="text-[11px] font-bold text-orange-500">1</span>
            </div>
            <input value="Introduction to Web Development" class="flex-1 min-w-0 text-sm font-bold text-gray-800 bg-transparent border-none outline-none" />
            <button class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer shrink-0">
              <Trash :size="14" />
            </button>
          </div>

          <div class="divide-y divide-gray-100">
            <div class="flex flex-col gap-2 px-4 sm:px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center">
                  <CheckCircle :size="18" class="text-emerald-500" />
                </div>
                <input value="Course Overview & Tools" class="flex-1 min-w-0 text-sm text-gray-700 bg-transparent border-none outline-none" />
                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    class="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    <Upload :size="11" />
                    <span>Replace</span>
                  </button>
                  <button class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer">
                    <Trash :size="13" />
                  </button>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 px-4 sm:px-5 py-3">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-full shrink-0 flex items-center justify-center">
                  <Loader :size="16" class="text-orange-400 animate-spin" />
                </div>
                <input value="Setting up your environment" class="flex-1 min-w-0 text-sm text-gray-700 bg-transparent border-none outline-none" />
                <div class="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled
                    class="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-500 opacity-40 cursor-not-allowed"
                  >
                    <Upload :size="11" />
                    <span>Upload</span>
                  </button>
                  <button class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer">
                    <Trash :size="13" />
                  </button>
                </div>
              </div>

              <div class="pl-9">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[11px] text-gray-500 font-medium">Processing video... (this may take a minute)</span>
                  <span class="text-[11px] font-bold text-orange-500">92%</span>
                </div>
                <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full bg-orange-500 transition-all duration-300" style="width: 92%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
            <button class="flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"><Plus :size="14" /> Add Lesson</button>
          </div>
        </div>
      </div>

      <button
        class="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-semibold text-gray-500 hover:border-orange-400/50 hover:text-orange-500 hover:bg-orange-50/20 transition-all duration-200 cursor-pointer mt-1"
      >
        <Plus :size="15" /> Add Section
      </button>
    </div>

    <div class="flex justify-end pt-4 border-t border-gray-100">
      <button
        class="px-6 py-2.5 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        Save & Continue →
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Animations kept for the progress bars */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
