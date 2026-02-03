<script setup lang="ts">
import { useUser } from '~/composables/useUser';
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
definePageMeta({
  layout: false,
  middleware: ['guest-only'],
});

const router = useRouter();
const { setUser } = useUser();
const { t } = useI18n();
const auth = useAuthStore();

// ------------------------------
// Form fields
// ------------------------------
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const country = ref('');

const password = ref('');
const confirmPassword = ref('');

// Birth date fields
const birthDay = ref('');
const birthMonth = ref('');
const birthYear = ref('');

// Gender field
const gender = ref('');

// ------------------------------
// Validation states
// ------------------------------
const error = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmError = ref('');
const loading = ref(false);

// ------------------------------
// Countries list
// ------------------------------
const countries = [
  'Libya',
  'Tunisia',
  'Algeria',
  'Morocco',
  'Egypt',
  'Sudan',
  'Palestine',
  'Jordan',
  'Lebanon',
  'Syria',
  'Iraq',
  'Kuwait',
  'Qatar',
  'Bahrain',
  'Saudi Arabia',
  'UAE',
  'Oman',
  'Yemen',
  'Mauritania',
  'Somalia',
  'Djibouti',
  'USA',
  'UK',
  'France',
  'Italy',
  'Spain',
  'Germany',
  'Turkey',
  'India',
  'Pakistan',
  'Indonesia',
  'Malaysia',
  'Japan',
  'South Korea',
  'China',
  'Brazil',
  'Canada',
  'Argentina',
  'Australia',
  'Sweden',
  'Norway',
  'Netherlands',
  'Switzerland',
  'Denmark',
  'Russia',
];

// ------------------------------
// Generate years list
// ------------------------------
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

// ------------------------------
// Validators
// ------------------------------
const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePassword = (value: string) => value.length >= 8 && /\d/.test(value) && /[A-Za-z]/.test(value);

// Live watchers
watch(email, (val) => {
  emailError.value = val && !validateEmail(val) ? 'Invalid email' : '';
});

watch(password, (val) => {
  passwordError.value = val && !validatePassword(val) ? 'Password must be at least 8 characters and contain letters + numbers' : '';
});

watch(confirmPassword, (val) => {
  confirmError.value = val && val !== password.value ? 'Passwords do not match' : '';
});

// ------------------------------
// Submit handler
// ------------------------------
const handleSubmit = async () => {
  // Required fields check
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value || !birthDay.value || !birthMonth.value || !birthYear.value || !country.value || !gender.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (emailError.value || passwordError.value || confirmError.value) return;

  loading.value = true;
  error.value = '';

  try {
    await $fetch('http://localhost:3001/api/teacher/signup', {
      method: 'POST',
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        country: country.value,
        gender: gender.value,
        birthDate: {
          day: birthDay.value,
          month: birthMonth.value,
          year: birthYear.value,
        },
      },
    });

    sessionStorage.setItem('teacher_signup_success', 'true');
    await router.push('/teacher/signup-success');
  } catch (err: any) {
    error.value = err.data?.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};
// :class="auth.isEnglish ? 'text-left' : 'text-right'"
</script>

<template>
  <LanguageBanner />

  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="hidden bg-muted lg:block">
      <img src="/assets/images/course-new.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>
    <div class="flex items-center justify-center py-12">
      <Card class="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle class="text-xl text-right" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('sign-up') }}</CardTitle>
          <CardDescription class="text-right" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('enter-account-info') }}</CardDescription>
        </CardHeader>

        <CardContent>
          <div class="grid gap-4">
            <!-- Name fields -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <Label for="last-name" class="self-end">{{ t('last-name') }}</Label>
                <Input id="last-name" :class="auth.isEnglish ? 'text-left' : 'text-right'" :placeholder="t('fake-last-name')" v-model="lastName" />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="first-name" class="self-end">{{ t('first-name') }}</Label>
                <Input id="first-name" :class="auth.isEnglish ? 'text-left' : 'text-right'" :placeholder="t('fake-first-name')" v-model="firstName" />
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
              <Label for="email" class="self-end">{{ t('your-email') }}</Label>
              <Input id="email" type="email" :class="auth.isEnglish ? 'text-left' : 'text-right'" placeholder="m@example.com" v-model="email" />
              <p v-if="emailError" class="text-red-500 text-sm text-right">
                {{ emailError }}
              </p>
            </div>

            <!-- Country (ShadCN Select) -->
            <div class="flex flex-col gap-1 items-end">
              <Label class="self-end">{{ t('country') }}</Label>
              <Select v-model="country" class="self-end">
                <SelectTrigger class="bg-white w-full">
                  <SelectValue :placeholder="t('choose-country')" />
                </SelectTrigger>

                <SelectContent class="text-left">
                  <SelectItem v-for="c in countries" :key="c" :value="c">
                    {{ c }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Gender -->
            <div class="flex flex-col gap-1 items-end">
              <Label class="self-end">{{ t('gender') }}</Label>

              <Select v-model="gender">
                <SelectTrigger class="bg-white w-full">
                  <SelectValue :placeholder="t('choose-gender')" />
                </SelectTrigger>

                <SelectContent class="text-right">
                  <SelectItem value="male">{{ t('male') }}</SelectItem>
                  <SelectItem value="female">{{ t('female') }}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Birthdate -->
            <div class="flex flex-col gap-2">
              <label :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('date-birth') }}</label>

              <div class="grid grid-cols-3 gap-4">
                <!-- Day -->
                <Select v-model="birthDay">
                  <SelectTrigger class="bg-white">
                    <SelectValue :placeholder="t('day')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="d in 31" :key="d" :value="String(d)">
                      {{ d }}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <!-- Month -->
                <Select v-model="birthMonth">
                  <SelectTrigger class="bg-white">
                    <SelectValue :placeholder="t('month')" />
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
                <Select v-model="birthYear">
                  <SelectTrigger class="bg-white">
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

            <!-- Password -->
            <div class="flex flex-col gap-1">
              <Label for="password" class="self-end">{{ t('password') }}</Label>
              <Input id="password" type="password" v-model="password" />
              <p v-if="passwordError" class="text-red-500 text-sm text-right">
                {{ passwordError }}
              </p>
            </div>

            <!-- Confirm password -->
            <div class="flex flex-col gap-1">
              <Label for="confirm-password" class="self-end">{{ t('conform-password') }}</Label>
              <Input id="confirm-password" type="password" v-model="confirmPassword" />
              <p v-if="confirmError" class="text-red-500 text-sm text-right">
                {{ confirmError }}
              </p>
            </div>

            <!-- Submit -->
            <Button type="submit" class="w-full cursor-pointer" @click.prevent="handleSubmit" :disabled="loading">
              <span v-if="loading">جاري التسجيل...</span>
              <span v-else>{{ t('create-account') }}</span>
            </Button>

            <p class="text-red-500 text-sm mt-2 text-right" v-if="error">
              {{ error }}
            </p>
          </div>

          <div class="mt-4 text-center text-sm">
            {{ t('have-account') }}
            <a href="login" class="underline">{{ t('log-in') }}</a>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
