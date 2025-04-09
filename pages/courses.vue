<template>
  <div class="w-full bg-[#F5F5F5] px-4 sm:px-8 py-3 overflow-x-auto">
    <CustomContainer>
   <CustomBreadCrumb/>
  </CustomContainer>
  </div>
</template>

<script setup>
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
</script>
