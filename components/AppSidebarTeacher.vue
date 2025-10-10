<script setup lang="ts">
// This file contains the 3 final major components of the sidebar userPic, linkList, homeButton
import type { SidebarProps } from '@/components/ui/sidebar';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-vue-next';

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
});

// This is sample data.
const data = {
  navMain: [
    {
      title: 'عام',
      url: 'overview',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'كورساتي',
      url: 'my-courses',
      icon: Bot,
    },
    {
      title: 'انشاء كورس',
      url: 'create-course',
      icon: BookOpen,
    },
    {
      title: 'الرسائل',
      url: 'messages',
      icon: BookOpen,
    },
    // {
    //   title: 'الطلاب',
    //   url: 'students',
    //   icon: Settings2,
    // },
    // {
    //   title: 'التقيمات',
    //   url: 'edit-notification-preferences',
    //   icon: Settings2,
    // },
    // {
    //   title: 'المساعدة والدعم',
    //   url: '#',
    //   icon: Settings2,
    // },
    // {
    //   title: 'الرسائل',
    //   url: 'messages',
    //   icon: Settings2,
    // },
    // {
    //   title: 'الأرباح',
    //   url: 'profits',
    //   icon: Settings2,
    // },
    {
      title: 'الاعدادات',
      url: 'settings',
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
      <Button class="cursor-pointer w-full"><a href="/">Home page</a></Button>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
