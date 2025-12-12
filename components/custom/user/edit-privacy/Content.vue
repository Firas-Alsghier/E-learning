<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
type Privacy = {
  showProfile: boolean;
  showReviews: boolean;
  allowMessages: boolean;
};

type MeResponse = {
  privacySettings?: Partial<Privacy>;
};

const showProfile = ref<boolean>(false);
const showReviews = ref<boolean>(false);
const allowMessages = ref<boolean>(false);
const isSaving = ref(false);
const auth = useAuthStore();
const { t } = useI18n();
// Load saved privacy settings on mount (client-side)
const loadPrivacy = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const me = await $fetch<MeResponse>('http://localhost:3001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (me?.privacySettings) {
      showProfile.value = !!me.privacySettings.showProfile;
      showReviews.value = !!me.privacySettings.showReviews;
      allowMessages.value = !!me.privacySettings.allowMessages;
    }
  } catch (err) {
    console.error('❌ Failed to load privacy settings:', err);
  }
};

onMounted(loadPrivacy);

// Save privacy settings
const savePrivacy = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    isSaving.value = true;

    const res = await $fetch<{ message: string; privacySettings?: Privacy }>('http://localhost:3001/api/auth/edit-privacy', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        showProfile: showProfile.value,
        showReviews: showReviews.value,
        allowMessages: allowMessages.value,
      },
    });

    // reflect saved values (no reload needed)
    if (res?.privacySettings) {
      showProfile.value = !!res.privacySettings.showProfile;
      showReviews.value = !!res.privacySettings.showReviews;
      allowMessages.value = !!res.privacySettings.allowMessages;
    }

    console.log('✅ Privacy saved:', res);
    location.reload();
  } catch (err) {
    console.error('❌ Error saving privacy:', err);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col my-6 gap-4">
    <!-- <h2 class="font-bold text-center my-4">إعدادات صفحة الملف الشخصي</h2> -->

    <div :class="auth.isEnglish ? 'text-left' : 'text-right'">
      <Checkbox v-model="showProfile" id="profile" />
      <label for="profile">{{ t('show-profile-label') }}</label>
    </div>

    <div :class="auth.isEnglish ? 'text-left' : 'text-right'">
      <Checkbox v-model="showReviews" id="reviews" />
      <label for="reviews">{{ t('show-reviews-label') }}</label>
    </div>

    <div :class="auth.isEnglish ? 'text-left' : 'text-right'">
      <Checkbox v-model="allowMessages" id="message" />
      <label for="message">{{ t('allow-messages-label') }}</label>
    </div>
    <div :class="auth.isEnglish ? 'text-left' : 'text-right'">
      <Button class="cursor-pointer w-fit" :disabled="isSaving" @click="savePrivacy">{{ t('save-btn') }}</Button>
    </div>
  </div>
</template>
