<script setup lang="ts">
import revenueImage from '@/assets/svgs/money-bag.svg';
import studentImage from '@/assets/svgs/student.svg';
import coursesImage from '@/assets/svgs/video.svg';
import { useAuthStore } from '~/stores/auth';
definePageMeta({
  middleware: ['require-teacher-auth'],
  layout: false,
});
const route = useRoute();
const x = false;
const auth = useAuthStore();

const coursesCount = ref(0);
const studentsCount = ref(0);
const revenue = ref(0);
const fetchCoursesCount = async () => {
  try {
    const token = useCookie('teacher_token').value;

    if (!token) {
      coursesCount.value = 0;
      return;
    }

    const courses = await $fetch<any[]>('http://localhost:3001/api/teacher/courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    coursesCount.value = courses.length;
  } catch (error) {
    console.error('Failed to fetch teacher courses:', error);
    coursesCount.value = 0;
  }
};

const fetchStudentsCount = async () => {
  try {
    const token = useCookie('teacher_token').value;

    if (!token) {
      studentsCount.value = 0;
      return;
    }

    const response = await $fetch<{ totalStudents: number }>('http://localhost:3001/api/teacher/courses/stats/students', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    studentsCount.value = response.totalStudents;
  } catch (error) {
    console.error('Failed to fetch total students:', error);
    studentsCount.value = 0;
  }
};

const fetchRevenue = async () => {
  try {
    const token = useCookie('teacher_token').value;

    if (!token) {
      revenue.value = 0;
      return;
    }

    const response = await $fetch<{ totalRevenue: number }>('http://localhost:3001/api/teacher/courses/stats/revenue', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    revenue.value = response.totalRevenue;
  } catch (error) {
    console.error('Failed to fetch total revenue:', error);
    revenue.value = 0;
  }
};

const courseData = ref<any[]>([]);

const fetchCourseStatus = async (period = 'this-month') => {
  try {
    const token = useCookie('teacher_token').value;

    if (!token) {
      courseData.value = [];
      return;
    }

    const response = await $fetch<any[]>(`http://localhost:3001/api/teacher/courses/status?period=${period}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    courseData.value = response;
  } catch (error) {
    console.error('Failed to fetch course status:', error);
    courseData.value = [];
  }
};

onMounted(() => {
  fetchCoursesCount();
  fetchStudentsCount();
  fetchRevenue();
  fetchCourseStatus();
});
</script>
<template>
  <LanguageBanner />
  <SidebarProvider class="mixt-style">
    <AppSidebarTeacher />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1 cursor-pointer" />
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
          <CustomTeacherDashboardCard :title="auth.isEnglish ? 'Total Revenue' : 'إجمالي الإيرادات'" :number="revenue" :link="revenueImage" />
          <CustomTeacherDashboardCard :title="auth.isEnglish ? 'Total Students' : 'إجمالي الطلاب'" :number="studentsCount" :link="studentImage" />
          <CustomTeacherDashboardCard :title="auth.isEnglish ? 'Total Courses' : 'إجمالي الدورات'" :number="coursesCount" :link="coursesImage" />
          <!-- <div class="aspect-video rounded-xl bg-muted/50 ratings flex justify-center items-center text-5xl">20</div> -->
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CustomTeacherChartOverview />
          <CustomTeacherTopStudentlocations />
          <CustomTeacherCourseStatusTable :courses="courseData" @period-change="fetchCourseStatus" />
          <CustomTeacherRecentPurchasesTable />
          <!-- <CustomTeacherDashboardCharts /> -->
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
