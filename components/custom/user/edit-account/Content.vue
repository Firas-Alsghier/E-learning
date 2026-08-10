<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';
import { useUser } from '~/composables/useUser';

const router = useRouter();
const { setUser } = useUser();
const { t } = useI18n();
const auth = useAuthStore();

// --- Token MUST be loaded only on client
const token = ref<string | null>(null);

onMounted(() => {
  if (import.meta.client) {
    token.value = localStorage.getItem('token');
  }
});

// --- Email state
const email = ref(auth.user?.email);
const newEmail = ref('');
const passwordForEmail = ref('');

// --- Password state
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// --- Change Email ---
const changeEmail = async () => {
  if (!newEmail.value || !passwordForEmail.value) {
    alert('الرجاء إدخال البريد وكلمة المرور');
    return;
  }

  try {
    await $fetch('http://localhost:3001/api/auth/change-email', {
      method: 'PUT',
      body: {
        newEmail: newEmail.value,
        password: passwordForEmail.value,
      },
      headers: { Authorization: `Bearer ${token.value}` },
    });

    email.value = newEmail.value;
    alert('تم تحديث البريد الإلكتروني ✅');

    // Logout user
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
    setTimeout(() => location.reload(), 100);
  } catch (err) {
    console.error(err);
    alert('فشل تحديث البريد');
  }
};

// --- Change Password ---
const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    alert('الرجاء إدخال جميع الحقول');
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('كلمة المرور الجديدة غير متطابقة');
    return;
  }

  try {
    await $fetch('http://localhost:3001/api/auth/edit-account', {
      method: 'PUT',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      },
      headers: { Authorization: `Bearer ${token.value}` },
    });

    alert('تم تحديث كلمة المرور ✅');

    // Logout
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
    setTimeout(() => location.reload(), 100);
  } catch (err) {
    console.error(err);
    alert('فشل تحديث كلمة المرور');
  }
};
</script>

<template>
  <form @submit.prevent="changePassword" class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <!-- ── Section: Email ──────────────────────────────────────────────────── -->
    <!--
      The email modal is CSS-only:
      A hidden <input type="checkbox"> acts as open/close state.
      The "Edit" button is a <label> that checks it (opens).
      The backdrop and Cancel are <label>s that uncheck it (close).
      No script changes needed.
    -->
    <div class="px-6 sm:px-8 py-7 border-b border-gray-100">
      <div class="flex items-center gap-2.5 mb-6" :class="auth.isEnglish ? 'flex-row' : 'flex-row-reverse'">
        <div class="w-1 h-5 rounded-full bg-orange-500 shrink-0"></div>
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">
          {{ t('your-email-password') }}
        </h3>
      </div>

      <!-- Wrapper — the checkbox must be a sibling BEFORE the elements it controls -->
      <div class="relative">
        <!-- Hidden checkbox: controls modal open/close via CSS peer -->
        <input type="checkbox" id="email-modal-ctrl" class="peer/emailmodal sr-only" />

        <!-- Email row -->
        <div class="flex flex-col sm:flex-row gap-3 max-w-lg" :class="auth.isEnglish ? '' : 'flex-row-reverse'">
          <!-- Edit button → opens modal by checking the checkbox -->
          <label
            for="email-modal-ctrl"
            class="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#171717] hover:bg-black text-white text-sm font-semibold cursor-pointer transition-colors shrink-0 select-none"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536M9 11l6.536-6.536a2 2 0 112.828 2.828L11.828 13.828A4 4 0 019 15H8v-1a4 4 0 011.172-2.828z"
              />
            </svg>
            {{ t('edit-btn') }}
          </label>

          <!-- Current email (readonly display) -->
          <input
            v-model="email"
            readonly
            type="email"
            class="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-default focus:outline-none"
            :class="auth.isEnglish ? 'text-left' : 'text-right'"
          />
        </div>

        <!-- ── Email change modal (shown via peer-checked CSS) ───────────── -->
        <div class="hidden peer-checked/emailmodal:flex fixed inset-0 z-50 items-center justify-center p-4">
          <!-- Backdrop — clicking it closes the modal (uncheck via label) -->
          <label for="email-modal-ctrl" class="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"></label>

          <!-- Dialog card -->
          <div class="relative z-10 bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden">
            <!-- Modal header -->
            <div class="px-6 py-5 border-b border-gray-100">
              <h2 class="text-base font-bold text-gray-900" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                {{ t('change-email-title') }}
              </h2>
              <p class="text-sm text-gray-400 mt-1 leading-relaxed" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                {{ t('change-email-desc') }}
              </p>
            </div>

            <!-- Modal body -->
            <div class="px-6 py-5 flex flex-col gap-4">
              <!-- New email -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-600" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                  {{ t('new-email') }}
                </label>
                <input
                  v-model="newEmail"
                  type="email"
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors"
                  :class="auth.isEnglish ? 'text-left' : 'text-right'"
                />
              </div>

              <!-- Password -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-gray-600" :class="auth.isEnglish ? 'text-left' : 'text-right'">
                  {{ t('password') }}
                </label>
                <input
                  v-model="passwordForEmail"
                  type="password"
                  class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors"
                  :class="auth.isEnglish ? 'text-left' : 'text-right'"
                />
              </div>
            </div>

            <!-- Modal footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <!-- Cancel → unchecks checkbox, closes modal -->
              <label
                for="email-modal-ctrl"
                class="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer select-none"
              >
                {{ t('cancel') }}
              </label>

              <!-- Confirm → calls changeEmail (redirects on success, so modal closes via navigation) -->
              <button type="button" @click.prevent="changeEmail" class="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-black text-white text-sm font-bold cursor-pointer transition-colors">
                {{ t('confirm') }}
              </button>
            </div>

            <!-- Close × -->
            <label
              for="email-modal-ctrl"
              class="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </label>
          </div>
        </div>
        <!-- ── End modal ── -->
      </div>
    </div>

    <!-- ── Section: Change Password ───────────────────────────────────────── -->
    <div class="px-6 sm:px-8 py-7 border-b border-gray-100">
      <div class="flex items-center gap-2.5 mb-6" :class="auth.isEnglish ? 'flex-row' : 'flex-row-reverse'">
        <div class="w-1 h-5 rounded-full bg-orange-500 shrink-0"></div>
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-widest">Change Password</h3>
      </div>

      <div class="flex flex-col gap-5 max-w-lg">
        <!-- Current password -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-600" :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('current-password') }}
          </label>
          <input
            v-model="currentPassword"
            type="password"
            class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors"
            :class="auth.isEnglish ? 'text-left' : 'text-right'"
          />
        </div>

        <!-- New password -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-600" :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('new-password') }}
          </label>
          <input
            v-model="newPassword"
            type="password"
            class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors"
            :class="auth.isEnglish ? 'text-left' : 'text-right'"
          />
        </div>

        <!-- Confirm new password -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-semibold text-gray-600" :class="auth.isEnglish ? 'text-left' : 'text-right'">
            {{ t('confirm-new-password') }}
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400/25 focus:border-orange-400 transition-colors"
            :class="auth.isEnglish ? 'text-left' : 'text-right'"
          />
          <!-- Hint -->
          <p class="text-xs text-gray-400" :class="auth.isEnglish ? 'text-left' : 'text-right'">Use at least 8 characters with a mix of letters and numbers.</p>
        </div>
      </div>
    </div>

    <!-- ── Footer: Save button ────────────────────────────────────────────── -->
    <div class="px-6 sm:px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
      <p class="text-xs text-gray-400">Saving will log you out so you can sign in with your new password.</p>
      <button
        type="submit"
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_20px_rgba(255,120,45,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shrink-0"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ t('save-btn') }}
      </button>
    </div>
  </form>
</template>
