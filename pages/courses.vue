<script lang="ts">
import { Search } from 'lucide-vue-next'

</script>
<template>
  <div class="w-full bg-white">
    <CustomBreadCrumb />
    <CustomContainer>
      <div class="flex flex-col lg:flex-row-reverse gap-4 my-14">
        <!-- Filters (Left) -->
        <div class="w-full lg:max-w-[280px]">
          <CustomCoursesFilterSidebar />
        </div>

        <!-- Course List + Search (Right) -->
        <div class="flex-1 w-full space-y-5">
          <!-- Top bar: Title + Search -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="relative w-full max-w-sm items-center">
              <Input id="search" type="text" placeholder="Search..." class="pl-10" />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Search class="size-6 text-muted-foreground" />
              </span>
            </div>
            <h2 class="text-xl font-semibold">All Courses</h2>
          </div>

          <!-- Courses -->
          <div class="space-y-6">
            <CustomCoursesCourseCard v-for="i in 6" :key="i" />
          </div>

          <!-- Pagination -->
          <div class="flex justify-center pt-4">
            <ul class="flex gap-2 text-sm">
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                ‹</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center bg-black text-white">1</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                2</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                3</li>
              <li class="border rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100 cursor-pointer">
                ›</li>
            </ul>
          </div>
        </div>
      </div>
    </CustomContainer>
  </div>
</template>
