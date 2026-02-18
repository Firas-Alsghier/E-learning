<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

definePageMeta({
  layout: false,
});

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Course {
  _id: string;
  title: string;
}

interface Enrollment {
  _id: string;
  student: Student;
  course: Course;
  price: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
  progress: number;
  createdAt: string;
}

const enrollments = ref<Enrollment[]>([]);
const search = ref('');
const loading = ref(false);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
});

const fetchEnrollments = async () => {
  try {
    loading.value = true;

    const { data } = await api.get('/enrollments', {
      params: { search: search.value },
    });

    enrollments.value = data.enrollments;
  } catch (error) {
    console.error('Fetch enrollments error:', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

onMounted(fetchEnrollments);
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Enrollment History</h1>

    <!-- 🔎 Search -->
    <div>
      <input v-model="search" @input="fetchEnrollments" type="text" placeholder="Search by student name, email or ID..." class="border rounded px-3 py-2 w-full max-w-md text-sm" />
    </div>

    <!-- 📊 Table -->
    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Student</th>
            <th class="p-4">Course</th>
            <th class="p-4">Price</th>
            <th class="p-4">Payment</th>
            <th class="p-4">Progress</th>
            <th class="p-4">Enrolled At</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="enrollment in enrollments" :key="enrollment._id" class="border-t">
            <td class="p-4">
              {{ enrollment.student?.firstName }}
              {{ enrollment.student?.lastName }}
              <div class="text-xs text-muted-foreground">
                {{ enrollment.student?.email }}
              </div>
            </td>

            <td class="p-4">
              {{ enrollment.course?.title }}
            </td>

            <td class="p-4">${{ enrollment.price }}</td>

            <td class="p-4">
              <span
                :class="{
                  'text-green-600': enrollment.paymentStatus === 'paid',
                  'text-yellow-600': enrollment.paymentStatus === 'pending',
                  'text-red-600': enrollment.paymentStatus === 'failed',
                }"
              >
                {{ enrollment.paymentStatus }}
              </span>
            </td>

            <td class="p-4">{{ enrollment.progress }}%</td>

            <td class="p-4">
              {{ formatDate(enrollment.createdAt) }}
            </td>
          </tr>

          <tr v-if="enrollments.length === 0">
            <td colspan="6" class="p-6 text-center text-muted-foreground">No enrollments found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
