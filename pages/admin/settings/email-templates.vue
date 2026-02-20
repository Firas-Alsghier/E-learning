<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface EmailTemplates {
  welcomeEmail: string;
  passwordReset: string;
  purchaseConfirmation: string;
  instructorApproval: string;
}

const form = ref<EmailTemplates>({
  welcomeEmail: '',
  passwordReset: '',
  purchaseConfirmation: '',
  instructorApproval: '',
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

/* ---------------- FETCH ---------------- */
const fetchTemplates = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('http://localhost:3001/api/admin/settings/emails');
    form.value = data;
  } catch (error) {
    errorMessage.value = 'Failed to load email templates';
  } finally {
    loading.value = false;
  }
};

/* ---------------- UPDATE ---------------- */
const updateTemplates = async () => {
  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const { data } = await axios.put('/api/admin/settings/emails', form.value);

    successMessage.value = data.message;
  } catch (error) {
    errorMessage.value = 'Failed to update email templates';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTemplates);
</script>

<template>
  <div class="space-y-6 max-w-4xl">
    <h1 class="text-2xl font-semibold">Email Templates</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="space-y-8">
      <!-- Welcome Email -->
      <div>
        <label class="block mb-2 font-medium"> Welcome Email Template </label>
        <textarea v-model="form.welcomeEmail" rows="6" class="border p-2 rounded w-full" placeholder="Use variables like {{userName}}"></textarea>
      </div>

      <!-- Password Reset -->
      <div>
        <label class="block mb-2 font-medium"> Password Reset Email Template </label>
        <textarea v-model="form.passwordReset" rows="6" class="border p-2 rounded w-full"></textarea>
      </div>

      <!-- Purchase Confirmation -->
      <div>
        <label class="block mb-2 font-medium"> Purchase Confirmation Template </label>
        <textarea v-model="form.purchaseConfirmation" rows="6" class="border p-2 rounded w-full"></textarea>
      </div>

      <!-- Instructor Approval -->
      <div>
        <label class="block mb-2 font-medium"> Instructor Approval Template </label>
        <textarea v-model="form.instructorApproval" rows="6" class="border p-2 rounded w-full"></textarea>
      </div>

      <!-- Messages -->
      <p v-if="successMessage" class="text-green-600">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="text-red-600">
        {{ errorMessage }}
      </p>

      <!-- Save Button -->
      <button @click="updateTemplates" class="bg-black text-white px-4 py-2 rounded" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>
