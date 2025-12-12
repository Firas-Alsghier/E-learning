<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';

import { useUser } from '~/composables/useUser';
const { setUser } = useUser();
const router = useRouter();
const { t } = useI18n(); // 💡 Destructured locale to check current language

const auth = useAuthStore();
const token = localStorage.getItem('token');

// --- Email state
const email = ref(auth.user?.email);
const newEmail = ref('');
const passwordForEmail = ref('');

// --- Password state
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// --- Change Email ---
const changeEmail = async () => {
  if (!newEmail.value || !passwordForEmail.value) {
    alert('الرجاء إدخال البريد وكلمة المرور');
    return;
  }

  try {
    await $fetch('http://localhost:3001/api/auth/change-email', {
      method: 'PUT',
      body: {
        newEmail: newEmail.value,
        password: passwordForEmail.value,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    email.value = newEmail.value;
    alert('تم تحديث البريد الإلكتروني ✅');
    localStorage.removeItem('token');
    setUser(null); // ✅ This is enough
    router.push('/');
    setTimeout(() => {
      location.reload();
    }, 100);
  } catch (err) {
    console.error(err);
    alert('فشل تحديث البريد');
  }
};

// --- Change Password ---
const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('الرجاء إدخال جميع الحقول');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('كلمة المرور الجديدة غير متطابقة');
    return;
  }

  try {
    await $fetch('http://localhost:3001/api/auth/edit-account', {
      method: 'PUT',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    alert('تم تحديث كلمة المرور ✅');
    localStorage.removeItem('token');
    setUser(null); // ✅ This is enough
    router.push('/');
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    setTimeout(() => {
      location.reload();
    }, 100);
  } catch (err) {
    console.error(err);
    alert('فشل تحديث كلمة المرور');
  }
};
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-8 rounded-lg" @submit.prevent="changePassword">
    <!-- Email -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2 text-right">
        <label class="font-medium" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('your-email-password') }}:</label>
        <div class="flex gap-2">
          <!-- Dialog for editing email -->
          <AlertDialog>
            <AlertDialogTrigger class="bg-[#171717] text-white py-2 px-4 rounded-lg text-sm cursor-pointer"> {{ t('edit-btn') }} </AlertDialogTrigger>
            <AlertDialogContent class="flex flex-col w-full">
              <AlertDialogHeader>
                <AlertDialogTitle class="text-right">{{ t('change-email-title') }}</AlertDialogTitle>
                <AlertDialogDescription class="text-right">{{ t('change-email-desc') }}</AlertDialogDescription>
              </AlertDialogHeader>

              <div class="space-y-2">
                <label class="font-medium w-full text-right inline-block">{{ t('new-email') }}</label>
                <Input v-model="newEmail" class="bg-white" />
              </div>

              <div class="space-y-2">
                <label class="font-medium w-full text-right inline-block">{{ t('password') }}</label>
                <Input v-model="passwordForEmail" type="password" class="bg-white" />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel class="cursor-pointer">{{ t('cancel') }}</AlertDialogCancel>
                <AlertDialogAction class="cursor-pointer" @click.prevent="changeEmail">{{ t('confirm') }}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <!-- Current email display -->
          <Input v-model="email" class="bg-white" readonly />
        </div>
      </div>
    </div>

    <hr />

    <!-- Change Password -->
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="font-medium" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('current-password') }}</label>
        <Input v-model="currentPassword" type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('new-password') }}</label>
        <Input v-model="newPassword" type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('confirm-new-password') }}</label>
        <Input v-model="confirmPassword" type="password" class="w-[95%] bg-white" />
      </div>
    </div>

    <!-- Save button -->
    <Button type="submit" class="mt-6 cursor-pointer">{{ t('save-btn') }}</Button>
  </form>
</template>
