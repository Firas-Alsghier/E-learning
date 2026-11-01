<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
const { t } = useI18n();
const config = useRuntimeConfig();

type NotificationPreferences = {
  teacherNotifications: boolean;
  coursePurchase: boolean;
  welcome: boolean;
  courseCompletion: boolean;
};

type NotificationResponse = {
  notificationPreferences?: NotificationPreferences;
};

const preferences = ref<NotificationPreferences>({
  teacherNotifications: true,
  coursePurchase: true,
  welcome: true,
  courseCompletion: true,
});

const isSaving = ref(false);

const loadPreferences = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const me = await $fetch<NotificationResponse>(`${config.public.apiBase}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (me?.notificationPreferences) {
      preferences.value = {
        teacherNotifications: me.notificationPreferences.teacherNotifications ?? true,
        coursePurchase: me.notificationPreferences.coursePurchase ?? true,
        welcome: me.notificationPreferences.welcome ?? true,
        courseCompletion: me.notificationPreferences.courseCompletion ?? true,
      };
    }
  } catch (err) {
    console.error('Failed to load notifications:', err);
  }
};

onMounted(loadPreferences);

const savePreferences = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    isSaving.value = true;

    const res = await $fetch<{
      success: boolean;
      data: NotificationPreferences;
    }>(`${config.public.apiBase}/api/auth/notifications`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: preferences.value,
    });

    if (res.success) {
      preferences.value = res.data;
      alert('تم حفظ التفضيلات بنجاح ✅');
      window.location.reload();
    }
  } catch (err) {
    console.error('Error saving notifications:', err);
    alert('خطأ في الاتصال بالخادم');
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <form class="space-y-8 bg-[#f9f9f9] p-6 rounded-xl" @submit.prevent="savePreferences">
    <div class="border rounded-lg overflow-hidden">
      <div class="flex items-center justify-center p-4 border-b">
        <h2 class="text-lg font-semibold">
          {{ t('notification-preferences-title') }}
        </h2>
      </div>

      <div class="space-y-4 px-4 py-4">
        <div class="flex items-center gap-2" :class="auth.isEnglish ? 'justify-start' : 'justify-end'">
          <Checkbox v-model="preferences.teacherNotifications" />
          <label>{{ t('teacher-notifications-label') }}</label>
        </div>

        <div class="flex items-center gap-2" :class="auth.isEnglish ? 'justify-start' : 'justify-end'">
          <Checkbox v-model="preferences.coursePurchase" />
          <label>{{ t('course-purchase-label') }}</label>
        </div>

        <div class="flex items-center gap-2" :class="auth.isEnglish ? 'justify-start' : 'justify-end'">
          <Checkbox v-model="preferences.welcome" />
          <label>{{ t('welcome-notification-label') }}</label>
        </div>

        <div class="flex items-center gap-2" :class="auth.isEnglish ? 'justify-start' : 'justify-end'">
          <Checkbox v-model="preferences.courseCompletion" />
          <label>{{ t('course-completion-label') }}</label>
        </div>
      </div>
    </div>

    <p class="text-sm text-muted-foreground leading-relaxed" :class="auth.isEnglish ? 'text-left' : 'text-right'">
      {{ t('prefs-note') }}
    </p>

    <div class="flex justify-end">
      <Button class="cursor-pointer" :disabled="isSaving">
        {{ isSaving ? 'Saving...' : t('save-btn') }}
      </Button>
    </div>
  </form>
</template>
