<script setup>
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();

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

// ✅ Load user data on mount
onMounted(async () => {
  let token = useCookie('token').value;
  if (!token && import.meta.client) {
    token = localStorage.getItem('token');
  }

  if (!token) return;

  try {
    const user = await $fetch('http://localhost:3001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    auth.user = user; // Save in store

    form.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      headline: user.headline || '',
      bio: user.bio || '',
      language: user.language || '',
      website: user.social?.website || '',
      facebook: user.social?.facebook || '',
      instagram: user.social?.instagram || '',
      linkedin: user.social?.linkedin || '',
      tiktok: user.social?.tiktok || '',
      x: user.social?.x || '',
      youtube: user.social?.youtube || '',
    };
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
});

// ✅ Save changes
const saveChanges = async () => {
  let token = useCookie('token').value;
  if (!token && import.meta.client) {
    token = localStorage.getItem('token');
  }

  if (!token) {
    alert('You are not logged in.');
    return;
  }

  try {
    const response = await $fetch('http://localhost:3001/api/auth/edit-profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: form.value,
    });

    auth.user = { ...auth.user, ...form.value };
    alert('Profile updated successfully');
    console.log('Response:', response);
    location.reload();
  } catch (error) {
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
        <label class="font-medium">اللقب:</label>
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

    <div class="space-y-2">
      <label class="font-medium">معلومات الاتصال</label>
      <input type="number" v-model="form.bio" class="w-[95%] bg-white" />
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
        <label class="font-medium">موقع الويب ://https</label>
        <Input v-model="form.website" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">facebook.com</label>
        <Input v-model="form.facebook" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">instagram.com</label>
        <Input v-model="form.instagram" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">linkedin.com</label>
        <Input v-model="form.linkedin" placeholder="عنوان URL للملف الشخصي العام" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">tiktok.com</label>
        <Input v-model="form.tiktok" placeholder="@اسم المستخدم" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">x.com</label>
        <Input v-model="form.x" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">youtube.com</label>
        <Input v-model="form.youtube" placeholder="اسم المستخدم" class="w-[95%] bg-white" />
      </div>
    </div>
    <hr />

    <CustomUserEditProfileImageUpload />

    <!-- زر الحفظ -->
    <Button class="mt-6 cursor-pointer" type="submit">حفظ</Button>
  </form>
</template>
