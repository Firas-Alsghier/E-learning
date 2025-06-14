<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
const form = ref({
  firstName: '',
  lastName: '',
  headline: '',
  bio: '',
  language: '',
  website: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  tiktok: '',
  x: '',
  youtube: '',
});
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-8 rounded-lg">
    <!-- الاسم الأول واسم العائلة -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="font-medium">بريدك الإلكتروني:</label>
        <div class="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger>تعديل</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>تغيير بريدك الإلكتروني</AlertDialogTitle>
                <AlertDialogDescription> يرجى إدخال عنوان البريد الإلكتروني الجديد الذي ترغب في استخدامه. سنرسل إليك رمز تأكيد لتأكيد العنوان.</AlertDialogDescription>
              </AlertDialogHeader>
              <div class="space-y-2">
                <label class="font-medium">ادخل بريدك الإلكتروني الجديد</label>
                <Input class="w-[95%] bg-white" />
              </div>
              <div class="space-y-2">
                <label class="font-medium">كلمة المرور</label>
                <Input class="w-[95%] bg-white" type="password" />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel class="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction class="cursor-pointer">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Input v-model="form.firstName" class="w-[95%] bg-white" readonly placeholder="ferasalarape10@gmail.com" />
        </div>
      </div>
    </div>
    <hr />
    <!-- المسمى الوظيفي -->
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="font-medium">كلمة المرور الحالية</label>
        <Input v-model="form.headline" type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">كلمة مرور جديدة</label>
        <Input v-model="form.headline" type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">تأكيد كلمة المرور الجديدة </label>
        <Input v-model="form.headline" type="password" class="w-[95%] bg-white" />
      </div>
    </div>
    <!-- زر الحفظ -->
    <Button class="mt-6">حفظ</Button>
  </form>
</template>
