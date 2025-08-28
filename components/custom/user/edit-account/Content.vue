<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from '#app';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const router = useRouter();

const currentEmail = ref('ferasalarape10@gmail.com');

// Email change dialog fields
const newEmail = ref('');
const emailPassword = ref('');

// Password change fields
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');

const getToken = () => useCookie('token').value || (process.client ? localStorage.getItem('token') : '');

const saveToken = (token: string) => {
  const tokenCookie = useCookie('token');
  tokenCookie.value = token;
  if (process.client) localStorage.setItem('token', token);
};

const clearToken = () => {
  const tokenCookie = useCookie('token');
  tokenCookie.value = null;
  if (process.client) localStorage.removeItem('token');
};

const logoutAndRedirect = async () => {
  clearToken();
  await router.push('/login');
};

// Change Email
const changeEmail = async () => {
  const token = getToken();
  if (!token) return alert('You are not logged in');

  try {
    const res: any = await $fetch('/api/user/edit-account', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        newEmail: newEmail.value,
        currentPassword: emailPassword.value,
      },
    });

    if (res.token) {
      saveToken(res.token); // ✅ refresh JWT
    }

    if (res.user?.email) {
      currentEmail.value = res.user.email; // ✅ update UI
    }

    alert('تم تحديث البريد الإلكتروني بنجاح');
  } catch (err: any) {
    alert(err?.data?.statusMessage || err?.message || 'Error changing email');
  }
};

// Change Password
const changePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    return alert('Passwords do not match');
  }

  const token = getToken();
  if (!token) return alert('You are not logged in');

  try {
    const res: any = await $fetch('/api/user/edit-account', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
    });

    if (res.token) {
      saveToken(res.token); // ✅ refresh JWT
    }

    alert('تم تحديث كلمة المرور بنجاح');
  } catch (err: any) {
    alert(err?.data?.statusMessage || err?.message || 'Error changing password');
  }
};
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-8 rounded-lg" @submit.prevent="changePassword">
    <!-- Email -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2 text-right">
        <label class="font-medium">بريدك الإلكتروني:</label>
        <div class="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger class="bg-[#171717] text-white py-2 px-4 rounded-lg text-sm cursor-pointer">تعديل</AlertDialogTrigger>
            <AlertDialogContent class="flex flex-col w-full">
              <AlertDialogHeader>
                <AlertDialogTitle class="text-right">تغيير بريدك الإلكتروني</AlertDialogTitle>
                <AlertDialogDescription class="text-right"> يرجى إدخال عنوان البريد الإلكتروني الجديد وكلمة المرور الحالية. </AlertDialogDescription>
              </AlertDialogHeader>
              <div class="space-y-2">
                <label class="font-medium w-full text-right inline-block">ادخل بريدك الإلكتروني الجديد</label>
                <Input v-model="newEmail" class="bg-white" />
              </div>
              <div class="space-y-2">
                <label class="font-medium w-full text-right inline-block">كلمة المرور</label>
                <Input v-model="emailPassword" class="bg-white" type="password" />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel class="cursor-pointer">الغاء</AlertDialogCancel>
                <AlertDialogAction class="cursor-pointer" @click="changeEmail">تأكيد</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Input class="bg-white" readonly :placeholder="currentEmail" />
        </div>
      </div>
    </div>

    <hr />

    <!-- Change Password -->
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="font-medium">كلمة المرور الحالية</label>
        <Input v-model="currentPassword" type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">كلمة مرور جديدة</label>
        <Input v-model="newPassword" type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">تأكيد كلمة المرور الجديدة</label>
        <Input v-model="confirmNewPassword" type="password" class="w-[95%] bg-white" />
      </div>
    </div>

    <!-- Save button -->
    <Button type="submit" class="mt-6 cursor-pointer">حفظ</Button>
  </form>
</template>
