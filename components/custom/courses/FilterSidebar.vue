<script setup lang="ts">
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

// --- reset filters function
const resetFilters = () => {
  selectedCategories.value = [];
  selectedLevels.value = [];
};
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Filter Toggle Button for small screens -->
    <Button class="md:hidden self-start" @click="isOpen = !isOpen" variant="outline"> <Filter class="w-4 h-4 mr-2" /> Filters </Button>

    <!-- Filter Sidebar -->
    <div
      :class="[
        'fixed md:static top-0 left-0  md:h-auto w-72 md:w-80 bg-white shadow-lg md:shadow-none p-4 flex flex-col transition-transform duration-300 z-50',
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
      <h2 class="text-xl font-bold mb-4 hidden md:block" :class="auth.isEnglish ? 'text-left' : 'text-right'">{{ t('filter-courses') }}</h2>

      <!-- Scrollable area for filters -->
      <ScrollArea class="flex-1">
        <Accordion type="multiple" class="w-full space-y-3">
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
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

          <AccordionItem value="level">
            <AccordionTrigger>Level</AccordionTrigger>
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
        </Accordion>
      </ScrollArea>

      <!-- Footer buttons (always visible) -->
      <div class="flex gap-2 pt-4 border-t mt-4">
        <Button class="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white"> Save Filters </Button>
        <Button variant="outline" class="w-1/2" @click="resetFilters"> Reset Filters </Button>
      </div>
    </div>
  </div>
</template>
