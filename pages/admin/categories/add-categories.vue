<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

const categories = ref<Category[]>([]);
const search = ref<string>('');
const loading = ref<boolean>(false);

const showModal = ref<boolean>(false);
const selectedCategory = ref<Category | null>(null);

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin/categories',
});

/* ---------------- FETCH ---------------- */
const fetchCategories = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/', {
      params: { search: search.value },
    });
    categories.value = data.categories;
  } catch (error) {
    console.error('Fetch failed', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCategories);
watch(search, fetchCategories);

/* ---------------- DELETE (SOFT) ---------------- */
const deleteCategory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category?')) return;

  try {
    await api.delete(`/${id}`);
    fetchCategories();
  } catch (error) {
    console.error('Delete failed', error);
  }
};

/* ---------------- OPEN MODAL ---------------- */
const openEditModal = (category: Category) => {
  selectedCategory.value = { ...category };
  showModal.value = true;
};

/* ---------------- UPDATE ---------------- */
const updateCategory = async () => {
  if (!selectedCategory.value) return;

  try {
    await api.put(`/${selectedCategory.value._id}`, {
      name: selectedCategory.value.name,
      description: selectedCategory.value.description,
      isActive: selectedCategory.value.isActive,
    });

    showModal.value = false;
    fetchCategories();
  } catch (error) {
    console.error('Update failed', error);
  }
};
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-semibold">All Categories</h1>

    <!-- 🔎 Search -->
    <input v-model="search" type="text" placeholder="Search category..." class="border rounded px-3 py-2 w-full max-w-sm text-sm" />

    <!-- 📋 Table -->
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

            <td class="p-4">{{ category.slug }}</td>

            <td class="p-4">
              <span :class="category.isActive ? 'text-green-600' : 'text-red-600'">
                {{ category.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>

            <td class="p-4">
              {{ new Date(category.createdAt).toLocaleDateString() }}
            </td>

            <td class="p-4 text-right space-x-3">
              <button @click="openEditModal(category)" class="text-blue-600 text-sm">Edit</button>

              <button @click="deleteCategory(category._id)" class="text-red-600 text-sm">Delete</button>
            </td>
          </tr>

          <tr v-if="categories.length === 0">
            <td colspan="5" class="p-6 text-center text-gray-500">No categories found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✏ EDIT MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 class="text-lg font-semibold">Edit Category</h2>

        <input v-model="selectedCategory!.name" type="text" class="border rounded px-3 py-2 w-full text-sm" />

        <textarea v-model="selectedCategory!.description" rows="3" class="border rounded px-3 py-2 w-full text-sm" />

        <div class="flex items-center gap-2">
          <input type="checkbox" v-model="selectedCategory!.isActive" />
          <span class="text-sm">Active</span>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button @click="showModal = false" class="border px-4 py-2 rounded text-sm">Cancel</button>

          <button @click="updateCategory" class="bg-black text-white px-4 py-2 rounded text-sm">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>
