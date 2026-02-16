<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

definePageMeta({
  layout: false,
});

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  gender: string;
  language: string;
  headline?: string;
  bio?: string;
  createdAt: string;
}

const teachers = ref<Teacher[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);

const token = process.client ? localStorage.getItem('adminToken') : null;

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const fetchBlockedTeachers = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/teachers/blocked');
    teachers.value = data;
  } catch (error) {
    console.error('Fetch blocked teachers error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const unblockTeacher = async (id: string) => {
  try {
    await api.patch(`/teachers/${id}/unblock`);
    teachers.value = teachers.value.filter((t) => t._id !== id);
  } catch (error) {
    console.error('Unblock error:', error);
  }
};

const deletePermanently = async (id: string) => {
  const firstConfirm = confirm('You are deleting this teacher permanently. This cannot be undone.');
  if (!firstConfirm) return;

  const secondConfirm = confirm('Are you absolutely sure you want to permanently delete this teacher?');
  if (!secondConfirm) return;

  try {
    await api.delete(`/teachers/${id}/hard-delete`);
    teachers.value = teachers.value.filter((t) => t._id !== id);
  } catch (error) {
    console.error('Hard delete error:', error);
  }
};

onMounted(() => {
  fetchBlockedTeachers();
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Blocked Teachers</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Country</th>
            <th class="p-4">Blocked Date</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="teacher in teachers" :key="teacher._id">
            <tr class="border-t">
              <td class="p-4 font-medium">{{ teacher.firstName }} {{ teacher.lastName }}</td>
              <td class="p-4">{{ teacher.email }}</td>
              <td class="p-4">{{ teacher.country }}</td>
              <td class="p-4">
                {{ new Date(teacher.createdAt).toLocaleDateString() }}
              </td>

              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" @click="toggleDetails(teacher._id)"> View </Button>

                <Button size="sm" variant="outline" @click="unblockTeacher(teacher._id)"> Unblock </Button>

                <Button size="sm" variant="destructive" @click="deletePermanently(teacher._id)"> Delete Permanently </Button>
              </td>
            </tr>

            <tr v-if="expandedId === teacher._id" class="bg-muted/40">
              <td colspan="5" class="p-6">
                <div class="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p><strong>Gender:</strong> {{ teacher.gender }}</p>
                    <p><strong>Language:</strong> {{ teacher.language }}</p>
                    <p><strong>Status:</strong> ⛔ Blocked</p>
                  </div>

                  <div>
                    <p><strong>Role:</strong> Teacher</p>
                  </div>

                  <div class="md:col-span-2">
                    <p class="font-medium">Headline</p>
                    <p class="text-muted-foreground">
                      {{ teacher.headline || '—' }}
                    </p>
                  </div>

                  <div class="md:col-span-2">
                    <p class="font-medium">Bio</p>
                    <p class="text-muted-foreground">
                      {{ teacher.bio || '—' }}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="teachers.length === 0">
            <td colspan="5" class="p-6 text-center text-muted-foreground">No blocked teachers found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
