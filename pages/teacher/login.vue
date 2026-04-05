<!-- pages/teacher/login.vue -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useTeacherStore } from '~/stores/teacher';
import { useAuthStore } from '~/stores/auth';
definePageMeta({
  layout: false,
  middleware: ['require-teacher-auth'],
});
const router = useRouter();
const { t } = useI18n();
const auth = useAuthStore();
const teacherStore = useTeacherStore();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const emailError = ref('');
const passwordError = ref('');

const handleLogin = async () => {
  // ... your existing validation code ...

  try {
    const res: any = await $fetch('http://localhost:3001/api/teacher/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    });

    // ✅ FIX: Use the store action to save everything correctly
    // This will save the token and teacher data to LocalStorage automatically
    teacherStore.setTeacher(res.teacher, res.token);

    // Redirect to home
    router.push('/');
  } catch (err: any) {
    // ... your error handling ...
  }
};
</script>

<template>
  <LanguageBanner />

  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="hidden bg-muted lg:block">
      <img src="/assets/images/course.jpg" alt="Image" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
    </div>

    <div class="flex items-center justify-center py-12">
      <Card class="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle class="text-2xl" :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('log-in') }}
          </CardTitle>

          <CardDescription :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('enter-email-password') }}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div class="grid gap-4">
            <!-- Email -->
            <div class="flex flex-col gap-2">
              <Label for="email" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                {{ t('your-email') }}
              </Label>
              <Input id="email" v-model="email" type="email" placeholder="teacher@example.com" />
              <p v-if="emailError" class="text-red-500 text-sm text-right">
                {{ emailError }}
              </p>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <Label for="password" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                {{ t('password') }}
              </Label>
              <Input id="password" v-model="password" type="password" />
              <p v-if="passwordError" class="text-red-500 text-sm text-right">
                {{ passwordError }}
              </p>
            </div>

            <Button class="w-full cursor-pointer" :disabled="loading" @click.prevent="handleLogin">
              <span v-if="loading">{{ t('logging-in') }}</span>
              <span v-else>{{ t('log-in') }}</span>
            </Button>

            <p v-if="error" class="text-red-500 text-sm text-center">
              {{ error }}
            </p>
          </div>

          <div class="mt-4 text-center text-sm">
            {{ t('dont-have-account') }} <a href="/">{{ t('sign-up') }}</a>
            <!-- <span class="text-muted-foreground"> ({{ t('wait-admin-approval') }}) </span> -->
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
