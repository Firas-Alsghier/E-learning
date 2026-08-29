<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { ShoppingBag, TrendingUp } from 'lucide-vue-next';

interface Purchase {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  purchaseDate: string;
  course: string;
  amount: number;
}

interface RecentSalesResponse {
  purchases: Purchase[];
  salesThisMonth: number;
  total: number;
}

const purchases = ref<Purchase[]>([]);
const salesThisMonth = ref(0);
const total = ref(0);

const isLoading = ref(true);
const error = ref('');

const fetchRecentSales = async () => {
  try {
    isLoading.value = true;
    error.value = '';

    const token = useCookie('teacher_token').value;

    const response = await axios.get<RecentSalesResponse>('http://localhost:3001/api/teacher/courses/stats/recent-sales', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    purchases.value = response.data.purchases;
    salesThisMonth.value = response.data.salesThisMonth;
    total.value = response.data.total;
  } catch (err) {
    console.error('Failed to fetch recent sales:', err);
    error.value = 'Failed to load recent sales';
  } finally {
    isLoading.value = false;
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('');

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const avatarColor = (name: string) => {
  const colors = ['bg-indigo-500/20 text-indigo-300', 'bg-orange-500/20 text-orange-300', 'bg-emerald-500/20 text-emerald-300', 'bg-pink-500/20 text-pink-300', 'bg-violet-500/20 text-violet-300'];

  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

onMounted(() => {
  fetchRecentSales();
});
</script>

<template>
  <div class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden col-span-full">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-white/[0.06]">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
          <ShoppingBag :size="13" class="text-emerald-400" />
        </div>
        <div>
          <h2 class="text-sm font-bold text-white leading-tight">Recent Sales</h2>
          <p class="text-[11px] text-zinc-600 flex items-center gap-1">
            <TrendingUp :size="10" class="text-emerald-500" />
            {{ salesThisMonth }} sales this month
          </p>
        </div>
      </div>

      <!-- Total earned badge -->
      <div class="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 self-start sm:self-auto">
        <span class="text-xs text-zinc-500">Total</span>
        <span class="text-sm font-extrabold text-emerald-400">
          {{ formatCurrency(total) }}
        </span>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[580px]">
        <thead>
          <tr class="border-b border-white/[0.05]">
            <th class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-5 sm:px-6 py-3.5">User</th>
            <th class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-3.5">Date</th>
            <th class="text-left text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 py-3.5">Course</th>
            <th class="text-right text-[11px] font-bold text-zinc-600 uppercase tracking-widest px-3 pr-5 sm:pr-6 py-3.5">Amount</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-white/[0.04]">
          <tr v-for="purchase in purchases" :key="purchase.id" class="group hover:bg-white/[0.02] transition-colors duration-150">
            <!-- User -->
            <td class="px-5 sm:px-6 py-3.5">
              <div class="flex items-center gap-3">
                <!-- Avatar -->
                <div class="w-9 h-9 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/[0.08]">
                  <img
                    v-if="purchase.user.avatar"
                    :src="purchase.user.avatar"
                    :alt="purchase.user.name"
                    class="w-full h-full object-cover"
                    @error="($event.target as HTMLImageElement).style.display = 'none'"
                  />
                  <!-- Fallback initials -->
                  <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold" :class="avatarColor(purchase.user.name)">
                    {{ getInitials(purchase.user.name) }}
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-sm text-left font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
                    {{ purchase.user.name }}
                  </p>
                  <p class="text-[11px] text-zinc-600 truncate">{{ purchase.user.email }}</p>
                </div>
              </div>
            </td>

            <!-- Date -->
            <td class="px-3 py-3.5">
              <span class="text-xs text-zinc-500 whitespace-nowrap tabular-nums">
                {{ formatDate(purchase.purchaseDate) }}
              </span>
            </td>

            <!-- Course -->
            <td class="px-3 py-3.5 max-w-[220px]">
              <p class="text-sm text-zinc-300 truncate leading-snug">{{ purchase.course }}</p>
            </td>

            <!-- Amount -->
            <td class="px-3 pr-5 sm:pr-6 py-3.5 text-right">
              <span class="text-sm font-extrabold text-emerald-400 tabular-nums whitespace-nowrap">
                {{ formatCurrency(purchase.amount) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
