<!-- <script setup lang="ts">
const links = [
  { name: 'الملف الشخصي', to: '/account/profile' },
  { name: 'الصورة', to: '/account/photo' },
  { name: 'أمان الحساب', to: '/account/security' },
  { name: 'الاشتراكات', to: '/account/subscriptions' },
  { name: 'طرق الدفع', to: '/account/payment-methods' },
  { name: 'الخصوصية', to: '/account/privacy' },
  { name: 'الإشعارات', to: '/account/notifications' },
  { name: 'عملاء API', to: '/account/api-clients' },
  { name: 'إغلاق الحساب', to: '/account/close' },
];
</script>

<template>
  <aside class="w-full lg:w-64 border-r p-4 space-y-2">
    <div class="flex items-center gap-3">
      <div class="bg-black text-white h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold">FA</div>
      <div class="text-sm font-medium">Feras Alshghier</div>
    </div>
    <ul class="mt-6 space-y-2">
      <li v-for="link in links" :key="link.to">
        <NuxtLink :to="link.to" class="block px-3 py-2 rounded hover:bg-gray-100" active-class="bg-gray-200 font-bold">
          {{ link.name }}
        </NuxtLink>
      </li>
    </ul>
  </aside>
</template> -->
