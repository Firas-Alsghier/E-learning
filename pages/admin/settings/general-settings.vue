<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface GeneralSettings {
  platformName: string;
  logoUrl: string;
  contactEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
}

const form = ref<GeneralSettings>({
  platformName: '',
  logoUrl: '',
  contactEmail: '',
  supportPhone: '',
  defaultCurrency: 'USD',
  maintenanceMode: false,
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

/* ---------------- FETCH SETTINGS ---------------- */
const fetchSettings = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('http://localhost:3001/api/admin/settings/general');
    form.value = data;
  } catch (error) {
    errorMessage.value = 'Failed to load settings';
  } finally {
    loading.value = false;
  }
};

/* ---------------- UPDATE SETTINGS ---------------- */
const updateSettings = async () => {
  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const { data } = await axios.put('/api/admin/settings/general', form.value);

    successMessage.value = data.message;
  } catch (error) {
    errorMessage.value = 'Failed to update settings';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSettings);
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <h1 class="text-2xl font-semibold">General Settings</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="space-y-4">
      <!-- Platform Name -->
      <div>
        <label class="block mb-1 font-medium">Platform Name</label>
        <input v-model="form.platformName" type="text" class="border p-2 rounded w-full" />
      </div>

      <!-- Logo URL -->
      <div>
        <label class="block mb-1 font-medium">Logo URL</label>
        <input v-model="form.logoUrl" type="text" class="border p-2 rounded w-full" />
      </div>

      <!-- Contact Email -->
      <div>
        <label class="block mb-1 font-medium">Contact Email</label>
        <input v-model="form.contactEmail" type="email" class="border p-2 rounded w-full" />
      </div>

      <!-- Support Phone -->
      <div>
        <label class="block mb-1 font-medium">Support Phone</label>
        <input v-model="form.supportPhone" type="text" class="border p-2 rounded w-full" />
      </div>

      <!-- Default Currency -->
      <div>
        <label class="block mb-1 font-medium">Default Currency</label>
        <select v-model="form.defaultCurrency" class="border p-2 rounded w-full">
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      <!-- Maintenance Mode -->
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.maintenanceMode" />
        <label>Enable Maintenance Mode</label>
      </div>

      <!-- Messages -->
      <p v-if="successMessage" class="text-green-600">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="text-red-600">
        {{ errorMessage }}
      </p>

      <!-- Save Button -->
      <button @click="updateSettings" class="bg-black text-white px-4 py-2 rounded" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>
