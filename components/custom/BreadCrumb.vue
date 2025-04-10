<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
</script>


<template>
     <Breadcrumb class="bg-[#F5F5F5] py-3 px-8">
      <CustomContainer>
      <BreadcrumbList class="flex gap-1 text-sm text-[#555555] whitespace-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>/</BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>
            The Ultimate Guide To The Best WordPress LMS Plugin
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </CustomContainer>
    </Breadcrumb>
</template>
