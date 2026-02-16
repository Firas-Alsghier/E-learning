<!-- pages/admin/login.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: false,
});

const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
onMounted(() => {
  if (localStorage.getItem('admin_token')) {
    navigateTo('/admin');
  }
});
const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const res = await $fetch('http://localhost:3001/api/admin/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // ✅ save admin token
    localStorage.setItem('admin_token', res.token);
    localStorage.setItem('admin', JSON.stringify(res.admin));

    // ✅ go to admin dashboard
    router.push('/admin');
  } catch (err) {
    error.value = err?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Admin Login</CardTitle>
        <CardDescription class="text-center"> Authorized access only </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <div>
          <Label>Email</Label>
          <Input v-model="email" type="email" placeholder="admin@example.com" />
        </div>

        <div>
          <Label>Password</Label>
          <Input v-model="password" type="password" />
        </div>

        <Button class="w-full" :disabled="loading" @click="handleLogin">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </Button>

        <p v-if="error" class="text-sm text-red-500 text-center">
          {{ error }}
        </p>
      </CardContent>
    </Card>
  </div>
</template>
