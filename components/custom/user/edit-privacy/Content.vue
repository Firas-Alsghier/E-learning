<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from '#app'; // Nuxt composable for API calls

// ✅ reactive checkboxes
const showProfile = ref(true);
const showReviews = ref(true);
const allowMessages = ref(true);

// ✅ save function
const savePrivacy = async () => {
  try {
    const token = localStorage.getItem('token'); // adjust if you store token differently

    const { data, error } = await useFetch('http://localhost:3001/api/auth/edit-privacy', {
      method: 'PUT',
      body: {
        showProfile: showProfile.value,
        showReviews: showReviews.value,
        allowMessages: allowMessages.value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error.value) {
      console.error('❌ Error saving privacy:', error.value);
    } else {
      console.log('✅ Privacy saved:', data.value);
    }
  } catch (err) {
    console.error('❌ Request failed:', err);
  }
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="font-bold">إعدادات صفحة الملف الشخصي</h2>

    <div>
      <Checkbox v-model:checked="showProfile" id="profile" />
      <label for="profile">إظهار ملفك الشخصي للمستخدمين المسجلين</label>
    </div>

    <div>
      <Checkbox v-model:checked="showReviews" id="reviews" />
      <label for="reviews">السماح للمستخدمين بمشاهدة تعليقاتي على الدورات</label>
    </div>

    <div>
      <Checkbox v-model:checked="allowMessages" id="message" />
      <label for="message">السماح للآخرين بمراسلتي</label>
    </div>

    <!-- ✅ connect button to function -->
    <Button class="cursor-pointer w-fit" @click="savePrivacy">حفظ</Button>
  </div>
</template>
