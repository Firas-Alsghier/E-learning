<script setup lang="ts">
import { computed, ref } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';

const { t } = useI18n();
const auth = useAuthStore();

/* =======================
   PROPS FROM PARENT
======================= */
const props = defineProps<{
  filters: {
    categories: string[];
    levels: string[];
    ratings: number[];
    hours: string[];
    price: string[];
  };
}>();

const emit = defineEmits(['apply-filters']);

/* =======================
   TWO-WAY COMPUTED STATE
======================= */
const selectedCategories = computed({
  get: () => props.filters.categories,
  set: (val: string[]) => emit('apply-filters', { ...props.filters, categories: val }),
});

const selectedLevels = computed({
  get: () => props.filters.levels,
  set: (val: string[]) => emit('apply-filters', { ...props.filters, levels: val }),
});

const selectedPrice = computed({
  get: () => props.filters.price,
  set: (val: string[]) => emit('apply-filters', { ...props.filters, price: val }),
});

const selectedRatings = computed({
  get: () => props.filters.ratings,
  set: (val: number[]) => emit('apply-filters', { ...props.filters, ratings: val }),
});

const selectedHours = computed({
  get: () => props.filters.hours,
  set: (val: string[]) => emit('apply-filters', { ...props.filters, hours: val }),
});

/* =======================
   ACCORDION OPEN STATE
======================= */
const openSections = ref<string[]>(['category', 'level', 'price']);

const toggleSection = (id: string) => {
  if (openSections.value.includes(id)) {
    openSections.value = openSections.value.filter((s) => s !== id);
  } else {
    openSections.value.push(id);
  }
};

const isOpen = (id: string) => openSections.value.includes(id);

/* =======================
   RESET
======================= */
const resetFilters = () => {
  emit('apply-filters', {
    categories: [],
    levels: [],
    ratings: [],
    hours: [],
    price: [],
  });
};

/* =======================
   ACTIVE FILTER COUNT
======================= */
const activeCount = computed(() => props.filters.categories.length + props.filters.levels.length + props.filters.ratings.length + props.filters.hours.length + props.filters.price.length);
</script>

<template>
  <!--
    🎨 BACKGROUND COLOR — change the class below to set your sidebar background.
    Current value: bg-white
    Examples: bg-gray-50 | bg-slate-100 | bg-[#your-color]
  -->
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h2 class="text-sm font-bold text-gray-800 uppercase tracking-widest" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        {{ t('filter-courses') }}
      </h2>

      <!-- Active filter badge + reset -->
      <button v-if="activeCount > 0" @click="resetFilters" class="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors cursor-pointer">
        <span class="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-[10px]">
          {{ activeCount }}
        </span>
        Reset
      </button>
    </div>

    <!-- Scrollable filter sections -->
    <div class="overflow-y-auto flex-1 divide-y divide-gray-100" style="max-height: 520px; scrollbar-width: thin; scrollbar-color: #e5e7eb transparent">
      <!-- ── Category ── -->
      <div>
        <button
          @click="toggleSection('category')"
          class="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
        >
          <span>Category</span>
          <ChevronDown :size="15" class="text-gray-400 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': isOpen('category') }" />
        </button>

        <Transition name="accordion">
          <div v-show="isOpen('category')" class="px-5 pb-4 flex flex-col gap-2.5">
            <label v-for="opt in ['Design', 'Development']" :key="opt" class="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" v-model="selectedCategories" :value="opt" class="w-4 h-4 rounded border-gray-300 text-orange-500 accent-orange-500 cursor-pointer shrink-0" />
              <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{{ opt }}</span>
            </label>
          </div>
        </Transition>
      </div>

      <!-- ── Level ── -->
      <div>
        <button @click="toggleSection('level')" class="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
          <span>Level</span>
          <ChevronDown :size="15" class="text-gray-400 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': isOpen('level') }" />
        </button>

        <Transition name="accordion">
          <div v-show="isOpen('level')" class="px-5 pb-4 flex flex-col gap-2.5">
            <label v-for="opt in ['All levels', 'Basic', 'Intermediate', 'Advanced']" :key="opt" class="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" v-model="selectedLevels" :value="opt" class="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer shrink-0" />
              <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{{ opt }}</span>
            </label>
          </div>
        </Transition>
      </div>

      <!-- ── Rating ── -->
      <div>
        <button @click="toggleSection('ratings')" class="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
          <span>Rating</span>
          <ChevronDown :size="15" class="text-gray-400 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': isOpen('ratings') }" />
        </button>

        <Transition name="accordion">
          <div v-show="isOpen('ratings')" class="px-5 pb-4 flex flex-col gap-2.5">
            <label v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" v-model="selectedRatings" :value="star" class="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer shrink-0" />
              <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors"> {{ '⭐'.repeat(star) }} ({{ star }}+) </span>
            </label>
          </div>
        </Transition>
      </div>

      <!-- ── Hours ── -->
      <div>
        <button @click="toggleSection('hours')" class="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
          <span>Hours</span>
          <ChevronDown :size="15" class="text-gray-400 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': isOpen('hours') }" />
        </button>

        <Transition name="accordion">
          <div v-show="isOpen('hours')" class="px-5 pb-4 flex flex-col gap-2.5">
            <label
              v-for="opt in [
                { value: '0-2', label: '0 – 2 hours' },
                { value: '2-5', label: '2 – 5 hours' },
                { value: '5-10', label: '5 – 10 hours' },
                { value: '10+', label: '10+ hours' },
              ]"
              :key="opt.value"
              class="flex items-center gap-3 cursor-pointer group"
            >
              <input type="checkbox" v-model="selectedHours" :value="opt.value" class="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer shrink-0" />
              <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{{ opt.label }}</span>
            </label>
          </div>
        </Transition>
      </div>

      <!-- ── Price ── -->
      <div>
        <button @click="toggleSection('price')" class="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer transition-colors">
          <span>Price</span>
          <ChevronDown :size="15" class="text-gray-400 transition-transform duration-200 shrink-0" :class="{ 'rotate-180': isOpen('price') }" />
        </button>

        <Transition name="accordion">
          <div v-show="isOpen('price')" class="px-5 pb-4 flex flex-col gap-2.5">
            <label
              v-for="opt in [
                { value: 'free', label: 'Free' },
                { value: 'paid', label: 'Paid' },
              ]"
              :key="opt.value"
              class="flex items-center gap-3 cursor-pointer group"
            >
              <input type="checkbox" v-model="selectedPrice" :value="opt.value" class="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer shrink-0" />
              <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{{ opt.label }}</span>
            </label>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Footer: Save button -->
    <div class="px-5 py-4 border-t border-gray-100">
      <button
        @click="
          emit('apply-filters', {
            categories: selectedCategories,
            levels: selectedLevels,
            ratings: selectedRatings,
            hours: selectedHours,
            price: selectedPrice,
          })
        "
        class="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold cursor-pointer shadow-[0_4px_16px_rgba(255,120,45,0.3)] hover:shadow-[0_6px_22px_rgba(255,120,45,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        Apply Filters
      </button>
    </div>
  </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
