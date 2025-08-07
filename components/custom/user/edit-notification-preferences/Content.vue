<script setup lang="ts">
import { reactive, toRefs, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const form = reactive({
  offers: {
    enabled: false,
    productUpdates: false,
    promotions: false,
  },
  learning: {
    enabled: false,
    stats: false,
    inspiration: false,
    courseRecs: false,
    lecturerNotifs: false,
  },
});

const { offers, learning } = toRefs(form);

// Watch switch changes and apply them to inner checkboxes
watch(
  () => offers.value.enabled,
  (val) => {
    offers.value.productUpdates = val;
    offers.value.promotions = val;
  }
);

watch(
  () => learning.value.enabled,
  (val) => {
    learning.value.stats = val;
    learning.value.inspiration = val;
    learning.value.courseRecs = val;
    learning.value.lecturerNotifs = val;
  }
);
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-6 rounded-xl">
    <!-- Section 1: Offers & Updates -->
    <div class="border rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b">
        <Switch v-model:checked="offers.enabled" />
        <h2 class="text-lg font-semibold">التحديثات والعروض</h2>
      </div>
      <div class="space-y-2 px-4 py-3">
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model:checked="offers.productUpdates" />
          <label>إطلاق المنتجات والإعلانات</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model:checked="offers.promotions" />
          <label>العروض والترويج</label>
        </div>
      </div>
    </div>

    <!-- Section 2: Your Learning -->
    <div class="border rounded-lg overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b">
        <Switch v-model:checked="learning.enabled" />
        <h2 class="text-lg font-semibold">التعلم الخاص بك</h2>
      </div>
      <div class="space-y-2 px-4 py-3">
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model:checked="learning.stats" />
          <label>إحصاءات التعلم</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model:checked="learning.inspiration" />
          <label>الإلهام (النصائح والقصص وما إلى ذلك)</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model:checked="learning.courseRecs" />
          <label>توصيات الدورة</label>
        </div>
        <div class="flex items-center justify-end gap-2">
          <Checkbox v-model:checked="learning.lecturerNotifs" />
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
