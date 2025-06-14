<template>
  <div class="space-y-6 text-right">
    <!-- Overall Rating Summary -->
    <div class="space-y-2">
      <h2 class="text-xl font-bold">التعليقات</h2>
      <div class="flex items-center gap-2 text-2xl font-semibold">
        <span>4.0</span>
        <div class="text-yellow-400">
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="far fa-star"></i>
        </div>
      </div>
      <p class="text-sm text-gray-500">استناداً إلى 146,951 تقييم</p>

      <!-- Rating Bars -->
      <div class="space-y-1 mt-3 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <span>⭐ 5</span>
          <div class="flex-1 h-2 bg-gray-200 rounded">
            <div class="h-full bg-yellow-400 rounded" style="width: 95%"></div>
          </div>
          <span>95%</span>
        </div>
        <div class="flex items-center gap-2">
          <span>⭐ 4</span>
          <div class="flex-1 h-2 bg-gray-200 rounded">
            <div class="h-full bg-yellow-400 rounded" style="width: 5%"></div>
          </div>
          <span>5%</span>
        </div>
        <div class="flex items-center gap-2">
          <span>⭐ 3</span>
          <div class="flex-1 h-2 bg-gray-200 rounded">
            <div class="h-full bg-yellow-400 rounded" style="width: 2%"></div>
          </div>
          <span>2%</span>
        </div>
        <div class="flex items-center gap-2">
          <span>⭐ 2</span>
          <div class="flex-1 h-2 bg-gray-200 rounded">
            <div class="h-full bg-yellow-400 rounded" style="width: 2%"></div>
          </div>
          <span>2%</span>
        </div>
        <div class="flex items-center gap-2">
          <span>⭐ 1</span>
          <div class="flex-1 h-2 bg-gray-200 rounded">
            <div class="h-full bg-yellow-400 rounded" style="width: 1%"></div>
          </div>
          <span>1%</span>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="space-y-6">
      <div v-for="i in 3" :key="i" class="border-b pb-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <img src="/assets/images/faq.png" class="w-10 h-10 rounded-full" />
            <span class="font-semibold">Laura Hipster</span>
          </div>
          <span class="text-sm text-gray-500">October 03, 2022</span>
        </div>
        <p class="text-sm text-gray-700 leading-relaxed">
          Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus.
        </p>
        <a href="#" class="text-xs text-red-500 mt-1 inline-block hover:underline">Reply</a>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center gap-2">
      <button class="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-gray-200">‹</button>
      <button class="w-8 h-8 rounded-full bg-black text-white text-sm">1</button>
      <button class="w-8 h-8 rounded-full text-sm hover:bg-gray-200">2</button>
      <button class="w-8 h-8 rounded-full text-sm hover:bg-gray-200">3</button>
      <button class="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-gray-200">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed
</script>
