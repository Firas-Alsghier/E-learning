<template>
  <form class="space-y-8 bg-[#f9f9f9] p-8 rounded-lg">
    <!-- الاسم الأول واسم العائلة -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="font-medium">الاسم الأول:</label>
        <Input v-model="form.firstName" class="w-[95%] bg-white" />
      </div>
      <div class="space-y-2">
        <label class="font-medium">اسم العائلة:</label>
        <Input v-model="form.lastName" class="w-[95%] bg-white" />
      </div>
    </div>
    <hr />
    <!-- المسمى الوظيفي -->
    <div class="space-y-2">
      <label class="font-medium">Headline</label>
      <Input v-model="form.headline" class="w-[95%] bg-white" />
      <p class="text-sm text-muted-foreground">أضف عنوانًا احترافيًا مثل "محاضر في Udemy" أو "مهندس معماري".</p>
    </div>
    <hr />
    <!-- السيرة الذاتية -->
    <div class="space-y-2">
      <label class="font-medium">السيرة الذاتية</label>
      <Textarea v-model="form.bio" class="w-[95%] bg-white" />
      <p class="text-sm text-muted-foreground">لا يسمح بالروابط ورموز التنسيق في هذا القسم.</p>
    </div>
    <hr />
    <!-- اللغة -->
    <div class="space-y-2">
      <label class="font-medium">اللغة</label>
      <Select v-model="form.language">
        <SelectTrigger class="w-[95%] bg-white">
          <SelectValue placeholder="اختر لغة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ar">العربية</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <hr />
    <!-- روابط التواصل -->
    <div class="space-y-6">
      <h3 class="font-semibold text-lg">روابط:</h3>

      <div class="space-y-2">
        <label class="font-medium">موقع الويب (http(s)://..)</label>
        <Input v-model="form.website" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">/facebook.com</label>
        <Input v-model="form.facebook" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
        <p class="text-sm text-muted-foreground">ادخل اسم مستخدم حسابك على Facebook (مثل johnsmith).</p>
      </div>

      <div class="space-y-2">
        <label class="font-medium">/instagram.com</label>
        <Input v-model="form.instagram" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
        <p class="text-sm text-muted-foreground">ادخل اسم مستخدم حسابك على Instagram (مثل johnsmith).</p>
      </div>

      <div class="space-y-2">
        <label class="font-medium">/linkedin.com</label>
        <Input v-model="form.linkedin" placeholder="عنوان URL للملف الشخصي العام" class="w-[95%] bg-white" />
        <p class="text-sm text-muted-foreground">ادخل عنوان URL لملفك الشخصي العام على LinkedIn (مثل johnsmith, company/udemy/in).</p>
      </div>

      <div class="space-y-2">
        <label class="font-medium">/tiktok.com</label>
        <Input v-model="form.tiktok" placeholder="@اسم المستخدم" class="w-[95%] bg-white" />
        <p class="text-sm text-muted-foreground">ادخل اسم حسابك على TikTok (مثل @johnsmith).</p>
      </div>

      <div class="space-y-2">
        <label class="font-medium">/x.com</label>
        <Input v-model="form.x" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
        <p class="text-sm text-muted-foreground">أضف اسم المستخدم الخاص بك على X (مثل johnsmith).</p>
      </div>

      <div class="space-y-2">
        <label class="font-medium">/youtube.com</label>
        <Input v-model="form.youtube" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
        <p class="text-sm text-muted-foreground">ادخل اسم حسابك على YouTube (مثل johnsmith).</p>
      </div>
    </div>

    <!-- زر الحفظ -->
    <Button class="mt-6">حفظ</Button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const form = ref({
  firstName: '',
  lastName: '',
  headline: '',
  bio: '',
  language: '',
  website: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  tiktok: '',
  x: '',
  youtube: '',
});
</script>
