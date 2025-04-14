<script setup lang="ts">
import { Calendar, GraduationCap , Gauge, FileVideo2   } from 'lucide-vue-next';

</script>
<template>
  <div
    class="w-full max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border rounded-[20px] overflow-hidden bg-white"
  >
    <!-- Left: Course Image -->
    <div class="w-full sm:w-[45%] h-full sm:h-full flex-shrink-0 relative">
  <!-- Label -->
  <span
    class="absolute top-2 left-2 bg-black font-medium text-sm text-white px-3 py-3 rounded-lg z-10"
  >
    Programming
  </span>

  <!-- Course Image -->
  <img
    src="https://www.filepicker.io/api/file/eYA6E8L3TiGl0GxpQoS6"
    alt="Course Image"
    class="w-full h-full object-cover"
  />
</div>


    <!-- Right: Course Content -->
    <div class="w-full sm:w-[55%] h-auto sm:h-full px-4 py-5 flex flex-col justify-between gap-2">
      <!-- Top -->
      <div class="space-y-2">
        <p class="text-sm text-gray-500">by <span class="font-medium text-black">Determined-Poitras</span></p>
        <h3 class="font-semibold text-[20px]">
          Create An LMS Website With LearnPress
        </h3>

        <div class="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
          <div class="flex items-center gap-1">
            <Calendar :size="20" color="#ff782d" />
            <span>2 Weeks</span>
          </div>
          <div class="flex items-center gap-1">
            <GraduationCap :size="20" color="#ff782d" />
            <span>156 Students</span>
          </div>
          <div class="flex items-center gap-1">
            <Gauge :size="20" color="#ff782d" />
            <span>All levels</span>
          </div>
          <div class="flex items-center gap-1">
            <FileVideo2 :size="20" color="#ff782d" />
            <span>20 Lessons</span>
          </div>
        </div>
      </div>
      <!-- Price and Button -->
      <div class="flex flex-col gap-4">
        <hr>
        <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="text-gray-500 line-through font-light text-lg">$29.0</span>
          <span class="text-green-600 text-lg font-medium">Free</span>
        </div>
        <button class="text-lg cursor-pointer text-black font-medium hover:underline">
          المزيد
        </button>
      </div>
      </div>
    </div>
  </div>
</template>
