<template>
  <CustomContainer>
  <section class="text-center py-10 ">
      <div class="flex flex-row-reverse items-start justify-between gap-6 mb-6">
        <div class="text-right">
          <h3 class="text-2xl mb-3 font-semibold">الدّورات الأكثر طلباً</h3>
          <p class="text-lg sm:text-base text-[#555]">
            .اختر من أحد هذه الدورات لتطوير مهاراتك في مجالات مختلفة
          </p>
        </div>
        <div>
          <Button class="bg-transparent text-base cursor-pointer rounded-2xl hover:bg-[#FF782D] hover:text-white text-black border-2">كل التصنيفات</Button>
        </div>
      </div>

      <div
        class="grid justify-center sm:justify-between gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="bg-white cursor-pointer border rounded-lg w-[234px] h-[234px] p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg mx-auto"
        >
          <div class="text-4xl mb-3">{{ category.icon }}</div>
          <h3 class="text-gray-800 font-semibold">{{ category.name }}</h3>
          <p class="text-gray-500 text-sm">{{ category.courses }} دورات</p>
        </div>
      </div>
    </section>
  </CustomContainer>
</template>

<script setup>
const categories = [
  { icon: "🎨", name: "Design", courses: 38 },
  { icon: "💻", name: "Development", courses: 38 },
  { icon: "🎭", name: "Art", courses: 38 },
  { icon: "🎥", name: "Video", courses: 38 },
  { icon: "📊", name: "Marketing", courses: 38 },
  { icon: "📄", name: "Business", courses: 38 },
  { icon: "📡", name: "Networking", courses: 38 },
  { icon: "🎨", name: "Illustration", courses: 38 },
  { icon: "🎨", name: "Illustration", courses: 38 },
  { icon: "🎨", name: "Illustration", courses: 38 },
];
</script>
