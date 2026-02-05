<script setup>
import { ref } from 'vue';

const expandedId = ref(null);

const teachers = ref([
  {
    id: '1',
    firstName: 'Ahmed',
    lastName: 'Ali',
    email: 'ahmed@example.com',
    country: 'Libya',
    gender: 'male',
    language: 'ar',
    headline: 'Web Developer',
    bio: '10 years experience in full-stack development',
    isApproved: false,
    isBlocked: false,
    createdAt: '2026-01-20',
  },
]);

const toggleDetails = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Pending Teachers</h1>

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
            <tr class="border-t">
              <td class="p-4 font-medium">{{ teacher.firstName }} {{ teacher.lastName }}</td>
              <td class="p-4">{{ teacher.email }}</td>
              <td class="p-4">{{ teacher.country }}</td>
              <td class="p-4">{{ teacher.createdAt }}</td>
              <td class="p-4 flex gap-2 justify-center">
                <Button size="sm" @click="toggleDetails(teacher.id)"> View </Button>
                <Button size="sm">Approve</Button>
                <Button size="sm" variant="destructive">Reject</Button>
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
                    <p><strong>Approved:</strong> ❌</p>
                    <p><strong>Blocked:</strong> ❌</p>
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
        </tbody>
      </table>
    </div>
  </div>
</template>
