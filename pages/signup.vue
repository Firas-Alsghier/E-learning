<script setup lang="ts">
import { useUser } from '~/composables/useUser';
definePageMeta({
  layout: false,
  middleware: ['guest-only'],
});

const router = useRouter();
const { setUser } = useUser();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const error = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmError = ref('');
const loading = ref(false);

// ✅ Email validation
const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// ✅ Password validation (min 8 chars + at least 1 number + 1 letter)
const validatePassword = (value: string) => value.length >= 8 && /\d/.test(value) && /[A-Za-z]/.test(value);

// 🧠 Watch for live validation feedback
watch(email, (val) => {
  if (val && !validateEmail(val)) emailError.value = 'بريد إلكتروني غير صالح';
  else emailError.value = '';
});

watch(password, (val) => {
  if (val && !validatePassword(val)) passwordError.value = 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وتشمل أرقامًا وحروفًا';
  else passwordError.value = '';
});

watch(confirmPassword, (val) => {
  if (val && val !== password.value) confirmError.value = 'كلمتا السر غير متطابقتين';
  else confirmError.value = '';
});

// 📨 Submit handler
const handleSubmit = async () => {
  // 1️⃣ Basic checks before API call
  if (!firstName.value || !lastName.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'يرجى ملء جميع الحقول';
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
      },
    });

    await router.push({
      path: '/check-email',
      query: { email: email.value },
    });
  } catch (err: any) {
    error.value = err.data?.message || 'حدث خطأ ما';
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
          <CardDescription class="text-right">أدخل معلوماتك لإنشاء حساب</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
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

            <div class="flex flex-col gap-1">
              <Label for="email" class="self-end">بريدك الإلكتروني</Label>
              <Input id="email" type="email" class="text-right" placeholder="m@example.com" v-model="email" />
              <p v-if="emailError" class="text-red-500 text-sm text-right">{{ emailError }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <Label for="password" class="self-end">كلمة السر</Label>
              <Input id="password" type="password" v-model="password" />
              <p v-if="passwordError" class="text-red-500 text-sm text-right">{{ passwordError }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <Label for="confirm-password" class="self-end">اعد كتابة كلمة السر</Label>
              <Input id="confirm-password" type="password" v-model="confirmPassword" />
              <p v-if="confirmError" class="text-red-500 text-sm text-right">{{ confirmError }}</p>
            </div>

            <Button type="submit" class="w-full cursor-pointer" @click.prevent="handleSubmit" :disabled="loading">
              <span v-if="loading">جاري التسجيل...</span>
              <span v-else>إنشاء حساب</span>
            </Button>

            <p class="text-red-500 text-sm mt-2 text-right" v-if="error">{{ error }}</p>

            <Button variant="outline" class="w-full cursor-pointer">تسجيل الدخول باستخدام جوجل</Button>
          </div>

          <div class="mt-4 text-center text-sm">
            لديك حساب بالفعل؟
            <a href="login" class="underline">تسجيل الدخول</a>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="hidden bg-muted lg:block">
      <img src="/assets/images/course-new.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>
  </div>
</template>
