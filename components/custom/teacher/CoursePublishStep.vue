<script setup lang="ts">
import axios from 'axios';

const props = defineProps<{
  courseId: string | null;
}>();

const emit = defineEmits<{
  (e: 'published'): void;
}>();

const isPublishing = ref(false);

const publishCourse = async () => {
  if (!props.courseId) {
    alert('Course ID missing');
    return;
  }

  isPublishing.value = true;

  try {
    const token = localStorage.getItem('teacher_token');

    if (!token) {
      alert('Not authenticated');
      return;
    }

    await axios.patch(
      `http://localhost:3001/api/teacher/courses/${props.courseId}/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert('🎉 Course published successfully!');
    emit('published');
  } catch (err: any) {
    console.error('Publish error:', err);
    alert(err?.response?.data?.message || 'Failed to publish course');
  } finally {
    isPublishing.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto text-center space-y-6">
    <h1 class="text-2xl font-bold text-gray-800">Ready to Publish?</h1>

    <p class="text-gray-600">Before publishing, make sure:</p>

    <ul class="text-left list-disc list-inside text-gray-600 space-y-2">
      <li>Your course information is complete</li>
      <li>You added at least one section and lesson</li>
      <li>Pricing is correct</li>
    </ul>

    <div class="pt-6">
      <button @click="publishCourse" :disabled="isPublishing" class="px-8 py-3 bg-green-600 text-white rounded-lg cursor-pointer font-semibold hover:bg-green-700 transition disabled:opacity-50">
        {{ isPublishing ? 'Publishing...' : 'Publish Course' }}
      </button>
    </div>

    <p class="text-sm text-gray-400">Once published, students will be able to see your course.</p>
  </div>
</template>
