<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useUser } from '~/composables/useUser';

const router = useRouter();
const route = useRoute();
const { setUser } = useUser();

const message = ref('تم التحقق من بريدك الإلكتروني بنجاح ✅');
const countdown = ref(5);

// ✅ Check for token (if backend sends it in URL)
onMounted(() => {
  const token = route.query.token as string | undefined;

  if (token) {
    const cookie = useCookie('token');
    cookie.value = token;
  }

  // ⏱ Auto redirect
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
      router.push('/create');
    }
  }, 1000);
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-muted text-center p-6">
    <Card class="p-6 max-w-md shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle class="text-2xl font-bold text-green-600">🎉 تم التحقق بنجاح</CardTitle>
      </CardHeader>

      <CardContent>
        <p class="text-gray-700 mb-4">{{ message }}</p>
        <p class="text-sm text-gray-500">سيتم تحويلك إلى صفحتك بعد {{ countdown }} ثوانٍ...</p>
        <Button class="mt-4 w-full" @click="router.push('/create')"> الانتقال الآن </Button>
      </CardContent>
    </Card>
  </div>
</template>
