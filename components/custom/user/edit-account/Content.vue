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
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-8 rounded-lg">
    <!-- الاسم الأول واسم العائلة -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2 text-right">
        <label class="font-medium">بريدك الإلكتروني:</label>
        <div class="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger class="bg-[#171717] text-white py-2 px-4 rounded-lg text-sm cursor-pointer">تعديل</AlertDialogTrigger>
            <AlertDialogContent class="flex flex-col w-full">
              <AlertDialogHeader>
                <AlertDialogTitle class="text-right">تغيير بريدك الإلكتروني</AlertDialogTitle>
                <AlertDialogDescription class="text-right"> يرجى إدخال عنوان البريد الإلكتروني الجديد الذي ترغب في استخدامه. سنرسل إليك رمز تأكيد لتأكيد العنوان.</AlertDialogDescription>
              </AlertDialogHeader>
              <div class="space-y-2">
                <label class="font-medium w-full text-right inline-block">ادخل بريدك الإلكتروني الجديد</label>
                <Input class="bg-white" />
              </div>
              <div class="space-y-2">
                <label class="font-medium w-full text-right inline-block">كلمة المرور</label>
                <Input class="bg-white" type="password" />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel class="cursor-pointer">الغاء</AlertDialogCancel>
                <AlertDialogAction class="cursor-pointer">تأكيد</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Input class="bg-white" readonly placeholder="ferasalarape10@gmail.com" />
        </div>
      </div>
    </div>
    <hr />
    <!-- المسمى الوظيفي -->
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="font-medium">كلمة المرور الحالية</label>
        <Input type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">كلمة مرور جديدة</label>
        <Input type="password" class="w-[95%] bg-white" />
      </div>

      <div class="space-y-2">
        <label class="font-medium">تأكيد كلمة المرور الجديدة </label>
        <Input type="password" class="w-[95%] bg-white" />
      </div>
    </div>
    <!-- زر الحفظ -->
    <Button class="mt-6 cursor-pointer">حفظ</Button>
  </form>
</template>
