<script setup lang="ts">
import { useUser } from '~/composables/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-vue-next';
const router = useRouter();
const { setUser, user } = useUser();

const handleLogout = () => {
  localStorage.removeItem('token');
  setUser(null); // ✅ This is enough
  router.push('/');

  setTimeout(() => {
    location.reload();
  }, 200);
};
// const props = defineProps<{
//   user: {
//     name: string;
//     email: string;
//     avatar: string;
//   };
// }>();

const { isMobile } = useSidebar();
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar class="h-8 w-8 rounded-lg">
              <!-- put it in Avatar image :src="user.avatar" -->
              <AvatarImage src="https://randomuser.me/api/portraits/med/men/75.jpg" :alt="user?.firstName" />
              <AvatarFallback class="rounded-lg"> {{ user?.firstName?.slice(0, 1) }} {{ user?.lastName?.slice(0, 1) }} </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user?.firstName }} {{ user?.lastName }}</span>
              <span class="truncate text-xs">{{ user?.email }}</span>
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
    </SidebarMenuItem>
  </SidebarMenu>
</template>
