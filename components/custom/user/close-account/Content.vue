<script setup lang="ts"></script>

<template>
  <div class="text-right">
    <p class="mb-2">
      تحذير: إذا قمت بإغلاق حسابك، فسوف يتم إلغاء اشتراكك في دوراتك الـ 266 كلها وستفقد إمكانية الوصول إلى حسابك والبيانات المرتبطة بحسابك إلى الأبد<br />
      حتى إذا اخترت إنشاء حساب جديد باستخدام عنوان البريد الإلكتروني نفسه في المستقبل.
    </p>
    <AlertDialog>
      <AlertDialogTrigger class="bg-[#171717] text-white py-2 px-4 rounded-lg text-sm cursor-pointer">إغلاق الحساب</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle class="text-right">هل أنت متأكد من حذف الحساب؟</AlertDialogTitle>
          <AlertDialogDescription class="text-right">سيتم حذف حسابك بشكل دائم ولا يمكن التراجع عن هذا الإجراء. جميع بياناتك ستُفقد ولن تتمكن من استعادتها لاحقًا</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="cursor-pointer">الغاء</AlertDialogCancel>
          <AlertDialogAction class="cursor-pointer">تأكيد</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style lang="scss" scoped></style>
