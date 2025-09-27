<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-vue-next';

const earnings = {
  total: 4250,
  thisMonth: 1200,
  lastMonth: 980,
};

const growth = ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100;
</script>

<template>
  <Card class="w-full bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-200">
    <CardHeader class="pb-2">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-tight">Earnings Overview</h2>
        <DollarSign class="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <!-- Total Earnings -->
      <div class="mb-6">
        <p class="text-sm text-muted-foreground">Total Earnings</p>
        <p class="text-3xl font-bold tracking-tight mt-1">${{ earnings.total.toLocaleString() }}</p>
      </div>

      <!-- This Month vs Last Month -->
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-xl bg-white shadow-sm border p-3">
          <p class="text-xs text-muted-foreground">This Month</p>
          <p class="text-lg font-semibold">${{ earnings.thisMonth }}</p>
        </div>
        <div class="rounded-xl bg-white shadow-sm border p-3">
          <p class="text-xs text-muted-foreground">Last Month</p>
          <p class="text-lg font-semibold">${{ earnings.lastMonth }}</p>
        </div>
      </div>

      <!-- Growth Indicator -->
      <div class="mt-6 flex items-center gap-2">
        <div class="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium" :class="growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
          <component :is="growth >= 0 ? TrendingUp : TrendingDown" class="h-4 w-4" />
          <span>{{ growth.toFixed(1) }}%</span>
        </div>
        <span class="text-xs text-muted-foreground">vs last month</span>
      </div>
    </CardContent>
  </Card>
</template>
