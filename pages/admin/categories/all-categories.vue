<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
definePageMeta({
  layout: false,
});
interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive?: boolean;
  createdAt: string;
}

const categories = ref<Category[]>([]);
const search = ref('');
const loading = ref(false);
const editingId = ref<string | null>(null);

const editName = ref('');
const editDescription = ref('');
const editActive = ref(true);

const fetchCategories = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('http://localhost:3001/api/admin/categories', {
      params: { search: search.value },
    });
    categories.value = data.categories;
  } catch (error) {
    console.error('Fetch categories error:', error);
  } finally {
    loading.value = false;
  }
};

const startEdit = (category: Category) => {
  editingId.value = category._id;
  editName.value = category.name;
  editDescription.value = category.description || '';
  editActive.value = category.isActive ?? true;
};

const cancelEdit = () => {
  editingId.value = null;
};

const updateCategory = async (id: string) => {
  try {
    await axios.put(`http://localhost:3001/api/admin/categories/${id}`, {
      name: editName.value,
      description: editDescription.value,
      isActive: editActive.value,
    });

    editingId.value = null;
    fetchCategories();
  } catch (error) {
    console.error('Update category error:', error);
  }
};

const deleteCategory = async (id: string) => {
  const confirmDelete = confirm('Are you sure you want to delete this category?');
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:3001/api/admin/categories/${id}`);
    categories.value = categories.value.filter((c) => c._id !== id);
  } catch (error) {
    console.error('Delete category error:', error);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl text-center mt-6 font-semibold">All Categories</h1>

    <!-- 🔎 Search -->
    <div>
      <input v-model="search" @input="fetchCategories" type="text" placeholder="Search categories..." class="border p-2 rounded w-full" />
    </div>

    <!-- 📦 Table -->
    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="border rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-3 text-center">Name</th>
            <th class="p-3 text-center">Slug</th>
            <th class="p-3 text-center">Status</th>
            <th class="p-3 text-center">Created</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="category in categories" :key="category._id" class="border-t text-center">
            <!-- EDIT MODE -->
            <template v-if="editingId === category._id">
              <td class="p-3">
                <input v-model="editName" class="border p-1 rounded w-full" />
              </td>

              <td class="p-3">{{ category.slug }}</td>

              <td class="p-3">
                <select v-model="editActive" class="border p-1 rounded">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </td>

              <td class="p-3">
                {{ new Date(category.createdAt).toLocaleDateString() }}
              </td>

              <td class="p-3 flex gap-2 justify-center">
                <Button class="bg-green-600 text-white px-2 py-1 rounded" @click="updateCategory(category._id)">Save</Button>

                <Button class="bg-gray-400 text-white px-2 py-1 rounded" @click="cancelEdit">Cancel</Button>
              </td>
            </template>

            <!-- NORMAL MODE -->
            <template v-else>
              <td class="p-3 font-medium">
                {{ category.name }}
              </td>

              <td class="p-3">
                {{ category.slug }}
              </td>

              <td class="p-3">
                <span
                  :class="{
                    'text-green-600': category.isActive,
                    'text-red-600': category.isActive === false,
                  }"
                >
                  {{ category.isActive === false ? 'Inactive' : 'Active' }}
                </span>
              </td>

              <td class="p-3">
                {{ new Date(category.createdAt).toLocaleDateString() }}
              </td>

              <td class="p-3 flex gap-2 justify-center">
                <Button class="bg-blue-600 cursor-pointer text-white px-2 py-1 rounded" @click="startEdit(category)">Edit</Button>

                <Button class="bg-red-600 cursor-pointer text-white px-2 py-1 rounded" @click="deleteCategory(category._id)">Delete</Button>
              </td>
            </template>
          </tr>

          <tr v-if="categories.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500">No categories found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
