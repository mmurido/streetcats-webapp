<template>
  <div v-if="content" class="preview-section">
    <div class="preview-header">
      <span class="preview-label">Preview</span>
    </div>
    <div class="preview-content" v-html="safeHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { renderMarkdown } from '@/utils/markdown'
import { computed } from 'vue'

const props = defineProps<{ content: string }>()
const safeHtml = computed(() => renderMarkdown(props.content))
</script>

<style scoped>
.preview-section {
  @apply relative border-t border-gray-200 p-4 pt-6;
}

.preview-header {
  @apply absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform;
}

.preview-label {
  @apply bg-surface px-3 text-xs font-medium tracking-wider text-text-placeholder;
}

.preview-content {
  @apply prose prose-sm max-w-none;
}
</style>
