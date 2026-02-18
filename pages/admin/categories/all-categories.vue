<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

definePageMeta({
  layout: false,
});

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

const router = useRouter();
const categories = ref<Category[]>([]);
const loading = ref<boolean>(false);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin/categories',
});

const fetchCategories = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/');
    categories.value = data.categories;
  } catch (error) {
    console.error('Failed to fetch categories', error);
  } finally {
    loading.value = false;
  }
};

const deleteCategory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category?')) return;

  try {
    await api.delete(`/${id}`);
    fetchCategories();
  } catch (error) {
    console.error('Delete failed', error);
  }
};

const goToEdit = (id: string) => {
  router.push(`/admin/categories/edit/${id}`);
};

onMounted(fetchCategories);
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold">All Categories</h1>

      <button @click="$router.push('/admin/categories/add')" class="bg-black text-white px-4 py-2 rounded text-sm">+ Add Category</button>
    </div>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-4">Name</th>
            <th class="p-4">Slug</th>
            <th class="p-4">Status</th>
            <th class="p-4">Created</th>
            <th class="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="category in categories" :key="category._id" class="border-t">
            <td class="p-4 font-medium">
              {{ category.name }}
              <div class="text-xs text-gray-500">
                {{ category.description }}
              </div>
            </td>

            <td class="p-4">
              {{ category.slug }}
            </td>

            <td class="p-4">
              <span :class="category.isActive ? 'text-green-600' : 'text-red-600'">
                {{ category.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>

            <td class="p-4">
              {{ new Date(category.createdAt).toLocaleDateString() }}
            </td>

            <td class="p-4 text-right space-x-2">
              <button @click="goToEdit(category._id)" class="text-blue-600 text-sm">Edit</button>

              <button @click="deleteCategory(category._id)" class="text-red-600 text-sm">Delete</button>
            </td>
          </tr>

          <tr v-if="categories.length === 0">
            <td colspan="5" class="p-6 text-center text-gray-500">No categories found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
