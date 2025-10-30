<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

definePageMeta({
  layout: false,
});

const route = useRoute();
const router = useRouter();
const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const message = ref('');
const error = ref('');

onMounted(() => {
  token.value = (route.query.token as string) || '';
  if (!token.value) {
    error.value = 'رمز التحقق غير موجود. تحقق من الرابط مرة أخرى.';
  }
});

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.';
  if (!/[A-Z]/.test(password)) return 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل.';
  if (!/[a-z]/.test(password)) return 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل.';
  if (!/[0-9]/.test(password)) return 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.';
  if (!/[!@#$%^&*]/.test(password)) return 'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (!@#$%^&*).';
  return null;
};

const handleReset = async () => {
  error.value = '';
  message.value = '';

  if (!token.value) {
    error.value = 'رمز التحقق مفقود.';
    return;
  }

  // ✅ Validation checks
  const passwordError = validatePassword(newPassword.value);
  if (passwordError) {
    error.value = passwordError;
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'كلمتا المرور غير متطابقتين.';
    return;
  }

  loading.value = true;

  try {
    await $fetch('http://localhost:3001/api/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, newPassword: newPassword.value },
    });

    message.value = 'تم تغيير كلمة المرور بنجاح! سيتم تحويلك إلى صفحة تسجيل الدخول...';
    setTimeout(() => router.push('/login'), 4000);
  } catch (err: any) {
    error.value = err.data?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-background">
    <Card class="max-w-md w-full text-center shadow-lg">
      <CardHeader>
        <CardTitle class="text-2xl font-bold mb-2">إعادة تعيين كلمة المرور</CardTitle>
        <CardDescription class="text-gray-600 dark:text-gray-400"> أدخل كلمة مرور جديدة لحسابك. </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <input v-model="newPassword" type="password" placeholder="كلمة المرور الجديدة" class="w-full p-2 border rounded" />
        <input v-model="confirmPassword" type="password" placeholder="تأكيد كلمة المرور" class="w-full p-2 border rounded" />

        <p v-if="message" class="text-green-600 font-medium">{{ message }}</p>
        <p v-if="error" class="text-red-500 font-medium">{{ error }}</p>
      </CardContent>

      <CardFooter>
        <Button class="w-full cursor-pointer" @click="handleReset" :disabled="loading || !token">
          <span v-if="loading">جاري التعيين...</span>
          <span v-else>تعيين كلمة المرور</span>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
