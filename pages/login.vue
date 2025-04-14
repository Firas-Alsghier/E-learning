<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <Card class="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle class="text-2xl text-right">
            تسجيل الدخول
          </CardTitle>
          <CardDescription class="text-right">
            أدخل بريدك الإلكتروني في الاسفل لتسجيل الدخول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="flex flex-col gap-2">
              <Label for="email" class=" self-end">بريدك الإلكتروني</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center self-end">
                <Label for="password">كلمة السر</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <a href="#" class="ml-auto inline-block text-sm text-right underline">
              نسيت كلمة السر؟
            </a>
            <Button type="submit" class="w-full cursor-pointer">
              الدخول
            </Button>
            <Button variant="outline" class="w-full cursor-pointer">
              تسجيل الدخول باستخدام جوجل
            </Button>
          </div>
          <div class="mt-4 text-center text-sm">
            ليس لديك حساب؟
            <a href="/signup" class="underline">
              التسجيل
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="hidden bg-muted lg:block">
      <img src="/assets/images/course.jpg" alt="Image" width="1920" height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
    </div>
  </div>
</template>

<style lang="scss" scoped></style>