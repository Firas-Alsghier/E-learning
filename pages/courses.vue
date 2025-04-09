<template>
    <div class=" min-h-screen text-white py-10">
      <!-- Breadcrumbs -->
      <div class="container mx-auto px-4 text-sm text-gray-400 mb-4">
        Homepage > Course > <span class="text-white">The Ultimate Guide to The Best WordPress LMS Plugin</span>
      </div>
  
      <!-- Search Bar -->
      <div class="container mx-auto px-4 mb-8">
        <input type="text" placeholder="Search" class="w-full p-3 rounded-lg text-black" />
      </div>
  
      <div class="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
        <!-- Courses List -->
        <div class="flex-1 space-y-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-lg overflow-hidden text-black">
            <div class="flex flex-col md:flex-row">
              <div class="relative md:w-1/3">
                <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Photography</div>
                <div class="w-full h-48 md:h-full bg-gray-300 flex items-center justify-center">
                  <span>Course Image</span>
                </div>
              </div>
              <div class="p-4 md:w-2/3">
                <p class="text-xs text-gray-400">by DeterminedPotatos</p>
                <h3 class="font-semibold text-lg mb-2">Create An LMS Website With LearnPress</h3>
                <div class="flex items-center text-sm text-gray-600 gap-4 mb-3 flex-wrap">
                  <span>2 Weeks</span>
                  <span>156 Students</span>
                  <span>All levels</span>
                  <span>20 Lessons</span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-green-500 font-bold">$29.0 <span class="text-green-400">Free</span></div>
                  <button class="text-blue-600 font-semibold">View More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Filters Sidebar -->
        <div class="w-full lg:w-64 space-y-6 text-sm">
          <div>
            <div class="mb-2 text-white">Categories</div>
            <div class="space-y-1">
              <div v-for="item in 6" :key="item" class="flex justify-between">
                <span class="text-gray-300">Commercial</span>
                <span class="text-gray-400">15</span>
              </div>
            </div>
          </div>
  
          <div>
            <div class="mb-2 text-white">Instructors</div>
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Kenny White</span>
                <span class="text-gray-400">15</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">John Doe</span>
                <span class="text-gray-400">15</span>
              </div>
            </div>
          </div>
  
          <div>
            <div class="mb-2 text-white">Price</div>
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">Free</span>
                <span class="text-gray-400">15</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Paid</span>
                <span class="text-gray-400">15</span>
              </div>
            </div>
          </div>
  
          <div>
            <div class="mb-2 text-white">Rating</div>
            <div class="space-y-1">
              <div v-for="i in 5" :key="i" class="flex justify-between">
                <span class="text-yellow-400">{'★'.repeat(i)}{'☆'.repeat(5 - i)}</span>
                <span class="text-gray-400">(1,025)</span>
              </div>
            </div>
          </div>
  
          <div>
            <div class="mb-2 text-white">Level</div>
            <div class="space-y-1">
              <div class="flex justify-between">
                <span class="text-gray-300">All levels</span>
                <span class="text-gray-400">15</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Beginner</span>
                <span class="text-gray-400">15</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Expert</span>
                <span class="text-gray-400">15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Pagination -->
      <div class="mt-12 flex justify-center gap-2">
        <span class="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">1</span>
        <span v-for="i in 4" :key="i" class="w-8 h-8 border-2 border-white rounded-full"></span>
      </div>
    </div>
  </template>
  
  <script setup>
  // Static demo - Replace with actual data bindings
  </script>