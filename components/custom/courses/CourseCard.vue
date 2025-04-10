<template>
  <div
    class="w-full max-w-[990px] h-auto sm:h-[250px] flex flex-col sm:flex-row border shadow-sm rounded-xl overflow-hidden bg-white"
  >
    <!-- Left: Course Image -->
    <div class="w-full sm:w-[410px] h-[200px] sm:h-full flex-shrink-0">
      <img
        src="https://www.filepicker.io/api/file/eYA6E8L3TiGl0GxpQoS6"
        alt="Course Image"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Right: Course Content -->
    <div class="w-full sm:w-[580px] h-auto sm:h-full px-4 py-3 flex flex-col justify-between gap-2">
      <!-- Top -->
      <div class="space-y-2">
        <p class="text-sm text-gray-500">by <span class="font-medium">Determined-Poitras</span></p>
        <h3 class="font-semibold text-lg">
          Create An LMS Website With LearnPress
        </h3>

        <div class="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
          <div class="flex items-center gap-1">
            <span>⏱</span>
            <span>2 Weeks</span>
          </div>
          <div class="flex items-center gap-1">
            <span>👥</span>
            <span>156 Students</span>
          </div>
          <div class="flex items-center gap-1">
            <span>📊</span>
            <span>All levels</span>
          </div>
          <div class="flex items-center gap-1">
            <span>📚</span>
            <span>20 Lessons</span>
          </div>
        </div>
      </div>
      <!-- Price and Button -->
      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center gap-2">
          <span class="text-gray-500 line-through text-sm">$29.0</span>
          <span class="text-green-600 font-semibold">Free</span>
        </div>
        <button class="text-sm text-blue-600 font-medium hover:underline">
          View More
        </button>
      </div>
    </div>
  </div>
</template>
