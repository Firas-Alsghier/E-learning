<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar';

import { GalleryVerticalEnd } from 'lucide-vue-next';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const props = defineProps<SidebarProps>();

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Overview',
      url: '/admin',
      items: [],
    },
    {
      title: 'Teachers',
      items: [
        {
          title: 'Pending Approval',
          url: '/admin/teachers/pending',
        },
        {
          title: 'Approved Teachers',
          url: '/admin/teachers/approved',
          isActive: true,
        },
        {
          title: 'Rejected Teachers',
          url: '/admin/teachers/rejected',
        },
        {
          title: 'Blocked Teachers',
          url: '/admin/teachers/blocked',
        },
      ],
    },
    {
      title: 'Courses',
      items: [
        {
          title: 'All Courses',
          url: '/admin/courses/all-courses',
        },
        {
          title: 'Pending Courses',
          url: '/admin/courses/pending-courses',
        },
        {
          title: 'Reported Courses',
          url: '/admin/courses/reported-courses',
        },
        {
          title: 'Blocked Courses',
          url: '/admin/courses/blocked-courses',
        },
      ],
    },
    {
      title: 'Students',
      items: [
        {
          title: 'All Students',
          url: '/admin/students/all-students',
        },
        {
          title: 'Blocked Students',
          url: '/admin/students/blocked-students',
        },
        {
          title: 'Reported Students',
          url: '/admin/students/reported-students',
        },
        {
          title: 'Enrollment History',
          url: '/admin/students/enrollment-history',
        },
      ],
    },
    {
      title: 'Categories',
      items: [
        {
          title: 'All Categories',
          url: '/admin/categories/all-categories',
        },
        {
          title: 'Add Categories',
          url: '/admin/categories/add-categories',
        },
      ],
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd class="size-4" />
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                <span class="font-medium">Documentation</span>
                <span class="">v1.0.0</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
            <SidebarMenuButton as-child>
              <a :href="item.url" class="font-medium">
                {{ item.title }}
              </a>
            </SidebarMenuButton>
            <SidebarMenuSub v-if="item.items.length">
              <SidebarMenuSubItem v-for="childItem in item.items" :key="childItem.title">
                <SidebarMenuSubButton as-child>
                  <a :href="childItem.url">{{ childItem.title }}</a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
