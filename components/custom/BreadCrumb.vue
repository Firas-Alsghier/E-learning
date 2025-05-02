<script setup lang="ts">
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// Props to accept breadcrumb items
interface BreadcrumbItemType {
  label: string;
  href?: string; // optional: if no href, it will be just text
}

defineProps<{
  items: BreadcrumbItemType[];
}>();
</script>

<template>
  <Breadcrumb class="bg-[#F5F5F5] py-3 px-8">
    <CustomContainer>
      <BreadcrumbList class="flex gap-1 text-sm text-[#555555] whitespace-nowrap">
        <template v-for="(item, index) in items" :key="index">
          <BreadcrumbItem>
            <template v-if="item.href">
              <BreadcrumbLink :href="item.href">{{ item.label }}</BreadcrumbLink>
            </template>
            <template v-else>
              <BreadcrumbPage>{{ item.label }}</BreadcrumbPage>
            </template>
          </BreadcrumbItem>

          <!-- Add separator except after the last item -->
          <BreadcrumbSeparator v-if="index !== items.length - 1">/</BreadcrumbSeparator>
        </template>
      </BreadcrumbList>
    </CustomContainer>
  </Breadcrumb>
</template>
