<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useI18n } from 'vue-i18n';
import { Search, MenuIcon, Heart, ShoppingCart, Bell } from 'lucide-vue-next';
import { useUser } from '~/composables/useUser'; // Retained for real-world functionality
import { useTeacher } from '~/composables/useTeacher';
const { user } = useUser();
const { teacher } = useTeacher(); // 👈 Add this line
const cartStore = useCartStore();
const isMenuOpen = ref(false);
const searchQuery = ref('');
const isHydrated = ref(false);
const { t } = useI18n();
// --- Notification/Count State (New) ---
// Initialize your mock counts here. In a real app, these would come from a store or API.
const wishlistCount = ref(0); // Items in wishlist
const cartCount = computed(() => cartStore.count);
const notificationCount = ref(9); // Unread notifications
const auth = useAuthStore();

const fetchWishlistCount = async () => {
  try {
    const token = useCookie('token').value;

    if (!token) {
      wishlistCount.value = 0;
      return;
    }

    const wishlist = await $fetch<any[]>('http://localhost:3001/api/user/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    wishlistCount.value = wishlist.length;
  } catch (err) {
    console.error('Wishlist count error:', err);
    wishlistCount.value = 0;
  }
};

const fetchCartCount = async () => {
  try {
    const token = useCookie('token').value;

    if (!token) {
      cartStore.setCount(0);
      return;
    }

    const cart: any = await $fetch('http://localhost:3001/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    cartStore.setCount(cart.items.length);
  } catch (err) {
    console.error('Cart count error:', err);
    cartStore.setCount(0);
  }
};
// Wait for client-side rehydration
onMounted(async () => {
  isHydrated.value = true;
  await Promise.all([fetchWishlistCount(), fetchCartCount()]); // Click outside to close menu
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
  <!-- <LanguageBanner /> -->
  <LanguageBanner />

  <header class="w-full shadow-md bg-navbar-custom py-2" v-if="isHydrated">
    <CustomContainer>
      <div class="flex items-center justify-between">
        <!-- Logo & Hamburger -->
        <div class="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" class="h-16 w-16" />
          <button @click="toggleMenu" class="lg:hidden">
            <MenuIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Mobile & Desktop Menu -->
        <div
          :class="[
            'mobile-menu flex flex-col lg:flex-row gap-6 items-center p-4 lg:p-0',
            isMenuOpen ? 'flex absolute animate__animated animate__fadeInDown animate__faster z-10 top-20 left-10 w-[80%] bg-card-custom shadow-xl' : 'hidden',
            'lg:static lg:w-auto lg:flex',
          ]"
        >
          <NuxtLink to="/faqs" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">FAQ</NuxtLink>
          <NuxtLink to="/about" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('about-us') }}</NuxtLink>
          <!-- <NuxtLink to="/articles" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('articles') }}</NuxtLink> -->
          <NuxtLink to="/courses" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('courses') }}</NuxtLink>
          <a href="/" class="text-text-custom hover:text-hover-rose-gold cursor-pointer" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('home') }}</a>

          <!-- Search Input -->
          <div class="relative w-full max-md:w-full lg:w-72 mx-auto">
            <Input id="search" type="text" v-model="searchQuery" placeholder="Search" class="w-full text-center bg-[#F0F0F0] text-base rounded-2xl py-2 pr-10" />
            <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search class="size-5 text-gray-500" />
            </span>
          </div>

          <!-- icons after logging in (Updated with Badges) -->
          <template v-if="user">
            <NuxtLink to="/wishlist" class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold">
              <Heart class="size-6" />
              <span
                v-if="wishlistCount > 0"
                class="absolute top-[-8px] right-[-8px] h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border border-white"
              >
                {{ wishlistCount > 9 ? '9+' : wishlistCount }}
              </span>
            </NuxtLink>

            <NuxtLink to="/cart" class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold">
              <ShoppingCart class="size-6" />
              <span v-if="cartCount > 0" class="absolute top-[-8px] right-[-8px] h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border border-white">
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </NuxtLink>

            <div class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold">
              <Bell class="size-6" />
            </div>
            <CustomUserDropMenu />
          </template>

          <template v-else-if="teacher">
            <div class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold">
              <Bell class="size-6" />
              <span
                v-if="notificationCount > 0"
                class="absolute top-[-8px] right-[-8px] h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border border-white"
              >
                {{ notificationCount > 9 ? '9+' : notificationCount }}
              </span>
            </div>

            <CustomTeacherDropMenu />
          </template>

          <template v-else>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" class="cursor-pointer rounded-2xl">{{ t('log-in') }}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem as-child>
                  <NuxtLink class="cursor-pointer" to="/login">Login as Student</NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <NuxtLink class="cursor-pointer" to="/teacher/login">Login as Teacher</NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button class="btn-custom text-primary-custom border-custom rounded-2xl cursor-pointer">{{ t('sign-up') }}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem as-child>
                  <NuxtLink class="cursor-pointer" to="/signup">Register as Student</NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <NuxtLink class="cursor-pointer" to="/teacher/signup">Register as Teacher</NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
