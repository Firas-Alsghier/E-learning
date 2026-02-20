<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({ layout: false });

const expandedId = ref(null);
const teachers = ref([]);
const loading = ref(false);
const error = ref('');

const adminToken = () => localStorage.getItem('admin_token');

const toggleDetails = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// ✅ MUST BE HERE (top-level)
const approveTeacher = async (id) => {
  if (!confirm('Approve this teacher?')) return;
  try {
    await $fetch(`http://localhost:3001/api/admin/teachers/${id}/approve`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken()}`,
      },
    });

    teachers.value = teachers.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error(err);
    alert('Failed to approve teacher');
  }
};

const rejectTeacher = async (id) => {
  if (!confirm('Reject and delete this teacher?')) return;

  try {
    await $fetch(`http://localhost:3001/api/admin/teachers/${id}/reject`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken()}`,
      },
    });

    teachers.value = teachers.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error(err);
    alert('Failed to reject teacher');
  }
};

// onMounted ONLY for fetching
onMounted(async () => {
  loading.value = true;

  try {
    const data = await $fetch('http://localhost:3001/api/admin/teachers/pending', {
      headers: {
        Authorization: `Bearer ${adminToken()}`,
      },
    });
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
      createdAt: new Date(t.createdAt).toLocaleDateString(),
    }));
    console.log(teachers);
  } catch (err) {
    error.value = 'Failed to load pending teachers';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <!-- <AppSidebarAdmin /> -->
  <div class="space-y-6">
    <h1 class="text-2xl text-center mt-6 font-semibold">Pending Teachers</h1>

    <div class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Country</th>
            <th class="p-4">Signup Date</th>
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
                <Button class="cursor-pointer" size="sm" @click="toggleDetails(teacher.id)"> View </Button>
                <Button class="cursor-pointer" size="sm" @click="approveTeacher(teacher.id)"> Approve </Button>
                <Button class="cursor-pointer" size="sm" @click="rejectTeacher(teacher.id)" variant="destructive"> Reject </Button>
              </td>
            </tr>

            <!-- Expanded Details -->
            <tr v-if="expandedId === teacher.id" class="bg-muted/40">
              <td colspan="5" class="p-6">
                <div class="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p><strong>Gender:</strong> {{ teacher.gender }}</p>
                    <p><strong>Language:</strong> {{ teacher.language }}</p>
                    <p><strong>Role:</strong> Teacher</p>
                  </div>

                  <div>
                    <p><strong>Approved:</strong> {{ teacher.isApproved }}</p>
                    <p><strong>Blocked:</strong> {{ teacher.isBlocked }}</p>
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
            <td colspan="5" class="p-6 text-center text-muted-foreground">No pending teachers.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
