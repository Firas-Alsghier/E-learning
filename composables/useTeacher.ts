// import { ref } from 'vue';

// const teacher = ref<any>(null);

// export const useTeacher = () => {
//   const setTeacher = (data: any) => {
//     teacher.value = data;
//   };

//   const loadTeacher = () => {
//     if (!import.meta.client) return;
//     const saved = localStorage.getItem('teacher');
//     if (saved) teacher.value = JSON.parse(saved);
//   };

//   const logout = () => {
//     localStorage.removeItem('teacher');
//     localStorage.removeItem('teacher_token');
//     teacher.value = null;
//     navigateTo('/teacher/login');
//   };

//   return {
//     teacher,
//     setTeacher,
//     loadTeacher,
//     logout,
//   };
// };
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
