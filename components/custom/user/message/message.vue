<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue';
import axios from 'axios';
import { Search, Plus, MoreVertical, Send, Paperclip, CheckCheck, Image, Video, FileText, Link, ChevronDown, BellOff } from 'lucide-vue-next';

// --- Shared Data Interfaces ---
interface Message {
  id: string;
  text: string;
  attachment?: string;
  isUser: boolean;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number | null;
  isOnline: boolean;
  image: string;
}

interface FileItem {
  id: number;
  name: string;
  type: 'document' | 'image' | 'video' | 'link';
  icon: any; // Lucide icon component
  url: string;
}

const conversations = ref<Conversation[]>([]);
const chatMessages = ref<Message[]>([]);
const activeConversationId = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const newMessageText = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const conversationSearch = ref('');
const messageSearch = ref('');
const matchedMessageIds = ref<string[]>([]);
const isOpend = ref(false);
const highlightedMessageId = ref<string | null>(null);
const currentMatchIndex = ref(0);
const messagesContainer = ref<HTMLElement | null>(null);

// --- Helpers for File Upload ---
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
  }
};
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
};
const previewUrl = computed(() => {
  if (!selectedFile.value) return null;
  return URL.createObjectURL(selectedFile.value as Blob);
});

const scrollToBottom = () => {
  if (!messagesContainer.value) return;
  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
    behavior: 'smooth',
  });
};

const activeConversation = computed(() => {
  return conversations.value.find((c) => c.id === activeConversationId.value);
});

const goToNextMatch = async () => {
  if (matchedMessageIds.value.length === 0) return;
  currentMatchIndex.value++;
  if (currentMatchIndex.value >= matchedMessageIds.value.length) currentMatchIndex.value = 0;

  const id = matchedMessageIds.value[currentMatchIndex.value];
  highlightedMessageId.value = id;

  await nextTick();
  const el = document.getElementById(`msg-${id}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// --- Get current user ID from localStorage ---
const getUserId = () => {
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  try {
    const parsed = JSON.parse(userData);
    return parsed.id;
  } catch {
    return null;
  }
};

const loadMessages = async (userId: string) => {
  try {
    const token = localStorage.getItem('token'); // your auth token
    if (!token) return;

    const res = await axios.get(`http://localhost:3001/api/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const currentUserId = getUserId();

    chatMessages.value = res.data.map((msg: any) => ({
      id: msg._id,
      text: msg.text,
      attachment: msg.attachment,
      isUser: msg.sender === currentUserId || msg.sender?._id === currentUserId,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'read',
    }));
  } catch (err) {
    console.error('Load messages error', err);
  }
};

const loadConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await $fetch('http://localhost:3001/api/messages/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    });

    conversations.value = res as Conversation[];
  } catch (err) {
    console.error('Failed to load conversations', err);
  }
};

const sendMessage = async () => {
  if (!activeConversationId.value) return;
  if (newMessageText.value.trim() === '' && !selectedFile.value) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('receiverId', activeConversationId.value);
    formData.append('text', newMessageText.value);
    if (selectedFile.value) formData.append('attachment', selectedFile.value);

    const res = await axios.post('http://localhost:3001/api/messages', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });

    chatMessages.value.push({
      id: res.data._id,
      text: res.data.text,
      attachment: res.data.attachment,
      isUser: true,
      time: new Date(res.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    });

    newMessageText.value = '';
    selectedFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
    setTimeout(scrollToBottom, 100);
  } catch (err) {
    console.error('Send message error:', err);
  }
};

// --- Status Icon Helper ---
const getStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
  switch (status) {
    case 'read':
      return CheckCheck;
    case 'delivered':
      return CheckCheck;
    default:
      return CheckCheck;
  }
};

const openConversation = async (conversationId: string) => {
  isOpend.value = true;
  activeConversationId.value = conversationId;
  messageSearch.value = '';
  matchedMessageIds.value = [];
  highlightedMessageId.value = null;
  currentMatchIndex.value = 0;
  await loadMessages(conversationId);
  setTimeout(scrollToBottom, 100);
};

const filteredConversations = computed(() => {
  if (!conversationSearch.value) return conversations.value;
  return conversations.value.filter((conv) => conv.name.toLowerCase().includes(conversationSearch.value.toLowerCase()));
});

// --- Dropdown ---
const isDropdownOpen = ref(false);
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

watch(messageSearch, async (value) => {
  if (!value) {
    matchedMessageIds.value = [];
    highlightedMessageId.value = null;
    currentMatchIndex.value = 0;
    return;
  }

  const matches = chatMessages.value.filter((msg) => msg.text?.toLowerCase().includes(value.toLowerCase())).map((msg) => msg.id);

  matchedMessageIds.value = matches;
  currentMatchIndex.value = 0;

  if (matches.length > 0) {
    highlightedMessageId.value = matches[0];
    await nextTick();
    const el = document.getElementById(`msg-${matches[0]}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

watch(chatMessages, () => {
  nextTick(() => scrollToBottom());
});
watch(previewUrl, (url, oldUrl) => {
  if (oldUrl) URL.revokeObjectURL(oldUrl);
});

onMounted(() => {
  loadConversations();
});
</script>

<template>
  <div class="w-screen flex bg-gray-50 font-sans antialiased overflow-hidden" @click="closeDropdown">
    <!-- Main 3-Column Grid Container (Restored) -->
    <div class="flex-1 grid grid-cols-[290px_1fr_290px] h-full overflow-hidden border-r border-gray-200 shadow-lg">
      <!-- 1. Conversation List (Left Column) -->
      <div class="flex flex-col border-r border-gray-200">
        <!-- Search/Header -->
        <div class="p-4 flex items-center justify-between border-b border-gray-200 bg-white">
          <div class="relative flex items-center w-full">
            <Search class="h-4 w-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search name"
              v-model="conversationSearch"
              class="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <!-- Conversation Items -->
        <div class="flex-1 overflow-y-auto bg-white">
          <div
            v-for="conv in filteredConversations"
            :key="conv.id"
            @click="openConversation(conv.id)"
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
        <div class="flex flex-col h-full" v-if="isOpend">
          <div class="p-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
            <div v-if="activeConversation" class="flex items-center space-x-3">
              <img :src="activeConversation.image" :alt="activeConversation.name" class="w-10 h-10 rounded-full object-cover" />

              <div>
                <p class="font-semibold text-sm">
                  {{ activeConversation.name }}
                </p>
              </div>
            </div>
            <div class="text-gray-400 flex space-x-3 relative">
              <input
                v-model="messageSearch"
                @keyup.enter="goToNextMatch"
                type="text"
                placeholder="Search messages..."
                class="w-48 px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

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
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Date Separator -->
            <div class="text-center my-4">
              <span class="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full"> March 6, 2028 </span>
            </div>

            <div
              v-for="msg in chatMessages"
              :key="msg.id"
              :id="`msg-${msg.id}`"
              :class="['flex transition-all duration-300', msg.isUser ? 'justify-end' : 'justify-start', msg.id === highlightedMessageId ? 'bg-yellow-200 rounded-lg p-1' : '']"
            >
              <div v-if="!msg.isUser" class="flex-shrink-0 mr-2">
                <img src="https://placehold.co/32x32/EDF2F7/2D3748?text=DJ" alt="Student" class="w-8 h-8 rounded-full object-cover" />
              </div>

              <div :class="['max-w-xs md:max-w-sm lg:max-w-sm p-3 rounded-xl shadow-sm', msg.isUser ? 'bg-violet-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-tl-none']">
                <p v-if="msg.text" class="text-sm mb-2">
                  {{ msg.text }}
                </p>

                <!-- Image attachment -->
                <img v-if="msg.attachment && msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)" :src="`http://localhost:3001/uploads/${msg.attachment}`" class="max-w-[200px] rounded-lg mb-2" />

                <!-- File attachment -->
                <a
                  v-if="msg.attachment && !msg.attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i)"
                  :href="`http://localhost:3001/uploads/${msg.attachment}`"
                  target="_blank"
                  class="text-sm underline text-blue-500"
                >
                  Download attachment
                </a>
                <div class="flex justify-end items-center mt-1 space-x-1">
                  <span :class="['text-xs', msg.isUser ? 'text-violet-200' : 'text-gray-500']">{{ msg.time }}</span>
                  <component :is="getStatusIcon(msg.status)" :class="['h-3 w-3', msg.status === 'read' ? 'text-blue-400' : msg.isUser ? 'text-violet-200' : 'text-gray-400']" />
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div v-if="selectedFile" class="px-4 py-2 border-t bg-gray-50 flex items-center gap-3">
            <img v-if="previewUrl && selectedFile?.type.startsWith('image/')" :src="previewUrl" class="w-12 h-12 object-cover rounded" />

            <span class="text-sm text-gray-700 truncate">
              {{ selectedFile.name }}
            </span>

            <button class="ml-auto text-red-500 text-sm" @click="selectedFile = null">Remove</button>
          </div>
          <div class="p-4 border-t border-gray-200 flex items-center flex-shrink-0">
            <div class="relative flex-1">
              <input
                type="text"
                v-model="newMessageText"
                @keyup.enter="sendMessage"
                placeholder="Type a message..."
                class="w-full pl-4 pr-12 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <label class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-violet-600 transition">
                <button @click="fileInput?.click()" class="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-violet-600 transition">
                  <Paperclip class="h-5 w-5" />
                </button>
                <input type="file" class="hidden" ref="fileInput" @change="handleFileChange" />
              </label>
            </div>
            <button
              @click="sendMessage"
              :disabled="newMessageText.trim() === '' && !selectedFile"
              :class="[
                'ml-3 p-3 rounded-full transition duration-200 ',
                newMessageText.trim() === '' && !selectedFile ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-violet-600 text-white cursor-pointer hover:bg-violet-700',
              ]"
            >
              <Send class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div v-else class="flex justify-center items-center h-full">
          <h1 class="text-4xl">Click on any converstion 💬</h1>
        </div>
      </div>
      <!-- end -->
    </div>
  </div>
</template>
