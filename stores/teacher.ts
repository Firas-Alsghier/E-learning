import { defineStore } from 'pinia';
import type { Teacher } from '@/types/teacher';

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    teacher: null as Teacher | null,
    token: null as string | null,
  }),

  getters: {
    // ✅ Now this getter will work perfectly for your v-if buttons!
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    setTeacher(data: Teacher, token: string) {
      this.teacher = data;
      this.token = token;

      // ✅ Sync with Cookies (so middleware can see it)
      const tToken = useCookie('teacher_token', { maxAge: 60 * 60 * 24 * 7 });
      const tData = useCookie('teacher_data', { maxAge: 60 * 60 * 24 * 7 });

      tToken.value = token;
      tData.value = JSON.stringify(data);
    },

    loadTeacher() {
      // ✅ Pull from Cookies instead of LocalStorage
      const token = useCookie('teacher_token').value;
      const data = useCookie('teacher_data').value;

      if (token && data) {
        this.token = token;
        this.teacher = typeof data === 'string' ? JSON.parse(data) : data;
      }
    },

    logout() {
      this.teacher = null;
      this.token = null;

      // ✅ Clear Cookies
      useCookie('teacher_token').value = null;
      useCookie('teacher_data').value = null;
      localStorage.removeItem('teacher');
      localStorage.removeItem('teacher_token');
      location.reload();
      navigateTo('/');
    },
  },
});
