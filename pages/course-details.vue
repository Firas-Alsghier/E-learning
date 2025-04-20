<template>
  <CustomBreadCrumb />
  <div class="bg-black h-[290px] text-white pt-8">
    <CustomContainer>
      <!-- Top Section -->
      <div class="flex flex-col lg:flex-row justify-between gap-6">
        <!-- Left: Course Info -->
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="bg-[#555555] text-white text-sm px-3 py-2 rounded-[8px] inline-block">Photography</span>
            <p class="text-lg"><span class="text-[#9D9D9D]">by</span> Determined-Poitras</p>
          </div>
          <h1 class="text-4xl font-bold">The Ultimate Guide To The Best WordPress LMS Plugin</h1>

          <!-- Course Meta Info -->
          <div class="flex flex-wrap gap-4 text-sm text-orange-400 mt-4">
            <span>🕒 2Weeks</span>
            <span>🎓 156 Students</span>
            <span>📊 All levels</span>
            <span>📚 20 Lessons</span>
            <span>📝 3 Quizzes</span>
          </div>
        </div>

        <!-- Right: Sidebar Card -->
        <div class="bg-white text-black rounded-xl p-4 w-full lg:w-[320px] shrink-0">
          <img src="/assets/images/error.png" alt="LMS" class="rounded-lg mb-4" />
          <div class="text-center space-y-2">
            <p class="text-sm text-gray-600 line-through">$59.0</p>
            <p class="text-2xl text-orange-500 font-bold">$49.0</p>
            <button class="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-4 py-2 mt-2">البدء الآن</button>
          </div>
        </div>
      </div>
    </CustomContainer>
  </div>

  <!-- Tabs Section -->
  <CustomContainer>
    <div class="flex justify-start my-12">
      <div class="bg-gray-100 rounded-xl w-[850px] h-[340px]">
        <!-- Tabs -->
        <div class="flex justify-between rounded-t-xl bg-white border border-[#EAEAEA] overflow-hidden">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="selectedTab = tab.id"
            class="px-7 w-full text-sm font-semibold py-5 border-l border-[#EAEAEA] first:rounded-tl-xl last:rounded-tr-xl first:border-l-0"
            :class="{
              'bg-[#F5F5F5] text-[#FF782D] font-bold': selectedTab === tab.id,
              'text-gray-700': selectedTab !== tab.id,
            }"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="mt-4 text-right bg-[#F5F5F5] leading-loose text-gray-800 overflow-y-auto h-[250px] px-4 py-3 rounded-b-xl">
          <div v-if="selectedTab === 'overview'">
            <p>على ووردبريس، تُعد واحدة من أفضل إضافات شاملة لنظام إدارة التعلم LearnPress (LMS). يمكنك تصميم مناهج دراسية وبيع الدورات بسهولة عبر الإنترنت.</p>
            <p>بفضل واجهتها البسيطة، يستطيع المستخدمون التفاعل معها بسهولة. تُستخدم في بناء مدارس إلكترونية وتدعم الدروس، الاختبارات، والشهادات.</p>
            <p>رغم بساطتها، إلا أنها ما زالت تتمتع بإمكانيات عالية تساعدك على إنشاء موقع تعليمي متكامل.</p>
          </div>
          <!-- Add other tab content here -->
        </div>
      </div>
    </div>
  </CustomContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref('overview');

const tabs = [
  { id: 'overview', label: 'نظرة عامة' },
  { id: 'curriculum', label: 'المنهج الدراسي' },
  { id: 'instructor', label: 'المُدرّس' },
  { id: 'faq', label: 'الأسئلة الشائعة' },
  { id: 'reviews', label: 'التقييمات' },
];
</script>

<!-- <style scoped>
  .tab-btn {
    @apply px-4 py-2 text-sm text-gray-700 hover:text-orange-500;
  }
  </style> -->
