<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Course {
  id: number;
  title: string;
  image: string;
  teacher: string;
  progress: number;
  rating: number;
  reviews: number;
}

const courses = ref<Course[]>([
  {
    id: 1,
    title: 'Advanced CSS and Sass: Flexbox, Grid, Animations and More',
    image: '/images/courses/css.jpg',
    teacher: 'Jonas Schmedtmann',
    progress: 2,
    rating: 5,
    reviews: 942,
  },
  {
    id: 2,
    title: 'The Web Developer Bootcamp 2025',
    image: '/images/courses/webdev.jpg',
    teacher: 'Colt Steele',
    progress: 1,
    rating: 4,
    reviews: 1201,
  },
  {
    id: 3,
    title: 'The Complete JavaScript Course 2025: From Zero to Expert!',
    image: '/images/courses/js.jpg',
    teacher: 'Jonas Schmedtmann',
    progress: 58,
    rating: 5,
    reviews: 1688,
  },
]);
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Search bar -->
    <div class="flex items-center gap-2 max-w-lg">
      <Input type="text" placeholder="ابحث في دوراتي" class="rounded-r-none" />
      <Button class="rounded-l-none bg-purple-600 hover:bg-purple-700">🔍</Button>
    </div>

    <!-- Filters bar -->
    <div class="flex flex-wrap gap-3 text-sm">
      <Button variant="outline" class="rounded-full">تم الوصول إليه مؤخرًا ⬇️</Button>
      <Button variant="outline" class="rounded-full">التقدم ⬇️</Button>
      <Button variant="outline" class="rounded-full">المحاضر ⬇️</Button>
      <Button variant="outline" class="rounded-full">إعادة التعيين</Button>
    </div>

    <!-- Courses list -->
    <div class="space-y-4">
      <div v-for="course in courses" :key="course.id" class="flex bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
        <!-- Thumbnail -->
        <img :src="course.image" class="w-48 h-32 object-cover" />

        <!-- Content -->
        <div class="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 class="font-semibold text-lg line-clamp-1">{{ course.title }}</h3>
            <p class="text-sm text-gray-500">{{ course.teacher }}</p>
          </div>

          <!-- Progress + rating -->
          <div class="flex items-center justify-between text-sm mt-2">
            <span>تم إكمال {{ course.progress }}%</span>
            <div class="flex items-center gap-1">
              <span class="text-yellow-500">★★★★★</span>
              <span class="text-gray-500">({{ course.reviews }})</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">⋮</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>👁️ عرض</DropdownMenuItem>
              <DropdownMenuItem>✏️ تعديل</DropdownMenuItem>
              <DropdownMenuItem class="text-red-600">🗑️ حذف</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>
