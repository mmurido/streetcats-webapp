<template>
  <div class="toolbar">
    <button
      type="button"
      @click="emitFormatting('**', '**')"
      class="toolbar-button"
      title="Bold"
    >
      <strong>B</strong>
    </button>
    <button
      type="button"
      @click="emitFormatting('*', '*')"
      class="toolbar-button"
      title="Italic"
    >
      <em class="font-mono">I</em>
    </button>
    <button
      type="button"
      @click="emitFormatting('~~', '~~')"
      class="toolbar-button"
      title="Strikethrough"
    >
      <s>S</s>
    </button>
    <button
      type="button"
      @click="emitFormatting('[', '](url)')"
      class="toolbar-button"
      title="Link"
    >
      <LinkIcon class="size-[16px]" />
    </button>
    <button
      type="button"
      @click="emitFormatting('> ', '')"
      class="toolbar-button"
      title="Quote"
    >
      <QuotationMarkIcon class="size-[18px]" />
    </button>
    <button
      type="button"
      @click="emitFormatting('- ', '')"
      class="toolbar-button"
      title="Unordered list"
    >
      <ListBulletIcon class="size-[18px]" />
    </button>
    <button
      type="button"
      @click="emitFormatting('1. ', '')"
      class="toolbar-button"
      title="Ordered list"
    >
      <NumberedListIcon class="size-[18px]" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  LinkIcon,
  ListBulletIcon,
  NumberedListIcon,
} from '@heroicons/vue/24/outline'
import { QuotationMarkIcon } from '@sidekickicons/vue/24/outline'

const emit = defineEmits(['format'])

const emitFormatting = (before: string, after: string) => {
  emit('format', { before, after })
}
</script>

<style scoped>
.toolbar {
  @apply flex gap-1 px-4;
}

.toolbar-button {
  @apply flex size-[30px] items-center justify-center rounded-full border border-border bg-surface text-sm text-text-muted transition-colors hover:bg-surface-hover;
}
</style>
