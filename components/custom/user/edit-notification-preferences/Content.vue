<script setup lang="ts">
import { ref, onMounted } from 'vue';

type Offers = {
  productUpdates: boolean;
  promotions: boolean;
};

type Learning = {
  stats: boolean;
  inspiration: boolean;
  courseRecs: boolean;
  lecturerNotifs: boolean;
};

type NotificationResponse = {
  notificationPreferences?: {
    offers: Offers;
    learning: Learning;
  };
};

const offers = ref<Offers>({
  productUpdates: false,
  promotions: false,
});

const learning = ref<Learning>({
  stats: false,
  inspiration: false,
  courseRecs: false,
  lecturerNotifs: false,
});

const isSaving = ref(false);

// Load saved preferences
const loadPreferences = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const me = await $fetch<NotificationResponse>('http://localhost:3001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (me?.notificationPreferences) {
      offers.value = {
        productUpdates: !!me.notificationPreferences.offers?.productUpdates,
        promotions: !!me.notificationPreferences.offers?.promotions,
      };

      learning.value = {
        stats: !!me.notificationPreferences.learning?.stats,
        inspiration: !!me.notificationPreferences.learning?.inspiration,
        courseRecs: !!me.notificationPreferences.learning?.courseRecs,
        lecturerNotifs: !!me.notificationPreferences.learning?.lecturerNotifs,
      };
    }
  } catch (err) {
    console.error('❌ Failed to load notifications:', err);
  }
};

onMounted(loadPreferences);

// Save preferences
const savePreferences = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    isSaving.value = true;

    const res = await $fetch<{ success: boolean; data: { offers: Offers; learning: Learning } }>('http://localhost:3001/api/auth/notifications', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        offers: offers.value,
        learning: learning.value,
      },
    });

    if (res.success) {
      offers.value = res.data.offers;
      learning.value = res.data.learning;
      console.log('✅ Saved:', res.data);
      alert('تم حفظ التفضيلات بنجاح ✅');
      location.reload();
    }
  } catch (err) {
    console.error('❌ Error saving notifications:', err);
    alert('خطأ في الاتصال بالخادم');
  } finally {
    isSaving.value = false;
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
      <Button class="cursor-pointer" :disabled="isSaving">حفظ</Button>
    </div>
  </form>
</template>
