<template>
  <Modal
    :show="isVisible"
    title="Markdown help"
    width="md"
    @close="$emit('close')"
  >
    <div class="modal-content">
      <div class="modal-body">
        <div class="help-section">
          <h3>What is Markdown?</h3>
          <p>
            Markdown is a lightweight markup language for creating formatted
            text using a plain-text editor.
          </p>
        </div>

        <div class="markdown-help-table">
          <table>
            <thead>
              <tr>
                <th>Type this</th>
                <th>To get this</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ex in examples" :key="ex.input">
                <td>
                  <pre>{{ ex.input }}</pre>
                </td>
                <td>
                  <MarkdownRenderer :content="ex.input" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@components/Modal.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'

defineProps<{
  isVisible: boolean
}>()

const examples = [
  { input: '*italic*' },
  { input: '**bold**' },
  { input: '~~strikethrough~~' },
  { input: '[text](link)' },
  { input: '> quoted text' },
  {
    input: `- item 1
- item 2 
- item 3`,
  },
  {
    input: `1. item 1
2. item 2 
3. item 3`,
  },
]
</script>

<style scoped>
.modal-content {
  @apply max-h-96 w-full max-w-md rounded-lg bg-white;
}

.modal-body {
  @apply pb-4;
}

.help-section {
  @apply mb-4;
}

.help-section h3 {
  @apply text-base font-semibold text-text;
}

.help-section p {
  @apply text-base text-text;
}

.markdown-help-table {
  @apply w-full;
}

.markdown-help-table table {
  @apply w-full border-collapse;
}

.markdown-help-table th {
  @apply border-b border-border bg-surface-hover px-4 py-2 text-left text-sm font-semibold text-text;
}

.markdown-help-table td {
  @apply border-b border-border px-4 py-2 text-sm;
}

.markdown-help-table pre {
  @apply w-fit rounded bg-surface-hover px-1 py-0.5 font-mono;
}
</style>
