<script setup lang="ts">
import { Facebook, Instagram, Earth, Linkedin } from 'lucide-vue-next';

defineProps<{
  facebook?: any;
  twitter?: string;
  instagram?: string;
  site?: string;
  linkedin?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-5 sm:gap-6" dir="ltr">
    <!-- Instructor profile row -->
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
      <!-- Avatar -->
      <img src="/assets/images/teacher.png" alt="Instructor" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-white/[0.08] shrink-0" />

      <!-- Info -->
      <div class="flex flex-col gap-2 text-center sm:text-left min-w-0">
        <h2 class="text-lg sm:text-xl font-bold text-white leading-tight">
          <slot name="name" />
        </h2>

        <p class="text-sm text-zinc-400 leading-relaxed line-clamp-3">
          <slot name="about" />
        </p>

        <!-- Stats -->
        <div class="flex items-center justify-center sm:justify-start gap-4 mt-1">
          <div class="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/[0.08] rounded-full px-3 py-1.5">
            <span class="text-orange-400">🎥</span>
            <span><slot name="students" /> Student(s)</span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/[0.08] rounded-full px-3 py-1.5">
            <span class="text-orange-400">📚</span>
            <span><slot name="lessons" /> Course(s)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-white/[0.06]"></div>

    <!-- Social links -->
    <div class="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
      <span class="text-xs font-semibold text-zinc-500 uppercase tracking-widest mr-1">Follow</span>

      <a
        v-if="facebook"
        :href="facebook"
        target="_blank"
        rel="noopener noreferrer"
        class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/[0.08] text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200"
        aria-label="Facebook"
      >
        <Facebook :size="15" />
      </a>

      <a
        v-if="instagram"
        :href="instagram"
        target="_blank"
        rel="noopener noreferrer"
        class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/[0.08] text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200"
        aria-label="Instagram"
      >
        <Instagram :size="15" />
      </a>

      <a
        v-if="site"
        :href="site"
        target="_blank"
        rel="noopener noreferrer"
        class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/[0.08] text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200"
        aria-label="Website"
      >
        <Earth :size="15" />
      </a>

      <a
        v-if="linkedin"
        :href="linkedin"
        target="_blank"
        rel="noopener noreferrer"
        class="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/[0.08] text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-200"
        aria-label="LinkedIn"
      >
        <Linkedin :size="15" />
      </a>
    </div>
  </div>
</template>
