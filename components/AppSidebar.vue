<script setup lang="ts">
// This file contains the 3 final major components of the sidebar userPic, linkList, homeButton
import type { SidebarProps } from '@/components/ui/sidebar';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-vue-next';
import SidebarProvider from './ui/sidebar/SidebarProvider.vue';

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
});

// This is sample data.
const data = {
  navMain: [
    {
      title: 'الملف الشخصي',
      url: 'edit-profile',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'أمان الحساب',
      url: 'edit-account',
      icon: BookOpen,
    },
    {
      title: 'الخصوصية',
      url: 'edit-privacy',
      icon: Settings2,
    },
    {
      title: 'تفضيلات الإشعارات',
      url: 'edit-notification-preferences',
      icon: Settings2,
    },
    // {
    //   title: 'المساعدة والدعم',
    //   url: '#',
    //   icon: Settings2,
    // },
    {
      title: 'إغلاق الحساب',
      url: 'close-account',
      icon: Settings2,
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <NavUser />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <!-- <Button class="cursor-pointer w-[30%] m-auto"><a href="/">🏠</a></Button> -->
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
