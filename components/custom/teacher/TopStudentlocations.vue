<script setup lang="ts">
import { ref, computed } from 'vue';
import { MoreVertical, MapPin } from 'lucide-vue-next';

interface LocationData {
  country: string;
  students: number;
  flag: string;
}

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const locationData = ref<LocationData[]>([
  { country: 'Mexico', students: 3200, flag: '🇲🇽' },
  { country: 'Dominican Republic', students: 2500, flag: '🇩🇴' },
  { country: 'El Salvador', students: 1500, flag: '🇸🇻' },
  { country: 'Chile', students: 1000, flag: '🇨🇱' },
  { country: 'Argentina', students: 800, flag: '🇦🇷' },
]);

const totalStudents = computed(() => locationData.value.reduce((sum, item) => sum + item.students, 0));

function getSharePercent(students: number): number {
  if (totalStudents.value === 0) return 0;
  return parseFloat(((students / totalStudents.value) * 100).toFixed(1));
}

function getShareLabel(students: number): string {
  return `${getSharePercent(students)}%`;
}

// Sort so the biggest bar is always first
const sorted = computed(() => [...locationData.value].sort((a, b) => b.students - a.students));
</script>

<template>
  <div class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col" @click="isMenuOpen = false">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
          <MapPin :size="13" class="text-orange-400" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-white leading-tight">Top Student Locations</h3>
          <p class="text-[11px] text-zinc-600">{{ totalStudents.toLocaleString() }} total students</p>
        </div>
      </div>

      <!-- Menu -->
      <div class="relative" @click.stop>
        <button @click="toggleMenu" class="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
          <MoreVertical :size="15" />
        </button>

        <Transition name="fade-slide">
          <div v-if="isMenuOpen" class="absolute right-0 top-full mt-1.5 w-44 bg-[#1c1c1f] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden z-20">
            <button class="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer">View Details</button>
            <button class="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer">Filter Countries</button>
            <button class="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer">Export Data</button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Location rows -->
    <div class="flex flex-col divide-y divide-white/[0.04] px-5 py-2">
      <div v-for="(item, index) in sorted" :key="index" class="flex flex-col gap-2 py-3.5">
        <!-- Row: flag + name + students + percent -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Rank -->
            <span class="text-[11px] font-bold text-zinc-700 w-4 shrink-0">{{ index + 1 }}</span>
            <!-- Flag -->
            <span class="text-xl leading-none shrink-0">{{ item.flag }}</span>
            <!-- Name + count -->
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white leading-tight truncate">{{ item.country }}</p>
              <p class="text-[11px] text-zinc-500">{{ item.students.toLocaleString() }} students</p>
            </div>
          </div>
          <!-- Percent -->
          <span class="text-sm font-extrabold text-orange-400 shrink-0 tabular-nums">
            {{ getShareLabel(item.students) }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :style="{
              width: getShareLabel(item.students),
              background: index === 0 ? 'linear-gradient(90deg, #ff782d, #ffab6b)' : index === 1 ? 'rgba(255,120,45,0.6)' : 'rgba(255,120,45,0.3)',
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Click-outside backdrop -->
  <div v-if="isMenuOpen" class="fixed inset-0 z-10" @click="isMenuOpen = false"></div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
