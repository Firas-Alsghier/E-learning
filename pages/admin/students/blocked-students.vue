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
}

const students = ref<Student[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
});

const fetchBlockedStudents = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/students/blocked');
    students.value = data.students;
  } catch (error) {
    console.error('Fetch blocked students error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const unblockStudent = async (id: string) => {
  try {
    await api.patch(`/students/${id}/unblock`);
    students.value = students.value.filter((student) => student._id !== id);
  } catch (error) {
    console.error('Unblock error:', error);
  }
};

const deleteStudent = async (id: string) => {
  const confirmDelete = confirm('Are you sure you want to permanently delete this student?');
  if (!confirmDelete) return;

  try {
    await api.delete(`/students/${id}`);
    students.value = students.value.filter((student) => student._id !== id);
  } catch (error) {
    console.error('Delete error:', error);
  }
};

onMounted(() => {
  fetchBlockedStudents();
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Blocked Students</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
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
                {{ new Date(student.createdAt).toLocaleDateString() }}
              </td>

              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" variant="outline" @click="unblockStudent(student._id)"> Unblock </Button>

                <Button size="sm" variant="destructive" @click="deleteStudent(student._id)"> Delete </Button>

                <Button size="sm" @click="toggleDetails(student._id)"> View </Button>
              </td>
            </tr>

            <tr v-if="expandedId === student._id" class="bg-muted/40">
              <td colspan="4" class="p-6">
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
            <td colspan="4" class="p-6 text-center text-muted-foreground">No blocked students.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
