<script setup lang="ts">
// This file contains the 3 final major components of the sidebar userPic, linkList, homeButton
import type { SidebarProps } from '@/components/ui/sidebar';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { useI18n } from 'vue-i18n';

import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-vue-next';

const { t } = useI18n();

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
});

// 💡 FIX 2: Wrapped the entire data object in a computed property.
// This ensures that the translations are re-evaluated and updated
// every time the i18n locale changes.
const data = computed(() => ({
  navMain: [
    {
      title: t('profile'),
      url: 'edit-profile',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: t('account-security'),
      url: 'edit-account',
      icon: BookOpen,
    },
    {
      title: t('privacy'),
      url: 'edit-privacy',
      icon: Settings2,
    },
    {
      title: t('notification-preferences'),
      url: 'edit-notification-preferences',
      icon: Settings2,
    }, // { //   title: 'المساعدة والدعم', //   url: '#', //   icon: Settings2, // },
    {
      title: t('close-account'),
      url: 'close-account',
      icon: Settings2,
    },
  ],
}));
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
      <!-- <LanguageBanner /> -->
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
