<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ChevronDown, RefreshCw, Trash2, Eye, Users, Clock, Globe, XCircle } from 'lucide-vue-next';

definePageMeta({ layout: false });

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  gender: string;
  language: string;
  headline?: string;
  bio?: string;
  createdAt: string;
}

const teachers = ref<Teacher[]>([]);
const expandedId = ref<string | null>(null);
const loading = ref(false);

const token = import.meta.client ? localStorage.getItem('adminToken') : null;

const api = axios.create({
  baseURL: 'http://localhost:3001/api/admin',
  headers: { Authorization: `Bearer ${token}` },
});

const fetchRejectedTeachers = async () => {
  try {
    loading.value = true;
    const { data } = await api.get('/teachers/rejected');
    teachers.value = data;
  } catch (error) {
    console.error('Fetch rejected teachers error:', error);
  } finally {
    loading.value = false;
  }
};

const toggleDetails = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const restoreTeacher = async (id: string) => {
  try {
    await api.patch(`/teachers/${id}/restore`);
    teachers.value = teachers.value.filter((t) => t._id !== id);
  } catch (error) {
    console.error('Restore error:', error);
  }
};

const deletePermanently = async (id: string) => {
  const firstConfirm = confirm('You are deleting this teacher permanently. This cannot be undone.');
  if (!firstConfirm) return;
  const secondConfirm = confirm('Are you absolutely sure you want to permanently delete this teacher?');
  if (!secondConfirm) return;
  try {
    await api.delete(`/teachers/${id}/hard-delete`);
    teachers.value = teachers.value.filter((t) => t._id !== id);
  } catch (error) {
    console.error('Hard delete error:', error);
  }
};

const getInitials = (first: string, last: string) => `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();

onMounted(() => fetchRejectedTeachers());
</script>

<template>
  <div class="min-h-screen bg-[#0d0d0f] text-white px-4 sm:px-6 lg:px-8 py-10">
    <div class="max-w-6xl mx-auto flex flex-col gap-7">
      <!-- Page header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Rejected Teachers</h1>
          <p class="text-sm text-zinc-500 mt-0.5">Review rejected applications — restore or permanently delete</p>
        </div>
        <div v-if="!loading" class="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 self-start sm:self-auto">
          <XCircle :size="14" class="text-red-400" />
          <span class="text-sm font-bold text-red-400">{{ teachers.length }} rejected</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-8 h-8 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin"></div>
        <p class="text-sm text-zinc-500">Loading teachers...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="teachers.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 text-center bg-[#161618] border border-white/[0.07] rounded-2xl">
        <div class="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <Users :size="24" class="text-zinc-600" />
        </div>
        <div>
          <p class="text-base font-bold text-white">No rejected teachers</p>
          <p class="text-sm text-zinc-500 mt-1">Rejected applications will appear here.</p>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden">
        <!-- Column headers -->
        <div class="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3.5 border-b border-white/[0.06]">
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Name</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Email</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Country</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Rejected</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Actions</span>
        </div>

        <!-- Rows -->
        <div class="divide-y divide-white/[0.04]">
          <template v-for="teacher in teachers" :key="teacher._id">
            <!-- Main row -->
            <div class="flex flex-col md:grid md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors duration-150">
              <!-- Name + avatar -->
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-red-400">
                  {{ getInitials(teacher.firstName, teacher.lastName) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-white truncate">{{ teacher.firstName }} {{ teacher.lastName }}</p>
                  <p class="text-xs text-zinc-600 truncate md:hidden">{{ teacher.email }}</p>
                </div>
              </div>

              <!-- Email (desktop) -->
              <p class="hidden md:flex items-center text-sm text-zinc-400 truncate">{{ teacher.email }}</p>

              <!-- Country -->
              <div class="flex items-center gap-1.5 text-sm text-zinc-400">
                <Globe :size="12" class="text-zinc-600 shrink-0" />
                <span class="truncate">{{ teacher.country || '—' }}</span>
              </div>

              <!-- Date -->
              <div class="flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock :size="11" class="text-zinc-700 shrink-0" />
                <span class="whitespace-nowrap">{{ new Date(teacher.createdAt).toLocaleDateString() }}</span>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 flex-wrap">
                <!-- View -->
                <button
                  @click="toggleDetails(teacher._id)"
                  class="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  <Eye :size="11" />
                  {{ expandedId === teacher._id ? 'Hide' : 'View' }}
                  <ChevronDown :size="11" class="transition-transform duration-200" :class="{ 'rotate-180': expandedId === teacher._id }" />
                </button>

                <!-- Restore -->
                <button
                  @click="restoreTeacher(teacher._id)"
                  class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400/40 transition-all cursor-pointer"
                >
                  <RefreshCw :size="11" /> Restore
                </button>

                <!-- Delete permanently -->
                <button
                  @click="deletePermanently(teacher._id)"
                  class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-400/40 transition-all cursor-pointer"
                >
                  <Trash2 :size="11" /> Delete
                </button>
              </div>
            </div>

            <!-- Expanded details -->
            <Transition name="expand">
              <div v-if="expandedId === teacher._id" class="px-5 pb-5 bg-white/[0.02] border-t border-white/[0.04]">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
                  <div class="bg-[#1c1c1f] border border-white/[0.07] rounded-xl px-4 py-3">
                    <p class="text-[11px] text-zinc-600 uppercase tracking-wide font-bold mb-1">Gender</p>
                    <p class="text-sm font-semibold text-white">{{ teacher.gender || '—' }}</p>
                  </div>

                  <div class="bg-[#1c1c1f] border border-white/[0.07] rounded-xl px-4 py-3">
                    <p class="text-[11px] text-zinc-600 uppercase tracking-wide font-bold mb-1">Language</p>
                    <p class="text-sm font-semibold text-white">{{ teacher.language || '—' }}</p>
                  </div>

                  <div class="bg-[#1c1c1f] border border-white/[0.07] rounded-xl px-4 py-3">
                    <p class="text-[11px] text-zinc-600 uppercase tracking-wide font-bold mb-1">Status</p>
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400"> ✕ Rejected </span>
                  </div>

                  <div class="bg-[#1c1c1f] border border-white/[0.07] rounded-xl px-4 py-3">
                    <p class="text-[11px] text-zinc-600 uppercase tracking-wide font-bold mb-1">Role</p>
                    <p class="text-sm font-semibold text-white">Teacher</p>
                  </div>

                  <div class="sm:col-span-2 lg:col-span-4 bg-[#1c1c1f] border border-white/[0.07] rounded-xl px-4 py-3">
                    <p class="text-[11px] text-zinc-600 uppercase tracking-wide font-bold mb-1">Headline</p>
                    <p class="text-sm text-zinc-300 leading-relaxed">{{ teacher.headline || '—' }}</p>
                  </div>

                  <div class="sm:col-span-2 lg:col-span-4 bg-[#1c1c1f] border border-white/[0.07] rounded-xl px-4 py-3">
                    <p class="text-[11px] text-zinc-600 uppercase tracking-wide font-bold mb-1">Bio</p>
                    <p class="text-sm text-zinc-400 leading-relaxed">{{ teacher.bio || '—' }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
