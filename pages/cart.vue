<script setup lang="ts">
import { ref, computed } from 'vue';
import { Trash2, Tag, ShoppingCart, ArrowRight, BookOpen, Clock, Shield, RotateCcw } from 'lucide-vue-next';

definePageMeta({
  layout: false,
  middleware: ['user-auth'],
});

interface CartItem {
  id: string;
  title: string;
  author: string;
  image: string;
  category: string;
  duration: string;
  originalPrice: number;
  price: number;
}

// ── Hardcoded test data ──────────────────────────────────────────────────────
// Replace this with your real API/store cart data when ready
const cartItems = ref<CartItem[]>([
  {
    id: '1',
    title: 'Complete Web Development Bootcamp 2024',
    author: 'John Doe',
    image: 'https://img-c.udemycdn.com/course/750x422/5463624_6dc8.jpg',
    category: 'Development',
    duration: '42 hours',
    originalPrice: 99,
    price: 29,
  },
  {
    id: '2',
    title: 'UI/UX Design Fundamentals with Figma',
    author: 'Sarah Ahmed',
    image: 'https://img-c.udemycdn.com/course/750x422/5266090_aba5.jpg',
    category: 'Design',
    duration: '18 hours',
    originalPrice: 79,
    price: 19,
  },
  {
    id: '3',
    title: 'Introduction to Data Science with Python',
    author: 'Fatimah Zahra',
    image: 'https://miro.medium.com/v2/resize:fit:1400/1*tDvPpTA8Jw5P_B5xV8gsjw.jpeg',
    category: 'Data Science',
    duration: '28 hours',
    originalPrice: 89,
    price: 24,
  },
]);

const couponCode = ref('');
const couponApplied = ref(false);
const couponError = ref('');
const couponDiscount = ref(0);

// ── Computed totals ──────────────────────────────────────────────────────────
const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price, 0));

const originalTotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.originalPrice, 0));

const totalSaved = computed(() => originalTotal.value - subtotal.value);

const discountAmount = computed(() => (couponApplied.value ? Math.round(subtotal.value * couponDiscount.value) : 0));

const total = computed(() => subtotal.value - discountAmount.value);

// ── Actions ──────────────────────────────────────────────────────────────────
const removeItem = (id: string) => {
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
};

const applyCoupon = () => {
  couponError.value = '';
  const code = couponCode.value.trim().toUpperCase();

  // Test coupon codes — replace with real API call
  if (code === 'SAVE10') {
    couponDiscount.value = 0.1;
    couponApplied.value = true;
  } else if (code === 'SAVE20') {
    couponDiscount.value = 0.2;
    couponApplied.value = true;
  } else {
    couponError.value = 'Invalid coupon code. Try SAVE10 or SAVE20.';
    couponApplied.value = false;
    couponDiscount.value = 0;
  }
};

const removeCoupon = () => {
  couponCode.value = '';
  couponApplied.value = false;
  couponDiscount.value = 0;
  couponError.value = '';
};

const checkout = () => {
  // Replace with your checkout logic / navigateTo('/checkout')
  alert('Proceeding to checkout...');
};
</script>

<template>
  <div class="min-h-screen bg-[#0d0d0f] text-white">
    <!-- Subtle glow -->
    <div class="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-40" style="background: radial-gradient(circle, rgba(255, 120, 45, 0.07) 0%, transparent 70%)"></div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
      <!-- Page header -->
      <div class="mb-8 sm:mb-10">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0">
            <ShoppingCart :size="17" class="text-orange-400" />
          </div>
          Your Cart
        </h1>
        <p class="text-sm text-zinc-500 mt-1 ml-12">{{ cartItems.length }} {{ cartItems.length === 1 ? 'course' : 'courses' }} in your cart</p>
      </div>

      <!-- ── Empty cart ── -->
      <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-28 gap-5 text-center bg-[#161618] border border-white/[0.07] rounded-2xl">
        <div class="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <ShoppingCart :size="28" class="text-zinc-600" />
        </div>
        <div>
          <p class="text-lg font-bold text-white">Your cart is empty</p>
          <p class="text-sm text-zinc-500 mt-1">Browse our courses and add something you'd like to learn.</p>
        </div>
        <a
          href="/courses"
          class="mt-2 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_22px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 transition-all"
        >
          Browse Courses <ArrowRight :size="15" />
        </a>
      </div>

      <!-- ── Cart layout ── -->
      <div v-else class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        <!-- Left: Cart items -->
        <div class="flex-1 flex flex-col gap-3 min-w-0">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="group flex flex-col sm:flex-row gap-4 bg-[#161618] border border-white/[0.08] rounded-2xl p-4 sm:p-5 hover:border-orange-500/20 transition-all duration-300"
          >
            <!-- Thumbnail -->
            <div class="relative w-full sm:w-36 aspect-video sm:aspect-auto sm:h-24 rounded-xl overflow-hidden shrink-0">
              <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/10">
                {{ item.category }}
              </span>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-between gap-2">
              <div>
                <h3 class="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-orange-300 transition-colors line-clamp-2">
                  {{ item.title }}
                </h3>
                <p class="text-xs text-zinc-500 mt-0.5">
                  By <span class="text-zinc-300 font-medium">{{ item.author }}</span>
                </p>
              </div>

              <div class="flex items-center gap-3 text-xs text-zinc-600">
                <span class="flex items-center gap-1">
                  <Clock :size="11" class="text-zinc-700" />
                  {{ item.duration }}
                </span>
                <span class="flex items-center gap-1">
                  <BookOpen :size="11" class="text-zinc-700" />
                  Full lifetime access
                </span>
              </div>
            </div>

            <!-- Price + remove -->
            <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between shrink-0">
              <div class="text-right">
                <p class="text-lg font-extrabold text-orange-400">${{ item.price }}</p>
                <p class="text-xs text-zinc-600 line-through">${{ item.originalPrice }}</p>
              </div>
              <button
                @click="removeItem(item.id)"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                aria-label="Remove from cart"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>

          <!-- Continue shopping link -->
          <a href="/courses" class="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-orange-400 transition-colors mt-1 w-fit"> ← Continue Shopping </a>
        </div>

        <!-- Right: Order summary -->
        <div class="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-8">
          <!-- Summary card -->
          <div class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-white/[0.06]">
              <h2 class="text-sm font-bold text-white">Order Summary</h2>
            </div>

            <div class="px-5 py-4 flex flex-col gap-3">
              <!-- Original price -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-zinc-500">Original price</span>
                <span class="text-zinc-400 line-through">${{ originalTotal }}</span>
              </div>

              <!-- Savings -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-zinc-500">Savings</span>
                <span class="text-emerald-400 font-semibold">-${{ totalSaved }}</span>
              </div>

              <!-- Coupon discount -->
              <div v-if="couponApplied" class="flex items-center justify-between text-sm">
                <span class="text-zinc-500 flex items-center gap-1">
                  <Tag :size="11" class="text-orange-400" />
                  Coupon ({{ Math.round(couponDiscount * 100) }}% off)
                </span>
                <span class="text-emerald-400 font-semibold">-${{ discountAmount }}</span>
              </div>

              <!-- Divider -->
              <div class="h-px bg-white/[0.06]"></div>

              <!-- Total -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-white">Total</span>
                <span class="text-xl font-extrabold text-white">${{ total }}</span>
              </div>
            </div>

            <!-- Checkout button -->
            <div class="px-5 pb-5">
              <button
                @click="checkout"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-[0_4px_20px_rgba(255,120,45,0.35)] hover:shadow-[0_8px_28px_rgba(255,120,45,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight :size="15" />
              </button>
            </div>
          </div>

          <!-- Coupon code -->
          <div class="bg-[#161618] border border-white/[0.08] rounded-2xl px-5 py-4">
            <p class="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">Have a coupon?</p>

            <!-- Applied state -->
            <div v-if="couponApplied" class="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
              <div class="flex items-center gap-2">
                <Tag :size="13" class="text-emerald-400" />
                <span class="text-sm font-bold text-emerald-400">{{ couponCode.toUpperCase() }}</span>
              </div>
              <button @click="removeCoupon" class="text-xs text-zinc-500 hover:text-red-400 transition-colors cursor-pointer font-semibold">Remove</button>
            </div>

            <!-- Input state -->
            <div v-else class="flex gap-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Enter code..."
                @keyup.enter="applyCoupon"
                class="flex-1 min-w-0 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              <button
                @click="applyCoupon"
                class="px-4 py-2.5 rounded-xl bg-orange-500/15 border border-orange-500/25 text-orange-400 text-sm font-bold hover:bg-orange-500/25 transition-all cursor-pointer whitespace-nowrap"
              >
                Apply
              </button>
            </div>

            <p v-if="couponError" class="text-xs text-red-400 mt-2">{{ couponError }}</p>
          </div>

          <!-- Trust badges -->
          <div class="bg-[#161618] border border-white/[0.08] rounded-2xl px-5 py-4 flex flex-col gap-3">
            <div class="flex items-center gap-3 text-xs text-zinc-500">
              <Shield :size="14" class="text-orange-400 shrink-0" />
              <span>30-day money-back guarantee</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-zinc-500">
              <RotateCcw :size="14" class="text-orange-400 shrink-0" />
              <span>Full lifetime access to all content</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-zinc-500">
              <BookOpen :size="14" class="text-orange-400 shrink-0" />
              <span>Certificate of completion included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
