<template>
  <footer class="bg-[#1E262E] py-10 border-t">
    <CustomContainer>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-text-custom rtl">
        <!-- About Section -->
        <div class="md:col-span-1">
          <h2 class="text-xl font-bold mb-4">منصة راوِية</h2>
          <p class="text-sm leading-relaxed">منصة "راوية" هي منصة تعليمية مبتكرة تهدف إلى تقديم محتوى تعليمي عالي الجودة في مختلف المجالات...</p>
        </div>

        <!-- Get Help Section -->
        <div>
          <h3 class="text-lg font-semibold mb-3">GET HELP</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="#">تواصل معنا</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">أحدث المقالات</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">أهم الأسئلة والأجوبة</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Programs Section -->
        <div>
          <h3 class="text-lg font-semibold mb-3">PROGRAMS</h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="#">Art & Design</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">IT & Software</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">Languages</NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">Programming</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div class="text-left">
          <h3 class="text-lg font-semibold mb-3">CONTACT US</h3>
          <p class="text-sm">Address: 2321 New Design Str, Lorem Ipsum10 Hudson Yards, USA</p>
          <p class="text-sm mt-2">Tel: + (123) 2500-567-8988</p>
          <p class="text-sm">Mail: supportlms@gmail.com</p>

          <!-- Social Icons -->
          <div class="flex justify-end space-x-4 mt-4">
            <NuxtLink to="#">
              <Facebook class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink to="#">
              <X class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink to="#">
              <Instagram class="w-5 h-5" />
            </NuxtLink>
            <NuxtLink to="#">
              <Youtube class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Copyright & Scroll to Top -->
      <div class="mt-10 flex items-center justify-center relative">
        <p class="text-sm text-text-secondary-custom">© {{ new Date().getFullYear() }} | منصة راوِية جميع الحقوق محفوظة</p>

        <!-- Scroll to Top Button in the Right Corner -->
        <button
          @click="scrollToTop"
          class="absolute cursor-pointer right-0 bottom-0 mb-2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
        >
          <ArrowUp class="w-6 h-6" />
        </button>
      </div>
    </CustomContainer>
  </footer>
</template>

<script setup lang="ts">
import { ArrowUp, Facebook, X, Instagram, Youtube } from 'lucide-vue-next';

// Function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style>
.rtl {
  direction: rtl;
}
</style>
