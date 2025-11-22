<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUser } from '~/composables/useUser';

const { user } = useUser();
const blogs = ref<any[]>([]);
const loading = ref(false);
const error = ref('');
const router = useRouter();

const fetchBlogs = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');

    const data: any = await $fetch('http://localhost:3001/api/blogs/my-blogs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    blogs.value = data.blogs || [];
  } catch (err: any) {
    error.value = err.data?.message || 'حدث خطأ أثناء جلب المقالات.';
  } finally {
    loading.value = false;
  }
};

// ✅ Publish draft
const handlePublish = async (id: string) => {
  if (!confirm('هل تريد نشر هذا المقال الآن؟')) return;

  try {
    const token = localStorage.getItem('token');
    const res: any = await $fetch(`http://localhost:3001/api/blogs/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { isPublished: true },
    });

    // Update locally
    const index = blogs.value.findIndex((b) => b._id === id);
    if (index !== -1) blogs.value[index].isPublished = true;

    alert('✅ تم نشر المقال بنجاح!');
  } catch (err: any) {
    alert(err.data?.message || 'حدث خطأ أثناء النشر.');
  }
};

// ✅ Delete blog
const handleDelete = async (id: string) => {
  if (!confirm('هل أنت متأكد أنك تريد حذف هذا المقال؟')) return;

  try {
    const token = localStorage.getItem('token');
    await $fetch(`http://localhost:3001/api/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    blogs.value = blogs.value.filter((b) => b._id !== id);
  } catch (err: any) {
    alert(err.data?.message || 'فشل حذف المقال.');
  }
};

onMounted(fetchBlogs);
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">📚 مقالاتي</h1>
      <Button @click="router.push('/teacher/blogs/create')">➕ مقال جديد</Button>
    </div>

    <div v-if="loading" class="text-gray-500">جاري التحميل...</div>
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <div v-if="blogs.length === 0 && !loading" class="text-gray-500">لا توجد مقالات بعد. يمكنك إنشاء أول مقال لك الآن.</div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="blog in blogs" :key="blog._id" class="relative overflow-hidden">
        <CardHeader class="flex justify-between items-start">
          <CardTitle class="text-lg font-semibold">{{ blog.title }}</CardTitle>
          <Badge v-if="!blog.isPublished" variant="secondary" class="bg-yellow-100 text-yellow-800"> 📝 مسودة </Badge>
          <Badge v-else variant="default" class="bg-green-100 text-green-800"> ✅ منشور </Badge>
        </CardHeader>

        <CardContent>
          <img v-if="blog.coverImage" :src="blog.coverImage" alt="Blog image" class="w-full h-40 object-cover rounded mb-3" />
          <p class="text-sm text-gray-600 line-clamp-3" v-html="blog.content"></p>

          <div class="flex justify-between items-center mt-4 gap-2">
            <Button variant="outline" size="sm" @click="router.push(`/teacher/blogs/edit/${blog._id}`)"> ✏️ تعديل </Button>

            <!-- ✅ Publish button for drafts only -->
            <Button v-if="!blog.isPublished" variant="default" size="sm" class="bg-blue-600 hover:bg-blue-700 text-white" @click="handlePublish(blog._id)"> 🚀 نشر </Button>

            <Button variant="destructive" size="sm" @click="handleDelete(blog._id)"> 🗑️ حذف </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
