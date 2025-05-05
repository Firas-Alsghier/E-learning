<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUser } from '~/composables/useUser';

const router = useRouter();
const { user } = useUser();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// 👇 Define the expected shape of the response
type LoginResponse = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  };
  token: string;
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const res = await $fetch<LoginResponse>('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    user.value = res.user;
    localStorage.setItem('token', res.token); // optional

    await router.push('/'); // ✅ redirect to home
  } catch (err: any) {
    error.value = err.data?.message || 'حدث خطأ أثناء تسجيل الدخول';
  } finally {
    loading.value = false;
  }
};

definePageMeta({
  layout: false,
});
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <Card class="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle class="text-2xl text-right">تسجيل الدخول</CardTitle>
          <CardDescription class="text-right">أدخل بريدك الإلكتروني في الأسفل لتسجيل الدخول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="flex flex-col gap-2">
              <Label for="email" class="self-end">بريدك الإلكتروني</Label>
              <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center self-end">
                <Label for="password">كلمة السر</Label>
              </div>
              <Input id="password" v-model="password" type="password" required />
            </div>
            <a href="#" class="ml-auto inline-block text-sm text-right underline">نسيت كلمة السر؟</a>
            <Button type="submit" class="w-full cursor-pointer" @click.prevent="handleLogin" :disabled="loading">
              <span v-if="loading">جاري تسجيل الدخول...</span>
              <span v-else>الدخول</span>
            </Button>
            <p class="text-red-500 text-sm mt-2" v-if="error">{{ error }}</p>
            <Button variant="outline" class="w-full cursor-pointer">تسجيل الدخول باستخدام جوجل</Button>
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

<style lang="scss" scoped></style>
