<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Course {
  id: number;
  title: string;
  students: number;
  earnings: number;
}

const leaderboard: Course[] = [
  { id: 1, title: 'JavaScript Mastery', students: 240, earnings: 3500 },
  { id: 2, title: 'Vue 3 + Nuxt 3 Bootcamp', students: 180, earnings: 2900 },
  { id: 3, title: 'TailwindCSS UI Design', students: 120, earnings: 2100 },
];
</script>

<template>
  <Card class="w-full shadow-sm border border-gray-200">
    <CardHeader>
      <CardTitle class="text-lg font-semibold tracking-tight"> 📊 Top Courses Leaderboard </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div v-for="(course, index) in leaderboard" :key="course.id" class="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
          <!-- Left: Rank + Course info -->
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold" :class="[index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500']">
              {{ index + 1 }}
            </div>
            <div>
              <p class="font-medium">{{ course.title }}</p>
              <p class="text-xs text-muted-foreground">{{ course.students }} students</p>
            </div>
          </div>

          <!-- Right: Earnings -->
          <div class="text-right">
            <p class="font-semibold text-primary">${{ course.earnings }}</p>
            <p class="text-xs text-muted-foreground">Earnings</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
