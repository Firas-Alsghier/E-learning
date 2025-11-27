<script setup lang="ts">
import { Search, MenuIcon, Heart, ShoppingCart, Bell } from 'lucide-vue-next';
import { useUser } from '~/composables/useUser'; // Retained for real-world functionality

const { user } = useUser();
const isMenuOpen = ref(false);
const searchQuery = ref('');
const isHydrated = ref(false);

// --- Notification/Count State (New) ---
// Initialize your mock counts here. In a real app, these would come from a store or API.
const wishlistCount = ref(5); // Items in wishlist
const cartCount = ref(1); // Items in cart
const notificationCount = ref(9); // Unread notifications

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
  <header class="w-full shadow-md bg-navbar-custom py-2" v-if="isHydrated">
    <CustomContainer>
      <div class="flex items-center justify-between">
        <!-- Logo & Hamburger -->
        <div class="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" class="h-16 w-16 -translate-x-7" />
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
          <NuxtLink to="/faqs" class="text-text-custom hover:text-hover-rose-gold">FAQ</NuxtLink>
          <NuxtLink to="/about" class="text-text-custom hover:text-hover-rose-gold">عن المنصة</NuxtLink>
          <NuxtLink to="/articles" class="text-text-custom hover:text-hover-rose-gold">المقالات</NuxtLink>
          <NuxtLink to="/courses" class="text-text-custom hover:text-hover-rose-gold">الكورسات</NuxtLink>
          <a href="/" class="text-text-custom hover:text-hover-rose-gold cursor-pointer">الرئيسية</a>

          <!-- Search Input -->
          <div class="relative w-full max-md:w-full lg:w-72 mx-auto">
            <Input id="search" type="text" v-model="searchQuery" placeholder="ابحث عن أي شيء" class="w-full text-center bg-[#F0F0F0] text-base rounded-2xl py-2 pr-10" />
            <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search class="size-5 text-gray-500" />
            </span>
          </div>

          <!-- icons after logging in (Updated with Badges) -->
          <template v-if="user">
            <!-- Heart Icon with Badge -->
            <NuxtLink to="/wishlist" class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold">
              <Heart class="size-6" />
              <span
                v-if="wishlistCount > 0"
                class="absolute top-[-8px] right-[-8px] h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border border-white"
              >
                {{ wishlistCount > 9 ? '9+' : wishlistCount }}
              </span>
            </NuxtLink>

            <!-- ShoppingCart Icon with Badge -->
            <div class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold">
              <ShoppingCart class="size-6" />
              <span v-if="cartCount > 0" class="absolute top-[-8px] right-[-8px] h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border border-white">
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </div>

            <!-- Bell Icon with Badge -->
            <div class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold">
              <Bell class="size-6" />
              <span
                v-if="notificationCount > 0"
                class="absolute top-[-8px] right-[-8px] h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border border-white"
              >
                {{ notificationCount > 9 ? '9+' : notificationCount }}
              </span>
            </div>
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
