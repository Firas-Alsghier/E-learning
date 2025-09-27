<script setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Course Visit',
      data: [40, 25, 50, 20, 60, 10, 70, 20, 50, 35, 60, 55],
      backgroundColor: '#4F46E5', // Indigo
      borderRadius: 6,
      barThickness: 20,
    },
    {
      label: 'Course Sale',
      data: [10, 20, 25, 15, 30, 10, 40, 20, 25, 35, 30, 40],
      backgroundColor: '#F87171', // Red
      borderRadius: 6,
      barThickness: 20,
    },
    {
      label: 'This Month',
      data: [0, 0, 0, 0, 0, 0, 70, 0, 0, 0, 0, 0], // highlight July
      backgroundColor: '#F97316', // Orange
      borderRadius: 6,
      barThickness: 20,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        color: '#6B7280',
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle',
        font: { size: 12 },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: { color: '#6B7280' },
      grid: { display: false },
    },
    y: {
      stacked: true,
      ticks: { color: '#6B7280' },
      grid: { color: '#E5E7EB' },
    },
  },
};
</script>

<template>
  <div class="bg-white rounded-xl lg:col-span-2 shadow p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-semibold text-gray-800 flex items-center gap-2">
        Revenue
        <span class="text-green-500 text-sm font-medium">▲ +0.3%</span>
      </h3>
      <select class="border rounded px-2 py-1 text-sm text-gray-700">
        <option>This Month</option>
        <option>Last Month</option>
      </select>
    </div>

    <!-- Chart -->
    <div class="h-72">
      <Bar :data="data" :options="options" />
    </div>
  </div>
</template>
