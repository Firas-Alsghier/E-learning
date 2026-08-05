<script setup lang="ts">
import type { Profile } from '@/types/edit-profile';
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';

const auth = useAuthStore();
const { t } = useI18n();

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

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
  } catch (err) {
    console.error('Error fetching profile:', err);
  }
});

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
    location.reload();
  } catch (error) {
    alert('Failed to update profile');
    console.error('Error updating profile:', error);
  }
};
</script>

<template>
  <!--
    🎨 BACKGROUND — change bg-white on the outer form element if needed.
    Example: bg-gray-50 | bg-slate-50 | bg-[#your-color]
  -->
  <form @submit.prevent="saveChanges" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- ── Section: Personal Information ── -->
    <div class="px-6 sm:px-8 py-7 border-b border-gray-100">
      <div class="flex items-center gap-2.5 mb-6" :class="auth.isEnglish ? 'flex-row' : 'flex-row-reverse'">
        <div class="w-1 h-5 rounded-full bg-orange-500 shrink-0"></div>
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">Personal Information</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Last name -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-600" :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('last-name') }}
          </label>
          <input
            v-model="form.lastName"
            type="text"
            class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors"
            :class="auth.isEnglish ? 'text-left' : 'text-right'"
          />
        </div>

        <!-- First name -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-600" :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('first-name') }}
          </label>
          <input
            v-model="form.firstName"
            type="text"
            class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors"
            :class="auth.isEnglish ? 'text-left' : 'text-right'"
          />
        </div>
      </div>
    </div>

    <!-- ── Section: Country ── -->
    <div class="px-6 sm:px-8 py-7 border-b border-gray-100">
      <div class="flex items-center gap-2.5 mb-6" :class="auth.isEnglish ? 'flex-row' : 'flex-row-reverse'">
        <div class="w-1 h-5 rounded-full bg-orange-500 shrink-0"></div>
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">
          {{ t('country') }}
        </h3>
      </div>

      <div class="relative max-w-sm">
        <select
          v-model="form.country"
          class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors cursor-pointer pr-10"
          :class="auth.isEnglish ? 'text-left' : 'text-right'"
        >
          <option value="" disabled>{{ t('choose-country') }}</option>
          <option value="Libya">{{ t('country-libya') }}</option>
          <option value="Egypt">{{ t('country-egypt') }}</option>
          <option value="Morocco">{{ t('country-morocco') }}</option>
          <option value="Tunisia">{{ t('country-tunisia') }}</option>
          <option value="Algeria">{{ t('country-algeria') }}</option>
          <option value="Sudan">{{ t('country-sudan') }}</option>
          <option value="Saudi Arabia">{{ t('country-saudi-arabia') }}</option>
          <option value="UAE">{{ t('country-uae') }}</option>
          <option value="Qatar">{{ t('country-qatar') }}</option>
          <option value="Kuwait">{{ t('country-kuwait') }}</option>
          <option value="Bahrain">{{ t('country-bahrain') }}</option>
          <option value="Oman">{{ t('country-oman') }}</option>
          <option value="Jordan">{{ t('country-jordan') }}</option>
          <option value="Lebanon">{{ t('country-lebanon') }}</option>
          <option value="Syria">{{ t('country-syria') }}</option>
          <option value="Iraq">{{ t('country-iraq') }}</option>
          <option value="Yemen">{{ t('country-yemen') }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- ── Section: Gender ── -->
    <div class="px-6 sm:px-8 py-7 border-b border-gray-100">
      <div class="flex items-center gap-2.5 mb-6" :class="auth.isEnglish ? 'flex-row' : 'flex-row-reverse'">
        <div class="w-1 h-5 rounded-full bg-orange-500 shrink-0"></div>
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">
          {{ t('gender') }}
        </h3>
      </div>

      <!-- Gender toggle pills -->
      <div class="flex gap-3 flex-wrap">
        <label
          class="flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none"
          :class="form.gender === 'male' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'"
        >
          <input type="radio" v-model="form.gender" value="male" class="sr-only" />
          <span class="text-lg">👨</span>
          <span class="text-sm font-semibold">{{ t('male') }}</span>
        </label>

        <label
          class="flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none"
          :class="form.gender === 'female' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'"
        >
          <input type="radio" v-model="form.gender" value="female" class="sr-only" />
          <span class="text-lg">👩</span>
          <span class="text-sm font-semibold">{{ t('female') }}</span>
        </label>
      </div>
    </div>

    <!-- ── Section: Date of Birth ── -->
    <div class="px-6 sm:px-8 py-7 border-b border-gray-100">
      <div class="flex items-center justify-center gap-2.5 mb-6">
        <div class="w-1 h-5 rounded-full bg-orange-500 shrink-0"></div>
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">
          {{ t('date-birth') }}
        </h3>
      </div>

      <div class="flex justify-center gap-3 flex-wrap">
        <!-- Day -->
        <div class="relative">
          <select
            v-model="form.birthDay"
            class="px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors cursor-pointer pr-9 w-28"
          >
            <option value="" disabled>{{ t('day') }}</option>
            <option v-for="d in 31" :key="d" :value="String(d)">{{ d }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Month -->
        <div class="relative">
          <select
            v-model="form.birthMonth"
            class="px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors cursor-pointer pr-9 w-36"
          >
            <option value="" disabled>{{ t('month') }}</option>
            <option value="1">{{ t('month-jan') }}</option>
            <option value="2">{{ t('month-feb') }}</option>
            <option value="3">{{ t('month-mar') }}</option>
            <option value="4">{{ t('month-apr') }}</option>
            <option value="5">{{ t('month-may') }}</option>
            <option value="6">{{ t('month-jun') }}</option>
            <option value="7">{{ t('month-jul') }}</option>
            <option value="8">{{ t('month-aug') }}</option>
            <option value="9">{{ t('month-sep') }}</option>
            <option value="10">{{ t('month-oct') }}</option>
            <option value="11">{{ t('month-nov') }}</option>
            <option value="12">{{ t('month-dec') }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Year -->
        <div class="relative">
          <select
            v-model="form.birthYear"
            class="px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors cursor-pointer pr-9 w-36"
          >
            <option value="" disabled>{{ t('year') }}</option>
            <option v-for="y in years" :key="y" :value="String(y)">{{ y }}</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Section: Social Links ── -->
    <div class="px-6 sm:px-8 py-7 border-b border-gray-100">
      <div class="flex items-center gap-2.5 mb-6" :class="auth.isEnglish ? 'flex-row' : 'flex-row-reverse'">
        <div class="w-1 h-5 rounded-full bg-orange-500 shrink-0"></div>
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">
          {{ t('links') }}
        </h3>
      </div>

      <div class="flex flex-col gap-4">
        <!-- Website -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide"> 🌐 Website </label>
          <div class="flex items-stretch rounded-xl overflow-hidden border border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
            <div class="flex items-center px-3.5 bg-gray-50 border-r border-gray-200 shrink-0">
              <span class="text-xs font-semibold text-gray-400 whitespace-nowrap">https://</span>
            </div>
            <input v-model="form.website" type="text" placeholder="yourwebsite.com" class="flex-1 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none" />
          </div>
        </div>

        <!-- Facebook -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide"> 📘 Facebook </label>
          <div class="flex items-stretch rounded-xl overflow-hidden border border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
            <div class="flex items-center px-3.5 bg-gray-50 border-r border-gray-200 shrink-0">
              <span class="text-xs font-semibold text-gray-400 whitespace-nowrap">facebook.com/</span>
            </div>
            <input v-model="form.facebook" type="text" placeholder="username" class="flex-1 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none" />
          </div>
        </div>

        <!-- Instagram -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide"> 📸 Instagram </label>
          <div class="flex items-stretch rounded-xl overflow-hidden border border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
            <div class="flex items-center px-3.5 bg-gray-50 border-r border-gray-200 shrink-0">
              <span class="text-xs font-semibold text-gray-400 whitespace-nowrap">instagram.com/</span>
            </div>
            <input v-model="form.instagram" type="text" placeholder="username" class="flex-1 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none" />
          </div>
        </div>

        <!-- LinkedIn -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide"> 💼 LinkedIn </label>
          <div class="flex items-stretch rounded-xl overflow-hidden border border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
            <div class="flex items-center px-3.5 bg-gray-50 border-r border-gray-200 shrink-0">
              <span class="text-xs font-semibold text-gray-400 whitespace-nowrap">linkedin.com/in/</span>
            </div>
            <input v-model="form.linkedin" type="text" placeholder="username" class="flex-1 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none" />
          </div>
        </div>

        <!-- X (Twitter) -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-gray-500 uppercase tracking-wide"> 𝕏 X (Twitter) </label>
          <div class="flex items-stretch rounded-xl overflow-hidden border border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/20 transition-all">
            <div class="flex items-center px-3.5 bg-gray-50 border-r border-gray-200 shrink-0">
              <span class="text-xs font-semibold text-gray-400 whitespace-nowrap">x.com/</span>
            </div>
            <input v-model="form.x" type="text" placeholder="username" class="flex-1 px-4 py-3 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none" />
          </div>
        </div>
      </div>
    </div>

    <!-- <CustomUserEditProfileImageUpload /> -->

    <!-- ── Footer: Save button ── -->
    <div class="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
      <p class="text-xs text-gray-400">All fields are optional except your name.</p>
      <button
        type="submit"
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_20px_rgba(255,120,45,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        <!-- Save icon -->
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ t('save-btn') }}
      </button>
    </div>
  </form>
</template>
