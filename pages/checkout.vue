<script setup>
// 1. Import all necessary Vue functions and Lucide icons
import { ref, computed, defineComponent, h } from 'vue';
import { CreditCard, Lock, AlertTriangle, Trash2, Edit2, Minus, Plus, ShoppingCart, DollarSign, MapPin, Tag } from 'lucide-vue-next';

// --- STATE MANAGEMENT ---
const currentStep = ref(1); // 1: Cart, 2: Checkout (Billing/Payment), 3: Confirmation

// --- MOCK DATA ---
const cartItems = ref([
  { id: 1, name: 'دورة تطوير الواجهات الأمامية المتقدمة', price: 99.99, originalPrice: 120.0, quantity: 1, image: 'https://placehold.co/100x120/E8F5E9/000000?text=Course+1' },
  { id: 2, name: 'كتاب: أساسيات التصميم الجرافيكي', price: 19.99, originalPrice: 25.0, quantity: 2, image: 'https://placehold.co/100x120/FBE8A0/000000?text=Book' },
  { id: 3, name: 'دورة التسويق الرقمي الشاملة', price: 79.99, originalPrice: 99.99, quantity: 1, image: 'https://placehold.co/100x120/FFD9C0/000000?text=Course+3' },
]);

// --- PRICE CALCULATIONS ---
const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const couponCode = ref('');
const discountRate = ref(0.15); // Mock 15% discount
const shippingFee = ref(0.0); // Assuming no physical shipping for courses
const taxRate = ref(0.05); // 5% tax

const discount = computed(() => {
  // Only apply discount if a valid mock coupon is applied
  return couponCode.value.toUpperCase() === 'SAVE15' ? subtotal.value * discountRate.value : 0;
});

const taxAmount = computed(() => {
  return (subtotal.value - discount.value) * taxRate.value;
});

const totalAmount = computed(() => {
  return subtotal.value - discount.value + shippingFee.value + taxAmount.value;
});

// --- FORM STATE (for Step 2) ---
const paymentMethod = ref('credit_card');
const billingDetails = ref({
  fullName: '',
  email: '',
  country: 'المملكة العربية السعودية',
  city: 'الرياض',
  address: '',
});
const cardDetails = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: '',
});

// --- METHODS ---
const applyCoupon = () => {
  // Mock coupon logic
  if (couponCode.value.toUpperCase() === 'SAVE15') {
    alert('تم تطبيق الكوبون بنجاح! خصم 15%.');
  } else {
    alert('كوبون غير صالح أو منتهي الصلاحية.');
  }
};

const handlePayment = () => {
  // Placeholder for actual payment submission logic
  console.log('Processing payment...');
  // Using alert for this demo, as requested by previous implementation logic, but prefer custom modal in real app.
  alert('تمت محاكاة عملية الدفع بنجاح! ننتقل إلى صفحة التأكيد.');
  currentStep.value = 3; // Move to confirmation step
};

const updateQuantity = (id, change) => {
  const item = cartItems.value.find((i) => i.id === id);
  if (item) {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    } else {
      removeItem(id);
    }
  }
};

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
};

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

// --- MOCK COMPONENTS (Rewritten using h() for compatibility) ---
const Input = defineComponent({
  props: ['id', 'type', 'placeholder', 'modelValue', 'required'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        id: props.id,
        type: props.type,
        placeholder: props.placeholder,
        value: props.modelValue,
        required: props.required,
        onInput: (event) => emit('update:modelValue', event.target.value),
        class: 'w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-right',
      });
  },
});

const Button = defineComponent({
  props: ['type', 'variant', 'disabled'],
  setup(props, { slots }) {
    const buttonClasses = computed(() => ({
      'bg-orange-600 text-white hover:bg-orange-700': props.variant === 'primary' || !props.variant,
      'bg-gray-200 text-gray-700 hover:bg-gray-300': props.variant === 'secondary',
      'opacity-50 cursor-not-allowed': props.disabled,
    }));

    return () =>
      h(
        'button',
        {
          type: props.type || 'button',
          disabled: props.disabled,
          class: `w-full font-semibold py-3 rounded-xl transition duration-200 ${Object.entries(buttonClasses.value)
            .filter(([, val]) => val)
            .map(([key]) => key)
            .join(' ')}`,
        },
        slots.default ? slots.default() : null
      );
  },
});

const RadioGroup = defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    return () => h('div', { class: 'space-y-4 text-right' }, slots.default ? slots.default() : null);
  },
});

const RadioGroupItem = defineComponent({
  props: ['id', 'value', 'label'],
  setup(props, { slots, emit, attrs }) {
    const parentModelValue = computed(() => attrs.modelValue); // Accessing parent's modelValue via attrs

    return () =>
      h(
        'label',
        {
          for: props.id,
          class: [
            'flex items-center justify-end p-4 border rounded-xl cursor-pointer transition hover:bg-gray-50',
            {
              'border-orange-600 ring-2 ring-orange-100': parentModelValue.value === props.value,
            },
          ],
        },
        [
          h('div', { class: 'flex items-center space-x-3 space-x-reverse flex-grow' }, [slots.icon ? slots.icon() : null, h('div', { class: 'font-medium flex-grow text-right' }, props.label)]),
          h('input', {
            id: props.id,
            type: 'radio',
            value: props.value,
            checked: parentModelValue.value === props.value,
            onChange: (event) => emit('update:modelValue', props.value),
            name: 'paymentMethod',
            class: 'w-4 h-4 text-orange-600 focus:ring-orange-500',
          }),
        ]
      );
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header and Step Indicator -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-10 text-right">
        <h1 class="text-3xl font-serif font-light text-gray-900 mb-4 sm:mb-0">سلة المشتريات</h1>

        <div class="flex items-center space-x-6 space-x-reverse text-gray-500">
          <div :class="{ 'text-black font-semibold': currentStep === 1, 'text-gray-900': currentStep > 1 }" class="text-sm sm:text-lg transition duration-300">
            <span class="mr-1 font-mono text-gray-500" :class="{ 'text-orange-500': currentStep === 1 }">1.</span> السلة
          </div>
          <div :class="{ 'text-black font-semibold': currentStep === 2, 'text-gray-900': currentStep > 2 }" class="text-sm sm:text-lg transition duration-300">
            <span class="mr-1 font-mono text-gray-500" :class="{ 'text-orange-500': currentStep === 2 }">2.</span> الدفع
          </div>
          <div :class="{ 'text-black font-semibold': currentStep === 3 }" class="text-sm sm:text-lg transition duration-300">
            <span class="mr-1 font-mono text-gray-500" :class="{ 'text-orange-500': currentStep === 3 }">3.</span> تأكيد
          </div>
        </div>
      </div>

      <!-- Content Grid: Items (2/3) + Summary (1/3) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-8" style="direction: rtl">
        <!-- Left Column (Items/Forms) - Takes 2/3 space -->
        <div class="lg:col-span-2 space-y-8">
          <!-- STEP 1: CART ITEMS -->
          <div v-if="currentStep === 1" class="space-y-6">
            <div v-if="cartItems.length === 0" class="bg-white p-12 rounded-2xl shadow-lg border text-center text-gray-600">
              <ShoppingCart :size="48" class="mx-auto mb-4 text-gray-400" />
              <p class="text-xl font-medium">سلة مشترياتك فارغة.</p>
              <p class="text-sm mt-2">ابدأ بإضافة دورات ومقالات إلى سلتك!</p>
            </div>

            <div v-for="item in cartItems" :key="item.id" class="bg-white p-4 sm:p-6 rounded-2xl shadow-md border flex flex-col sm:flex-row items-center justify-between">
              <div class="flex items-center w-full sm:w-2/3 space-x-4 space-x-reverse">
                <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded-xl shadow-inner" />
                <div class="flex-grow text-right">
                  <h2 class="text-lg font-semibold text-gray-900">{{ item.name }}</h2>
                  <p class="text-sm text-gray-500 mt-1">
                    <span v-if="item.isCourse" class="text-blue-500 font-medium">دورة إلكترونية</span>
                    <span v-else class="text-green-500 font-medium">كتاب/مقالة</span>
                  </p>
                  <div class="flex items-center mt-2 justify-end text-sm">
                    <span class="font-bold text-lg text-red-600">${{ (item.price * item.quantity).toFixed(2) }}</span>
                    <span class="line-through text-gray-400 mr-2">${{ (item.originalPrice * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-4 space-x-reverse mt-4 sm:mt-0 sm:w-1/3 justify-end">
                <!-- Quantity Controls -->
                <div class="flex items-center border rounded-full overflow-hidden divide-x divide-x-reverse">
                  <button @click="updateQuantity(item.id, -1)" class="p-2 text-gray-600 hover:bg-gray-100 transition">
                    <Minus :size="16" />
                  </button>
                  <span class="px-4 text-sm font-medium">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, 1)" class="p-2 text-gray-600 hover:bg-gray-100 transition">
                    <Plus :size="16" />
                  </button>
                </div>
                <!-- Actions -->
                <button @click="removeItem(item.id)" class="p-2 text-gray-500 hover:text-red-500 transition">
                  <Trash2 :size="20" />
                </button>
                <button class="p-2 text-gray-500 hover:text-blue-500 transition">
                  <Edit2 :size="20" />
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 2: CHECKOUT (Billing & Payment) -->
          <form v-else-if="currentStep === 2" @submit.prevent="handlePayment" class="space-y-8">
            <!-- Billing Details -->
            <div class="bg-white p-6 rounded-2xl shadow-lg border">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-right">1. تفاصيل الفوترة</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1 text-right">الاسم بالكامل</label>
                  <Input id="fullName" type="text" placeholder="أدخل اسمك" required v-model="billingDetails.fullName" />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1 text-right">البريد الإلكتروني</label>
                  <Input id="email" type="email" placeholder="example@domain.com" required v-model="billingDetails.email" />
                </div>
                <div class="md:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700 mb-1 text-right">العنوان</label>
                  <Input id="address" type="text" placeholder="الشارع، رقم المبنى (هذا للحصول على الإيصالات والعروض)" required v-model="billingDetails.address" />
                </div>
                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700 mb-1 text-right">الدولة</label>
                  <Input id="country" type="text" required v-model="billingDetails.country" />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1 text-right">المدينة</label>
                  <Input id="city" type="text" required v-model="billingDetails.city" />
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="bg-white p-6 rounded-2xl shadow-lg border">
              <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-right">2. اختيار طريقة الدفع</h2>

              <!-- Use RadioGroup and RadioGroupItem components -->
              <RadioGroup v-model="paymentMethod">
                <!-- Credit Card Option -->
                <RadioGroupItem id="card" value="credit_card" label="بطاقة ائتمانية (فيزا/ماستركارد)">
                  <template #icon>
                    <CreditCard class="w-6 h-6 text-orange-600" />
                  </template>
                </RadioGroupItem>

                <!-- Digital Payment Option (e.g., PayPal/Apple Pay) -->
                <RadioGroupItem id="paypal" value="paypal" label="باي بال">
                  <template #icon>
                    <div class="w-6 h-6 bg-blue-900 text-white flex items-center justify-center rounded-sm text-xs font-bold">P</div>
                  </template>
                </RadioGroupItem>
              </RadioGroup>

              <!-- Credit Card Details Form -->
              <div v-if="paymentMethod === 'credit_card'" class="mt-6 p-4 border border-gray-200 rounded-xl space-y-4">
                <h3 class="font-medium text-lg text-right">تفاصيل البطاقة</h3>
                <div>
                  <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-1 text-right">رقم البطاقة</label>
                  <Input id="cardNumber" type="text" placeholder="XXXX XXXX XXXX XXXX" required v-model="cardDetails.cardNumber" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-1 text-right">تاريخ الانتهاء (MM/YY)</label>
                    <Input id="expiryDate" type="text" placeholder="01/25" required v-model="cardDetails.expiryDate" />
                  </div>
                  <div>
                    <label for="cvv" class="block text-sm font-medium text-gray-700 mb-1 text-right">رمز CVV</label>
                    <Input id="cvv" type="text" placeholder="123" required v-model="cardDetails.cvv" />
                  </div>
                </div>
                <p class="flex items-center justify-end text-xs text-gray-500 pt-2 space-x-1 space-x-reverse">
                  <Lock class="w-4 h-4 ml-1" />
                  <span>عملية دفع آمنة ومشفرة</span>
                </p>
              </div>

              <!-- Submit Button -->
              <div class="mt-8">
                <Button type="submit" variant="primary"> ادفع الآن وأكمل الطلب: ${{ totalAmount.toFixed(2) }} </Button>
                <button type="button" @click="prevStep" class="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm py-2">← العودة إلى السلة</button>
              </div>
            </div>
          </form>

          <!-- STEP 3: CONFIRMATION -->
          <div v-else-if="currentStep === 3" class="bg-white p-12 rounded-2xl shadow-lg border text-center text-gray-900">
            <DollarSign :size="48" class="mx-auto mb-6 text-green-500 p-2 bg-green-100 rounded-full" />
            <h2 class="text-3xl font-bold mb-2">تم تأكيد طلبك بنجاح!</h2>
            <p class="text-gray-600 text-lg mb-6">شكراً لشرائك. ستصلك جميع تفاصيل الدورات والمقالات على بريدك الإلكتروني قريباً.</p>
            <p class="text-sm font-medium text-gray-500 mt-4">رقم الطلب: #XYZ-{{ Math.floor(Math.random() * 90000) + 10000 }}</p>
            <Button variant="secondary" class="mt-6 w-1/2"> انتقل إلى حسابي </Button>
          </div>
        </div>

        <!-- Right Column (Order Summary) - Takes 1/3 space -->
        <!-- UPDATED: Changed mt-8 to mt-12 for better separation on mobile/tablet (screens below lg) -->
        <div class="mt-12 lg:mt-0">
          <div class="bg-white p-6 rounded-2xl shadow-lg border sticky top-10">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-right">ملخص الطلب</h2>

            <!-- Item Count (Only visible in Cart/Checkout steps) -->
            <div v-if="currentStep < 3" class="flex justify-between items-center text-sm font-medium text-gray-600 mb-4 border-b pb-4">
              <span class="text-gray-600">عدد الأصناف:</span>
              <span class="font-bold text-gray-800">{{ cartItems.length }}</span>
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2 mb-4 text-sm text-right">
              <div class="flex justify-between">
                <span class="text-gray-600">المجموع الفرعي:</span>
                <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-red-600 font-semibold">
                <span class="flex items-center space-x-1 space-x-reverse">
                  <Tag :size="16" class="ml-1" />
                  <span>الخصم:</span>
                </span>
                <span>-${{ discount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الضرائب ({{ (taxRate * 100).toFixed(0) }}%):</span>
                <span class="font-medium">${{ taxAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الشحن:</span>
                <span class="font-medium">{{ shippingFee === 0 ? 'مجاني' : `$${shippingFee.toFixed(2)}` }}</span>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t pt-4 flex justify-between items-center text-xl font-bold text-gray-900 text-right">
              <span>الإجمالي الكلي:</span>
              <span>${{ totalAmount.toFixed(2) }}</span>
            </div>

            <!-- Coupon Input (Only visible in Cart/Checkout steps) -->
            <div v-if="currentStep < 3" class="mt-6 pt-4 border-t">
              <label for="coupon" class="block text-sm font-medium text-gray-700 mb-2 text-right">هل لديك كوبون خصم؟</label>
              <div class="flex space-x-2 space-x-reverse">
                <button type="button" @click="applyCoupon" class="whitespace-nowrap px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">تطبيق</button>
                <Input id="coupon" type="text" placeholder="مثال: SAVE15" v-model="couponCode" />
              </div>
            </div>

            <!-- Action Button (Only visible in Cart step) -->
            <div v-if="currentStep === 1" class="mt-6">
              <Button @click="nextStep" :disabled="cartItems.length === 0" variant="primary"> الإنتقال لصفحة الدفع </Button>
            </div>

            <!-- Delivery/Confirmation Info -->
            <div class="mt-6 p-3 bg-gray-50 text-gray-700 rounded-xl text-sm flex items-start space-x-2 space-x-reverse text-right">
              <MapPin class="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-500" />
              <div v-if="currentStep === 1">
                <p class="font-medium">التسليم المقدر:</p>
                <p class="text-xs">يتم الوصول الفوري للدورات بعد إتمام عملية الدفع.</p>
              </div>
              <div v-else-if="currentStep === 2">
                <p class="font-medium">أمان الدفع:</p>
                <p class="text-xs">يتم تشفير جميع معلومات الدفع الخاصة بك.</p>
              </div>
              <div v-else-if="currentStep === 3">
                <p class="font-medium">تاريخ الطلب:</p>
                <p class="text-xs">{{ new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure Arabic right-to-left alignment for the layout */
/* Using direction: rtl on the grid container above helps Tailwind utilities, but these CSS fixes are still necessary for specific flex/margin overrides in RTL */
.space-x-reverse > * + * {
  margin-right: 0.75rem;
  margin-left: 0;
}
.space-x-reverse {
  direction: rtl;
}

/* Fix radio button layout direction (Step 2) */
input[type='radio'] {
  order: 2;
  margin-right: 0.5rem;
  margin-left: 0;
}
.RadioGroupItem label {
  display: flex;
  flex-direction: row-reverse;
}

/* Ensure price text and quantity controls are always right-aligned when space allows */
.justify-end {
  justify-content: flex-start;
}
.text-right {
  text-align: right;
}
</style>
