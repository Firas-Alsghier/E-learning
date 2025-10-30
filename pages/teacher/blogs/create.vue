<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bold, Italic, Underline, AlignLeft, AlignRight, Undo, Redo, Languages } from 'lucide-vue-next';

const router = useRouter();

const title = ref('');
const content = ref('');
const tags = ref<string[]>([]);
const tagInput = ref('');
const image = ref<File | null>(null);
const preview = ref('');
const loading = ref(false);
const success = ref('');
const error = ref('');

definePageMeta({ layout: false });

// ✅ Execute formatting command
const format = (cmd: string, value = '') => {
  document.execCommand(cmd, false, value);
};

// ✅ Handle image upload
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    image.value = file;
    preview.value = URL.createObjectURL(file);
  }
};

// ✅ Add / remove tags with limit (6)
const addTag = () => {
  if (!tagInput.value.trim()) return;

  if (tags.value.length >= 6) {
    error.value = 'لا يمكنك إضافة أكثر من 6 وسوم';
    tagInput.value = '';
    return;
  }

  if (!tags.value.includes(tagInput.value.trim())) {
    tags.value.push(tagInput.value.trim());
    tagInput.value = '';
    error.value = '';
  }
};
const removeTag = (tag: string) => {
  tags.value = tags.value.filter((t) => t !== tag);
  error.value = '';
};

// ✅ Get HTML content
const getContent = () => {
  const editor = document.getElementById('editor');
  if (editor) content.value = editor.innerHTML;
};

// ✅ Submit blog
const handleSubmit = async () => {
  getContent();
  if (!title.value || !content.value) {
    error.value = 'الرجاء ملء جميع الحقول المطلوبة';
    return;
  }

  loading.value = true;
  success.value = '';
  error.value = '';

  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    if (image.value) formData.append('image', image.value);
    if (tags.value.length) formData.append('tags', JSON.stringify(tags.value));

    const res = await fetch('http://localhost:3001/api/blogs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    success.value = data.message || 'تم نشر المقال بنجاح ✅';
    setTimeout(() => router.push('/teacher/blogs'), 2500);
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء إنشاء المقال';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-background py-10">
    <div class="max-w-3xl mx-auto space-y-6 p-6 bg-white dark:bg-card rounded-2xl shadow">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">✍️ إنشاء مقال جديد</h1>
        <p class="text-gray-500">شارك أفكارك وخبراتك مع الطلاب</p>
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium mb-1 text-right">العنوان</label>
        <Input v-model="title" placeholder="أدخل عنوان المقال" class="text-right" />
      </div>

      <!-- Toolbar -->
      <div class="flex flex-wrap gap-2 border rounded-lg p-2 bg-gray-100 justify-center">
        <Button size="icon" variant="ghost" @click="format('bold')" title="Bold"><Bold class="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" @click="format('italic')" title="Italic"><Italic class="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" @click="format('underline')" title="Underline"><Underline class="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" @click="format('justifyLeft')" title="Align Left"><AlignLeft class="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" @click="format('justifyRight')" title="Align Right"><AlignRight class="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" @click="format('undo')" title="Undo"><Undo class="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" @click="format('redo')" title="Redo"><Redo class="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" @click="format('direction', 'rtl')" title="Toggle RTL"><Languages class="w-4 h-4" /></Button>
      </div>

      <!-- Live Editor -->
      <div>
        <label class="block text-sm font-medium mb-1 text-right">المحتوى</label>
        <div id="editor" contenteditable="true" class="w-full border rounded-lg p-3 min-h-[250px] focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="اكتب محتوى المقال هنا..."></div>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium mb-1 text-right">الوسوم (Tags)</label>
        <div class="flex gap-2 mb-2">
          <Button type="button" @click="addTag">إضافة</Button>
          <Input v-model="tagInput" class="text-right" placeholder="أضف وسمًا..." @keyup.enter="addTag" />
        </div>
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500">عدد الوسوم: {{ tags.length }}/6</p>
          <p v-if="error && tags.length >= 6" class="text-xs text-red-500">{{ error }}</p>
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-for="tag in tags" :key="tag" class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full cursor-pointer hover:bg-indigo-200" @click="removeTag(tag)"> {{ tag }} ✕ </span>
        </div>
      </div>

      <!-- Image Upload -->
      <div>
        <label class="block text-sm font-medium mb-1 text-right">صورة المقال</label>
        <Input type="file" accept="image/*" @change="handleImageUpload" />
        <img v-if="preview" :src="preview" alt="Preview" class="mt-3 w-full h-64 object-cover rounded-lg border" />
      </div>

      <!-- Submit -->
      <div class="flex justify-center">
        <Button @click="handleSubmit" class="w-full cursor-pointer" :disabled="loading">
          <span v-if="loading">جارٍ النشر...</span>
          <span v-else>نشر المقال</span>
        </Button>
      </div>

      <p v-if="success" class="text-green-600 text-center">{{ success }}</p>
      <p v-if="error && tags.length < 6" class="text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>
