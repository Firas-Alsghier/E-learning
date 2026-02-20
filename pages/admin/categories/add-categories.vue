<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
definePageMeta({
  layout: false,
});
const name = ref('');
const description = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const submitCategory = async () => {
  if (!name.value.trim()) {
    errorMessage.value = 'Category name is required';
    return;
  }

  try {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await axios.post('http://localhost:3001/api/admin/categories', {
      name: name.value,
      description: description.value,
    });

    successMessage.value = 'Category created successfully';

    // Reset form
    name.value = '';
    description.value = '';
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to create category';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="add-category m-auto">
    <h2 class="title text-center mt-6">Add New Category</h2>

    <form @submit.prevent="submitCategory" class="form">
      <!-- Category Name -->
      <div class="form-group">
        <label>Category Name</label>
        <input v-model="name" type="text" placeholder="Enter category name" />
      </div>

      <!-- Description -->
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="description" rows="4" placeholder="Enter description (optional)"></textarea>
      </div>

      <!-- Error Message -->
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>

      <!-- Success Message -->
      <p v-if="successMessage" class="success">
        {{ successMessage }}
      </p>

      <!-- Submit Button -->
      <button type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Category' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.add-category {
  max-width: 500px;
  padding: 20px;
}

.title {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

input,
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #6b7280;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  margin-bottom: 10px;
}

.success {
  color: #16a34a;
  margin-bottom: 10px;
}
</style>
