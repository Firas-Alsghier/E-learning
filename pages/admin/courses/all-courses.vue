<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

definePageMeta({
  layout: false,
});

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
  isPublished?: boolean;
  isBlocked?: boolean;
}
onMounted(() => {
  fetchCourses();
});

const courses = ref<Course[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);

const token = process.client ? localStorage.getItem('adminToken') : null;

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const fetchCourses = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/courses');
    courses.value = data.courses;
  } catch (error) {
    console.error('Fetch courses error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const getStatus = (course: Course) => {
  if (course.isBlocked) return 'Blocked';
  if (course.isPublished) return 'Published';
  return 'Draft';
};

const blockCourse = async (id: string) => {
  try {
    await api.patch(`/courses/${id}/block`);
    courses.value = courses.value.map((course) => (course._id === id ? { ...course, isBlocked: true } : course));
  } catch (error) {
    console.error('Block course error:', error);
  }
};

const deleteCourse = async (id: string) => {
  const confirmDelete = confirm('Are you sure you want to permanently delete this course?');
  if (!confirmDelete) return;

  try {
    await api.delete(`/courses/${id}`);
    courses.value = courses.value.filter((course) => course._id !== id);
  } catch (error) {
    console.error('Delete course error:', error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">All Courses</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Title</th>
            <th class="p-4">Instructor</th>
            <th class="p-4">Category</th>
            <th class="p-4">Price</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="course in courses" :key="course._id">
            <tr class="border-t">
              <td class="p-4 font-medium">{{ course.title }}</td>
              <td class="p-4">{{ course.teacher?.firstName }} {{ course.teacher?.lastName }}</td>
              <td class="p-4">{{ course.category }}</td>
              <td class="p-4">${{ course.price }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': getStatus(course) === 'Published',
                    'bg-yellow-100 text-yellow-700': getStatus(course) === 'Draft',
                    'bg-red-100 text-red-700': getStatus(course) === 'Blocked',
                  }"
                >
                  {{ getStatus(course) }}
                </span>
              </td>

              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" variant="outline" @click="blockCourse(course._id)"> Block </Button>

                <Button size="sm" variant="destructive" @click="deleteCourse(course._id)"> Delete </Button>
              </td>
            </tr>

            <tr v-if="expandedId === course._id" class="bg-muted/40">
              <td colspan="6" class="p-6">
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Created At:</strong>
                    {{ new Date(course.createdAt).toLocaleDateString() }}
                  </p>
                  <p><strong>Course ID:</strong> {{ course._id }}</p>
                  <p>
                    <strong>Instructor Email:</strong>
                    {{ course.teacher?.email }}
                  </p>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="courses.length === 0">
            <td colspan="6" class="p-6 text-center text-muted-foreground">No courses found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
