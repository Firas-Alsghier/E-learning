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
const search = ref<string>('');
const loading = ref<boolean>(false);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin/students',
});

const fetchEnrollments = async () => {
  try {
    loading.value = true;

    const { data } = await api.get('/enrollments', {
      params: { search: search.value },
    });

    enrollments.value = data.enrollments;
  } catch (error) {
    console.error('Failed to fetch enrollments', error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

onMounted(fetchEnrollments);
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Enrollment History</h2>

    <!-- 🔎 Search -->
    <div class="mb-4">
      <input v-model="search" @input="fetchEnrollments" type="text" placeholder="Search by student name, email or ID..." class="border p-2 rounded w-full" />
    </div>

    <!-- 📊 Table -->
    <div v-if="loading" class="mb-4 text-gray-500">Loading...</div>

    <table v-else class="w-full border">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2 border">Student</th>
          <th class="p-2 border">Course</th>
          <th class="p-2 border">Price</th>
          <th class="p-2 border">Payment</th>
          <th class="p-2 border">Progress</th>
          <th class="p-2 border">Date</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="enrollment in enrollments" :key="enrollment._id">
          <td class="p-2 border">
            {{ enrollment.student?.firstName }}
            {{ enrollment.student?.lastName }}
            <div class="text-sm text-gray-500">
              {{ enrollment.student?.email }}
            </div>
          </td>

          <td class="p-2 border">
            {{ enrollment.course?.title }}
          </td>

          <td class="p-2 border">${{ enrollment.price }}</td>

          <td class="p-2 border">
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

          <td class="p-2 border">{{ enrollment.progress }}%</td>

          <td class="p-2 border">
            {{ formatDate(enrollment.createdAt) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!loading && enrollments.length === 0" class="mt-4 text-gray-500">No enrollments found.</div>
  </div>
</template>
