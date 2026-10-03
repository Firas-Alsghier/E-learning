<script setup lang="ts">
import { ref, computed } from 'vue';
import { Trash2, Tag, ShoppingCart, ArrowRight, BookOpen, Clock, Shield, RotateCcw } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useI18n } from 'vue-i18n';

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

const token = useCookie('token');

const cartItems = ref<CartItem[]>([]);

const { t } = useI18n();

const loadCart = async () => {
  try {
    const data: any = await $fetch('http://localhost:3001/api/cart', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    cartItems.value = data.items.map((item: any) => ({
      id: item.course._id,
      title: item.course.title,
      author: `${item.course.teacher.firstName} ${item.course.teacher.lastName}`,
      image: item.course.coverImage,
      category: item.course.category,
      duration: '2 Weeks', // we'll replace this later with real duration
      originalPrice: item.course.price,
      price: item.course.price,
    }));
  } catch (err) {
    console.error(err);
  }
};

onMounted(loadCart);

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
const removeItem = async (courseId: string) => {
  try {
    await $fetch(`http://localhost:3001/api/cart/${courseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    // Remove instantly from UI
    cartItems.value = cartItems.value.filter((item) => item.id !== courseId);
    toast.success('Course removed from cart');
  } catch (err) {
    console.error(err);
  }
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

const checkout = async () => {
  try {
    const res: any = await $fetch('http://localhost:3001/api/cart/checkout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    toast.success('Purchase completed!', {
      description: 'Your courses have been added to My Courses.',
    });

    // Empty cart instantly
    cartItems.value = [];

    // We'll replace this later with cartStore.refresh()
    // and navigate to My Courses.
  } catch (err: any) {
    console.error(err);

    toast.error('Checkout failed', {
      description: err?.data?.message || 'Something went wrong.',
    });
  }
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
          {{ t('your-cart') }}
        </h1>
        <p dir="ltr" class="text-sm text-right text-zinc-500 mt-1 ml-12">{{ cartItems.length }} {{ cartItems.length === 1 ? 'course' : 'courses' }} {{ t('in-your-cart') }}</p>
      </div>

      <!-- ── Empty cart ── -->
      <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-28 gap-5 text-center bg-[#161618] border border-white/[0.07] rounded-2xl">
        <div class="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <ShoppingCart :size="28" class="text-zinc-600" />
        </div>
        <div>
          <p class="text-lg font-bold text-white">{{ t('cart-empty-title') }}</p>
          <p class="text-sm text-zinc-500 mt-1">{{ t('cart-empty-subtitle') }}</p>
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
                  {{ t('full-lifetime-access') }}
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
          <a href="/courses" class="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-orange-400 transition-colors mt-1 w-fit"> {{ t('continue-shopping') }} </a>
        </div>

        <!-- Right: Order summary -->
        <div class="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-8">
          <!-- Summary card -->
          <div class="bg-[#161618] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-white/[0.06]">
              <h2 class="text-sm font-bold text-white">{{ t('order-summary') }}</h2>
            </div>

            <div class="px-5 py-4 flex flex-col gap-3">
              <!-- Original price -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-zinc-500">{{ t('original-price') }}</span>
                <span class="text-zinc-400 line-through">${{ originalTotal }}</span>
              </div>

              <!-- Savings -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-zinc-500">{{ t('savings') }}</span>
                <span class="text-emerald-400 font-semibold">{{ t('currency') }}</span>
              </div>

              <!-- Coupon discount -->
              <div v-if="couponApplied" class="flex items-center justify-between text-sm">
                <span class="text-zinc-500 flex items-center gap-1">
                  <Tag :size="11" class="text-orange-400" />
                  Coupon ({{ Math.round(couponDiscount * 100) }}% off)
                </span>
                <span class="text-emerald-400 font-semibold">{{ t('currency') }}</span>
              </div>

              <!-- Divider -->
              <div class="h-px bg-white/[0.06]"></div>

              <!-- Total -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-white">{{ t('total') }}</span>
                <span class="text-xl font-extrabold text-white">${{ total }}</span>
              </div>
            </div>

            <!-- Checkout button -->
            <div class="px-5 pb-5">
              <button
                @click="checkout"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-sm shadow-[0_4px_20px_rgba(255,120,45,0.35)] hover:shadow-[0_8px_28px_rgba(255,120,45,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {{ t('checkout') }} <ArrowRight :size="15" />
              </button>
            </div>
          </div>
          <!-- Trust badges -->
          <div class="bg-[#161618] border border-white/[0.08] rounded-2xl px-5 py-4 flex flex-col gap-3">
            <div class="flex items-center gap-3 text-xs text-zinc-500">
              <Shield :size="14" class="text-orange-400 shrink-0" />
              <span>{{ t('money-back-guarantee') }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-zinc-500">
              <RotateCcw :size="14" class="text-orange-400 shrink-0" />
              <span>{{ t('full-lifetime-access') }}</span>
            </div>
            <div class="flex items-center gap-3 text-xs text-zinc-500">
              <BookOpen :size="14" class="text-orange-400 shrink-0" />
              <span>{{ t('certificate-included') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
