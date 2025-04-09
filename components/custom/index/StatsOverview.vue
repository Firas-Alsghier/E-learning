<template>
    <section class="py-10">
      <CustomContainer>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div
            v-for="(stat, index) in stats"
            :key="index"
            class="bg-gray-50 rounded-2xl py-10 shadow-sm"
          >
            <h2 class="text-4xl font-bold text-orange-500 mb-2">{{ stat.number }}</h2>
            <p class="text-base font-medium text-black">{{ stat.label }}</p>
          </div>
        </div>
      </CustomContainer>
    </section>
  </template>
  
  <script setup>
  const stats = [
    { number: "4.9", label: "معدل التقييم" },
    { number: "12", label: "المعلّم" },
    { number: "72", label: "مجموع الدورات" },
    { number: "1.2k", label: "الطلاب النشطين" },
  ];
  </script>
  