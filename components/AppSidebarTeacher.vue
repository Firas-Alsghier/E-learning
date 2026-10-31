<script setup lang="ts">
// This file contains the 3 final major components of the sidebar userPic, linkList, homeButton
import type { SidebarProps } from '@/components/ui/sidebar';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { useTeacher } from '~/composables/useTeacher';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

import { LayoutGrid, Video, Clapperboard, Mail, Settings2 } from 'lucide-vue-next';

const { teacher } = useTeacher();

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
});

// This is sample data.
const data = {
  navMain: [
    {
      title: 'عام',
      url: 'overview',
      icon: LayoutGrid,
      isActive: true,
    },
    {
      title: 'كورساتي',
      url: 'my-courses',
      icon: Clapperboard,
    },
    {
      title: 'انشاء كورس',
      url: 'create-course',
      icon: Video,
    },
    {
      title: 'الرسائل',
      url: 'messages',
      icon: Mail,
    },
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
      <NavUser :firstName="teacher?.firstName" :lastName="teacher?.lastName" :email="teacher?.email" />
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
