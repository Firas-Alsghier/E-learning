<template>
    <CustomContainer>
    <section
      class="relative rounded-2xl py-10 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-right overflow-hidden"
      style="background: linear-gradient(to right, #C7E6F9, #E8D1FE);"
    >
      <!-- Top right vector -->
      <img
        src="/assets/images/cap.png"
        alt="Decoration"
        class="absolute top-0 right-0 w-32 sm:w-48 opacity-40 pointer-events-none select-none"
      />
  
      <!-- Bottom left vector -->
      <img
        src="/assets/images/letter.png"
        alt="Decoration"
        class="absolute bottom-0 left-0 w-32 sm:w-48 opacity-40 pointer-events-none select-none"
      />
  
      <!-- Left side (text + buttons) -->
      <div class="flex flex-col gap-4 items-start sm:items-end z-10">
        <div class="flex gap-4">
          <button class="bg-white text-gray-600 text-sm sm:text-base font-medium px-6 py-2 rounded-full hover:bg-gray-100 transition">
            انضم كمعلم
          </button>
          <button class="border border-white text-white text-sm sm:text-base font-medium px-6 py-2 rounded-full hover:bg-white hover:text-gray-700 transition">
            أنا طالب
          </button>
        </div>
      </div>
  
      <!-- Right side (text + image) -->
      <div class="flex items-center gap-4 z-10">
        <p class="text-black font-semibold text-sm sm:text-base">لنبدأ مع منصة راوية</p>
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow">
          <img src="/assets/images/student.png" alt="Student Icon" class="w-10 h-10">
        </div>
      </div>
    </section>
</CustomContainer>
  </template>
  