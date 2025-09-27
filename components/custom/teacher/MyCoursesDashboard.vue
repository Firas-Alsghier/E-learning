<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

// Define the type for a course object
interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  status: 'all' | 'published' | 'in progress' | 'completed' | 'drafts' | 'archived';
  progress: number;
  rating: number;
  studentsEnrolled: number;
  duration: string;
}

// Dummy data for courses
const courses = ref<Course[]>([
  {
    id: 1,
    title: 'Vue 3 & Nuxt 3 Masterclass',
    instructor: 'Jane Doe',
    thumbnail: 'https://placehold.co/400x200/4F46E5/ffffff?text=Vue+3',
    status: 'published',
    progress: 75,
    rating: 4.8,
    studentsEnrolled: 1520,
    duration: '12h 30m',
  },
  {
    id: 2,
    title: 'Complete Tailwind CSS Course',
    instructor: 'John Smith',
    thumbnail: 'https://placehold.co/400x200/06B6D4/ffffff?text=Tailwind',
    status: 'in progress',
    progress: 40,
    rating: 4.5,
    studentsEnrolled: 850,
    duration: '8h 00m',
  },
  {
    id: 3,
    title: 'The Ultimate Guide to TypeScript',
    instructor: 'Sarah Lee',
    thumbnail: 'https://placehold.co/400x200/3178C6/ffffff?text=TypeScript',
    status: 'drafts',
    progress: 0,
    rating: 0,
    studentsEnrolled: 0,
    duration: '5h 45m',
  },
  {
    id: 4,
    title: 'React for Beginners',
    instructor: 'Michael Chen',
    thumbnail: 'https://placehold.co/400x200/61DAFB/ffffff?text=React',
    status: 'completed',
    progress: 100,
    rating: 4.9,
    studentsEnrolled: 2100,
    duration: '10h 15m',
  },
  {
    id: 5,
    title: 'Database Design with SQL',
    instructor: 'Emily Davis',
    thumbnail: 'https://placehold.co/400x200/F5A623/ffffff?text=SQL',
    status: 'archived',
    progress: 100,
    rating: 4.7,
    studentsEnrolled: 950,
    duration: '7h 50m',
  },
  {
    id: 6,
    title: 'Python for Data Science',
    instructor: 'David Wilson',
    thumbnail: 'https://placehold.co/400x200/3472A5/ffffff?text=Python',
    status: 'published',
    progress: 90,
    rating: 4.6,
    studentsEnrolled: 1800,
    duration: '15h 20m',
  },
  {
    id: 7,
    title: 'Machine Learning with Scikit-learn',
    instructor: 'John Smith',
    thumbnail: 'https://placehold.co/400x200/F5A623/ffffff?text=ML',
    status: 'published',
    progress: 25,
    rating: 4.4,
    studentsEnrolled: 720,
    duration: '10h 30m',
  },
  {
    id: 8,
    title: 'Vuex State Management',
    instructor: 'Jane Doe',
    thumbnail: 'https://placehold.co/400x200/4F46E5/ffffff?text=Vuex',
    status: 'in progress',
    progress: 60,
    rating: 4.7,
    studentsEnrolled: 1100,
    duration: '6h 45m',
  },
  {
    id: 9,
    title: 'Introduction to Firebase',
    instructor: 'Michael Chen',
    thumbnail: 'https://placehold.co/400x200/FFCA28/ffffff?text=Firebase',
    status: 'published',
    progress: 80,
    rating: 4.9,
    studentsEnrolled: 2500,
    duration: '8h 00m',
  },
  {
    id: 10,
    title: 'Full-Stack with Express.js',
    instructor: 'Sarah Lee',
    thumbnail: 'https://placehold.co/400x200/32CD32/ffffff?text=Express',
    status: 'drafts',
    progress: 0,
    rating: 0,
    studentsEnrolled: 0,
    duration: '9h 15m',
  },
]);

const activeTab = ref<Course['status'] | 'all'>('all');
const searchTerm = ref('');
const currentPage = ref(1);
const coursesPerPage = 8;

// A computed property that filters courses based on the active tab and search term.
const filteredCourses = computed(() => {
  let filtered = courses.value;

  // Filter by the active tab
  if (activeTab.value !== 'all') {
    filtered = filtered.filter((course) => course.status === activeTab.value);
  }

  // Filter by the search term
  if (searchTerm.value) {
    filtered = filtered.filter((course) => course.title.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }

  return filtered;
});

// Computed property to get the courses for the current page
const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * coursesPerPage;
  const end = start + coursesPerPage;
  return filteredCourses.value.slice(start, end);
});

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(filteredCourses.value.length / coursesPerPage);
});

// Pagination handlers
const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Example functions for course actions
const editCourse = (courseId: number) => {
  console.log(`Editing course with ID: ${courseId}`);
  // Add your navigation or modal logic here
};

const archiveCourse = (courseId: number) => {
  console.log(`Archiving course with ID: ${courseId}`);
  // Find the course and update its status
};

const deleteCourse = (courseId: number) => {
  console.log(`Deleting course with ID: ${courseId}`);
  // Add your logic to remove the course
};
</script>

<template>
  <div class="p-6 md:p-10 bg-gray-900 min-h-screen text-gray-200">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <h1 class="text-3xl font-bold tracking-tight">My Courses</h1>
      <div class="flex items-center gap-4 w-full md:w-auto">
        <Input type="text" v-model="searchTerm" placeholder="Search courses..." class="flex-1 bg-gray-800 border-gray-700 text-gray-200 placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-500" />
        <Button variant="outline" class="bg-indigo-600 text-white hover:bg-indigo-500 border-none"> + New Course </Button>
      </div>
    </div>

    <Tabs :model-value="activeTab" @update:model-value="activeTab = $event as any">
      <TabsList class="mb-6 flex flex-wrap h-auto bg-gray-800 border-b border-gray-700">
        <TabsTrigger value="all" class="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"> All Courses </TabsTrigger>
        <TabsTrigger value="published" class="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"> Published </TabsTrigger>
        <TabsTrigger value="in progress" class="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"> In Progress </TabsTrigger>
        <TabsTrigger value="completed" class="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"> Completed </TabsTrigger>
        <TabsTrigger value="drafts" class="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"> Drafts </TabsTrigger>
        <TabsTrigger value="archived" class="data-[state=active]:bg-indigo-500 data-[state=active]:text-white"> Archived </TabsTrigger>
      </TabsList>

      <TabsContent :value="activeTab">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card v-for="course in paginatedCourses" :key="course.id" class="bg-gray-800 border-gray-700 overflow-hidden rounded-lg shadow-lg relative">
            <img :src="course.thumbnail" :alt="course.title" class="w-full h-40 object-cover" />
            <div class="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" class="p-2 h-auto text-gray-400 hover:bg-gray-700">
                    <EllipsisVertical class="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-40 bg-gray-800 border-gray-700 text-gray-200">
                  <DropdownMenuItem @click="editCourse(course.id)" class="cursor-pointer hover:bg-gray-700">Edit Course</DropdownMenuItem>
                  <DropdownMenuItem @click="archiveCourse(course.id)" class="cursor-pointer hover:bg-gray-700">Archive</DropdownMenuItem>
                  <DropdownMenuItem @click="deleteCourse(course.id)" class="cursor-pointer text-red-400 hover:bg-gray-700">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardHeader class="p-4 pb-2 h-24">
              <CardTitle class="text-lg font-semibold">{{ course.title }}</CardTitle>
            </CardHeader>
            <CardContent class="p-4 pt-0">
              <div class="flex justify-between items-center text-sm text-gray-400 mb-2">
                <div class="flex items-center space-x-1">
                  <Star class="h-4 w-4 text-yellow-400" fill="currentColor" />
                  <span>{{ course.rating }} ({{ course.studentsEnrolled }} students)</span>
                </div>
                <span>{{ course.duration }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Progress :model-value="course.progress" class="h-2 flex-grow bg-gray-700 [&>div]:bg-indigo-500" />
                <span class="text-sm font-semibold text-indigo-400">{{ course.progress }}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <nav class="flex items-center space-x-1">
        <Button variant="ghost" :disabled="currentPage === 1" @click="goToPage(1)">
          <ChevronsLeft class="h-4 w-4" />
        </Button>
        <Button variant="ghost" :disabled="currentPage === 1" @click="prevPage">
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <div class="flex items-center space-x-1">
          <Button v-for="page in totalPages" :key="page" variant="ghost" :class="{ 'bg-gray-700 text-gray-200': currentPage === page, 'text-gray-400': currentPage !== page }" @click="goToPage(page)">
            {{ page }}
          </Button>
        </div>
        <Button variant="ghost" :disabled="currentPage === totalPages" @click="nextPage">
          <ChevronRight class="h-4 w-4" />
        </Button>
        <Button variant="ghost" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">
          <ChevronsRight class="h-4 w-4" />
        </Button>
      </nav>
    </div>
  </div>
</template>
