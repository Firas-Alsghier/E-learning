<script setup lang="ts">
import { useUser } from '~/composables/useUser';
definePageMeta({
  layout: false,
  middleware: ['guest-only'],
});

const router = useRouter();
const { setUser } = useUser();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const emailError = ref('');
const passwordError = ref('');

type LoginResponse = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    bio: string;
  };
  token: string;
};

const validateForm = () => {
  emailError.value = '';
  passwordError.value = '';
  let isValid = true;

  // ✅ email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.value = 'البريد الإلكتروني مطلوب';
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'يرجى إدخال بريد إلكتروني صالح';
    isValid = false;
  }

  // ✅ password length check
  if (!password.value) {
    passwordError.value = 'كلمة المرور مطلوبة';
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.value = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return; // stop if invalid

  loading.value = true;
  error.value = '';

  try {
    const res = await $fetch<LoginResponse>('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });

    setUser(res.user);
    const tokenCookie = useCookie('token');
    tokenCookie.value = res.token;
    localStorage.setItem('token', res.token);
    await router.push('/');
  } catch (err: any) {
    error.value = err.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
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
          <CardTitle class="text-2xl text-right">تسجيل الدخول</CardTitle>
          <CardDescription class="text-right"> أدخل بريدك الإلكتروني وكلمة المرور </CardDescription>
        </CardHeader>

        <CardContent>
          <div class="grid gap-4">
            <!-- email -->
            <div class="flex flex-col gap-2">
              <Label for="email" class="self-end">بريدك الإلكتروني</Label>
              <Input id="email" v-model="email" type="email" placeholder="m@example.com" />
              <p v-if="emailError" class="text-red-500 text-sm text-right">{{ emailError }}</p>
            </div>

            <!-- password -->
            <div class="flex flex-col gap-2">
              <Label for="password" class="self-end">كلمة المرور</Label>
              <Input id="password" v-model="password" type="password" />
              <p v-if="passwordError" class="text-red-500 text-sm text-right">{{ passwordError }}</p>
            </div>

            <a href="forgot-password" class="ml-auto inline-block text-sm text-right underline"> نسيت كلمة السر؟ </a>

            <Button class="w-full cursor-pointer" @click.prevent="handleLogin" :disabled="loading">
              <span v-if="loading">جاري تسجيل الدخول...</span>
              <span v-else>الدخول</span>
            </Button>

            <p class="text-red-500 text-sm mt-2" v-if="error">{{ error }}</p>

            <Button variant="outline" class="w-full cursor-pointer"> تسجيل الدخول باستخدام جوجل </Button>
          </div>

          <div class="mt-4 text-center text-sm">
            ليس لديك حساب؟
            <a href="signup" class="underline">التسجيل</a>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="hidden bg-muted lg:block">
      <img src="/assets/images/course.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>
  </div>
</template>
