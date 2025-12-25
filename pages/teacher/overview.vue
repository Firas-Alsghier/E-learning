<script setup lang="ts">
import revenueImage from '@/assets/svgs/money-bag.svg';
import studentImage from '@/assets/svgs/student.svg';
import coursesImage from '@/assets/svgs/video.svg';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const x = false;
const auth = useAuthStore();

definePageMeta({
  // middleware: ['auth'], // This is enough!
  ssr: false,
  layout: false,
});

// Dummy data for demonstration
const courseData = [
  {
    id: 1,
    image: 'https://via.placeholder.com/40/800080/FFFFFF?text=P', // Example image
    name: 'Complete Python Bootcamp in Python',
    description: 'Development',
    category: 'Design',
    sale: 150,
    rating: 4.5,
    earning: 610.5,
    visitor: 24512,
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/40/0000FF/FFFFFF?text=E', // Example image
    name: 'Advanced Excel Formulas & Functions',
    description: 'Learn backend',
    category: 'Development',
    sale: 20,
    rating: 5.0,
    earning: 55.5,
    visitor: 6200,
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=V', // Example image
    name: 'Video Editor in Filmora9',
    description: 'Video-Creation',
    category: 'Photography',
    sale: 56,
    rating: 4.5,
    earning: 610.5,
    visitor: 24512,
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/40/00FF00/FFFFFF?text=O', // Example image
    name: 'Online Meeting Facilitation: The 4 Secret Keys',
    description: 'Marketing Courses',
    category: 'Marketing',
    sale: 150,
    rating: 4.5,
    earning: 610.5,
    visitor: 24512,
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/40/FFA500/FFFFFF?text=I', // Example image
    name: 'Intermediate Blues Rhythm Guitar',
    description: 'Music Fundamentals',
    category: 'Music',
    sale: 30,
    rating: 5.0,
    earning: 110.5,
    visitor: 6512,
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/40/FFFF00/000000?text=B', // Example image
    name: 'B2B Sales Masterclass: People-Focused Selling',
    description: 'Business Courses',
    category: 'Business',
    sale: 90,
    rating: 4.5,
    earning: 240.5,
    visitor: 512,
  },
];
</script>
<template>
  <LanguageBanner />
  <SidebarProvider class="mixt-style">
    <AppSidebarTeacher />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#"> {{ route.path.slice(8) }} </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <CustomTeacherDashboardCard :title="auth.isEnglish ? 'Total Revenue' : 'إجمالي الإيرادات'" number="$26545" :link="revenueImage" />
          <CustomTeacherDashboardCard :title="auth.isEnglish ? 'Total Students' : 'إجمالي الطلاب'" number="26545" :link="studentImage" />
          <CustomTeacherDashboardCard :title="auth.isEnglish ? 'Total Courses' : 'إجمالي الدورات'" number="26545" :link="coursesImage" />
          <!-- <div class="aspect-video rounded-xl bg-muted/50 ratings flex justify-center items-center text-5xl">20</div> -->
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CustomTeacherChartOverview />
          <CustomTeacherTopStudentlocations />
          <CustomTeacherCourseStatusTable :courses="courseData" />
          <CustomTeacherRecentPurchasesTable />
          <!-- <CustomTeacherDashboardCharts /> -->
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
