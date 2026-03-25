<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Quill from 'quill';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

const editorRef = ref<HTMLDivElement | null>(null);
let quill: Quill;

onMounted(() => {
  if (!editorRef.value) return;

  quill = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: 'Write your course description...',
    modules: {
      toolbar: [[{ header: [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ align: [] }], [{ list: 'ordered' }, { list: 'bullet' }], ['link'], ['clean']],
    },
  });

  // Set initial content
  quill.root.innerHTML = props.modelValue || '';

  // Listen to changes
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML);
  });
});

// Sync if parent updates
watch(
  () => props.modelValue,
  (val) => {
    if (quill && quill.root.innerHTML !== val) {
      quill.root.innerHTML = val || '';
    }
  }
);
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200">
    <div ref="editorRef" class="min-h-[200px]" />
  </div>
</template>
