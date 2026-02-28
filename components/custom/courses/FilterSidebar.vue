<script setup lang="ts">
// components/custom/courses/FilterSidebar.vue
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';

const isOpen = ref(false);
const { t } = useI18n();
const auth = useAuthStore();

// --- filters state
const selectedCategories = ref<string[]>([]);
const selectedLevels = ref<string[]>([]);
const selectedRatings = ref<number[]>([]);
const selectedHours = ref<string[]>([]);
const selectedPrice = ref<string[]>([]); // 🔥 NEW PRICE FILTER

// --- reset filters function
const resetFilters = () => {
  selectedCategories.value = [];
  selectedLevels.value = [];
  selectedRatings.value = [];
  selectedHours.value = [];
  selectedPrice.value = []; // 🔥 reset price filter
};

const emit = defineEmits(['apply-filters']);
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Filter Toggle Button for small screens -->
    <Button class="md:hidden self-start" @click="isOpen = !isOpen" variant="outline"> <Filter class="w-4 h-4 mr-2" /> Filters </Button>

    <!-- Filter Sidebar -->
    <div
      :class="[
        'fixed md:static top-0 left-0 md:h-auto w-72 md:w-80 bg-white shadow-lg md:shadow-none p-4 flex flex-col transition-transform duration-300 z-50',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <!-- Header (mobile only) -->
      <div class="flex justify-between items-center mb-4 md:hidden">
        <h2 class="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="icon" @click="isOpen = false">
          <X class="w-4 h-4" />
        </Button>
      </div>

      <!-- Title -->
      <h2 class="text-xl font-bold mb-4 hidden md:block" :class="auth.isEnglish ? 'text-left' : 'text-right'">
        {{ t('filter-courses') }}
      </h2>

      <!-- Scrollable area -->
      <ScrollArea class="flex-1">
        <Accordion type="multiple" class="w-full space-y-3">
          <!-- Category -->
          <AccordionItem value="category">
            <AccordionTrigger class="cursor-pointer">Category</AccordionTrigger>
            <AccordionContent>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedCategories" value="Design" />
                  <span>Design</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedCategories" value="Development" />
                  <span>Development</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- Level -->
          <AccordionItem value="level">
            <AccordionTrigger class="cursor-pointer">Level</AccordionTrigger>
            <AccordionContent>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedLevels" value="Beginner" />
                  <span>Beginner</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedLevels" value="Advanced" />
                  <span>Advanced</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- ⭐ Ratings -->
          <AccordionItem value="ratings">
            <AccordionTrigger class="cursor-pointer">Rating</AccordionTrigger>
            <AccordionContent>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedRatings" :value="5" />
                  <span>⭐⭐⭐⭐⭐ (5+)</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedRatings" :value="4" />
                  <span>⭐⭐⭐⭐ (4+)</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedRatings" :value="3" />
                  <span>⭐⭐⭐ (3+)</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedRatings" :value="2" />
                  <span>⭐⭐ (2+)</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedRatings" :value="1" />
                  <span>⭐ (1+)</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- ⏳ Hours -->
          <AccordionItem value="hours">
            <AccordionTrigger class="cursor-pointer">Hours</AccordionTrigger>
            <AccordionContent>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedHours" value="0-2" />
                  <span>0 – 2 hours</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedHours" value="2-5" />
                  <span>2 – 5 hours</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedHours" value="5-10" />
                  <span>5 – 10 hours</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedHours" value="10+" />
                  <span>10+ hours</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- 💲 Price Filter -->
          <AccordionItem value="price">
            <AccordionTrigger class="cursor-pointer">Price</AccordionTrigger>
            <AccordionContent>
              <div class="space-y-2">
                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedPrice" value="free" />
                  <span>Free</span>
                </label>

                <label class="flex items-center space-x-2">
                  <input type="checkbox" v-model="selectedPrice" value="paid" />
                  <span>Paid</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <!-- Footer -->
      <div class="flex gap-2 pt-4 border-t mt-4">
        <Button
          class="w-1/2 bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white"
          @click="
            emit('apply-filters', {
              categories: selectedCategories,
              levels: selectedLevels,
              ratings: selectedRatings,
              hours: selectedHours,
              price: selectedPrice,
            })
          "
        >
          Save Filters
        </Button>
        <Button variant="outline" class="w-1/2 cursor-pointer" @click="resetFilters">Reset Filters</Button>
      </div>
    </div>
  </div>
</template>
