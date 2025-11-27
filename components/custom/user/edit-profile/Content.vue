<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import type { Profile } from '@/types/edit-profile';
const auth = useAuthStore();

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

// --------------------------------------
// 3) Form State
// --------------------------------------
const form = ref({
  firstName: '',
  lastName: '',
  headline: '',
  bio: '',
  language: '',
  country: '',

  gender: '',

  birthDay: '',
  birthMonth: '',
  birthYear: '',

  website: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  x: '',
});

onMounted(async () => {
  let token = useCookie('token').value;
  if (!token && import.meta.client) token = localStorage.getItem('token');
  if (!token) return;

  try {
    const user = await $fetch<Profile>('http://localhost:3001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    auth.user = user;

    form.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      headline: user.headline || '',
      bio: user.bio || '',
      language: user.language || '',
      country: user.country || '',

      gender: user.gender || '',

      birthDay: user.birthDay || '',
      birthMonth: user.birthMonth || '',
      birthYear: user.birthYear || '',

      website: user.social?.website || '',
      facebook: user.social?.facebook || '',
      instagram: user.social?.instagram || '',
      linkedin: user.social?.linkedin || '',
      x: user.social?.x || '',
    };
    console.log(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
});

// --------------------------------------
// 5) Save Changes
// --------------------------------------
const saveChanges = async () => {
  let token = useCookie('token').value;
  if (!token && import.meta.client) token = localStorage.getItem('token');
  if (!token) return alert('You are not logged in.');

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
    <!-- First / Last name -->
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

    <!-- Headline -->
    <div class="space-y-2">
      <label class="font-medium">العنوان الوظيفي (Headline)</label>
      <Input v-model="form.headline" class="w-[95%] bg-white" />
    </div>

    <hr />

    <!-- Bio -->
    <div class="space-y-2">
      <label class="font-medium">السيرة الذاتية</label>
      <Textarea v-model="form.bio" class="w-[95%] bg-white" />
    </div>

    <hr />

    <!-- Language -->
    <div class="space-y-2">
      <label class="font-medium">اللغة</label>

      <Select v-model="form.language" :default-value="form.language">
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

    <!-- Country -->
    <div class="space-y-2">
      <label class="font-medium">البلد</label>

      <Select v-model="form.country" :default-value="form.country">
        <SelectTrigger class="w-[95%] bg-white">
          <SelectValue placeholder="اختر البلد" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="Libya">ليبيا</SelectItem>
          <SelectItem value="Egypt">مصر</SelectItem>
          <SelectItem value="Morocco">المغرب</SelectItem>
          <SelectItem value="Tunisia">تونس</SelectItem>
          <SelectItem value="Algeria">الجزائر</SelectItem>
          <SelectItem value="Sudan">السودان</SelectItem>
          <SelectItem value="Saudi Arabia">السعودية</SelectItem>
          <SelectItem value="UAE">الإمارات</SelectItem>
          <SelectItem value="Qatar">قطر</SelectItem>
          <SelectItem value="Kuwait">الكويت</SelectItem>
          <SelectItem value="Bahrain">البحرين</SelectItem>
          <SelectItem value="Oman">عُمان</SelectItem>
          <SelectItem value="Jordan">الأردن</SelectItem>
          <SelectItem value="Lebanon">لبنان</SelectItem>
          <SelectItem value="Syria">سوريا</SelectItem>
          <SelectItem value="Iraq">العراق</SelectItem>
          <SelectItem value="Yemen">اليمن</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <hr />

    <!-- Gender -->
    <div class="space-y-2">
      <label class="font-medium">الجنس</label>

      <Select v-model="form.gender" :default-value="form.gender">
        <SelectTrigger class="w-[95%] bg-white">
          <SelectValue placeholder="اختر الجنس" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="male">ذكر</SelectItem>
          <SelectItem value="female">أنثى</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <hr />

    <!-- Date of Birth -->
    <div class="space-y-2">
      <label class="font-medium">تاريخ الميلاد</label>

      <div class="flex gap-3">
        <!-- Day -->
        <Select v-model="form.birthDay" :default-value="form.birthDay">
          <SelectTrigger class="w-28 bg-white">
            <SelectValue placeholder="اليوم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="d in 31" :key="d" :value="String(d)">
              {{ d }}
            </SelectItem>
          </SelectContent>
        </Select>

        <!-- Month -->
        <Select v-model="form.birthMonth" :default-value="form.birthMonth">
          <SelectTrigger class="w-36 bg-white">
            <SelectValue placeholder="الشهر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">يناير</SelectItem>
            <SelectItem value="2">فبراير</SelectItem>
            <SelectItem value="3">مارس</SelectItem>
            <SelectItem value="4">أبريل</SelectItem>
            <SelectItem value="5">مايو</SelectItem>
            <SelectItem value="6">يونيو</SelectItem>
            <SelectItem value="7">يوليو</SelectItem>
            <SelectItem value="8">أغسطس</SelectItem>
            <SelectItem value="9">سبتمبر</SelectItem>
            <SelectItem value="10">أكتوبر</SelectItem>
            <SelectItem value="11">نوفمبر</SelectItem>
            <SelectItem value="12">ديسمبر</SelectItem>
          </SelectContent>
        </Select>

        <!-- Year -->
        <Select v-model="form.birthYear" :default-value="form.birthYear">
          <SelectTrigger class="w-36 bg-white">
            <SelectValue placeholder="السنة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="y in years" :key="y" :value="String(y)">
              {{ y }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <hr />

    <!-- Social links -->
    <div class="space-y-6">
      <h3 class="font-semibold text-lg">روابط:</h3>

      <div class="space-y-2">
        <label class="font-medium">موقع الويب ://https</label>
        <Input v-model="form.website" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">facebook.com</label>
        <Input v-model="form.facebook" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">instagram.com</label>
        <Input v-model="form.instagram" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">linkedin.com</label>
        <Input v-model="form.linkedin" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">x.com</label>
        <Input v-model="form.x" class="w-[95%] bg-white" />
      </div>
    </div>

    <hr />

    <CustomUserEditProfileImageUpload />

    <Button class="mt-6 cursor-pointer" type="submit">حفظ</Button>
  </form>
</template>
