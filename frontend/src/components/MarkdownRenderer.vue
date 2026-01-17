<template>
  <article>
    <div
      v-if="safeMarkdown"
      v-html="safeMarkdown"
      class="prose prose-sm max-w-none overflow-hidden break-words"
    ></div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{
  content: string
}>()

const safeMarkdown = computed(() =>
  props.content ? renderMarkdown(props.content) : ''
)
</script>
