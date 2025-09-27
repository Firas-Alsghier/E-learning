<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical } from 'lucide-vue-next';

// 1. Define the TypeScript interface for the location data structure
interface LocationData {
  country: string;
  students: number;
  flag: string;
  // Removed progress and enrollmentTrend as they are no longer used
}

// State for the dropdown menu
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 2. Data for the Top Student Locations card with explicit typing
const locationData = ref<LocationData[]>([
  { country: 'El Salvador', students: 1500, flag: '🇸🇻' },
  { country: 'Dominican Republic', students: 2500, flag: '🇩🇴' },
  { country: 'Chile', students: 1000, flag: '🇨🇱' },
  { country: 'Argentina', students: 800, flag: '🇦🇷' },
  { country: 'Mexico', students: 3200, flag: '🇲🇽' },
]);

// 3. Computed property to calculate the total number of students across all locations
const totalStudents = computed(() => {
  return locationData.value.reduce((sum, item) => sum + item.students, 0);
});

/**
 * Calculates the percentage share of students for a given country out of the total.
 * @param students - The number of students for the country.
 * @returns The percentage value as a string (e.g., "15.5%").
 */
function getSharePercentage(students: number): string {
  if (totalStudents.value === 0) return '0%';
  const percentage = (students / totalStudents.value) * 100;
  return `${percentage.toFixed(1)}%`;
}
</script>

<template>
  <!-- Main container - no global background or height styling -->
  <div class="p-6 md:p-10 font-inter flex justify-center items-start w-full">
    <!-- Top Student Locations Card -->
    <Card class="bg-white border-gray-200 shadow-xl w-full max-w-sm overflow-hidden rounded-xl">
      <!-- Custom Header Background (Purple/Violet) -->
      <CardHeader class="flex flex-row items-center justify-between p-4 bg-violet-600 rounded-t-xl relative z-10">
        <CardTitle class="text-xl font-semibold text-white">Top Student locations</CardTitle>

        <!-- Dropdown Menu Implementation -->
        <div class="relative">
          <MoreVertical class="h-5 w-5 text-white cursor-pointer hover:text-violet-200 transition" @click.stop="toggleMenu" />

          <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden" @click.stop="isMenuOpen = false">
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">View Details</button>
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">Filter Countries</button>
            <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out">Export Data</button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-4">
        <div v-for="(item, index) in locationData" :key="index" class="flex flex-col py-3 border-b border-gray-200 last:border-b-0">
          <!-- Top Row: Country, Students, and Percentage -->
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center space-x-3">
              <!-- Flag (using emoji) -->
              <span class="text-xl">{{ item.flag }}</span>
              <div>
                <p class="text-gray-800 font-medium leading-none">{{ item.country }}</p>
                <p class="text-xs text-gray-500">{{ item.students }} Students</p>
              </div>
            </div>

            <!-- Percentage Share -->
            <p class="text-sm font-semibold text-violet-600">
              {{ getSharePercentage(item.students) }}
            </p>
          </div>

          <!-- Bottom Row: Horizontal Progress Bar (The non-chart visualization) -->
          <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div class="h-1.5 bg-violet-600 transition-all duration-500 ease-out" :style="{ width: getSharePercentage(item.students) }"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
  <!-- Click outside overlay to close the menu -->
  <div v-if="isMenuOpen" class="fixed inset-0 z-10" @click="isMenuOpen = false"></div>
</template>
