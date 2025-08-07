<script setup lang="ts">
// definePageMeta({
//   layout: false,
// });

const error = useError();
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-white text-black">
    <!-- Navbar -->
    <!-- <CustomNavBar /> -->
    <CustomContainer>
      <section class="w-full py-14">
        <div class="flex flex-col items-center mt-10">
          <!-- Error Image -->
          <img src="/assets/images/error.png" alt="Error Image" class="w-[70%] -translate-16 max-md:w-[100%]" />

          <!-- Back Button -->
          <a href="/" class="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-all"> العودة إلى الصفحة الرئيسية </a>
        </div>
      </section>
    </CustomContainer>

    <!-- Footer -->
    <!-- <CustomFooter /> -->
  </div>
</template>
