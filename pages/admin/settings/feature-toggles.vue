<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface FeatureToggles {
  instructorRegistration: boolean;
  coupons: boolean;
  liveClasses: boolean;
  reviews: boolean;
  certificates: boolean;
  referralSystem: boolean;
}

const form = ref<FeatureToggles>({
  instructorRegistration: true,
  coupons: true,
  liveClasses: false,
  reviews: true,
  certificates: false,
  referralSystem: false,
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

/* ---------------- FETCH ---------------- */
const fetchFeatures = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get('http://localhost:3001/api/admin/settings/features');
    form.value = data;
  } catch (error) {
    errorMessage.value = 'Failed to load feature toggles';
  } finally {
    loading.value = false;
  }
};

/* ---------------- UPDATE ---------------- */
const updateFeatures = async () => {
  try {
    loading.value = true;
    successMessage.value = '';
    errorMessage.value = '';

    const { data } = await axios.put('/api/admin/settings/features', form.value);

    successMessage.value = data.message;
  } catch (error) {
    errorMessage.value = 'Failed to update feature toggles';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFeatures);
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <h1 class="text-2xl font-semibold">Feature Toggles</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>

    <div v-else class="space-y-4">
      <div class="flex items-center justify-between border p-3 rounded">
        <span>Instructor Registration</span>
        <input type="checkbox" v-model="form.instructorRegistration" />
      </div>

      <div class="flex items-center justify-between border p-3 rounded">
        <span>Coupons</span>
        <input type="checkbox" v-model="form.coupons" />
      </div>

      <div class="flex items-center justify-between border p-3 rounded">
        <span>Live Classes</span>
        <input type="checkbox" v-model="form.liveClasses" />
      </div>

      <div class="flex items-center justify-between border p-3 rounded">
        <span>Reviews</span>
        <input type="checkbox" v-model="form.reviews" />
      </div>

      <div class="flex items-center justify-between border p-3 rounded">
        <span>Certificates</span>
        <input type="checkbox" v-model="form.certificates" />
      </div>

      <div class="flex items-center justify-between border p-3 rounded">
        <span>Referral System</span>
        <input type="checkbox" v-model="form.referralSystem" />
      </div>

      <!-- Messages -->
      <p v-if="successMessage" class="text-green-600">
        {{ successMessage }}
      </p>

      <p v-if="errorMessage" class="text-red-600">
        {{ errorMessage }}
      </p>

      <!-- Save Button -->
      <button @click="updateFeatures" class="bg-black text-white px-4 py-2 rounded" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>
