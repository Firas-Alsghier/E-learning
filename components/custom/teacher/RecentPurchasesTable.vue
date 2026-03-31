<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingBag, TrendingUp } from 'lucide-vue-next';

const purchases = ref([
  {
    id: '1',
    user: {
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      avatar: 'https://images.unsplash.com/photo-1534528736653-c7c4c114ad40?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-15',
    course: 'The Complete Full-Stack Web Development Course',
    amount: 1999,
  },
  {
    id: '2',
    user: {
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a811804f631?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-14',
    course: 'Introduction to Data Science with Python',
    amount: 39,
  },
  {
    id: '3',
    user: {
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c405a811e54?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-13',
    course: 'Mastering AI and Machine Learning',
    amount: 299,
  },
  {
    id: '4',
    user: {
      name: 'William Kim',
      email: 'will@email.com',
      avatar: 'https://images.unsplash.com/photo-1504593816503-4f932f94b1a4?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-12',
    course: 'Graphic Design for Beginners',
    amount: 99,
  },
  {
    id: '5',
    user: {
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-11',
    course: 'Digital Marketing Fundamentals',
    amount: 39,
  },
]);

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('');

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

// Color per initials for avatar fallback
const avatarColor = (name: string) => {
  const colors = ['bg-indigo-500/20 text-indigo-300', 'bg-orange-500/20 text-orange-300', 'bg-emerald-500/20 text-emerald-300', 'bg-pink-500/20 text-pink-300', 'bg-violet-500/20 text-violet-300'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
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
            265 sales this month
          </p>
        </div>
      </div>

      <!-- Total earned badge -->
      <div class="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 self-start sm:self-auto">
        <span class="text-xs text-zinc-500">Total</span>
        <span class="text-sm font-extrabold text-emerald-400">
          {{ formatCurrency(purchases.reduce((s, p) => s + p.amount, 0)) }}
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
                  <p class="text-sm font-semibold text-white truncate group-hover:text-orange-300 transition-colors">
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
