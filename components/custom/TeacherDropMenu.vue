<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useTeacher } from '~/composables/useTeacher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const router = useRouter();
const { teacher, logout } = useTeacher();
const handleLogout = () => {
  logout();
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
      <div class="flex gap-2 py-2">
        <Avatar variant="outline" class="cursor-pointer">
          <AvatarImage src="https://github.com/unovue.png" alt="@unovue" />
          <AvatarFallback>Fa</AvatarFallback>
        </Avatar>
        <div class="info">
          <h1 class="user-name text-base">{{ teacher?.firstName }} {{ teacher?.lastName }}</h1>
          <p class="user-email text-xs">{{ teacher?.email }}</p>
        </div>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer">
          <a href="/teacher/overview">Dashboard</a>
          <!-- <span>My Courses</span> -->
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <a href="/teacher/my-courses">My Courses</a>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer">
          <a href="/teacher/create-course">Create a Course</a>
          <!-- <span>Wishlist</span> -->
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
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
