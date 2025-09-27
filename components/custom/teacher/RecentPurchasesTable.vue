<script setup lang="ts">
import { ref } from 'vue';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Dummy data for recent user purchases with a purchase date as a string
const purchases = ref([
  {
    id: '1',
    user: {
      name: 'Olivia Martin',
      email: 'olivia.martin@email.com',
      avatar: 'https://images.unsplash.com/photo-1534528736653-c7c4c114ad40?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-15',
    course: 'The Complete Full-Stack Web Development Course',
    amount: 1999,
  },
  {
    id: '2',
    user: {
      name: 'Jackson Lee',
      email: 'jackson.lee@email.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a811804f631?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-14',
    course: 'Introduction to Data Science with Python',
    amount: 39,
  },
  {
    id: '3',
    user: {
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@email.com',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c405a811e54?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-13',
    course: 'Mastering AI and Machine Learning',
    amount: 299,
  },
  {
    id: '4',
    user: {
      name: 'William Kim',
      email: 'will@email.com',
      avatar: 'https://images.unsplash.com/photo-1504593816503-4f932f94b1a4?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-12',
    course: 'Graphic Design for Beginners',
    amount: 99,
  },
  {
    id: '5',
    user: {
      name: 'Sofia Davis',
      email: 'sofia.davis@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop',
    },
    purchaseDate: '2024-09-11',
    course: 'Digital Marketing Fundamentals',
    amount: 39,
  },
]);

// Utility function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Function to generate avatar fallback initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
};

// Utility function to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="w-full col-span-full mx-auto rounded-xl border border-gray-700 bg-gray-800 text-gray-200 shadow-lg p-6">
    <div class="mb-6">
      <h2 class="text-xl font-semibold">Recent Sales</h2>
      <p class="text-sm text-gray-400">You made 265 sales this month.</p>
    </div>

    <Table>
      <TableHeader>
        <TableRow class="hover:bg-gray-800">
          <TableHead class="text-gray-400">User</TableHead>
          <TableHead class="text-gray-400">Date</TableHead>
          <TableHead class="text-gray-400">Course</TableHead>
          <TableHead class="text-right text-gray-400">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="purchase in purchases" :key="purchase.id" class="border-b border-gray-700">
          <TableCell>
            <div class="flex items-center gap-3">
              <Avatar class="h-9 w-9 border border-gray-600">
                <AvatarImage :src="purchase.user.avatar" :alt="purchase.user.name" />
                <AvatarFallback>{{ getInitials(purchase.user.name) }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="font-medium text-gray-100">{{ purchase.user.name }}</div>
                <div class="text-sm text-gray-400">{{ purchase.user.email }}</div>
              </div>
            </div>
          </TableCell>
          <TableCell class="text-gray-300">{{ formatDate(purchase.purchaseDate) }}</TableCell>
          <TableCell class="font-medium max-w-xs">{{ purchase.course }}</TableCell>
          <TableCell class="text-right font-semibold text-green-400">{{ formatCurrency(purchase.amount) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
