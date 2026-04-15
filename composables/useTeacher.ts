// composables/useTeacher.ts
import { useTeacherStore } from '~/stores/teacher';

export const useTeacher = () => {
  const teacherStore = useTeacherStore();

  // On initialization, load from cookies
  if (!teacherStore.token) {
    teacherStore.loadTeacher();
  }

  return {
    teacher: computed(() => teacherStore.teacher),
    isLoggedIn: computed(() => teacherStore.isLoggedIn),
    logout: () => teacherStore.logout(),
    // Helper to get the raw token for manual fetch calls
    token: computed(() => teacherStore.token),
  };
};
