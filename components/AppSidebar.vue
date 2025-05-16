<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar';

import NavMain from '@/components/NavMain.vue';
import NavProjects from '@/components/NavProjects.vue';
import NavUser from '@/components/NavUser.vue';
import TeamSwitcher from '@/components/TeamSwitcher.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from 'lucide-vue-next';

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
});

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Profile',
      url: '/edit-profile',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Photo',
      url: 'edit-photo',
      icon: Bot,
    },
    {
      title: 'Account Security',
      url: 'edit-account',
      icon: BookOpen,
    },
    {
      title: 'Privacy',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Notification Preferences',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Help & Support',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Close account',
      url: '#',
      icon: Settings2,
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <NavUser :user="data.user" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NuxtLink to="/"><Button class="cursor-pointer w-full">Home page</Button></NuxtLink>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
