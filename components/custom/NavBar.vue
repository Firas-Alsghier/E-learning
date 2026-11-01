<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useCartStore } from '~/stores/cart';
import { useWishlistStore } from '~/stores/wishlist';
import { useI18n } from 'vue-i18n';
import { Search, MenuIcon, Heart, ShoppingCart, Bell, Facebook, Instagram } from 'lucide-vue-next';
import { useUser } from '~/composables/useUser'; // Retained for real-world functionality
import { useTeacher } from '~/composables/useTeacher';

// Notification data
interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

const config = useRuntimeConfig();
const { user } = useUser();
const { teacher } = useTeacher(); // 👈 Add this line
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const isMenuOpen = ref(false);
const isHydrated = ref(false);
const { t } = useI18n();
// --- Notification/Count State (New) ---
// Initialize your mock counts here. In a real app, these would come from a store or API.
const wishlistCount = computed(() => wishlistStore.count); // Items in wishlist
const cartCount = computed(() => cartStore.count);
const notificationCount = ref(0);
const isNotificationOpen = ref(false);
const notifications = ref<NotificationItem[]>([]);
const isLoadingNotifications = ref(false);
const auth = useAuthStore();
const searchQuery = ref('');

const router = useRouter();

const toggleNotifications = (event: Event) => {
  event.stopPropagation();
  isNotificationOpen.value = !isNotificationOpen.value;
};

// Fetch notifications from the backend
const fetchNotifications = async () => {
  try {
    const token = useCookie('token').value;

    if (!token) {
      notifications.value = [];
      notificationCount.value = 0;
      return;
    }

    isLoadingNotifications.value = true;

    const response = await $fetch<{
      notifications: NotificationItem[];
      unreadCount: number;
    }>(`${config.public.apiBase}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    notifications.value = response.notifications;
    notificationCount.value = response.unreadCount;
  } catch (error) {
    console.error('Notification fetch error:', error);
  } finally {
    isLoadingNotifications.value = false;
  }
};

const markNotificationAsRead = async (notification: NotificationItem) => {
  if (notification.isRead) return;

  try {
    const token = useCookie('token').value;
    if (!token) return;

    await $fetch(`${config.public.apiBase}/api/notifications/${notification._id}/read`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    notification.isRead = true;
    notificationCount.value = Math.max(0, notificationCount.value - 1);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

const handleSearch = () => {
  const query = searchQuery.value.trim();

  if (!query) return;

  router.push({
    path: '/courses',
    query: {
      search: query,
    },
  });
};

const fetchCartCount = async () => {
  try {
    const token = useCookie('token').value;

    if (!token) {
      cartStore.setCount(0);
      return;
    }

    const cart: any = await $fetch(`${config.public.apiBase}/api/cart`, {
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
  await Promise.all([wishlistStore.refresh(), fetchCartCount()]);

  if (user.value) {
    await fetchNotifications();
  }
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
          <div class="flex items-center gap-2">
            <!-- Example icons: -->
            <a href="#" class="text-[#1877F2] hover:opacity-75 transition-opacity duration-200">
              <Facebook class="w-5 h-5" />
            </a>

            <!-- Instagram (Brand Pink/Magenta) -->
            <a href="#" class="text-[#E1306C] hover:opacity-75 transition-opacity duration-200">
              <Instagram class="w-5 h-5" />
            </a>
          </div>
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
          <NuxtLink to="/faqs" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('faq-nav') }}</NuxtLink>
          <NuxtLink to="/about" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('about-us') }}</NuxtLink>
          <!-- <NuxtLink to="/articles" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('articles') }}</NuxtLink> -->
          <NuxtLink to="/courses" class="text-text-custom hover:text-hover-rose-gold" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('courses') }}</NuxtLink>
          <a href="/" class="text-text-custom hover:text-hover-rose-gold cursor-pointer" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('home') }}</a>

          <!-- Search Input -->
          <div class="relative w-full max-md:w-full lg:w-72 mx-auto">
            <Input id="search" type="text" v-model="searchQuery" @keyup.enter="handleSearch" placeholder="Search..." class="w-full text-center bg-[#F0F0F0] text-base rounded-2xl py-2 pr-10" />
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

            <div class="relative">
              <!-- Notification Bell -->
              <button type="button" @click="toggleNotifications" class="relative cursor-pointer text-text-secondary-custom hover:text-hover-rose-gold" aria-label="Notifications">
                <Bell class="size-6" />

                <span
                  v-if="notificationCount > 0"
                  class="absolute top-[-8px] right-[-8px] h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold border border-white"
                >
                  {{ notificationCount > 9 ? '9+' : notificationCount }}
                </span>
              </button>

              <!-- Notification Panel -->
              <div v-if="isNotificationOpen" class="absolute left-0 top-10 z-50 w-[min(24rem,calc(100vw-2rem))] bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div class="flex items-center justify-between p-4 border-b">
                  <h3 class="font-semibold text-gray-800">Notifications</h3>
                  <button type="button" @click="isNotificationOpen = false" class="text-sm text-gray-500 hover:text-gray-800">Close</button>
                </div>

                <!-- Loading state -->
                <div v-if="isLoadingNotifications" class="p-6 text-center text-gray-500">Loading notifications...</div>

                <!-- Empty state -->
                <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-500">
                  <Bell class="size-8 mx-auto mb-3 text-gray-400" />
                  <p class="font-medium">You're all caught up!</p>
                  <p class="text-sm mt-1">New notifications will appear here.</p>
                </div>

                <!-- Notification list -->
                <div v-else class="max-h-96 overflow-y-auto divide-y">
                  <div v-for="notification in notifications" :key="notification._id" class="p-4 hover:bg-gray-50 transition" :class="{ 'bg-blue-50': !notification.isRead }">
                    <NuxtLink
                      :to="notification.link || '/courses'"
                      @click="
                        markNotificationAsRead(notification);
                        isNotificationOpen = false;
                      "
                      class="block"
                    >
                      <div class="flex items-start gap-3">
                        <span v-if="!notification.isRead" class="mt-2 size-2 rounded-full bg-blue-500 shrink-0"></span>

                        <div class="min-w-0">
                          <p class="font-semibold text-sm text-gray-800">
                            {{ notification.title }}
                          </p>

                          <p class="text-sm text-gray-600 mt-1">
                            {{ notification.message }}
                          </p>

                          <p class="text-xs text-gray-400 mt-2">
                            {{ new Date(notification.createdAt).toLocaleString() }}
                          </p>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </div>
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
                  <NuxtLink class="cursor-pointer" to="/login">{{ t('login-as-student') }}</NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <NuxtLink class="cursor-pointer" to="/teacher/login">{{ t('login-as-teacher') }}</NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button class="btn-custom text-primary-custom border-custom rounded-2xl cursor-pointer">{{ t('sign-up') }}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem as-child>
                  <NuxtLink class="cursor-pointer" to="/signup">{{ t('register-as-student') }}</NuxtLink>
                </DropdownMenuItem>
                <DropdownMenuItem as-child>
                  <NuxtLink class="cursor-pointer" to="/teacher/signup">{{ t('register-as-teacher') }}</NuxtLink>
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
