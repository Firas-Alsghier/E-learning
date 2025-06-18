<template>
  <div class="flex flex-col space-y-3">
    <!-- Avatar clickable image -->

    <h1>أضف صورة جميلة لنفسك لملفك الشخصي</h1>
    <label for="avatar-upload" class="cursor-pointer relative">
      <img :src="preview || defaultAvatar" alt="avatar" class="w-24 h-24 rounded-full border object-cover shadow" />
      <div class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
        <span class="text-white text-xs">تغيير</span>
      </div>
    </label>

    <!-- Hidden file input -->
    <Input id="avatar-upload" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
// Bind these to your actual form data
const firstName = ref('Feras');
const lastName = ref('Alshghier');

const preview = ref<string | null>(null);

const initials = computed(() => {
  const first = firstName.value?.charAt(0) ?? '';
  const last = lastName.value?.charAt(0) ?? '';
  return `${first}${last}` || 'User';
});

const defaultAvatar = computed(() => `https://ui-avatars.com/api/?name=${initials.value}&background=random&color=fff`);

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
</script>
