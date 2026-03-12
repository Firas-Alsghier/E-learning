<script lang="ts" setup>
const route = useRoute();

definePageMeta({
  middleware: ['user-auth'],
  ssr: false,
  layout: false,
});
</script>
<template>
  <SidebarProvider class="mixt-style">
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"></header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <!-- <div class="grid auto-rows-min gap-4 md:grid-cols-4">
          <CustomTeacherDashboardCard />
          <CustomTeacherDashboardCard />
          <CustomTeacherDashboardCard />
          <CustomTeacherDashboardCard />
          <div class="aspect-video rounded-xl bg-muted/50 ratings flex justify-center items-center text-5xl">20</div>
        </div> -->
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min grid grid-cols-1 gap-6">
          <CustomUserMessage />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
