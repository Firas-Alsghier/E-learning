<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUser } from '~/composables/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const router = useRouter();
const { setUser } = useUser();

const handleLogout = () => {
  localStorage.removeItem('token');
  setUser(null); // ✅ This is enough
  router.push('/');

  setTimeout(() => {
    location.reload();
  }, 200);
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Avatar variant="outline" class="cursor-pointer">
        <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
        <AvatarFallback>Fa</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel class="no-selection">My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer">
          <span>My learning</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <span>My cart</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <span>Wishlist</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer">
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <span>Message</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer">
        <span>Account setting</span>
      </DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer">
        <span>Support</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleLogout" class="cursor-pointer">
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<style scoped>
.no-selection {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
