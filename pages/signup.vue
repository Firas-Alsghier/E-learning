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
const loading = ref(false);

interface SignupResponse {
  message: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
  token: string;
}

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'كلمتا السر غير متطابقتين';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const res = await $fetch<SignupResponse>('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      body: {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      },
    });

    // ✅ Save token to cookie (important for auth middleware)
    const token = useCookie('token');
    token.value = res.token;
    // ✅ Save user to store
    setUser(res.user);

    await router.push('/create');
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
                <Input id="last-name" class="text-right" placeholder="علي" required v-model="lastName" />
              </div>
              <div class="flex flex-col gap-2">
                <Label for="first-name" class="self-end">اسمك</Label>
                <Input id="first-name" class="text-right" placeholder="محمد" required v-model="firstName" />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <Label for="email" class="self-end">بريدك الإلكتروني</Label>
              <Input id="email" type="email" class="text-right" placeholder="m@example.com" required v-model="email" />
            </div>

            <div class="flex flex-col gap-2">
              <Label for="password" class="self-end">كلمة السر</Label>
              <Input id="password" type="password" v-model="password" />
            </div>

            <div class="flex flex-col gap-2">
              <Label for="confirm-password" class="self-end">اعد كتابة كلمة السر</Label>
              <Input id="confirm-password" type="password" v-model="confirmPassword" />
            </div>

            <Button type="submit" class="w-full cursor-pointer" @click.prevent="handleSubmit" :disabled="loading">
              <span v-if="loading">جاري التسجيل...</span>
              <span v-else>إنشاء حساب</span>
            </Button>

            <p class="text-red-500 text-sm mt-2" v-if="error">{{ error }}</p>

            <Button variant="outline" class="w-full cursor-pointer"> تسجيل الدخول باستخدام جوجل </Button>
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

<style lang="scss" scoped></style>
