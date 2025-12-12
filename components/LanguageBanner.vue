<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';
import { useDirection } from '~/composables/useDirection'; // Re-importing the custom composable

// Get the necessary functions/state
const { locale } = useI18n();
const langStore = useAuthStore();
const dir = useDirection(); // Initializing the custom composable

// Show/hide banner persist
const STORAGE_HIDE = 'hide_lang_banner';
const show = ref(true);

onMounted(() => {
  const h = import.meta.client && localStorage.getItem(STORAGE_HIDE);
  show.value = h !== '1';
  // initialize lang store
  langStore.initLanguage();
});

// banner text depending on locale
const bannerText = computed(() => (locale.value === 'ar' ? 'If you want to switch to English click the button' : 'إذا أردت التحويل إلى العربية اضغط الزر'));

const buttonLabel = computed(() => (locale.value === 'ar' ? 'English' : 'العربية'));

const switchLang = () => {
  // Switch locale + HTML dir
  location.reload();
  dir.toggle();

  // Update pinia isEnglish flag
  langStore.isEnglish = dir.current.value !== 'ar';

  // 🔥 Reload page AFTER switching language
};

// const dismiss = () => {
//   show.value = false;
//   if (import.meta.client) localStorage.setItem(STORAGE_HIDE, '1');
// };
</script>

<template>
  <div v-if="show" class="w-full bg-[#f3f6f9] text-[#123] py-3 px-4 flex items-center justify-center">
    <p class="text-sm mx-3">
      {{ bannerText }}
    </p>

    <div class="flex items-center gap-2 dir">
      <button class="px-3 py-1 rounded-md border cursor-pointer hover:bg-gray-100" @click="switchLang">
        {{ buttonLabel }}
      </button>

      <!-- <button class="text-xs text-gray-500" @click="dismiss">×</button> -->
    </div>
  </div>
</template>

<style scoped>
/* small style adjust if needed */
</style>
