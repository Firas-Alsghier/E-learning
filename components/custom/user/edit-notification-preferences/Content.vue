<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from '#app'; // Nuxt helper for API requests

// State for checkboxes
const offers = ref({
  productUpdates: false,
  promotions: false,
});

const learning = ref({
  stats: false,
  inspiration: false,
  courseRecs: false,
  lecturerNotifs: false,
});

// Save preferences function
const savePreferences = async () => {
  try {
    const token = localStorage.getItem('token'); // read JWT token

    const { data, error } = await useFetch('http://localhost:3001/api/auth/notifications', {
      method: 'PUT',
      body: {
        offers: offers.value,
        learning: learning.value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error.value) {
      console.error('❌ Failed to save:', error.value);
      alert('حدث خطأ أثناء الحفظ');
    } else {
      console.log('✅ Saved:', data.value);
      alert('تم حفظ التفضيلات بنجاح ✅');
    }
  } catch (err) {
    console.error('❌ Error:', err);
    alert('خطأ في الاتصال بالخادم');
  }
};
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-6 rounded-xl" @submit.prevent="savePreferences">
    <!-- Section 1: Offers & Updates -->
    <div class="border rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-semibold">التحديثات والعروض</h2>
      </div>

      <div class="space-y-2 px-4 py-3">
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model="offers.productUpdates" />
          <label>إطلاق المنتجات والإعلانات</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model="offers.promotions" />

          <label>العروض والترويج</label>
        </div>
      </div>
    </div>

    <!-- Section 2: Your Learning -->
    <div class="border rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-lg font-semibold">التعلم الخاص بك</h2>
      </div>

      <div class="space-y-2 px-4 py-3">
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model="learning.stats" />
          <label>إحصاءات التعلم</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model="learning.inspiration" />
          <label>الإلهام (النصائح والقصص وما إلى ذلك)</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model="learning.courseRecs" />
          <label>توصيات الدورة</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model="learning.lecturerNotifs" />
          <label>الإشعارات من المحاضرين</label>
        </div>
      </div>
    </div>

    <!-- Note -->
    <p class="text-sm text-right text-muted-foreground leading-relaxed">
      .لاحظة: قد يستغرق الأمر بضع ساعات لتظهر التغييرات في تفضيلاتك. ستستمر في تلقي رسائل بريد إلكتروني بالمعاملات التي تتعلق بحسابك ومشتركاتك إذا قمت بإلغاء الاشتراك
    </p>

    <!-- Save Button -->
    <div class="flex justify-end">
      <Button class="cursor-pointer">حفظ</Button>
    </div>
  </form>
</template>
