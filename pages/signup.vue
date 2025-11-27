<script setup lang="ts">
import { useUser } from '~/composables/useUser';

definePageMeta({
  layout: false,
  middleware: ['guest-only'],
});

const router = useRouter();
const { setUser } = useUser();

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
    await $fetch('http://localhost:3001/api/auth/signup', {
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

    await router.push({
      path: '/check-email',
      query: { email: email.value },
    });
  } catch (err: any) {
    error.value = err.data?.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <Card class="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle class="text-xl text-right">التسجيل</CardTitle>
          <CardDescription class="text-right"> أدخل معلوماتك لإنشاء حساب </CardDescription>
        </CardHeader>

        <CardContent>
          <div class="grid gap-4">
            <!-- Name fields -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <Label for="last-name" class="self-end">اللقب</Label>
                <Input id="last-name" class="text-right" placeholder="علي" v-model="lastName" />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="first-name" class="self-end">اسمك</Label>
                <Input id="first-name" class="text-right" placeholder="محمد" v-model="firstName" />
              </div>
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1">
              <Label for="email" class="self-end">بريدك الإلكتروني</Label>
              <Input id="email" type="email" class="text-right" placeholder="m@example.com" v-model="email" />
              <p v-if="emailError" class="text-red-500 text-sm text-right">
                {{ emailError }}
              </p>
            </div>

            <!-- Country -->
            <div class="flex flex-col gap-1">
              <Label for="country" class="self-end">الدولة</Label>
              <select id="country" v-model="country" class="text-right border rounded-md h-10 px-3 bg-white">
                <option value="" disabled>اختر دولتك</option>
                <option v-for="c in countries" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>

            <!-- Gender -->
            <div class="flex flex-col gap-1">
              <Label class="self-end">الجنس</Label>
              <Select v-model="gender">
                <SelectTrigger class="bg-white">
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Birthdate -->
            <div class="flex flex-col gap-2">
              <label class="self-end">تاريخ الميلاد</label>

              <div class="grid grid-cols-3 gap-4">
                <!-- Day -->
                <Select v-model="birthDay">
                  <SelectTrigger class="bg-white">
                    <SelectValue placeholder="اليوم" />
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
                <Select v-model="birthYear">
                  <SelectTrigger class="bg-white">
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

            <!-- Password -->
            <div class="flex flex-col gap-1">
              <Label for="password" class="self-end">كلمة السر</Label>
              <Input id="password" type="password" v-model="password" />
              <p v-if="passwordError" class="text-red-500 text-sm text-right">
                {{ passwordError }}
              </p>
            </div>

            <!-- Confirm password -->
            <div class="flex flex-col gap-1">
              <Label for="confirm-password" class="self-end">اعد كتابة كلمة السر</Label>
              <Input id="confirm-password" type="password" v-model="confirmPassword" />
              <p v-if="confirmError" class="text-red-500 text-sm text-right">
                {{ confirmError }}
              </p>
            </div>

            <!-- Submit -->
            <Button type="submit" class="w-full cursor-pointer" @click.prevent="handleSubmit" :disabled="loading">
              <span v-if="loading">جاري التسجيل...</span>
              <span v-else>إنشاء حساب</span>
            </Button>

            <p class="text-red-500 text-sm mt-2 text-right" v-if="error">
              {{ error }}
            </p>
          </div>

          <div class="mt-4 text-center text-sm">
            لديك حساب بالفعل؟
            <a href="login" class="underline">تسجيل الدخول</a>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Right Image -->
    <div class="hidden bg-muted lg:block">
      <img src="/assets/images/course-new.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>
  </div>
</template>
