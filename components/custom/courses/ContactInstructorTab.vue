<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
const props = defineProps<{
  teacherId: string;
  courseId: string;
}>();

const message = ref('');
const loading = ref(false);
const success = ref(false);
const selectedFile = ref<File | null>(null);
const sending = ref(false);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

function handleFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (file.size > MAX_FILE_SIZE) {
    alert('File must be smaller than 100MB');
    return;
  }

  selectedFile.value = file;
}

function removeFile() {
  selectedFile.value = null;
}

const sendMessage = async () => {
  if (!message.value.trim() && !selectedFile.value) return;

  try {
    loading.value = true;

    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('teacherId', props.teacherId);
    formData.append('courseId', props.courseId);
    formData.append('text', message.value);

    if (selectedFile.value) {
      formData.append('attachment', selectedFile.value);
    }

    await $fetch('http://localhost:3001/api/messages/contact-teacher', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    message.value = '';
    selectedFile.value = null;
    success.value = true;
  } catch (err) {
    console.error('Send message error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 max-w-2xl m-auto text-center">
    <!-- Title -->
    <div>
      <h3 class="text-xl font-semibold">Contact Instructor</h3>
      <p class="text-gray-500 text-sm">Send a message directly to the course instructor.</p>
    </div>

    <!-- Message textarea -->
    <div>
      <textarea v-model="message" placeholder="اكتب رسالتك للمدرس..." class="w-full border rounded-lg p-3" rows="4" />
    </div>

    <!-- File Upload -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-600"> Attachment (optional) </label>

      <input type="file" @change="handleFile" class="block w-full text-sm" />

      <p class="text-xs text-gray-400">Maximum file size: 100MB</p>

      <!-- File Preview -->
      <div v-if="selectedFile" class="flex items-center justify-between bg-gray-50 border rounded-lg p-3">
        <span class="text-sm">
          {{ selectedFile.name }}
        </span>

        <button @click="removeFile" class="text-red-500 text-sm hover:underline">Remove</button>
      </div>
    </div>

    <!-- Send Button -->
    <button @click="sendMessage" :disabled="loading" class="bg-orange-500 text-white px-4 py-2 rounded-lg disabled:opacity-50">إرسال الرسالة</button>

    <p v-if="success" class="text-green-600">تم إرسال الرسالة بنجاح</p>
  </div>
</template>
