<script setup lang="ts">
const route = useRoute();
const courseId = route.params.id as string;
definePageMeta({
  ssr: false,
  layout: false,
  middleware: ['require-teacher-auth'],
});
</script>
<template>
  <SidebarProvider class="mixt-style">
    <AppSidebarTeacher />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#"> {{ route.path.slice(8) }} </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min grid grid-cols-1 gap-6">
          <CustomTeacherCourseCreationEdit :courseId="courseId" />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
