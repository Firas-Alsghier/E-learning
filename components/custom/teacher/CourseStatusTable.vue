<script setup lang="ts">
// Define the interface for a single course item
interface Course {
  id: number;
  image: string;
  name: string;
  description: string;
  category: string;
  sale: number;
  rating: number;
  earning: number;
  visitor: number;
}

// Define props for the component
interface Props {
  courses: Course[];
}

const props = defineProps<Props>();
</script>

<template>
  <div class="rounded-xl bg-white p-6 shadow-md col-span-full">
    <div class="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <h2 class="text-xl font-semibold text-gray-800">Course Status</h2>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <span class="h-2 w-2 rounded-full bg-indigo-600"></span>
          <span class="text-sm text-gray-600">Course Visit</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="h-2 w-2 rounded-full bg-purple-600"></span>
          <span class="text-sm text-gray-600">Course Sale</span>
        </div>
        <select class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Year</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full table-auto">
        <thead>
          <tr class="border-b border-gray-200 text-left text-sm font-semibold text-gray-500">
            <th class="py-3 pr-4">Name</th>
            <th class="py-3 pr-4">Category</th>
            <th class="py-3 pr-4">Sale</th>
            <th class="py-3 pr-4">Rating</th>
            <th class="py-3 pr-4">Earning</th>
            <th class="py-3">Visitor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in props.courses" :key="course.id" class="border-b border-gray-100 last:border-b-0">
            <td class="py-4 pr-4">
              <div class="flex items-center gap-3">
                <img :src="course.image" :alt="course.name" class="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                <div>
                  <p class="font-medium text-gray-800">{{ course.name }}</p>
                  <p class="text-sm text-gray-500">{{ course.description }}</p>
                </div>
              </div>
            </td>
            <td class="py-4 pr-4 text-gray-600">{{ course.category }}</td>
            <td class="py-4 pr-4 text-gray-600">{{ course.sale }}</td>
            <td class="py-4 pr-4">
              <div class="flex items-center gap-1 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.001 9.306l8.332-1.151L12 .587z" />
                </svg>
                <span class="text-sm font-medium">{{ course.rating.toFixed(1) }}</span>
              </div>
            </td>
            <td class="py-4 pr-4 text-gray-600">${{ course.earning.toFixed(2) }}</td>
            <td class="py-4 text-gray-600">{{ course.visitor.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
