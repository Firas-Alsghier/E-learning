<script setup lang="ts">
import 'vidstack/bundle';

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
    <media-player :title="title || 'Lesson Video'" :poster="poster" autoplay :src="videoUrl" class="w-full h-full" @ended="emit('ended')">
      <ClientOnly>
        <media-provider></media-provider>
      </ClientOnly>
    </media-player>
  </div>
</template>
