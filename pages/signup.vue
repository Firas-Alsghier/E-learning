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
                    <CardTitle class="text-xl text-right">
                        التسجيل
                    </CardTitle>
                    <CardDescription class="text-right">
                        أدخل معلوماتك لإنشاء حساب
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="grid gap-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <Label for="last-name" class="self-end">اللقب</Label>
                                <Input id="last-name" class="text-right" placeholder="علي" required />
                            </div>
                            <div class="flex flex-col gap-2">
                                <Label for="first-name" class="self-end">اسمك</Label>
                                <Input id="first-name" class="text-right" placeholder="محمد" required />
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
              <Label for="email" class=" self-end">بريدك الإلكتروني</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
                        <div class="flex flex-col gap-2">
                            <Label for="password" class=" self-end">كلمة السر</Label>
                            <Input id="password" type="password" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Label for="password" class=" self-end">اعد كتابة كلمة السر</Label>
                            <Input id="password" type="password" />
                        </div>
                        <Button type="submit" class="w-full cursor-pointer ">
                            إنشاء حساب
                        </Button>
                        <Button variant="outline" class="w-full cursor-pointer">
              تسجيل الدخول باستخدام جوجل
            </Button>
                    </div>
                    <div class="mt-4 text-center text-sm">
                        لديك حساب بالفعل؟
                        <a href="/login" class="underline">
                            تسجيل الدخول
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