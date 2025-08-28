<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
// import CustomUserEditProfileImageUpload from '@/components/custom/profile/CustomUserEditProfileImageUpload';

interface FormType {
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  language: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  x: string;
  youtube: string;
}

const auth = useAuthStore();

const form = ref<FormType>({
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

onMounted(() => {
  if (auth.user) {
    Object.assign(form.value, {
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      headline: auth.user.headline || '',
      bio: auth.user.bio || '',
      language: auth.user.language || '',
      website: auth.user.social?.website || '',
      facebook: auth.user.social?.facebook || '',
      instagram: auth.user.social?.instagram || '',
      linkedin: auth.user.social?.linkedin || '',
      tiktok: auth.user.social?.tiktok || '',
      x: auth.user.social?.x || '',
      youtube: auth.user.social?.youtube || '',
    });
  }
});

const saveChanges = async () => {
  // ✅ Try cookie first, then localStorage
  let token = useCookie('token').value;
  if (!token && import.meta.client) {
    token = localStorage.getItem('token') || '';
  }

  if (!token) {
    alert('You are not logged in.');
    return;
  }

  try {
    const response: any = await $fetch('http://localhost:3001/api/auth/edit-profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send Bearer token
        'Content-Type': 'application/json', // ✅ Ensure JSON body
      },
      body: form.value,
    });

    alert('Profile updated successfully');
    console.log('Response:', response);
  } catch (error: any) {
    alert('Failed to update profile');
    console.error('Error updating profile:', error);
  }
};
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-8 rounded-lg" @submit.prevent="saveChanges">
    <!-- الاسم الأول واسم العائلة -->
    <div class="grid grid-cols-1 text-right md:grid-cols-2 gap-6">
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
      <p class="text-sm text-muted-foreground">أضف عنوانًا احترافيًا مثل "مصمم جرافيك" أو "مهندس معماري".</p>
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
      </div>

      <div class="space-y-2">
        <label class="font-medium">/instagram.com</label>
        <Input v-model="form.instagram" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">/linkedin.com</label>
        <Input v-model="form.linkedin" placeholder="عنوان URL للملف الشخصي العام" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">/tiktok.com</label>
        <Input v-model="form.tiktok" placeholder="@اسم المستخدم" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">/x.com</label>
        <Input v-model="form.x" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">/youtube.com</label>
        <Input v-model="form.youtube" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
      </div>
    </div>
    <hr />

    <CustomUserEditProfileImageUpload />

    <!-- زر الحفظ -->
    <Button class="mt-6 cursor-pointer" type="submit">حفظ</Button>
  </form>
</template>
