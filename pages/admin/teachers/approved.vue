<!-- pages/admin/teachers/approved.vue -->
<script setup>
import { ref, onMounted } from 'vue';
const { $api } = useNuxtApp();

definePageMeta({
  layout: false,
});

const expandedId = ref(null);
const teachers = ref([]);
const loading = ref(false);
const error = ref('');

const toggleDetails = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// Fetch approved teachers
onMounted(async () => {
  loading.value = true;
  error.value = '';

  try {
    const data = await $api('http://localhost:3001/api/admin/teachers/approved');

    teachers.value = data.map((t) => ({
      id: t._id,
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      country: t.country,
      gender: t.gender,
      language: t.language,
      headline: t.headline,
      bio: t.bio,
      isApproved: t.isApproved,
      isBlocked: t.isBlocked,
      createdAt: new Date(t.updatedAt || t.createdAt).toLocaleDateString(),
    }));
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load approved teachers';
  } finally {
    loading.value = false;
  }
});

// Block teacher
const blockTeacher = async (id) => {
  if (!confirm('Block this teacher?')) return;

  try {
    await $api(`http://localhost:3001/api/admin/teachers/${id}/block`, {
      method: 'PATCH',
    });

    // remove from approved list instantly
    teachers.value = teachers.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error(err);
    alert('Failed to block teacher');
  }
};

// Revoke approval (optional: sets isApproved = false)
const revokeTeacher = async (id) => {
  if (!confirm('Revoke approval for this teacher?')) return;

  try {
    await $api(`http://localhost:3001/api/admin/teachers/${id}/revoke`, {
      method: 'PATCH',
    });

    teachers.value = teachers.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error(err);
    alert('Failed to revoke approval');
  }
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl text-center mt-6 font-semibold">Approved Teachers</h1>

    <div v-if="loading" class="text-sm text-muted-foreground">Loading...</div>
    <div v-if="error" class="text-sm text-red-500">{{ error }}</div>

    <div class="border rounded-lg bg-white overflow-hidden" v-if="!loading">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Country</th>
            <th class="p-4">Approved Date</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="teacher in teachers" :key="teacher.id">
            <!-- Main Row -->
            <tr class="border-t text-center">
              <td class="p-4 font-medium">{{ teacher.firstName }} {{ teacher.lastName }}</td>
              <td class="p-4">{{ teacher.email }}</td>
              <td class="p-4">{{ teacher.country }}</td>
              <td class="p-4">{{ teacher.createdAt }}</td>

              <td class="p-4 flex gap-2 justify-center">
                <Button class="cursor-pointer" size="sm" @click="toggleDetails(teacher.id)">View</Button>
                <Button class="cursor-pointer" size="sm" variant="outline" @click="blockTeacher(teacher.id)">Block</Button>
                <Button class="cursor-pointer" size="sm" variant="destructive" @click="revokeTeacher(teacher.id)"> Revoke </Button>
              </td>
            </tr>

            <!-- Expanded Details -->
            <tr v-if="expandedId === teacher.id" class="bg-muted/40">
              <td colspan="5" class="p-6">
                <div class="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p><strong>Gender:</strong> {{ teacher.gender }}</p>
                    <p><strong>Language:</strong> {{ teacher.language }}</p>
                    <p><strong>Status:</strong> ✅ Approved</p>
                  </div>

                  <div>
                    <p><strong>Blocked:</strong> ❌</p>
                    <p><strong>Role:</strong> Teacher</p>
                  </div>

                  <div class="md:col-span-2">
                    <p class="font-medium">Headline</p>
                    <p class="text-muted-foreground">{{ teacher.headline || '—' }}</p>
                  </div>

                  <div class="md:col-span-2">
                    <p class="font-medium">Bio</p>
                    <p class="text-muted-foreground">{{ teacher.bio || '—' }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
