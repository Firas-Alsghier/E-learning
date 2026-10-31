<script setup lang="ts">
import { useSidebar } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { LogOut, ChevronsUpDown } from 'lucide-vue-next';

// Define the props for first name, last name, and email
withDefaults(
  defineProps<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>(),
  {
    firstName: '',
    lastName: '',
    email: '',
  },
);

const { isMobile } = useSidebar();
const { logout } = useTeacher();

const handleLogout = () => {
  logout();
};
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <ClientOnly>
        <DropdownMenu>
          <DropdownMenuTrigger class="cursor-pointer" as-child>
            <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <!-- Avatar section can be uncommented if needed -->
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{{ firstName }} {{ lastName }}</span>
                <span class="truncate text-xs">{{ email }}</span>
              </div>
              <ChevronsUpDown class="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg" :side="isMobile ? 'bottom' : 'right'" align="end" :side-offset="4">
            <DropdownMenuItem @click="handleLogout" class="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ClientOnly>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
