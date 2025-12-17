import { defineStore } from 'pinia';

export interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    teacher: null as Teacher | null,
    token: null as string | null,
    loading: false,
  }),

  actions: {
    setTeacher(data: Teacher, token: string) {
      this.teacher = data;
      this.token = token;

      if (import.meta.client) {
        localStorage.setItem('teacher', JSON.stringify(data));
        localStorage.setItem('teacher_token', token);
      }
    },

    loadTeacher() {
      if (!import.meta.client) return;

      const teacher = localStorage.getItem('teacher');
      const token = localStorage.getItem('teacher_token');

      if (teacher && token) {
        this.teacher = JSON.parse(teacher);
        this.token = token;
      }
    },

    logout() {
      this.teacher = null;
      this.token = null;

      if (import.meta.client) {
        localStorage.removeItem('teacher');
        localStorage.removeItem('teacher_token');
      }

      navigateTo('/teacher/login');
    },
  },
});
