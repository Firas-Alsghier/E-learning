<!-- pages/admin/teachers/approved.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { ChevronDown, ShieldOff, UserX, Eye, Users, Clock, Globe, ShieldCheck } from 'lucide-vue-next';

const { $api } = useNuxtApp();

definePageMeta({ layout: false });

const expandedId = ref(null);
const teachers = ref([]);
const loading = ref(false);
const error = ref('');

const toggleDetails = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

const getInitials = (first, last) => `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase();

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await $api('http://localhost:3001/api/admin/teachers/approved');
    teachers.value = data.map((t) => ({
      id: t._id,
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      country: t.country,
      gender: t.gender,
      language: t.language,
      headline: t.headline,
      bio: t.bio,
      isApproved: t.isApproved,
      isBlocked: t.isBlocked,
      createdAt: new Date(t.updatedAt || t.createdAt).toLocaleDateString(),
    }));
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load approved teachers';
  } finally {
    loading.value = false;
  }
});

const blockTeacher = async (id) => {
  if (!confirm('Block this teacher?')) return;
  try {
    await $api(`http://localhost:3001/api/admin/teachers/${id}/block`, { method: 'PATCH' });
    teachers.value = teachers.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error(err);
    alert('Failed to block teacher');
  }
};

const revokeTeacher = async (id) => {
  if (!confirm('Revoke approval for this teacher?')) return;
  try {
    await $api(`http://localhost:3001/api/admin/teachers/${id}/revoke`, { method: 'PATCH' });
    teachers.value = teachers.value.filter((t) => t.id !== id);
  } catch (err) {
    console.error(err);
    alert('Failed to revoke approval');
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#0d0d0f] text-white px-4 sm:px-6 lg:px-8 py-10">
    <div class="max-w-6xl mx-auto flex flex-col gap-7">
      <!-- Page header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Approved Teachers</h1>
          <p class="text-sm text-zinc-500 mt-0.5">Manage all approved and active teachers</p>
        </div>
        <div v-if="!loading" class="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 self-start sm:self-auto">
          <ShieldCheck :size="14" class="text-emerald-400" />
          <span class="text-sm font-bold text-emerald-400">{{ teachers.length }} approved</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-4">
        <div class="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
        <p class="text-sm text-zinc-500">Loading teachers...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm font-semibold">⚠ {{ error }}</div>

      <!-- Empty state -->
      <div v-else-if="teachers.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 text-center bg-[#161618] border border-white/[0.07] rounded-2xl">
        <div class="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <Users :size="24" class="text-zinc-600" />
        </div>
        <div>
          <p class="text-base font-bold text-white">No approved teachers</p>
          <p class="text-sm text-zinc-500 mt-1">Approved teachers will appear here.</p>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden">
        <!-- Column headers -->
        <div class="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3.5 border-b border-white/[0.06]">
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Name</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Email</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Country</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Date</span>
          <span class="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Actions</span>
        </div>

        <!-- Rows -->
        <div class="divide-y divide-white/[0.04]">
          <template v-for="teacher in teachers" :key="teacher.id">
            <!-- Main row -->
            <div class="flex flex-col md:grid md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-3 md:gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors duration-150">
              <!-- Name -->
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-400">
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
                <span class="whitespace-nowrap">{{ teacher.createdAt }}</span>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 flex-wrap">
                <!-- View -->
                <button
                  @click="toggleDetails(teacher.id)"
                  class="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  <Eye :size="11" />
                  {{ expandedId === teacher.id ? 'Hide' : 'View' }}
                  <ChevronDown :size="11" class="transition-transform duration-200" :class="{ 'rotate-180': expandedId === teacher.id }" />
                </button>

                <!-- Block -->
                <button
                  @click="blockTeacher(teacher.id)"
                  class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400/40 transition-all cursor-pointer"
                >
                  <ShieldOff :size="11" /> Block
                </button>

                <!-- Revoke -->
                <button
                  @click="revokeTeacher(teacher.id)"
                  class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-400/40 transition-all cursor-pointer"
                >
                  <UserX :size="11" /> Revoke
                </button>
              </div>
            </div>

            <!-- Expanded details -->
            <Transition name="expand">
              <div v-if="expandedId === teacher.id" class="px-5 pb-5 bg-white/[0.02] border-t border-white/[0.04]">
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
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400"> ✓ Approved </span>
                  </div>

                  <div class="bg-[#1c1c1f] border border-white/[0.07] rounded-xl px-4 py-3">
                    <p class="text-[11px] text-zinc-600 uppercase tracking-wide font-bold mb-1">Blocked</p>
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-700/50 text-zinc-400"> Not blocked </span>
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
