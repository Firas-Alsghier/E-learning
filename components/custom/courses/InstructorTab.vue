<script setup lang="ts">
import { Facebook, Twitter, Instagram, Earth, Linkedin } from 'lucide-vue-next';

defineProps<{
  facebook?: string;
  twitter?: string;
  instagram?: string;
  site?: string;
  linkedin?: string;
}>();
</script>

<template>
  <div class="text-left space-y-4">
    <div class="flex items-center gap-4">
      <img src="/assets/images/teacher.png" alt="Instructor" class="w-24 h-24 rounded-xl" />
      <div>
        <h2 class="font-semibold text-xl"><slot name="name"></slot></h2>
        <p class="text-base text-gray-600">
          <slot name="about"></slot>
        </p>
        <div class="flex items-center gap-4 mt-2 text-base text-gray-700">
          <p>🎥 <slot name="students"></slot>Student(s)</p>
          <p>📚 <slot name="lessons"></slot> Course(s)</p>
        </div>
      </div>
    </div>

    <!-- <p class="text-base text-gray-600">
      LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which can be used to easily create & sell courses online.
    </p> -->

    <div class="flex gap-3 mt-4 justify-start">
      <p class="text-base">Follow:</p>
      <a :href="facebook" v-if="facebook" lass="text-gray-500 hover:text-black"><Facebook /></a>
      <a :href="twitter" v-if="twitter" class="text-gray-500 hover:text-black"><Twitter /></a>
      <a :href="instagram" v-if="instagram" class="text-gray-500 hover:text-black"><Instagram /></a>
      <a :href="site" v-if="site" class="text-gray-500 hover:text-black"><Earth /></a>
      <a :href="linkedin" v-if="linkedin" class="text-gray-500 hover:text-black"><Linkedin /></a>
    </div>
  </div>
</template>
