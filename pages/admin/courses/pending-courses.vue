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
}

const courses = ref<Course[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
});

const fetchPendingCourses = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/courses/pending');
    courses.value = data.courses;
  } catch (error) {
    console.error('Fetch pending courses error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const approveCourse = async (id: string) => {
  try {
    await api.patch(`/courses/${id}/approve`);
    courses.value = courses.value.filter((course) => course._id !== id);
  } catch (error) {
    console.error('Approve error:', error);
  }
};

const rejectCourse = async (id: string) => {
  const confirmReject = confirm('Are you sure you want to reject this course?');
  if (!confirmReject) return;

  try {
    await api.delete(`/courses/${id}`);
    courses.value = courses.value.filter((course) => course._id !== id);
  } catch (error) {
    console.error('Reject error:', error);
  }
};

onMounted(() => {
  fetchPendingCourses();
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Pending Courses</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Title</th>
            <th class="p-4">Instructor</th>
            <th class="p-4">Category</th>
            <th class="p-4">Price</th>
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
              <td class="p-4">{{ course.category }}</td>
              <td class="p-4">${{ course.price }}</td>

              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" variant="default" @click="approveCourse(course._id)"> Approve </Button>

                <Button size="sm" variant="destructive" @click="rejectCourse(course._id)"> Reject </Button>

                <Button size="sm" @click="toggleDetails(course._id)"> View </Button>
              </td>
            </tr>

            <tr v-if="expandedId === course._id" class="bg-muted/40">
              <td colspan="5" class="p-6">
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
            <td colspan="5" class="p-6 text-center text-muted-foreground">No pending courses.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
