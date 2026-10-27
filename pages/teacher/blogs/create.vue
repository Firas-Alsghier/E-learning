<script setup lang="ts">
import { ref } from 'vue';
import { Bold, Italic, Rss, NotebookPen, Underline, AlignLeft, AlignRight, Undo, Redo, Languages } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
const showModal = ref(false);
const isPublishing = ref(true);
const config = useRuntimeConfig();
definePageMeta({ layout: false });

// ✅ Format commands
const format = (cmd: string, value = '') => {
  document.execCommand(cmd, false, value);
};

// ✅ Image upload
const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    image.value = file;
    preview.value = URL.createObjectURL(file);
  }
};

// ✅ Add / remove tags
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

const handlePublishClick = () => {
  getContent(); // make sure content is updated

  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'الرجاء ملء جميع الحقول المطلوبة قبل النشر';
    return;
  }

  error.value = '';
  showModal.value = true; // ✅ open dialog only if inputs are valid
};

// ✅ Get HTML content
const getContent = () => {
  const editor = document.getElementById('editor');
  if (editor) content.value = editor.innerHTML;
};

// ✅ Handle confirm buttons (Publish or Draft)
const confirmAction = (publish: boolean) => {
  isPublishing.value = publish;
  showModal.value = false;
  handleSubmit();
};

// ✅ Submit form
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
    formData.append('isPublished', String(isPublishing.value)); // ✅ send publish or draft state
    if (image.value) formData.append('image', image.value);
    if (tags.value.length) formData.append('tags', JSON.stringify(tags.value));

    const res = await fetch(`${config.public.apiBase}/api/blogs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    success.value = isPublishing.value ? 'تم نشر المقال بنجاح ✅' : 'تم حفظ المقالة كمسودة 📝';
    setTimeout(() => router.push('/teacher/blogs'), 2000);
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء إنشاء المقالة';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-background py-10">
    <div class="max-w-3xl mx-auto space-y-6 p-6 bg-white dark:bg-card rounded-2xl shadow">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">✍️ إنشاء مقالة جديد</h1>
        <p class="text-gray-500">شارك أفكارك وخبراتك مع الطلاب</p>
      </div>

      <!-- Title -->
      <div>
        <label class="block text-sm font-medium mb-1 text-right">العنوان</label>
        <Input v-model="title" placeholder="أدخل عنوان المقال" class="text-right" />
      </div>

      <!-- Toolbar -->
      <div class="flex flex-wrap gap-2 border rounded-lg p-2 bg-gray-100 justify-center">
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('bold')" title="Bold"><Bold class="w-4 h-4" /></Button>
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('italic')" title="Italic"><Italic class="w-4 h-4" /></Button>
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('underline')" title="Underline"><Underline class="w-4 h-4" /></Button>
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('justifyLeft')" title="Align Left"><AlignLeft class="w-4 h-4" /></Button>
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('justifyRight')" title="Align Right"><AlignRight class="w-4 h-4" /></Button>
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('undo')" title="Undo"><Undo class="w-4 h-4" /></Button>
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('redo')" title="Redo"><Redo class="w-4 h-4" /></Button>
        <Button class="cursor-pointer" size="icon" variant="ghost" @click="format('direction', 'rtl')" title="Toggle RTL"><Languages class="w-4 h-4" /></Button>
      </div>

      <!-- Editor -->
      <div>
        <label class="block text-sm font-medium mb-1 text-right">المحتوى</label>
        <div id="editor" contenteditable="true" class="w-full border rounded-lg p-3 min-h-[250px] focus:outline-none focus:ring-2 focus:ring-indigo-200" placeholder="اكتب محتوى المقالة هنا..."></div>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium mb-1 text-right">الوسوم (Tags)</label>
        <div class="flex gap-2 mb-2">
          <Button type="button" class="cursor-pointer" @click="addTag">إضافة</Button>
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
        <label class="block text-sm font-medium mb-1 text-right">صورة المقالة</label>
        <Input type="file" accept="image/*" @change="handleImageUpload" />
        <img v-if="preview" :src="preview" alt="Preview" class="mt-3 w-full h-64 object-cover rounded-lg border" />
      </div>

      <!-- Publish or Draft -->
      <div class="flex justify-center gap-3">
        <Button variant="default" class="w-1/2 cursor-pointer" @click="handlePublishClick">نشر المقالة</Button>
      </div>

      <p v-if="success" class="text-green-600 text-center">{{ success }}</p>
      <p v-if="error && tags.length < 6" class="text-red-500 text-center">{{ error }}</p>
    </div>
  </div>

  <!-- 🧩 Publish/Draft Modal -->
  <Dialog v-model:open="showModal">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>هل ترغب في نشر المقالة أم حفظها كمسودة؟</DialogTitle>
      </DialogHeader>
      <DialogFooter class="flex justify-end gap-3">
        <Button class="cursor-pointer" variant="secondary" @click="confirmAction(false)"><NotebookPen /> حفظ كمسودة</Button>
        <Button class="cursor-pointer" variant="default" @click="confirmAction(true)"> <Rss /> نشر الآن</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
