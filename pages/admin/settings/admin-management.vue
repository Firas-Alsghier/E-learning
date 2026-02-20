<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const admins = ref<AdminUser[]>([]);
const loading = ref(false);

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'admin',
});

const successMessage = ref('');
const errorMessage = ref('');

/* ---------------- FETCH ADMINS ---------------- */
const fetchAdmins = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('http://localhost:3001/api/admin/management');
    admins.value = data;
  } catch (error) {
    errorMessage.value = 'Failed to load admins';
  } finally {
    loading.value = false;
  }
};

/* ---------------- ADD ADMIN ---------------- */
const addAdmin = async () => {
  try {
    successMessage.value = '';
    errorMessage.value = '';

    await axios.post('http://localhost:3001/api/admin/management', form.value);

    successMessage.value = 'Admin created successfully';

    form.value = {
      name: '',
      email: '',
      password: '',
      role: 'admin',
    };

    fetchAdmins();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create admin';
  }
};

/* ---------------- UPDATE ROLE ---------------- */
const updateRole = async (admin: AdminUser) => {
  try {
    await axios.put(`http://localhost:3001/api/admin/management/${admin._id}`, {
      role: admin.role,
    });

    successMessage.value = 'Role updated successfully';
  } catch (error) {
    errorMessage.value = 'Failed to update role';
  }
};

/* ---------------- DELETE ---------------- */
const deleteAdmin = async (id: string) => {
  if (!confirm('Are you sure you want to delete this admin?')) return;

  try {
    await axios.delete(`http://localhost:3001/api/admin/management/${id}`);
    successMessage.value = 'Admin deleted successfully';
    fetchAdmins();
  } catch (error) {
    errorMessage.value = 'Failed to delete admin';
  }
};

onMounted(fetchAdmins);
</script>

<template>
  <div class="space-y-8 max-w-4xl">
    <h1 class="text-2xl font-semibold">Admin & Supervisor Management</h1>

    <!-- Add Admin Form -->
    <div class="border p-6 rounded space-y-4">
      <h2 class="text-lg font-medium">Add New Admin</h2>

      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.name" type="text" placeholder="Full Name" class="border p-2 rounded" />
        <input v-model="form.email" type="email" placeholder="Email" class="border p-2 rounded" />
        <input v-model="form.password" type="password" placeholder="Password" class="border p-2 rounded" />
        <select v-model="form.role" class="border p-2 rounded">
          <option value="admin">Admin</option>
          <option value="supervisor">Supervisor</option>
        </select>
      </div>

      <button @click="addAdmin" class="bg-black text-white px-4 py-2 rounded">Create</button>
    </div>

    <!-- Messages -->
    <p v-if="successMessage" class="text-green-600">
      {{ successMessage }}
    </p>

    <p v-if="errorMessage" class="text-red-600">
      {{ errorMessage }}
    </p>

    <!-- Admin List -->
    <div class="border p-6 rounded space-y-4">
      <h2 class="text-lg font-medium">Existing Admins</h2>

      <div v-if="loading" class="text-gray-500">Loading...</div>

      <div v-for="admin in admins" :key="admin._id" class="flex items-center justify-between border p-3 rounded">
        <div>
          <p class="font-medium">{{ admin.name }}</p>
          <p class="text-sm text-gray-500">{{ admin.email }}</p>
        </div>

        <div class="flex items-center gap-3">
          <select v-model="admin.role" @change="updateRole(admin)" class="border p-1 rounded">
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
          </select>

          <button @click="deleteAdmin(admin._id)" class="text-red-600 text-sm">Delete</button>
        </div>
      </div>

      <div v-if="admins.length === 0" class="text-gray-500">No admins found</div>
    </div>
  </div>
</template>
