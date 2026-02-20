<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface CommissionSettings {
  globalRate: number;
  instructorOverrideAllowed: boolean;
  minimumPayout: number;
}

const form = ref<CommissionSettings>({
  globalRate: 20,
  instructorOverrideAllowed: false,
  minimumPayout: 50,
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

/* ---------------- FETCH ---------------- */
const fetchCommission = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('http://localhost:3001/api/admin/settings/commission');
    form.value = data;
  } catch (error) {
    errorMessage.value = 'Failed to load commission settings';
  } finally {
    loading.value = false;
  }
};

/* ---------------- UPDATE ---------------- */
const updateCommission = async () => {
  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const { data } = await axios.put('/api/admin/settings/commission', form.value);

    successMessage.value = data.message;
  } catch (error) {
    errorMessage.value = 'Failed to update commission settings';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCommission);
</script>

<template>
  <div class="space-y-6 max-w-xl">
    <h1 class="text-2xl font-semibold">Commission Settings</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="space-y-4">
      <!-- Global Commission Rate -->
      <div>
        <label class="block mb-1 font-medium"> Global Commission Rate (%) </label>
        <input type="number" min="0" max="100" v-model.number="form.globalRate" class="border p-2 rounded w-full" />
      </div>

      <!-- Minimum Payout -->
      <div>
        <label class="block mb-1 font-medium"> Minimum Payout Threshold </label>
        <input type="number" min="0" v-model.number="form.minimumPayout" class="border p-2 rounded w-full" />
      </div>

      <!-- Instructor Override -->
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.instructorOverrideAllowed" />
        <label> Allow Instructor Commission Override </label>
      </div>

      <!-- Messages -->
      <p v-if="successMessage" class="text-green-600">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="text-red-600">
        {{ errorMessage }}
      </p>

      <!-- Save Button -->
      <button @click="updateCommission" class="bg-black text-white px-4 py-2 rounded" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>
