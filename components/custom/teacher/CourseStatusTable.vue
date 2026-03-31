<script setup lang="ts">
import { ref, computed } from 'vue';
import { Star, TrendingUp, Users, DollarSign, ShoppingCart, ArrowUpDown } from 'lucide-vue-next';

interface Course {
  id: number;
  image: string;
  name: string;
  description: string;
  category: string;
  sale: number;
  rating: number;
  earning: number;
  visitor: number;
}

interface Props {
  courses: Course[];
}

const props = defineProps<Props>();

/* ── Sorting ── */
type SortKey = keyof Pick<Course, 'sale' | 'rating' | 'earning' | 'visitor'>;
const sortKey = ref<SortKey | null>(null);
const sortDir = ref<'asc' | 'desc'>('desc');

const toggleSort = (key: SortKey) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDir.value = 'desc';
  }
};

const sortedCourses = computed(() => {
  if (!sortKey.value) return props.courses;
  return [...props.courses].sort((a, b) => {
    const dir = sortDir.value === 'asc' ? 1 : -1;
    return (a[sortKey.value!] - b[sortKey.value!]) * dir;
  });
});

/* ── Period filter ── */
const period = ref('this-month');

/* ── Star rating helper ── */
const starFill = (rating: number, star: number) => {
  if (rating >= star) return 'full';
  if (rating >= star - 0.5) return 'half';
  return 'empty';
};
</script>

<template>
  <div class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden col-span-full">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-white/[0.06]">
      <div>
        <h2 class="text-base font-bold text-white">Course Status</h2>
        <p class="text-xs text-zinc-500 mt-0.5">{{ props.courses.length }} courses tracked</p>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <!-- Legend -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
            <span class="text-xs text-zinc-500">Visits</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
            <span class="text-xs text-zinc-500">Sales</span>
          </div>
        </div>

        <!-- Period selector -->
        <select
          v-model="period"
          class="text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500/50 cursor-pointer transition-colors"
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="this-year">This Year</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[640px]">
        <thead>
          <tr class="border-b border-white/[0.05]">
            <th class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-5 sm:px-6 py-3.5">Course</th>
            <th class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-3.5">Category</th>
            <th
              class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-3.5 cursor-pointer hover:text-zinc-400 transition-colors select-none"
              @click="toggleSort('sale')"
            >
              <span class="flex items-center gap-1"> Sales <ArrowUpDown :size="10" /> </span>
            </th>
            <th
              class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-3.5 cursor-pointer hover:text-zinc-400 transition-colors select-none"
              @click="toggleSort('rating')"
            >
              <span class="flex items-center gap-1"> Rating <ArrowUpDown :size="10" /> </span>
            </th>
            <th
              class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-3.5 cursor-pointer hover:text-zinc-400 transition-colors select-none"
              @click="toggleSort('earning')"
            >
              <span class="flex items-center gap-1"> Earning <ArrowUpDown :size="10" /> </span>
            </th>
            <th
              class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 pr-5 sm:pr-6 py-3.5 cursor-pointer hover:text-zinc-400 transition-colors select-none"
              @click="toggleSort('visitor')"
            >
              <span class="flex items-center gap-1"> Visitors <ArrowUpDown :size="10" /> </span>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-white/[0.04]">
          <tr v-for="course in sortedCourses" :key="course.id" class="group hover:bg-white/[0.02] transition-colors duration-150">
            <!-- Course name + image -->
            <td class="px-5 sm:px-6 py-4">
              <div class="flex items-center gap-3">
                <img :src="course.image" :alt="course.name" class="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-white/[0.08]" />
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
                    {{ course.name }}
                  </p>
                  <p class="text-xs text-zinc-600 truncate mt-0.5">{{ course.description }}</p>
                </div>
              </div>
            </td>

            <!-- Category -->
            <td class="px-3 py-4">
              <span class="text-xs font-semibold text-zinc-400 bg-white/[0.05] border border-white/[0.07] rounded-lg px-2.5 py-1 whitespace-nowrap">
                {{ course.category }}
              </span>
            </td>

            <!-- Sale -->
            <td class="px-3 py-4">
              <div class="flex items-center gap-1.5">
                <ShoppingCart :size="12" class="text-orange-400 shrink-0" />
                <span class="text-sm font-semibold text-white tabular-nums">{{ course.sale }}</span>
              </div>
            </td>

            <!-- Rating -->
            <td class="px-3 py-4">
              <div class="flex items-center gap-1.5">
                <Star :size="13" class="text-yellow-400 shrink-0" fill="currentColor" />
                <span class="text-sm font-bold text-white tabular-nums">{{ course.rating.toFixed(1) }}</span>
              </div>
            </td>

            <!-- Earning -->
            <td class="px-3 py-4">
              <div class="flex items-center gap-1">
                <span class="text-sm font-bold text-emerald-400 tabular-nums">${{ course.earning.toFixed(2) }}</span>
              </div>
            </td>

            <!-- Visitor -->
            <td class="px-3 pr-5 sm:pr-6 py-4">
              <div class="flex items-center gap-1.5">
                <Users :size="12" class="text-indigo-400 shrink-0" />
                <span class="text-sm font-semibold text-white tabular-nums">{{ course.visitor.toLocaleString() }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="props.courses.length === 0" class="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <p class="text-sm font-semibold text-zinc-500">No courses to display</p>
      <p class="text-xs text-zinc-700">Add courses to see their status here</p>
    </div>
  </div>
</template>
