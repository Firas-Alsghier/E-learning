<script setup lang="ts">
import { useRouter } from 'vue-router';
definePageMeta({
  layout: false,
  middleware: ['guest-only'],
});

const router = useRouter();
const email = ref('');
const loading = ref(false);
const success = ref('');
const error = ref('');
const emailError = ref('');
const config = useRuntimeConfig();
// ✅ Email validation function
const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// 🧠 Watch for live correction
watch(email, (val) => {
  if (!val) emailError.value = '';
  else if (!validateEmail(val)) emailError.value = 'بريد إلكتروني غير صالح';
  else emailError.value = '';
});

// 📩 Send reset link
const handleForgotPassword = async () => {
  success.value = '';
  error.value = '';

  // 1️⃣ Check before sending request
  if (!email.value) {
    emailError.value = 'الرجاء إدخال البريد الإلكتروني';
    return;
  }

  if (!validateEmail(email.value)) {
    emailError.value = 'بريد إلكتروني غير صالح';
    return;
  }

  emailError.value = '';
  loading.value = true;

  try {
    await $fetch(`${config.public.apiBase}/api/auth/forgot-password`, {
      method: 'POST',
      body: { email: email.value },
    });
    success.value = '✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.';
  } catch (err: any) {
    error.value = err.data?.message || '❌ حدث خطأ أثناء إرسال الرابط. حاول مرة أخرى.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <Card class="w-full max-w-md p-6">
      <CardHeader>
        <CardTitle class="text-2xl text-center mb-2">نسيت كلمة المرور</CardTitle>
        <CardDescription class="text-center">أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور</CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleForgotPassword" class="grid gap-4">
          <div>
            <Label for="email" class="text-right block mb-1">البريد الإلكتروني</Label>
            <Input id="email" v-model="email" type="email" placeholder="you@example.com" class="text-right" />
            <p v-if="emailError" class="text-red-500 text-sm mt-1 text-right">{{ emailError }}</p>
          </div>

          <Button type="submit" class="w-full cursor-pointer" :disabled="loading">
            <span v-if="loading">...جاري الإرسال</span>
            <span v-else>إرسال الرابط</span>
          </Button>

          <p v-if="success" class="text-green-600 text-sm mt-2 text-right">{{ success }}</p>
          <p v-if="error" class="text-red-500 text-sm mt-2 text-right">{{ error }}</p>

          <div class="text-center mt-4">
            <NuxtLink to="/login" class="text-sm underline">العودة إلى تسجيل الدخول</NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
