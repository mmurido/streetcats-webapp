<template>
  <div class="markdown-editor-container">
    <div class="editor-header">
      <span class="editor-label">Markdown editor</span>
      <button
        type="button"
        @click="openHelpModal"
        class="info-button"
        aria-label="Learn about markdown formatting"
      >
        <InformationCircleIcon class="size-[16px]" />
      </button>
    </div>

    <MarkdownToolbar @format="handleFormatting" />

    <textarea
      :id="id"
      ref="editor"
      class="markdown-textarea"
      :value="modelValue"
      @input="onInput"
      placeholder="Write your description here..."
      rows="8"
    ></textarea>

    <MarkdownPreview :content="modelValue" />

    <MarkdownHelpModal :is-visible="showHelpModal" @close="closeHelpModal" />
  </div>
</template>

<script setup lang="ts">
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { ref, toRef, nextTick } from 'vue'
import MarkdownToolbar from './MarkdownToolbar.vue'
import MarkdownPreview from './MarkdownPreview.vue'
import MarkdownHelpModal from './MarkdownHelpModal.vue'

const props = defineProps<{ modelValue: string; id?: string }>()
const modelValue = toRef(props, 'modelValue')
const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()

const editor = ref<HTMLTextAreaElement | null>(null)

const showHelpModal = ref(false)
const openHelpModal = () => (showHelpModal.value = true)
const closeHelpModal = () => (showHelpModal.value = false)

function onInput(e: Event) {
  const v = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', v)
}

async function handleFormatting({
  before,
  after,
}: {
  before: string
  after: string
}) {
  const ta = editor.value
  if (!ta) return

  // capture selection and current value
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const current = modelValue.value ?? ta.value
  const selected = current.slice(start, end)

  // compute surrounding text for toggle detection
  const startBeforeIdx = Math.max(0, start - before.length)
  const endAfterIdx = Math.min(current.length, end + after.length)
  const beforeText = current.slice(startBeforeIdx, start)
  const afterText = current.slice(end, endAfterIdx)

  let newValue: string
  let selStart = start
  let selEnd = end

  if (start !== end && beforeText === before && afterText === after) {
    // selection is already wrapped -> unwrap
    newValue =
      current.slice(0, startBeforeIdx) + selected + current.slice(endAfterIdx)
    selStart = startBeforeIdx
    selEnd = selStart + selected.length
  } else if (start === end) {
    // collapsed selection -> insert markers and place cursor between them
    newValue = current.slice(0, start) + before + after + current.slice(end)
    selStart = start + before.length
    selEnd = selStart
  } else {
    // normal case: wrap selection
    newValue =
      current.slice(0, start) + before + selected + after + current.slice(end)
    selStart = start + before.length
    selEnd = selStart + selected.length
  }

  emit('update:modelValue', newValue)
  await nextTick()
  if (!editor.value) return
  editor.value.focus()
  const max = editor.value.value.length
  editor.value.setSelectionRange(Math.min(selStart, max), Math.min(selEnd, max))
}
</script>

<style scoped>
.markdown-editor-container {
  @apply relative rounded-lg border border-border bg-surface;
}

.editor-header {
  @apply flex items-center gap-2 rounded-t-lg px-4 py-2;
}

.editor-label {
  @apply text-sm font-normal text-text-placeholder;
}

.info-button {
  @apply p-1 text-text-placeholder transition-colors hover:text-text-muted;
}

.markdown-textarea {
  @apply w-full resize-none border-0 px-4 py-[25px] text-sm focus:outline-none focus:ring-0;
  max-height: 150px;
}
</style>
