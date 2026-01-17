<template>
  <div class="reactions-row">
    <!-- Heart button -->
    <button
      id="heart-post-button"
      @click="emit('toggle-like')"
      :aria-pressed="isLiked"
      class="reaction-button"
      :class="{ 'reaction-button--active': isLiked }"
    >
      <span
        :class="['reaction-icon', 'heart', !isLiked && 'empty-heart']"
        v-html="emojis.heart"
      />
      <span class="reaction-count">
        {{ heartCount }}
      </span>
    </button>

    <!-- Comments -->
    <div class="reaction-stat">
      <span class="reaction-icon" v-html="emojis.speechBalloon" />
      <span class="reaction-count">
        {{ commentCount }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emojis } from '@/utils/emojis'

const props = defineProps<{
  heartCount: number
  commentCount: number
  isLiked: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-like'): void
}>()
</script>

<style scoped>
.reactions-row {
  @apply my-5 flex items-center gap-8 border-y border-stone-400 px-3 py-4;
}

.reaction-button {
  @apply flex items-center gap-1 transition-all duration-200 hover:scale-105;
}

.reaction-button--active {
  @apply scale-105;
}

.reaction-button:not(.reaction-button--active) :deep(svg) {
  @apply brightness-50 grayscale invert filter;
}

.reaction-stat {
  @apply flex items-center gap-1;
}

.reaction-icon {
  @apply h-5 w-5;
}

.reaction-count {
  @apply text-lg;
}

.heart {
  @apply cursor-pointer transition-transform hover:scale-110;
}

.empty-heart {
  @apply opacity-50 contrast-0;
}
</style>
