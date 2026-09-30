<script setup lang="ts">
import { useUser } from '~/composables/useUser';
import { useAuthStore } from '~/stores/auth';
import { useTeacher } from '~/composables/useTeacher';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-vue-next';

const auth = useAuthStore();
const router = useRouter();
const { setUser, user } = useUser();
const { isMobile } = useSidebar();
const { logout, teacher } = useTeacher();
const handleLogout = () => {
  logout();
};

console.log('Teacher data in NavUser.vue:', teacher);
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <ClientOnly>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage src="" :alt="teacher?.firstName" />
                <AvatarFallback class="rounded-lg"> {{ teacher?.firstName }}{{ teacher?.lastName }} </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium"> {{ teacher?.firstName }} {{ teacher?.lastName }} </span>
                <span class="truncate text-xs">{{ teacher?.email }}</span>
              </div>
              <ChevronsUpDown class="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" :side="isMobile ? 'bottom' : 'right'" align="end" :side-offset="4">
            <DropdownMenuItem @click="handleLogout" class="cursor-pointer">
              <LogOut />
              Log out asdasd
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ClientOnly>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
