<script setup lang="ts">
import { ref } from 'vue';
import { Checkbox } from '@/components/ui/checkbox';

const selected = ref({
  courseCategory: ['Shop', 'Academy'],
  instructors: [],
  price: ['All'],
  review: ['★★★★☆'],
  level: ['Intermidiate'],
});
</script>

<template>
  <aside class="w-full max-w-xs p-4 space-y-6">
    <!-- Course Category -->
    <div>
      <h3 class="font-semibold text-base mb-2">Course Category</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between" v-for="item in ['Commercial', 'Office', 'Shop', 'Educate', 'Academy', 'Single family home', 'Studio', 'University']" :key="item">
          <div class="flex items-center gap-2">
            <Checkbox v-model:checked="selected.courseCategory" :value="item" />
            <span>{{ item }}</span>
          </div>
          <span class="text-sm font-medium text-muted-foreground">15</span>
        </div>
      </div>
    </div>

    <!-- Instructors -->
    <div>
      <h3 class="font-semibold text-base mb-2">Instructors</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between" v-for="item in ['Kenny White', 'John Doe']" :key="item">
          <div class="flex items-center gap-2">
            <Checkbox v-model:checked="selected.instructors" :value="item" />
            <span>{{ item }}</span>
          </div>
          <span class="text-sm font-medium text-muted-foreground">15</span>
        </div>
      </div>
    </div>

    <!-- Price -->
    <div>
      <h3 class="font-semibold text-base mb-2">Price</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between" v-for="item in ['All', 'Free', 'Paid']" :key="item">
          <div class="flex items-center gap-2">
            <Checkbox v-model:checked="selected.price" :value="item" />
            <span>{{ item }}</span>
          </div>
          <span class="text-sm font-medium text-muted-foreground">15</span>
        </div>
      </div>
    </div>

    <!-- Review -->
    <div>
      <h3 class="font-semibold text-base mb-2">Review</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between" v-for="item in ['★★★★★', '★★★★☆', '★★★☆☆', '★★☆☆☆', '★☆☆☆☆']" :key="item">
          <div class="flex items-center gap-2">
            <Checkbox v-model:checked="selected.review" :value="item" />
            <span class="text-yellow-500">{{ item }}</span>
          </div>
          <span class="text-sm font-medium text-muted-foreground">(1,025)</span>
        </div>
      </div>
    </div>

    <!-- Level -->
    <div>
      <h3 class="font-semibold text-base mb-2">Level</h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between" v-for="item in ['All levels', 'Beginner', 'Intermidiate', 'Expert']" :key="item">
          <div class="flex items-center gap-2">
            <Checkbox v-model:checked="selected.level" :value="item" />
            <span>{{ item }}</span>
          </div>
          <span class="text-sm font-medium text-muted-foreground">15</span>
        </div>
      </div>
    </div>
  </aside>
</template>
