<script setup lang="ts">
import { Search, MenuIcon } from 'lucide-vue-next';

const isMenuOpen = ref(false);
const searchQuery = ref('');

// Toggle menu on mobile
const toggleMenu = (event: Event) => {
  event.stopPropagation();
  isMenuOpen.value = !isMenuOpen.value;
};

// Close menu if clicked outside OR auto-close on large screens
onMounted(() => {
  // Click outside
  window.addEventListener('click', (event: any) => {
    if (!event.target.closest('.mobile-menu') && !event.target.closest('button')) {
      isMenuOpen.value = false;
    }
  });

  // Resize logic
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

const components = [
  {
    title: 'الأعمال والريادة',
    href: '/docs/components/alert-dialog',
    description: 'تعلّم مهارات القيادة وبناء المشاريع الناجحة',
  },
  {
    title: 'الصحة والتغذية',
    href: '/docs/components/hover-card',
    description: 'اكتشف أساليب الحياة الصحية والتغذية السليمة',
  },
  {
    title: 'تطوير الذات',
    href: '/docs/components/progress',
    description: 'Displays an indicator showing the completion progress of a task.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/components/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/components/tabs',
    description: 'Layered sections of content—known as tab panels.',
  },
  {
    title: 'Tooltip',
    href: '/docs/components/tooltip',
    description: 'Displays info on focus or hover.',
  },
  {
    title: 'Tooltip',
    href: '/docs/components/tooltip',
    description: 'Displays info on focus or hover.',
  },
];
</script>

<template>
  <header class="w-full shadow-md bg-white">
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

          <!-- Dropdown Menu -->
          <!-- <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger class="text-gray-700">الكورسات</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul class="grid max-lg:w-[270px] text-right w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li v-for="component in components" :key="component.title">
                      <NavigationMenuLink as-child>
                        <a
                          :href="component.href"
                          class="block select-none space-y-1 rounded-md p-3 transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div class="text-sm font-medium">{{ component.title }}</div>
                          <p class="text-sm text-muted-foreground text-right line-clamp-2">
                            {{ component.description }}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu> -->

          <!-- Search Input -->
          <div class="relative w-full max-md:w-full lg:w-72 mx-auto">
            <Input id="search" type="text" v-model="searchQuery" placeholder="ابحث عن أي شيء" class="w-full text-center bg-[#F0F0F0] text-base rounded-2xl py-2 pr-10" />
            <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search class="size-5 text-gray-500" />
            </span>
          </div>

          <!-- Auth Buttons -->
          <NuxtLink to="login" class="text-gray-700 hover:text-orange-500"><Button variant="outline" class="cursor-pointer rounded-2xl">تسجيل الدخول</Button></NuxtLink>
          <NuxtLink to="signup" class="text-gray-700 hover:text-orange-500"><Button class="bg-orange-500 text-white hover:bg-orange-600 rounded-2xl cursor-pointer">التسجيل</Button></NuxtLink>
        </div>
      </div>
    </CustomContainer>
  </header>
</template>
