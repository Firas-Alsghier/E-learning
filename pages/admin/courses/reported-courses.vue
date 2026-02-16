<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

definePageMeta({
  layout: false,
});

interface Report {
  _id: string;
  reason: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  category: string;
  price: number;
  createdAt: string;
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
  };
  reports: Report[];
}

const courses = ref<Course[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);
onMounted(() => {
  fetchReportedCourses();
});

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
});

const fetchReportedCourses = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/courses/reported');
    courses.value = data.courses;
  } catch (error) {
    console.error('Fetch reported courses error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const blockCourse = async (id: string) => {
  try {
    await api.patch(`/courses/${id}/block`);
    courses.value = courses.value.filter((course) => course._id !== id);
  } catch (error) {
    console.error('Block error:', error);
  }
};

const deleteCourse = async (id: string) => {
  const confirmDelete = confirm('Are you sure you want to permanently delete this course?');
  if (!confirmDelete) return;

  try {
    await api.delete(`/courses/${id}`);
    courses.value = courses.value.filter((course) => course._id !== id);
  } catch (error) {
    console.error('Delete error:', error);
  }
};

const clearReports = async (id: string) => {
  const confirmClear = confirm('Are you sure you want to clear all reports for this course?');
  if (!confirmClear) return;

  try {
    await api.patch(`/courses/${id}/clear-reports`);

    // Remove from reported list immediately
    courses.value = courses.value.filter((course) => course._id !== id);
  } catch (error) {
    console.error('Clear reports error:', error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Reported Courses</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Title</th>
            <th class="p-4">Instructor</th>
            <th class="p-4">Reports</th>
            <th class="p-4">Category</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="course in courses" :key="course._id">
            <tr class="border-t">
              <td class="p-4 font-medium">{{ course.title }}</td>
              <td class="p-4">
                {{ course.teacher?.firstName }}
                {{ course.teacher?.lastName }}
              </td>
              <td class="p-4 text-red-600 font-semibold">
                {{ course.reports?.length || 0 }}
              </td>
              <td class="p-4">{{ course.category }}</td>

              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" variant="outline" @click="blockCourse(course._id)"> Block </Button>

                <Button size="sm" variant="secondary" @click="clearReports(course._id)"> Clear Reports </Button>

                <Button size="sm" variant="destructive" @click="deleteCourse(course._id)"> Delete </Button>

                <Button size="sm" @click="toggleDetails(course._id)"> View Reports </Button>
              </td>
            </tr>

            <tr v-if="expandedId === course._id" class="bg-muted/40">
              <td colspan="5" class="p-6">
                <div class="space-y-4 text-sm">
                  <p>
                    <strong>Created At:</strong>
                    {{ new Date(course.createdAt).toLocaleDateString() }}
                  </p>

                  <div>
                    <p class="font-medium mb-2">Reports:</p>
                    <div v-for="report in course.reports" :key="report._id" class="border rounded p-3 mb-2 bg-white">
                      <p><strong>Reason:</strong> {{ report.reason }}</p>
                      <p class="text-muted-foreground text-xs">
                        {{ new Date(report.createdAt).toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="courses.length === 0">
            <td colspan="5" class="p-6 text-center text-muted-foreground">No reported courses.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
