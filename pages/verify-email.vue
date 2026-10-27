<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-vue-next';

definePageMeta({
  layout: false,
});

const router = useRouter();
const route = useRoute();
const status = ref<'loading' | 'success' | 'error'>('loading');
const message = ref('');
const config = useRuntimeConfig();
onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    status.value = 'error';
    message.value = 'رمز التحقق غير موجود أو الرابط غير صالح.';
    return;
  }

  try {
    const res: any = await $fetch(`${config.public.apiBase}/api/auth/verify-email`, {
      method: 'POST',
      body: { token },
    });

    status.value = 'success';
    message.value = res.message || 'تم تفعيل حسابك بنجاح 🎉 سيتم تحويلك إلى الصفحة الرئيسية...';

    // Redirect after 5 seconds
    setTimeout(() => {
      router.push('/');
    }, 5000);
  } catch (err: any) {
    status.value = 'error';
    message.value = err.data?.message || 'حدث خطأ أثناء التحقق من الحساب.';
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-background">
    <Card class="max-w-md w-full text-center shadow-lg">
      <CardHeader>
        <div class="flex justify-center mb-4">
          <CheckCircle v-if="status === 'success'" class="w-14 h-14 text-green-600" />
          <XCircle v-else-if="status === 'error'" class="w-14 h-14 text-red-600" />
          <svg v-else class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <CardTitle class="text-2xl font-bold mb-2">
          {{ status === 'success' ? 'تم التحقق من البريد الإلكتروني' : status === 'error' ? 'فشل التحقق' : 'جاري التحقق...' }}
        </CardTitle>
        <CardDescription class="text-gray-600 dark:text-gray-400">
          {{ message }}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <img v-if="status === 'success'" src="/assets/svgs/correct-success.svg" alt="Success" class="mx-auto w-64 mb-4" />
        <img v-else-if="status === 'error'" src="/assets/svgs/error.svg" alt="Error" class="mx-auto w-64 mb-4" />
      </CardContent>

      <CardFooter class="flex justify-center">
        <Button v-if="status === 'error'" variant="outline" @click="router.push('/signup')">إعادة المحاولة</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped></style>
