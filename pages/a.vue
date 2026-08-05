<script setup lang="ts">
import { ref, computed } from 'vue';
import { ShoppingBag, ChevronDown, Download, Search, CheckCircle, RefreshCw, XCircle, Calendar, CreditCard, Hash, BookOpen, TrendingUp } from 'lucide-vue-next';

definePageMeta({
  middleware: ['user-auth'],
  layout: false,
});

interface Purchase {
  id: string;
  orderNumber: string;
  course: {
    title: string;
    author: string;
    image: string;
    category: string;
    slug: string;
  };
  date: string;
  amount: number;
  originalAmount: number;
  discount: number;
  couponCode?: string;
  paymentMethod: string;
  cardLast4?: string;
  status: 'completed' | 'refunded' | 'pending';
  transactionId: string;
}

// ── Hardcoded test data — replace with real API call when ready ──────────────
const purchases = ref<Purchase[]>([
  {
    id: '1',
    orderNumber: 'ORD-2024-00841',
    course: {
      title: 'Complete Web Development Bootcamp 2024',
      author: 'John Doe',
      image: 'https://img-c.udemycdn.com/course/750x422/5463624_6dc8.jpg',
      category: 'Development',
      slug: 'complete-web-dev',
    },
    date: '2024-04-10T14:32:00Z',
    amount: 29,
    originalAmount: 99,
    discount: 70,
    couponCode: 'SAVE70',
    paymentMethod: 'Visa',
    cardLast4: '4242',
    status: 'completed',
    transactionId: 'TXN-7F3K9P2Q',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-00729',
    course: {
      title: 'UI/UX Design Fundamentals with Figma',
      author: 'Sarah Ahmed',
      image: 'https://img-c.udemycdn.com/course/750x422/5266090_aba5.jpg',
      category: 'Design',
      slug: 'uiux-design-figma',
    },
    date: '2024-03-22T09:15:00Z',
    amount: 19,
    originalAmount: 79,
    discount: 60,
    paymentMethod: 'Mastercard',
    cardLast4: '1234',
    status: 'completed',
    transactionId: 'TXN-2M8N4R6X',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-00614',
    course: {
      title: 'Introduction to Data Science with Python',
      author: 'Fatimah Zahra',
      image: 'https://miro.medium.com/v2/resize:fit:1400/1*tDvPpTA8Jw5P_B5xV8gsjw.jpeg',
      category: 'Data Science',
      slug: 'data-science-python',
    },
    date: '2024-02-18T18:44:00Z',
    amount: 89,
    originalAmount: 89,
    discount: 0,
    paymentMethod: 'PayPal',
    status: 'refunded',
    transactionId: 'TXN-5H1D9W3Y',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-00502',
    course: {
      title: 'Advanced React & TypeScript Patterns',
      author: 'Mohammed Ali',
      image: 'https://img-c.udemycdn.com/course/750x422/5266090_aba5.jpg',
      category: 'Development',
      slug: 'react-typescript',
    },
    date: '2024-01-30T11:20:00Z',
    amount: 24,
    originalAmount: 89,
    discount: 65,
    couponCode: 'NEWYEAR',
    paymentMethod: 'Visa',
    cardLast4: '4242',
    status: 'completed',
    transactionId: 'TXN-9L6B2T8V',
  },
  {
    id: '5',
    orderNumber: 'ORD-2023-00388',
    course: {
      title: 'Digital Marketing Fundamentals & Strategy',
      author: 'Layla Hassan',
      image: 'https://img-c.udemycdn.com/course/750x422/5463624_6dc8.jpg',
      category: 'Marketing',
      slug: 'digital-marketing',
    },
    date: '2023-12-05T16:08:00Z',
    amount: 15,
    originalAmount: 59,
    discount: 44,
    paymentMethod: 'Mastercard',
    cardLast4: '5678',
    status: 'completed',
    transactionId: 'TXN-3J7C4E1Z',
  },
]);

// ── State ────────────────────────────────────────────────────────────────────
const searchQuery = ref('');
const statusFilter = ref<'all' | 'completed' | 'refunded' | 'pending'>('all');
const expandedId = ref<string | null>(null);

// ── Toggle receipt expansion ──────────────────────────────────────────────────
const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id;
};

// ── Filters ───────────────────────────────────────────────────────────────────
const filteredPurchases = computed(() => {
  let result = purchases.value;
  if (statusFilter.value !== 'all') {
    result = result.filter((p) => p.status === statusFilter.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter((p) => p.course.title.toLowerCase().includes(q) || p.orderNumber.toLowerCase().includes(q) || p.transactionId.toLowerCase().includes(q));
  }
  return result;
});

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = computed(() => {
  const completed = purchases.value.filter((p) => p.status === 'completed');
  const refunded = purchases.value.filter((p) => p.status === 'refunded');
  const totalSpent = completed.reduce((s, p) => s + p.amount, 0);
  const totalSaved = purchases.value.reduce((s, p) => s + p.discount, 0);
  return {
    total: purchases.value.length,
    completed: completed.length,
    refunded: refunded.length,
    totalSpent,
    totalSaved,
  };
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', icon: CheckCircle },
  refunded: { label: 'Refunded', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25', icon: RefreshCw },
  pending: { label: 'Pending', color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25', icon: XCircle },
};

const paymentIcon = (method: string) => {
  if (method === 'PayPal') return '🅿️';
  if (method === 'Visa') return '💳';
  if (method === 'Mastercard') return '💳';
  return '💳';
};

// ── Print / download receipt (browser print dialog) ──────────────────────────
const printReceipt = (purchase: Purchase) => {
  // Replace with a real PDF download endpoint when ready:
  // window.open(`/api/purchases/${purchase.id}/receipt`, '_blank');
  window.print();
};

const filters = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'pending', label: 'Pending' },
];
</script>

<template>
  <div class="min-h-screen bg-[#0d0d0f] text-white">
    <!-- Glow -->
    <div class="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-40" style="background: radial-gradient(circle, rgba(255, 120, 45, 0.07) 0%, transparent 70%)"></div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">
      <!-- ── Page header ── -->
      <div class="mb-8 sm:mb-10">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
            <ShoppingBag :size="17" class="text-orange-400" />
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Purchase History</h1>
        </div>
        <p class="text-sm text-zinc-500 ml-12">All your course purchases and receipts</p>
      </div>

      <!-- ── Stats cards ── -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Total Orders</p>
          <p class="text-2xl font-extrabold text-white mt-0.5">{{ stats.total }}</p>
        </div>
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Completed</p>
          <p class="text-2xl font-extrabold text-emerald-400 mt-0.5">{{ stats.completed }}</p>
        </div>
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Total Spent</p>
          <p class="text-2xl font-extrabold text-orange-400 mt-0.5">{{ formatCurrency(stats.totalSpent) }}</p>
        </div>
        <div class="bg-[#161618] border border-white/[0.08] rounded-xl px-4 py-3">
          <p class="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">Total Saved</p>
          <div class="flex items-center gap-1.5 mt-0.5">
            <TrendingUp :size="14" class="text-emerald-400 shrink-0" />
            <p class="text-2xl font-extrabold text-emerald-400">{{ formatCurrency(stats.totalSaved) }}</p>
          </div>
        </div>
      </div>

      <!-- ── Toolbar ── -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <!-- Status filter tabs -->
        <div class="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 overflow-x-auto" style="scrollbar-width: none">
          <button
            v-for="f in filters"
            :key="f.value"
            @click="statusFilter = f.value as any"
            class="px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer"
            :class="statusFilter === f.value ? 'bg-orange-500 text-white shadow-[0_2px_10px_rgba(255,120,45,0.4)]' : 'text-zinc-500 hover:text-white'"
          >
            {{ f.label }}
          </button>
        </div>

        <!-- Search -->
        <div class="relative w-full sm:flex-1">
          <Search :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by course, order #, or transaction ID..."
            class="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-8 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
          />
        </div>
      </div>

      <!-- ── Empty state ── -->
      <div v-if="filteredPurchases.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 text-center bg-[#161618] border border-white/[0.07] rounded-2xl">
        <div class="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <ShoppingBag :size="24" class="text-zinc-600" />
        </div>
        <div>
          <p class="text-base font-bold text-white">No purchases found</p>
          <p class="text-sm text-zinc-500 mt-1">
            {{ searchQuery ? 'Try a different search term.' : 'You have no purchases in this category.' }}
          </p>
        </div>
        <a href="/courses" class="mt-1 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all">
          <BookOpen :size="14" /> Browse Courses
        </a>
      </div>

      <!-- ── Purchase list ── -->
      <div v-else class="flex flex-col gap-3 sm:gap-4">
        <div
          v-for="purchase in filteredPurchases"
          :key="purchase.id"
          class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-orange-500/20 transition-colors duration-200"
        >
          <!-- ── Summary row (always visible) ── -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 cursor-pointer" @click="toggleExpand(purchase.id)">
            <!-- Thumbnail -->
            <div class="w-full sm:w-20 aspect-video sm:h-13 sm:aspect-auto rounded-xl overflow-hidden shrink-0">
              <img :src="purchase.course.image" :alt="purchase.course.title" class="w-full h-full object-cover" />
            </div>

            <!-- Course info + meta -->
            <div class="flex-1 min-w-0 flex flex-col gap-1.5">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-sm font-bold text-white leading-snug line-clamp-2 flex-1">
                  {{ purchase.course.title }}
                </h3>
                <!-- Status badge -->
                <span class="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shrink-0 whitespace-nowrap" :class="statusConfig[purchase.status].color">
                  <component :is="statusConfig[purchase.status].icon" :size="10" />
                  {{ statusConfig[purchase.status].label }}
                </span>
              </div>

              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                <span class="flex items-center gap-1">
                  <Hash :size="10" class="text-zinc-700" />
                  {{ purchase.orderNumber }}
                </span>
                <span class="text-zinc-700">·</span>
                <span class="flex items-center gap-1">
                  <Calendar :size="10" class="text-zinc-700" />
                  {{ formatDate(purchase.date) }}
                </span>
                <span class="text-zinc-700">·</span>
                <span class="flex items-center gap-1">
                  <CreditCard :size="10" class="text-zinc-700" />
                  {{ purchase.paymentMethod }}{{ purchase.cardLast4 ? ` ···· ${purchase.cardLast4}` : '' }}
                </span>
              </div>
            </div>

            <!-- Amount + expand toggle -->
            <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1 shrink-0">
              <div class="text-right">
                <p class="text-lg font-extrabold text-orange-400">{{ formatCurrency(purchase.amount) }}</p>
                <p v-if="purchase.discount > 0" class="text-xs text-zinc-600 line-through">
                  {{ formatCurrency(purchase.originalAmount) }}
                </p>
              </div>
              <ChevronDown :size="16" class="text-zinc-600 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': expandedId === purchase.id }" />
            </div>
          </div>

          <!-- ── Expanded receipt ── -->
          <Transition name="expand">
            <div v-if="expandedId === purchase.id" class="border-t border-white/[0.06]">
              <!-- Receipt header -->
              <div class="flex items-center justify-between px-5 py-3 bg-white/[0.02]">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                  <span class="text-xs font-bold text-zinc-400 uppercase tracking-widest">Receipt</span>
                </div>
                <button @click.stop="printReceipt(purchase)" class="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-orange-400 transition-colors cursor-pointer">
                  <Download :size="12" /> Download
                </button>
              </div>

              <!-- Receipt body -->
              <div class="px-5 pb-5 pt-4 flex flex-col gap-4">
                <!-- Course details row -->
                <div class="flex items-start gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                  <img :src="purchase.course.image" :alt="purchase.course.title" class="w-14 h-10 rounded-lg object-cover shrink-0" />
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-white leading-snug">{{ purchase.course.title }}</p>
                    <p class="text-xs text-zinc-500 mt-0.5">By {{ purchase.course.author }} · {{ purchase.course.category }}</p>
                  </div>
                </div>

                <!-- Line items grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  <!-- Order number -->
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-xs text-zinc-500">Order Number</span>
                    <span class="text-xs font-semibold text-white font-mono">{{ purchase.orderNumber }}</span>
                  </div>

                  <!-- Transaction ID -->
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-xs text-zinc-500">Transaction ID</span>
                    <span class="text-xs font-semibold text-white font-mono">{{ purchase.transactionId }}</span>
                  </div>

                  <!-- Date & time -->
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-xs text-zinc-500">Date & Time</span>
                    <span class="text-xs font-semibold text-white"> {{ formatDate(purchase.date) }}, {{ formatTime(purchase.date) }} </span>
                  </div>

                  <!-- Payment method -->
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-xs text-zinc-500">Payment</span>
                    <span class="text-xs font-semibold text-white">
                      {{ paymentIcon(purchase.paymentMethod) }}
                      {{ purchase.paymentMethod }}
                      {{ purchase.cardLast4 ? `···· ${purchase.cardLast4}` : '' }}
                    </span>
                  </div>

                  <!-- Status -->
                  <div class="flex items-start justify-between gap-2">
                    <span class="text-xs text-zinc-500">Status</span>
                    <span class="text-xs font-bold px-2 py-0.5 rounded-full border" :class="statusConfig[purchase.status].color">
                      {{ statusConfig[purchase.status].label }}
                    </span>
                  </div>

                  <!-- Coupon -->
                  <div v-if="purchase.couponCode" class="flex items-start justify-between gap-2">
                    <span class="text-xs text-zinc-500">Coupon Applied</span>
                    <span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 font-mono">
                      {{ purchase.couponCode }}
                    </span>
                  </div>
                </div>

                <!-- Divider -->
                <div class="h-px bg-white/[0.06]"></div>

                <!-- Price breakdown -->
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-zinc-500">Original Price</span>
                    <span class="text-zinc-400" :class="{ 'line-through': purchase.discount > 0 }">
                      {{ formatCurrency(purchase.originalAmount) }}
                    </span>
                  </div>

                  <div v-if="purchase.discount > 0" class="flex items-center justify-between text-sm">
                    <span class="text-zinc-500">Discount</span>
                    <span class="text-emerald-400 font-semibold"> − {{ formatCurrency(purchase.discount) }} </span>
                  </div>

                  <!-- Total line -->
                  <div class="flex items-center justify-between mt-1 pt-3 border-t border-white/[0.06]">
                    <span class="text-sm font-bold text-white">Total Charged</span>
                    <span class="text-lg font-extrabold text-orange-400">
                      {{ formatCurrency(purchase.amount) }}
                    </span>
                  </div>
                </div>

                <!-- CTA -->
                <div class="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    v-if="purchase.status === 'completed'"
                    :href="`/learn/${purchase.course.slug}`"
                    class="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-[0_3px_12px_rgba(255,120,45,0.3)] hover:shadow-[0_5px_18px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 transition-all"
                  >
                    <BookOpen :size="13" /> Go to Course
                  </a>
                  <button
                    @click.stop="printReceipt(purchase)"
                    class="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl border border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Download :size="13" /> Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </Transition>
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
