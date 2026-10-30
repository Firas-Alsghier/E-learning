<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { toast } from 'vue-sonner';
definePageMeta({
  layout: false,
});

interface Course {
  _id: string;
  title: string;
  category: string;
  price: number;
  createdAt: string;
  accessDuration?: number;
  teacher: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isPublished?: boolean;
  isBlocked?: boolean;
}
onMounted(() => {
  fetchCourses();
});

const courses = ref<Course[]>([]);
const expandedId = ref<string | null>(null);
const durationCourse = ref<Course | null>(null);
const durationInput = ref(90);
const isSavingDuration = ref(false);
const loading = ref(false);
const config = useRuntimeConfig();
const token = import.meta.client ? localStorage.getItem('adminToken') : null;

const api = axios.create({
  baseURL: `${config.public.apiBase}/api/admin`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const openDurationDialog = (course: Course) => {
  durationCourse.value = course;
  durationInput.value = course.accessDuration ?? 90;
};

const closeDurationDialog = () => {
  durationCourse.value = null;
};

const saveDuration = async () => {
  if (!durationCourse.value) return;

  try {
    isSavingDuration.value = true;

    const { data } = await api.patch(`/courses/${durationCourse.value._id}/duration`, { accessDuration: Number(durationInput.value) });

    courses.value = courses.value.map((course) => (course._id === durationCourse.value!._id ? { ...course, accessDuration: data.accessDuration } : course));

    closeDurationDialog();
    toast.success('Course access duration updated successfully!');
  } catch (error) {
    console.error('Save course duration error:', error);
  } finally {
    isSavingDuration.value = false;
  }
};

const fetchCourses = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/courses');
    courses.value = data.courses;
  } catch (error) {
    console.error('Fetch courses error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const getStatus = (course: Course) => {
  if (course.isBlocked) return 'Blocked';
  if (course.isPublished) return 'Published';
  return 'Draft';
};

const blockCourse = async (id: string) => {
  try {
    await api.patch(`/courses/${id}/block`);

    courses.value = courses.value.map((course) => (course._id === id ? { ...course, isBlocked: true } : course));
  } catch (error) {
    console.error('Block course error:', error);
  }
};

const unblockCourse = async (id: string) => {
  try {
    await api.patch(`/courses/${id}/unblock`);

    // ✅ Update UI instantly
    courses.value = courses.value.map((course) => (course._id === id ? { ...course, isBlocked: false } : course));
  } catch (error) {
    console.error('Unblock course error:', error);
  }
};

const deleteCourse = async (id: string) => {
  const confirmDelete = confirm('Are you sure you want to permanently delete this course?');
  if (!confirmDelete) return;

  try {
    await api.delete(`/courses/${id}`);
    courses.value = courses.value.filter((course) => course._id !== id);
  } catch (error) {
    console.error('Delete course error:', error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl text-center mt-6 font-semibold">All Courses</h1>

    <div v-if="loading" class="text-muted-foreground">Loading...</div>

    <div v-else class="border rounded-lg bg-white overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted">
          <tr>
            <th class="p-4">Title</th>
            <th class="p-4">Teacher</th>
            <th class="p-4">Category</th>
            <th class="p-4">Price</th>
            <th class="p-4">Status</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="course in courses" :key="course._id">
            <tr class="border-t text-center">
              <td class="p-4 font-medium">{{ course.title }}</td>
              <td class="p-4">{{ course.teacher?.firstName }} {{ course.teacher?.lastName }}</td>
              <td class="p-4">{{ course.category }}</td>
              <td class="p-4">${{ course.price }}</td>
              <td class="p-4">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-700': getStatus(course) === 'Published',
                    'bg-yellow-100 text-yellow-700': getStatus(course) === 'Draft',
                    'bg-red-100 text-red-700': getStatus(course) === 'Blocked',
                  }"
                >
                  {{ getStatus(course) }}
                </span>
              </td>

              <td class="p-4 flex gap-2 justify-center">
                <Button class="cursor-pointer" size="sm" :variant="course.isBlocked ? 'default' : 'outline'" @click="course.isBlocked ? unblockCourse(course._id) : blockCourse(course._id)">
                  {{ course.isBlocked ? 'Unblock' : 'Block' }}
                </Button>

                <Button class="cursor-pointer" size="sm" variant="destructive" @click="deleteCourse(course._id)"> Delete </Button>
                <Button class="cursor-pointer" size="sm" variant="outline" @click="openDurationDialog(course)"> Duration </Button>
              </td>
            </tr>

            <tr v-if="expandedId === course._id" class="bg-muted/40">
              <td colspan="6" class="p-6">
                <div class="space-y-2 text-sm">
                  <p>
                    <strong>Created At:</strong>
                    {{ new Date(course.createdAt).toLocaleDateString() }}
                  </p>
                  <p><strong>Course ID:</strong> {{ course._id }}</p>
                  <p>
                    <strong>Instructor Email:</strong>
                    {{ course.teacher?.email }}
                  </p>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="courses.length === 0">
            <td colspan="6" class="p-6 text-center text-muted-foreground">No courses found.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Course Duration Dialog -->
    <div v-if="durationCourse" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="closeDurationDialog">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl space-y-5">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Course Access Duration</h2>

          <button type="button" class="text-gray-500 hover:text-gray-800 text-xl" @click="closeDurationDialog">&times;</button>
        </div>

        <p class="text-sm text-left text-gray-600">
          Set how many days students can access
          <strong>{{ durationCourse.title }}</strong>
          after purchasing it.
        </p>

        <div>
          <label class="mb-2 block text-left text-sm font-medium"> Duration (days) </label>

          <input
            v-model.number="durationInput"
            type="number"
            min="1"
            max="3650"
            class="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter number of days"
          />

          <p class="mt-2 text-xs text-left text-gray-500">For example, 90 days is approximately 3 months.</p>
        </div>

        <div class="flex justify-end gap-2">
          <Button class="cursor-pointer" variant="outline" :disabled="isSavingDuration" @click="closeDurationDialog"> Cancel </Button>

          <Button class="cursor-pointer" :disabled="isSavingDuration || !Number.isInteger(durationInput) || durationInput < 1 || durationInput > 3650" @click="saveDuration">
            {{ isSavingDuration ? 'Saving...' : 'Save Duration' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
