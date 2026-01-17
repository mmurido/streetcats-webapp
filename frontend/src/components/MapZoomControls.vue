<template>
  <div class="zoom-controls">
    <button
      id="zoom-in-button"
      type="button"
      @click="zoomIn"
      class="zoom-button"
    >
      <PlusIcon class="zoom-icon" />
    </button>

    <div class="divider" />

    <button
      id="zoom-out-button"
      type="button"
      @click="zoomOut"
      class="zoom-button"
    >
      <MinusIcon class="zoom-icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/solid'

defineProps<{
  zoomIn: () => void
  zoomOut: () => void
}>()
</script>

<style scoped>
.zoom-controls {
  @apply absolute bottom-[8%] right-0 flex -translate-x-3;
  @apply h-[70px] w-10 overflow-hidden;
  @apply flex-col items-center justify-center;
  @apply rounded-full border-[1.5px] border-border;
}

.zoom-button {
  @apply flex w-full flex-1 items-center justify-center;
  @apply bg-white hover:bg-surface-hover;
}

.zoom-icon {
  @apply size-[25px] text-text-muted;
}

.divider {
  @apply h-[1.5px] w-full bg-border;
}
</style>
