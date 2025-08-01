<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="font-bold">إعدادات صفحة الملف الشخصي</h2>
    <div>
      <Checkbox id="profile" />
      <label for="profile" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> إظهار ملفك الشخصي للمستخدمين المسجلين </label>
    </div>
    <div>
      <Checkbox id="reviews" />
      <label for="reviews" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> السماح للمستخدمين بمشاهدة تعليقاتي على الدورات </label>
    </div>
    <div>
      <Checkbox id="message" />
      <label for="message" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> السماح للآخرين بمراسلتي </label>
    </div>
    <Button class="cursor-pointer w-fit">حفظ</Button>
  </div>
</template>

<style lang="scss" scoped></style>
