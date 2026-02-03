<script setup lang="ts">
import { useRouter } from 'vue-router';

definePageMeta({
  layout: false,
  middleware: ['teacher-signup-success'],
});

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center space-y-4">
      <h1 class="text-2xl font-bold text-green-600">✅ Request Sent Successfully</h1>

      <p class="text-gray-600">
        Thank you for signing up as a teacher.
        <br />
        Your account is currently under review.
      </p>

      <p class="text-sm text-gray-500">Once approved by the admin, you’ll be able to log in and start creating courses.</p>

      <Button class="w-full mt-4" @click="goHome"> Go to Home </Button>
    </div>
  </div>
</template>
