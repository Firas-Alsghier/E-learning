<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useFetch } from '#app';
import { useUser } from '~/composables/useUser';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';

const { t } = useI18n();
const { setUser } = useUser();
const auth = useAuthStore();

const router = useRouter();

const closeAccount = async () => {
  try {
    const token = localStorage.getItem('token');

    const { error } = await useFetch('http://localhost:3001/api/auth/close-account', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error.value) {
      console.error('❌ Error deleting account:', error.value);
      return;
    }

    localStorage.removeItem('token');
    setUser(null); // ✅ This is enough
    router.push('/');

    setTimeout(() => {
      location.reload();
    }, 200);
  } catch (err) {
    console.error('❌ Request failed:', err);
  }
};
</script>

<template>
  <div class="text-right">
    <p class="mb-2">
      {{ t('warning-close') }}
    </p>
    <AlertDialog>
      <AlertDialogTrigger class="bg-[#171717] text-white py-2 px-4 rounded-lg text-sm cursor-pointer">{{ t('close-account') }}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('delete-alert') }}</AlertDialogTitle>
          <AlertDialogDescription :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('delete-data') }}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="cursor-pointer">{{ t('cancel') }}</AlertDialogCancel>
          <!-- ✅ connect button to closeAccount -->
          <AlertDialogAction class="cursor-pointer" @click="closeAccount">{{ t('conform-btn') }}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
