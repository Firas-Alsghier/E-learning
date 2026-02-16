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

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  reports: Report[];
}

const students = ref<Student[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
});

const fetchReportedStudents = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/students/reported');
    students.value = data.students;
  } catch (error) {
    console.error('Fetch reported students error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const blockStudent = async (id: string) => {
  try {
    await api.patch(`/students/${id}/block`);
    students.value = students.value.filter((student) => student._id !== id);
  } catch (error) {
    console.error('Block error:', error);
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

const clearReports = async (id: string) => {
  const confirmClear = confirm('Are you sure you want to clear all reports for this student?');
  if (!confirmClear) return;

  try {
    await api.patch(`/students/${id}/clear-reports`);
    students.value = students.value.filter((student) => student._id !== id);
  } catch (error) {
    console.error('Clear reports error:', error);
  }
};

onMounted(() => {
  fetchReportedStudents();
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Reported Students</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Reports</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="student in students" :key="student._id">
            <tr class="border-t">
              <td class="p-4 font-medium">{{ student.firstName }} {{ student.lastName }}</td>

              <td class="p-4">{{ student.email }}</td>

              <td class="p-4 text-red-600 font-semibold">
                {{ student.reports?.length || 0 }}
              </td>

              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" variant="outline" @click="blockStudent(student._id)"> Block </Button>

                <Button size="sm" variant="secondary" @click="clearReports(student._id)"> Clear Reports </Button>

                <Button size="sm" variant="destructive" @click="deleteStudent(student._id)"> Delete </Button>

                <Button size="sm" @click="toggleDetails(student._id)"> View Reports </Button>
              </td>
            </tr>

            <tr v-if="expandedId === student._id" class="bg-muted/40">
              <td colspan="4" class="p-6">
                <div class="space-y-4 text-sm">
                  <p>
                    <strong>Joined:</strong>
                    {{ new Date(student.createdAt).toLocaleDateString() }}
                  </p>

                  <div>
                    <p class="font-medium mb-2">Reports:</p>
                    <div v-for="report in student.reports" :key="report._id" class="border rounded p-3 mb-2 bg-white">
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

          <tr v-if="students.length === 0">
            <td colspan="4" class="p-6 text-center text-muted-foreground">No reported students.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
