<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useFetch } from '#app';
import { useUser } from '~/composables/useUser';
const { setUser } = useUser();

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
      تحذير: إذا قمت بإغلاق حسابك، فسوف يتم إلغاء اشتراكك في دوراتك الـ 266 كلها وستفقد إمكانية الوصول إلى حسابك والبيانات المرتبطة بحسابك إلى الأبد<br />
      حتى إذا اخترت إنشاء حساب جديد باستخدام عنوان البريد الإلكتروني نفسه في المستقبل.
    </p>
    <AlertDialog>
      <AlertDialogTrigger class="bg-[#171717] text-white py-2 px-4 rounded-lg text-sm cursor-pointer"> إغلاق الحساب </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle class="text-right">هل أنت متأكد من حذف الحساب؟</AlertDialogTitle>
          <AlertDialogDescription class="text-right"> سيتم حذف حسابك بشكل دائم ولا يمكن التراجع عن هذا الإجراء. جميع بياناتك ستُفقد ولن تتمكن من استعادتها لاحقًا </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="cursor-pointer">الغاء</AlertDialogCancel>
          <!-- ✅ connect button to closeAccount -->
          <AlertDialogAction class="cursor-pointer" @click="closeAccount">تأكيد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
