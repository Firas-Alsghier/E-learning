<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useTeacherStore } from '~/stores/teacher'; // 👈 Use the Teacher store
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const router = useRouter();
const teacherStore = useTeacherStore(); // 👈 Access teacher data

// Get teacher info from store
const teacher = computed(() => teacherStore.teacher);

const handleLogout = () => {
  // ✅ This calls the logout in stores/teacher.ts
  // It clears 'teacher_token' cookie and redirects to /teacher/login
  teacherStore.logout();
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Avatar variant="outline" class="cursor-pointer">
        <AvatarImage src="https://github.com/unovue.png" />
        <AvatarFallback>{{ teacher?.firstName?.charAt(0) }}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-56">
      <div class="flex gap-2 py-2 px-2">
        <Avatar variant="outline" class="cursor-pointer">
          <AvatarImage src="https://github.com/unovue.png" />
          <AvatarFallback>{{ teacher?.firstName?.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div class="info overflow-hidden">
          <h1 class="user-name text-base truncate">{{ teacher?.firstName }} {{ teacher?.lastName }}</h1>
          <p class="user-email text-xs text-zinc-500 truncate">{{ teacher?.email }}</p>
        </div>
      </div>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem class="cursor-pointer" as-child>
          <NuxtLink to="/teacher/overview">Dashboard</NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" as-child>
          <NuxtLink to="/teacher/my-courses">My Courses</NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem class="cursor-pointer" as-child>
          <NuxtLink to="/teacher/create-course">Create a Course</NuxtLink>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuItem @click="handleLogout" class="cursor-pointer text-red-400">
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
