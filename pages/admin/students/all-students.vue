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
  createdAt: string;
  isBlocked?: boolean;
}

const students = ref<Student[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
});

const fetchStudents = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/students');
    students.value = data.students;
  } catch (error) {
    console.error('Fetch students error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const getStatus = (student: Student) => {
  return student.isBlocked ? 'Blocked' : 'Active';
};

const blockStudent = async (id: string) => {
  try {
    await api.patch(`/students/${id}/block`);

    students.value = students.value.map((student) => (student._id === id ? { ...student, isBlocked: true } : student));
  } catch (error) {
    console.error('Block student error:', error);
  }
};

const deleteStudent = async (id: string) => {
  const confirmDelete = confirm('Are you sure you want to permanently delete this student?');
  if (!confirmDelete) return;

  try {
    await api.delete(`/students/${id}`);
    students.value = students.value.filter((student) => student._id !== id);
  } catch (error) {
    console.error('Delete student error:', error);
  }
};

onMounted(() => {
  fetchStudents();
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">All Students</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Status</th>
            <th class="p-4">Joined</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="student in students" :key="student._id">
            <tr class="border-t">
              <td class="p-4 font-medium">{{ student.firstName }} {{ student.lastName }}</td>

              <td class="p-4">{{ student.email }}</td>

              <td class="p-4">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': getStatus(student) === 'Active',
                    'bg-red-100 text-red-700': getStatus(student) === 'Blocked',
                  }"
                >
                  {{ getStatus(student) }}
                </span>
              </td>

              <td class="p-4">
                {{ new Date(student.createdAt).toLocaleDateString() }}
              </td>

              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" @click="toggleDetails(student._id)"> View </Button>

                <Button size="sm" variant="outline" @click="blockStudent(student._id)"> Block </Button>

                <Button size="sm" variant="destructive" @click="deleteStudent(student._id)"> Delete </Button>
              </td>
            </tr>

            <tr v-if="expandedId === student._id" class="bg-muted/40">
              <td colspan="5" class="p-6">
                <div class="space-y-2 text-sm">
                  <p><strong>Student ID:</strong> {{ student._id }}</p>
                  <p><strong>Email:</strong> {{ student.email }}</p>
                  <p>
                    <strong>Account Created:</strong>
                    {{ new Date(student.createdAt).toLocaleString() }}
                  </p>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="students.length === 0">
            <td colspan="5" class="p-6 text-center text-muted-foreground">No students found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
