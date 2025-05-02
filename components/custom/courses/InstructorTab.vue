<script setup lang="ts">
import { Facebook, Twitter, Instagram } from 'lucide-vue-next';
</script>

<template>
  <div class="text-left space-y-4">
    <div class="flex items-center gap-4">
      <img src="/assets/images/teacher.png" alt="Instructor" class="w-24 h-24 rounded-xl" />
      <div>
        <h2 class="font-semibold text-xl">ThimPress</h2>
        <p class="text-base text-gray-600">
          LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which can be used to easily create & sell courses online.
        </p>
        <div class="flex items-center gap-4 mt-2 text-sm text-gray-700">
          <span>🎓 156 Students</span>
          <span>📚 20 Lessons</span>
        </div>
      </div>
    </div>

    <p class="text-base text-gray-600">
      LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which can be used to easily create & sell courses online.
    </p>

    <div class="flex gap-3 mt-4 justify-start">
      <p class="text-base">Follow:</p>
      <a href="#" class="text-gray-500 hover:text-black"><Facebook /></a>
      <a href="#" class="text-gray-500 hover:text-black"><Twitter /></a>
      <a href="#" class="text-gray-500 hover:text-black"><Instagram /></a>
    </div>
  </div>
</template>
