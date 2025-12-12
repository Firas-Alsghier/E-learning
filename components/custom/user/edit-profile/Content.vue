<script setup lang="ts">
import type { Profile } from '@/types/edit-profile';
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';

// 1. Define the specific language type for type safety

const auth = useAuthStore();
const { t } = useI18n(); // 💡 Destructured locale to check current language

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

// --------------------------------------
// 3) Form State (Updated with LanguageCode)
// --------------------------------------
const form = ref({
  firstName: '',
  lastName: '',
  headline: '',
  bio: '',
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

    // Type casting the fetched language

    form.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      headline: user.headline || '',
      bio: user.bio || '',
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

    // Ensure the Pinia flag reflects the fetched language for template rendering

    console.log(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
});

// --------------------------------------
// 5) Save Changes (UPDATED for Global Language Switch)
// --------------------------------------
const saveChanges = async () => {
  let token = useCookie('token').value;
  if (!token && import.meta.client) token = localStorage.getItem('token');
  if (!token) return alert('You are not logged in.');

  // Get the potentially new language from the form

  try {
    const response = await $fetch('http://localhost:3001/api/auth/edit-profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: form.value,
    });

    // Update the local user state in the store
    auth.user = { ...auth.user, ...form.value };

    alert('Profile updated successfully');
    console.log('Response:', response);
  } catch (error) {
    alert('Failed to update profile');
    console.error('Error updating profile:', error);
  }
};
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-8 rounded-lg" @submit.prevent="saveChanges">
    <div class="grid grid-cols-1 text-right md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <label class="font-medium">{{ t('last-name') }}</label>
        </div>
        <Input v-model="form.lastName" class="w-[95%] bg-white" :class="auth.isEnglish ? 'text-left' : 'text-right'" />
      </div>
      <div class="space-y-2">
        <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <label class="font-medium">{{ t('first-name') }}</label>
        </div>
        <Input v-model="form.firstName" class="w-[95%] bg-white" :class="auth.isEnglish ? 'text-left' : 'text-right'" />
      </div>
    </div>

    <hr />

    <div class="space-y-2">
      <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        <label class="font-medium">{{ t('headline') }}</label>
      </div>
      <Input v-model="form.headline" class="w-[95%] bg-white" :class="auth.isEnglish ? 'text-left' : 'text-right'" />
    </div>

    <hr />

    <div class="space-y-2">
      <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        <label class="font-medium">{{ t('cv-label') }}</label>
      </div>
      <Textarea v-model="form.bio" class="w-[95%] bg-white" :class="auth.isEnglish ? 'text-left' : 'text-right'" />
    </div>

    <hr />

    <div class="space-y-2">
      <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        <label class="font-medium">{{ t('country') }}</label>
      </div>
      <Select v-model="form.country" :default-value="form.country">
        <SelectTrigger class="w-[95%] bg-white">
          <SelectValue :placeholder="t('choose-country')" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="Libya">{{ t('country-libya') }}</SelectItem>
          <SelectItem value="Egypt">{{ t('country-egypt') }}</SelectItem>
          <SelectItem value="Morocco">{{ t('country-morocco') }}</SelectItem>
          <SelectItem value="Tunisia">{{ t('country-tunisia') }}</SelectItem>
          <SelectItem value="Algeria">{{ t('country-algeria') }}</SelectItem>
          <SelectItem value="Sudan">{{ t('country-sudan') }}</SelectItem>
          <SelectItem value="Saudi Arabia">{{ t('country-saudi-arabia') }}</SelectItem>
          <SelectItem value="UAE">{{ t('country-uae') }}</SelectItem>
          <SelectItem value="Qatar">{{ t('country-qatar') }}</SelectItem>
          <SelectItem value="Kuwait">{{ t('country-kuwait') }}</SelectItem>
          <SelectItem value="Bahrain">{{ t('country-bahrain') }}</SelectItem>
          <SelectItem value="Oman">{{ t('country-oman') }}</SelectItem>
          <SelectItem value="Jordan">{{ t('country-jordan') }}</SelectItem>
          <SelectItem value="Lebanon">{{ t('country-lebanon') }}</SelectItem>
          <SelectItem value="Syria">{{ t('country-syria') }}</SelectItem>
          <SelectItem value="Iraq">{{ t('country-iraq') }}</SelectItem>
          <SelectItem value="Yemen">{{ t('country-yemen') }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <hr />

    <div class="space-y-2">
      <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        <label class="font-medium">{{ t('gender') }}</label>
      </div>
      <Select v-model="form.gender" :default-value="form.gender">
        <SelectTrigger class="w-[95%] bg-white">
          <SelectValue :placeholder="t('choose-gender')" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="male">{{ t('male') }}</SelectItem>
          <SelectItem value="female">{{ t('female') }}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <hr />

    <div class="space-y-2">
      <div class="w-[100%] text-center">
        <label class="font-medium">{{ t('date-birth') }}</label>
      </div>
      <div class="flex justify-center gap-3">
        <Select v-model="form.birthDay" :default-value="form.birthDay">
          <SelectTrigger class="w-28 bg-white">
            <SelectValue :placeholder="t('day')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="d in 31" :key="d" :value="String(d)">
              {{ d }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="form.birthMonth" :default-value="form.birthMonth">
          <SelectTrigger class="w-36 bg-white">
            <SelectValue :placeholder="t('month')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{{ t('month-jan') }}</SelectItem>
            <SelectItem value="2">{{ t('month-feb') }}</SelectItem>
            <SelectItem value="3">{{ t('month-mar') }}</SelectItem>
            <SelectItem value="4">{{ t('month-apr') }}</SelectItem>
            <SelectItem value="5">{{ t('month-may') }}</SelectItem>
            <SelectItem value="6">{{ t('month-jun') }}</SelectItem>
            <SelectItem value="7">{{ t('month-jul') }}</SelectItem>
            <SelectItem value="8">{{ t('month-aug') }}</SelectItem>
            <SelectItem value="9">{{ t('month-sep') }}</SelectItem>
            <SelectItem value="10">{{ t('month-oct') }}</SelectItem>
            <SelectItem value="11">{{ t('month-nov') }}</SelectItem>
            <SelectItem value="12">{{ t('month-dec') }}</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="form.birthYear" :default-value="form.birthYear">
          <SelectTrigger class="w-36 bg-white">
            <SelectValue :placeholder="t('year')" />
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

    <div class="space-y-6">
      <h3 class="font-semibold text-lg" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('links') }}</h3>

      <div class="space-y-2">
        <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <label class="font-medium text-left">//:https</label>
        </div>
        <Input v-model="form.website" class="w-[95%] bg-white text-left" />
      </div>

      <div class="space-y-2">
        <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <label class="font-medium text-left">facebook.com</label>
        </div>
        <Input v-model="form.facebook" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <label class="font-medium text-left">instagram.com</label>
        </div>
        <Input v-model="form.instagram" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <label class="font-medium text-left">linkedin.com</label>
        </div>
        <Input v-model="form.linkedin" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <div class="w-[95%]" :class="auth.isEnglish ? 'text-left' : 'text-right'">
          <label class="font-medium text-left">x.com</label>
        </div>
        <Input v-model="form.x" class="w-[95%] bg-white" />
      </div>
    </div>

    <hr />

    <CustomUserEditProfileImageUpload />

    <Button class="mt-6 cursor-pointer" type="submit">{{ t('save-btn') }}</Button>
  </form>
</template>
