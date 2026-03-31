<script setup>
import { ref, computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useI18n } from 'vue-i18n';
import { TrendingUp, TrendingDown } from 'lucide-vue-next';

const { t } = useI18n();

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

/* ── Period selector ── */
const selectedPeriod = ref('this-month');

/* ── Raw data per period ── */
const monthlyVisits = [40, 25, 50, 20, 60, 10, 70, 20, 50, 35, 60, 55];
const monthlySales = [10, 20, 25, 15, 30, 10, 40, 20, 25, 35, 30, 40];
const lastVisits = [30, 45, 35, 55, 40, 65, 50, 30, 45, 50, 35, 48];
const lastSales = [15, 25, 20, 30, 20, 35, 28, 18, 22, 40, 25, 32];

const currentVisits = computed(() => (selectedPeriod.value === 'this-month' ? monthlyVisits : lastVisits));
const currentSales = computed(() => (selectedPeriod.value === 'this-month' ? monthlySales : lastSales));

/* ── Summary numbers ── */
const totalVisits = computed(() => currentVisits.value.reduce((a, b) => a + b, 0));
const totalSales = computed(() => currentSales.value.reduce((a, b) => a + b, 0));
const visitChange = computed(() => {
  const prev = lastVisits.reduce((a, b) => a + b, 0);
  return Math.round(((totalVisits.value - prev) / prev) * 100);
});
const salesChange = computed(() => {
  const prev = lastSales.reduce((a, b) => a + b, 0);
  return Math.round(((totalSales.value - prev) / prev) * 100);
});

/* ── Chart data ── */
const data = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Course Visits',
      data: currentVisits.value,
      backgroundColor: 'rgba(99, 102, 241, 0.85)',
      hoverBackgroundColor: 'rgba(129, 140, 248, 1)',
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 14,
    },
    {
      label: 'Course Sales',
      data: currentSales.value,
      backgroundColor: 'rgba(255, 120, 45, 0.85)',
      hoverBackgroundColor: 'rgba(255, 154, 92, 1)',
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 14,
    },
  ],
}));

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: false, // we draw our own legend below
    },
    tooltip: {
      backgroundColor: '#1c1c1f',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      titleColor: '#f0f0f0',
      bodyColor: '#a1a1aa',
      padding: 12,
      cornerRadius: 10,
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
      },
    },
  },
  scales: {
    x: {
      stacked: false,
      ticks: { color: '#52525b', font: { size: 11 } },
      grid: { display: false },
      border: { display: false },
    },
    y: {
      stacked: false,
      ticks: { color: '#52525b', font: { size: 11 }, maxTicksLimit: 6 },
      grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
      border: { display: false },
    },
  },
};
</script>

<template>
  <div class="bg-[#161618] border border-white/[0.08] rounded-2xl p-5 sm:p-6 lg:col-span-2 flex flex-col gap-5">
    <!-- Header row -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{{ t('revenue') }}</p>
        <h3 class="text-lg font-extrabold text-white tracking-tight">Performance Overview</h3>
      </div>

      <!-- Period selector -->
      <select
        v-model="selectedPeriod"
        class="text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500/50 cursor-pointer transition-colors"
      >
        <option value="this-month">{{ t('this-month') }}</option>
        <option value="last-month">{{ t('last-month') }}</option>
      </select>
    </div>

    <!-- Summary pills -->
    <div class="flex flex-wrap gap-3">
      <!-- Visits -->
      <div class="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3 flex-1 min-w-[140px]">
        <div class="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0"></div>
        <div class="min-w-0">
          <p class="text-[11px] text-indigo-400 font-semibold uppercase tracking-wide">Visits</p>
          <p class="text-xl font-extrabold text-white leading-tight">{{ totalVisits }}</p>
        </div>
        <div class="ml-auto flex items-center gap-0.5 text-xs font-bold shrink-0" :class="visitChange >= 0 ? 'text-emerald-400' : 'text-red-400'">
          <TrendingUp v-if="visitChange >= 0" :size="13" />
          <TrendingDown v-else :size="13" />
          {{ Math.abs(visitChange) }}%
        </div>
      </div>

      <!-- Sales -->
      <div class="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 flex-1 min-w-[140px]">
        <div class="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0"></div>
        <div class="min-w-0">
          <p class="text-[11px] text-orange-400 font-semibold uppercase tracking-wide">Sales</p>
          <p class="text-xl font-extrabold text-white leading-tight">{{ totalSales }}</p>
        </div>
        <div class="ml-auto flex items-center gap-0.5 text-xs font-bold shrink-0" :class="salesChange >= 0 ? 'text-emerald-400' : 'text-red-400'">
          <TrendingUp v-if="salesChange >= 0" :size="13" />
          <TrendingDown v-else :size="13" />
          {{ Math.abs(salesChange) }}%
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="h-56 sm:h-64 w-full">
      <Bar :data="data" :options="options" />
    </div>

    <!-- Custom legend -->
    <div class="flex items-center gap-5 pt-1">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-indigo-400 shrink-0"></span>
        <span class="text-xs text-zinc-400 font-medium">Course Visits</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-orange-400 shrink-0"></span>
        <span class="text-xs text-zinc-400 font-medium">Course Sales</span>
      </div>
    </div>
  </div>
</template>
