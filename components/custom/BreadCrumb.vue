<script setup lang="ts">
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

defineProps<{
  items: BreadcrumbItemType[];
}>();
</script>

<template>
  <Breadcrumb class="bg-[#f2f6f9] border-b border-white/[0.06] py-4 sm:py-4">
    <CustomContainer>
      <BreadcrumbList class="flex items-center flex-wrap gap-x-1 gap-y-1 text-sm sm:text-sm min-w-0">
        <template v-for="(item, index) in items" :key="index">
          <BreadcrumbItem class="flex items-center min-w-0">
            <template v-if="item.href">
              <BreadcrumbLink :href="item.href" class="text-zinc-500 hover:text-orange-400 transition-colors duration-200 truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                {{ item.label }}
              </BreadcrumbLink>
            </template>
            <template v-else>
              <BreadcrumbPage class="text-zinc-400 font-medium truncate max-w-[140px] sm:max-w-[220px] lg:max-w-xs">
                {{ item.label }}
              </BreadcrumbPage>
            </template>
          </BreadcrumbItem>

          <BreadcrumbSeparator v-if="index !== items.length - 1" class="text-zinc-700 select-none shrink-0 text-xs"> / </BreadcrumbSeparator>
        </template>
      </BreadcrumbList>
    </CustomContainer>
  </Breadcrumb>
</template>
