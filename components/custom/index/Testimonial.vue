<template>
    <CustomContainer>
  <section class="py-16 px-4">
    <div class="text-center mb-12">
      <h2 class="text-xl sm:text-2xl font-semibold text-gray-800">ماذا يقول الطلاب عن منصة راوية</h2>
      <p class="mt-2 text-gray-500 text-sm sm:text-base">
        استكشف آراء طلابنا وانطباعاتهم بعد تجربة التعلم معنا.
      </p>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-2xl p-6 shadow-sm border bg-white flex flex-col justify-between"
      >
        <div class="text-5xl text-gray-300 leading-none mb-4">“</div>
        <p class="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
          I must explain to you how all this mistaken. Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound
        </p>
        <div>
          <h3 class="font-bold text-black text-sm sm:text-base">Roe Smith</h3>
          <p class="text-gray-400 text-sm">Designer</p>
        </div>
      </div>
    </div>
  </section>
</CustomContainer>
</template>
