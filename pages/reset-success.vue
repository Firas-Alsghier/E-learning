<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CheckCircle2 } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push('/login');
  }, 5000); // redirect after 5 seconds
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-background">
    <Card class="max-w-md w-full text-center p-6 shadow-md">
      <CardHeader>
        <div class="flex justify-center mb-4">
          <CheckCircle2 class="w-16 h-16 text-green-500" />
        </div>
        <CardTitle class="text-2xl font-bold mb-2">تم تغيير كلمة المرور بنجاح</CardTitle>
        <CardDescription>سيتم تحويلك تلقائيًا إلى صفحة تسجيل الدخول خلال 5 ثوانٍ...</CardDescription>
      </CardHeader>

      <CardContent>
        <p class="text-sm text-gray-500">إذا لم يتم تحويلك تلقائيًا، <a href="/login" class="text-blue-600 underline">اضغط هنا</a>.</p>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped></style>
