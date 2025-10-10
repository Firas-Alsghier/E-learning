<script setup lang="ts">
import { ref } from 'vue';
import { Search, Plus, MoreVertical, Send, Paperclip, CheckCheck, Image, Video, FileText, Link, ChevronDown, BellOff } from 'lucide-vue-next';

// --- Shared Data Interfaces ---

interface Message {
  id: number;
  text: string;
  isUser: boolean; // true for Account owner (Daniela Jung), false for Student
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number | null;
  isOnline: boolean;
  image: string; // Placeholder for profile image URL
}

interface FileItem {
  id: number;
  name: string;
  type: 'document' | 'image' | 'video' | 'link';
  icon: any; // Lucide icon component
  url: string;
}

// --- Data for ConversationList (Left Column) ---

const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: 'Emma Johnson',
    lastMessage: 'Hey! Just wanted to check if the assignment is uploaded?',
    time: '10:15 AM',
    unreadCount: 2,
    isOnline: true,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=EJ',
  },
  {
    id: 2,
    name: 'Michael Brown',
    lastMessage: 'The webinar was insightful! Thanks for organizing.',
    time: '09:45 AM',
    unreadCount: null,
    isOnline: true,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=MB',
  },
  {
    id: 3,
    name: 'Sophia Miller',
    lastMessage: 'Can you clarify the second module topic?',
    time: '08:30 AM',
    unreadCount: 1,
    isOnline: false,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=SM',
  },
  {
    id: 4,
    name: 'James Wilson',
    lastMessage: "I've submitted my final project. Kindly review.",
    time: 'Yesterday',
    unreadCount: 3,
    isOnline: false,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=JW',
  },
  {
    id: 5,
    name: 'Olivia Davis',
    lastMessage: "Do we have a recorded session for last week's class?",
    time: 'Yesterday',
    unreadCount: null,
    isOnline: true,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=OD',
  },
  {
    id: 6,
    name: 'Daniella Jung',
    lastMessage: "Great! If it still doesn't work, let me know...",
    time: 'Mar 6',
    unreadCount: null,
    isOnline: true,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=DJ',
  },
  {
    id: 7,
    name: 'Mohammed Rodrigues',
    lastMessage: "I'll continue with the course and check my progress again.",
    time: 'Mar 5',
    unreadCount: null,
    isOnline: false,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=MR',
  },
  {
    id: 8,
    name: 'Isabella Clark',
    lastMessage: 'Loved the course! Are there any follow-ups?',
    time: 'Mar 4',
    unreadCount: null,
    isOnline: true,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=IC',
  },
  {
    id: 9,
    name: 'Liam Harris',
    lastMessage: 'Hi Daniela, I have a quick question about...',
    time: 'Mar 4',
    unreadCount: null,
    isOnline: false,
    image: 'https://placehold.co/40x40/EDF2F7/2D3748?text=LH',
  },
]);

const activeConversationId = ref(6); // Default to Daniela Jung's chat

// --- Data for ChatWindow (Middle Column) ---

// Chat messages for the active conversation (Daniela Jung)
const chatMessages = ref<Message[]>([
  { id: 101, text: "Hey, I'm facing login issues. Any help?", isUser: false, time: '1:00 PM', status: 'read' },
  { id: 102, text: 'Hi Daniel! Could you specify the issue? Are you getting an error message?', isUser: true, time: '1:02 PM', status: 'read' },
  { id: 103, text: "Yeah, it says 'Invalid Credentials' even though my password is correct.", isUser: false, time: '1:05 PM', status: 'read' },
  { id: 104, text: 'Have you tried resetting your password?', isUser: true, time: '1:07 PM', status: 'read' },
  { id: 105, text: "Not yet. I'll try that now.", isUser: false, time: '1:10 PM', status: 'read' },
  { id: 106, text: "Great! If it still doesn't work, let me know and I'll escalate the issue to support.", isUser: true, time: '1:12 PM', status: 'read' },
]);

const newMessageText = ref('');

const sendMessage = () => {
  if (newMessageText.value.trim() === '') return;

  const newMsg: Message = {
    id: Date.now(),
    text: newMessageText.value,
    isUser: true, // Assuming the current user is Daniela Jung, the teacher
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent',
  };
  chatMessages.value.push(newMsg);
  newMessageText.value = '';
  // In a real app, you would send this to the server here.
};

// --- Data for AccountSidebar (Right Column) ---

const mediaFiles = ref<FileItem[]>([
  { id: 201, name: 'Image (2)', type: 'image', icon: Image, url: '#' },
  { id: 202, name: 'Video (0)', type: 'video', icon: Video, url: '#' },
  { id: 203, name: 'Audio (0)', type: 'document', icon: FileText, url: '#' }, // Using FileText as a generic document icon placeholder
]);

const documentFiles = ref<FileItem[]>([
  { id: 301, name: 'login_error_report', type: 'document', icon: FileText, url: '#' },
  { id: 302, name: 'daniella_jung_login_failed', type: 'document', icon: FileText, url: '#' },
  { id: 303, name: 'coursify_login_issue', type: 'document', icon: FileText, url: '#' },
]);

const linkFiles = ref<FileItem[]>([
  { id: 401, name: 'https://dashboard.com/reset-passwor...', type: 'link', icon: Link, url: 'https://dashboard.com/reset-password' },
  { id: 402, name: 'https://www.com/help/login-error-inva...', type: 'link', icon: Link, url: 'https://www.com/help/login-error-invalid' },
  { id: 403, name: 'https://dashboard.com/user/daniella.j...', type: 'link', icon: Link, url: 'https://dashboard.com/user/daniella.j' },
  { id: 404, name: 'https://dashboard.com/coursedetails/...', type: 'link', icon: Link, url: 'https://dashboard.com/coursedetails' },
]);

// Helper to determine the status icon
const getStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
  switch (status) {
    case 'read':
      return CheckCheck;
    case 'delivered':
      return CheckCheck; // Double check, but gray
    default:
      return CheckCheck; // Single check
  }
};

// --- Dropdown State Management ---
const isDropdownOpen = ref(false);

const closeDropdown = () => {
  isDropdownOpen.value = false;
};
</script>

<template>
  <div class="h-screen w-screen flex bg-gray-50 font-sans antialiased overflow-hidden" @click="closeDropdown">
    <!-- Main 3-Column Grid Container (Restored) -->
    <div class="flex-1 grid grid-cols-[280px_1fr_280px] h-full overflow-hidden border-r border-gray-200 shadow-lg">
      <!-- 1. Conversation List (Left Column) -->
      <div class="flex flex-col border-r border-gray-200">
        <!-- Search/Header -->
        <div class="p-4 flex items-center justify-between border-b border-gray-200 bg-white">
          <div class="relative flex items-center w-full">
            <Search class="h-4 w-4 text-gray-400 absolute left-3" />
            <input type="text" placeholder="Search name, chat, etc" class="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <button class="ml-2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition">
            <Plus class="h-5 w-5" />
          </button>
        </div>

        <!-- Conversation Items -->
        <div class="flex-1 overflow-y-auto bg-white">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            @click="activeConversationId = conv.id"
            :class="[
              'flex items-center p-3 cursor-pointer border-l-4 transition duration-150',
              conv.id === activeConversationId ? 'bg-violet-50 border-violet-600' : 'hover:bg-gray-50 border-transparent',
            ]"
          >
            <div class="relative flex-shrink-0">
              <img :src="conv.image" :alt="conv.name" class="w-10 h-10 rounded-full object-cover" />
              <!-- Online status indicator -->
              <span v-if="conv.isOnline" class="absolute right-0 bottom-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>

            <div class="ml-3 flex-1 overflow-hidden">
              <p class="font-semibold text-sm truncate">{{ conv.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ conv.lastMessage }}</p>
            </div>

            <div class="ml-2 flex flex-col items-end flex-shrink-0">
              <span :class="['text-xs', conv.unreadCount ? 'text-orange-500 font-bold' : 'text-gray-400']">
                {{ conv.time }}
              </span>
              <span v-if="conv.unreadCount" class="mt-1 h-5 w-5 flex items-center justify-center bg-orange-500 text-white text-xs font-bold rounded-full">
                {{ conv.unreadCount }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Chat Window (Middle Column) -->
      <div class="flex flex-col bg-white">
        <!-- Chat Header (Daniela Jung) -->
        <div class="p-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center space-x-3">
            <img src="https://placehold.co/40x40/EDF2F7/2D3748?text=DJ" alt="Daniella Jung" class="w-10 h-10 rounded-full object-cover" />
            <div>
              <p class="font-semibold text-sm">Daniella Jung</p>
              <p class="text-xs text-gray-500">last seen recently</p>
            </div>
          </div>
          <div class="text-gray-400 flex space-x-3 relative">
            <Search class="h-5 w-5 cursor-pointer hover:text-gray-600" />

            <!-- Dropdown Trigger -->
            <MoreVertical class="h-5 w-5 cursor-pointer hover:text-gray-600" @click.stop="isDropdownOpen = !isDropdownOpen" />

            <!-- Dropdown Menu -->
            <div v-if="isDropdownOpen" @click.stop class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20">
              <button @click="closeDropdown" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition">
                <Link class="h-4 w-4 text-violet-600" />
                <span>View Info</span>
              </button>
              <button @click="closeDropdown" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition">
                <Search class="h-4 w-4 text-violet-600" />
                <span>Search Chat</span>
              </button>
              <button @click="closeDropdown" class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition">
                <BellOff class="h-4 w-4 text-violet-600" />
                <span>Mute Notifications</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- Date Separator -->
          <div class="text-center my-4">
            <span class="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full"> March 6, 2028 </span>
          </div>

          <div v-for="msg in chatMessages" :key="msg.id" :class="['flex', msg.isUser ? 'justify-end' : 'justify-start']">
            <div v-if="!msg.isUser" class="flex-shrink-0 mr-2">
              <img src="https://placehold.co/32x32/EDF2F7/2D3748?text=DJ" alt="Student" class="w-8 h-8 rounded-full object-cover" />
            </div>

            <div :class="['max-w-xs md:max-w-sm lg:max-w-sm p-3 rounded-xl shadow-sm', msg.isUser ? 'bg-violet-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-tl-none']">
              <p class="text-sm">{{ msg.text }}</p>
              <div class="flex justify-end items-center mt-1 space-x-1">
                <span :class="['text-xs', msg.isUser ? 'text-violet-200' : 'text-gray-500']">{{ msg.time }}</span>
                <component :is="getStatusIcon(msg.status)" :class="['h-3 w-3', msg.status === 'read' ? 'text-blue-400' : msg.isUser ? 'text-violet-200' : 'text-gray-400']" />
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-gray-200 flex items-center flex-shrink-0">
          <div class="relative flex-1">
            <input
              type="text"
              v-model="newMessageText"
              @keyup.enter="sendMessage"
              placeholder="Type a message..."
              class="w-full pl-4 pr-12 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-violet-600 transition">
              <Paperclip class="h-5 w-5" />
            </button>
          </div>
          <button
            @click="sendMessage"
            :disabled="newMessageText.trim() === ''"
            :class="['ml-3 p-3 rounded-full transition duration-200', newMessageText.trim() === '' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-violet-600 text-white hover:bg-violet-700']"
          >
            <Send class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- 3. Account Sidebar (Right Column - Restored) -->
      <div class="flex flex-col border-l border-gray-200 bg-white overflow-y-auto">
        <div class="p-6 flex flex-col items-center border-b border-gray-200 sticky top-0 bg-white z-10">
          <img src="https://placehold.co/100x100/EDF2F7/2D3748?text=DJ" alt="Account Owner" class="w-24 h-24 rounded-full object-cover mb-3" />
          <h3 class="font-bold text-lg">Daniella Jung</h3>
          <p class="text-xs text-gray-500">last seen recently</p>
        </div>

        <div class="p-6 space-y-6">
          <!-- About Section -->
          <div>
            <h4 class="font-semibold text-sm mb-2 text-gray-800">About</h4>
            <p class="text-xs text-gray-600">Tech enthusiast & online learner, currently taking JavaScript Essentials. Interested in front-end development.</p>
          </div>

          <!-- Media Section -->
          <div v-for="(category, cIndex) in [mediaFiles, documentFiles, linkFiles]" :key="cIndex">
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-semibold text-sm text-gray-800 flex items-center">
                {{ category === mediaFiles ? 'Media' : category === documentFiles ? 'Documents' : 'Links' }}
                <span class="text-xs font-normal ml-1 text-gray-500">({{ category.length }})</span>
              </h4>
              <button v-if="category.length > 2" class="text-xs text-violet-600 font-medium hover:underline">Show All</button>
            </div>

            <!-- Filter/Tab for Media -->
            <div v-if="category === mediaFiles" class="flex space-x-2 mb-3">
              <button class="px-3 py-1 text-xs font-medium rounded-full bg-violet-600 text-white">Image (2)</button>
              <button class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Video (0)</button>
              <button class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">Audio (0)</button>
            </div>

            <!-- File/Link List -->
            <div class="space-y-2">
              <div v-for="item in category.slice(0, 3)" :key="item.id" class="flex items-center text-xs">
                <component v-if="item.type === 'link'" :is="Link" class="h-4 w-4 text-gray-400 flex-shrink-0 mr-2" />
                <component v-else :is="FileText" class="h-4 w-4 text-violet-600 flex-shrink-0 mr-2" />
                <a :href="item.url" :title="item.name" target="_blank" class="text-gray-700 hover:text-violet-600 truncate flex-1">
                  {{ item.name }}
                </a>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <button class="w-full py-2 mt-4 text-sm text-gray-600 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">Block User</button>
        </div>
      </div>
    </div>
  </div>
</template>
