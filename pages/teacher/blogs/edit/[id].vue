<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser } from '~/composables/useUser';

const route = useRoute();
const router = useRouter();
const { user } = useUser();

const title = ref('');
const content = ref('');
const previewUrl = ref<string | null>(null);
const imageFile = ref<File | null>(null);
const loading = ref(false);

const blogId = route.params.id;

// ✅ Load existing blog data
const fetchBlog = async () => {
  try {
    const res: any = await $fetch(`/api/blogs/${blogId}`);
    title.value = res.title;
    content.value = res.content;
    previewUrl.value = res.image ? res.image : null;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchBlog();
});

// ✅ Handle image preview
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

// ✅ Update blog
const updateBlog = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Unauthorized');

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    await $fetch(`/api/blogs/${blogId}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('✅ تم تحديث المقال بنجاح!');
    router.push('/teacher/blogs');
  } catch (err) {
    console.error('Error updating blog:', err);
    alert('حدث خطأ أثناء التحديث');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto py-10">
    <h1 class="text-3xl font-bold mb-6">✏️ تعديل المقال</h1>

    <form @submit.prevent="updateBlog" class="space-y-6 bg-white p-6 rounded-2xl shadow">
      <!-- Title -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">العنوان</label>
        <input v-model="title" type="text" class="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-indigo-200" placeholder="أدخل عنوان المقال" required />
      </div>

      <!-- Content -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">المحتوى</label>
        <textarea v-model="content" rows="8" class="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-indigo-200" placeholder="اكتب مقالك هنا..." required></textarea>
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block text-gray-700 font-medium mb-2">الصورة</label>
        <input type="file" accept="image/*" @change="onFileChange" class="mb-3" />
        <div v-if="previewUrl" class="mt-2">
          <img :src="previewUrl" alt="Preview" class="rounded-lg w-full max-h-64 object-cover border" />
        </div>
      </div>

      <!-- Submit -->
      <button type="submit" :disabled="loading" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
        {{ loading ? 'جارٍ التحديث...' : 'تحديث المقال' }}
      </button>
    </form>
  </div>
</template>
