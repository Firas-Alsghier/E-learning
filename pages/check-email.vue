<template>
  <div class="flex flex-col items-center justify-center h-screen text-center px-4">
    <div class="max-w-md">
      <img src="/assets/svgs/email-inbox.svg" alt="Email sent" class="w-40 mx-auto mb-6" />
      <h1 class="text-3xl font-semibold mb-2">Check your email 📩</h1>
      <p class="text-gray-600 mb-4">
        We've sent a verification link to <strong>{{ email }}</strong
        >. Please open it to verify your account.
      </p>

      <p class="text-sm text-gray-500 mb-6">Didn’t get the email? Check your spam folder or click the button below to resend.</p>

      <button @click="resendEmail" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Resend Email</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref } from 'vue';

const route = useRoute();
const email = ref(route.query.email || ''); // email passed from signup

const resendEmail = async () => {
  try {
    await axios.post('http://localhost:5000/api/auth/resend-verification', { email: email.value });
    alert('Verification email sent again!');
  } catch (err) {
    console.error(err);
    alert('Failed to resend email.');
  }
};
</script>
