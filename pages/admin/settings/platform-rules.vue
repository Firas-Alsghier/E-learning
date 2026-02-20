<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface PlatformRules {
  terms: string;
  privacy: string;
  requireAcceptanceOnSignup: boolean;
}

const form = ref<PlatformRules>({
  terms: '',
  privacy: '',
  requireAcceptanceOnSignup: true,
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

/* ---------------- FETCH ---------------- */
const fetchRules = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('http://localhost:3001/api/admin/settings/rules');
    form.value = data;
  } catch (error) {
    errorMessage.value = 'Failed to load platform rules';
  } finally {
    loading.value = false;
  }
};

/* ---------------- UPDATE ---------------- */
const updateRules = async () => {
  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const { data } = await axios.put('/api/admin/settings/rules', form.value);

    successMessage.value = data.message;
  } catch (error) {
    errorMessage.value = 'Failed to update platform rules';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRules);
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <h1 class="text-2xl font-semibold">Platform Rules</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="space-y-6">
      <!-- Terms -->
      <div>
        <label class="block mb-2 font-medium"> Terms & Conditions </label>
        <textarea v-model="form.terms" rows="8" class="border p-2 rounded w-full" placeholder="Enter platform terms and conditions..."></textarea>
      </div>

      <!-- Privacy -->
      <div>
        <label class="block mb-2 font-medium"> Privacy Policy </label>
        <textarea v-model="form.privacy" rows="8" class="border p-2 rounded w-full" placeholder="Enter privacy policy..."></textarea>
      </div>

      <!-- Require Acceptance -->
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.requireAcceptanceOnSignup" />
        <label> Require users to accept terms during signup </label>
      </div>

      <!-- Messages -->
      <p v-if="successMessage" class="text-green-600">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="text-red-600">
        {{ errorMessage }}
      </p>

      <!-- Save Button -->
      <button @click="updateRules" class="bg-black text-white px-4 py-2 rounded" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>
