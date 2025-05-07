<script setup lang="ts">
import { Search, MenuIcon, Heart, ShoppingCart, Bell } from 'lucide-vue-next';
import { useUser } from '~/composables/useUser';

const { user } = useUser();
const isMenuOpen = ref(false);
const searchQuery = ref('');
const isHydrated = ref(false);

// Wait for client-side rehydration
onMounted(() => {
  isHydrated.value = true;

  // Click outside to close menu
  window.addEventListener('click', (event: any) => {
    if (!event.target.closest('.mobile-menu') && !event.target.closest('button')) {
      isMenuOpen.value = false;
    }
  });

  // Resize logic to auto-close menu
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      isMenuOpen.value = false;
    }
  };
  window.addEventListener('resize', handleResize);
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});

const toggleMenu = (event: Event) => {
  event.stopPropagation();
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header class="w-full shadow-md bg-white" v-if="isHydrated">
    <CustomContainer>
      <div class="flex items-center justify-between">
        <!-- Logo & Hamburger -->
        <div class="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" class="h-20 w-20 -translate-x-7" />
          <button @click="toggleMenu" class="lg:hidden">
            <MenuIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Mobile & Desktop Menu -->
        <div
          :class="[
            'mobile-menu flex flex-col lg:flex-row gap-6 items-center p-4 lg:p-0',
            isMenuOpen ? 'flex absolute animate__animated animate__fadeInDown animate__faster z-10 top-20 left-10 w-[80%] bg-white shadow-xl' : 'hidden',
            'lg:static lg:w-auto lg:flex',
          ]"
        >
          <NuxtLink to="/faqs" class="text-gray-700 hover:text-orange-500">FAQ</NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-orange-500">عن المنصة</NuxtLink>
          <NuxtLink to="/articles" class="text-gray-700 hover:text-orange-500">المقالات</NuxtLink>
          <NuxtLink to="/courses" class="text-gray-700 hover:text-orange-500">الكورسات</NuxtLink>
          <NuxtLink to="/" class="text-gray-700 hover:text-orange-500">الرئيسية</NuxtLink>

          <!-- Search Input -->
          <div class="relative w-full max-md:w-full lg:w-72 mx-auto">
            <Input id="search" type="text" v-model="searchQuery" placeholder="ابحث عن أي شيء" class="w-full text-center bg-[#F0F0F0] text-base rounded-2xl py-2 pr-10" />
            <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search class="size-5 text-gray-500" />
            </span>
          </div>

          <!-- icons after logging in -->
          <template v-if="user">
            <Heart />
            <ShoppingCart />
            <Bell />
            <CustomUserDropMenu />
          </template>

          <!-- Show login/signup when NOT logged in -->
          <template v-else>
            <NuxtLink to="login" class="text-gray-700 hover:text-orange-500">
              <Button variant="outline" class="cursor-pointer rounded-2xl">تسجيل الدخول</Button>
            </NuxtLink>
            <NuxtLink to="signup" class="text-gray-700 hover:text-orange-500">
              <Button class="bg-orange-500 text-white hover:bg-orange-600 rounded-2xl cursor-pointer">التسجيل</Button>
            </NuxtLink>
          </template>
        </div>
      </div>
    </CustomContainer>
  </header>
</template>

<style scoped>
* {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
