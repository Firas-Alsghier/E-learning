<script setup lang="ts">
import 'vidstack/bundle';
import 'vidstack/icons';

const props = defineProps<{
  videoUrl: string;
  title?: string;
  poster?: string;
}>();

const emit = defineEmits<{
  ended: [];
}>();
</script>

<template>
  <div class="w-full aspect-video bg-black rounded-xl overflow-hidden">
    <media-player :title="title" :src="videoUrl" controls class="w-full h-full">
      <ClientOnly>
        <!-- <media-icon type="play"></media-icon> -->
        <media-provider />
        <media-video-layout />
      </ClientOnly>
    </media-player>
  </div>
</template>
