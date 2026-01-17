<template>
  <div class="popup-card" data-testid="map-popup">
    <img :src="imageUrl" :alt="title" class="popup-card-image" />
    <div class="popup-card-content">
      <h3 class="popup-card-title">{{ title }}</h3>
      <span class="popup-card-timestamp">
        {{
          formatDistanceToNow(new Date(created_at), {
            addSuffix: true,
          })
        }}
      </span>
    </div>
    <div class="reactions-container">
      <ul class="reactions-list">
        <li class="reactions-item">
          <span v-html="emojis.speechBalloon" class="reactions-icon" />
          {{ commentCount }}
        </li>
        <li class="reactions-item">
          <span v-html="emojis.heart" class="reactions-icon" />
          {{ heartCount }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emojis } from '@/utils/emojis'
import { formatDistanceToNow } from 'date-fns'

defineProps<{
  id: number
  imageUrl: string
  title: string
  commentCount: number
  heartCount: number
  created_at: string
}>()
</script>

<style scoped>
.popup-card {
  @apply w-64 cursor-pointer rounded-lg;
}

.popup-card-image {
  @apply h-32 w-full rounded-t-xl object-cover;
}

.popup-card-content {
  @apply p-2;
}

.popup-card-title {
  @apply mb-1 text-lg font-semibold text-text;
}

.popup-card-timestamp {
  @apply text-xs text-text-muted;
}

.reactions-container {
  @apply absolute -right-[15px] -top-[10px] rounded-full border-[1.5px] border-border bg-surface px-[8px] py-[5px];
}

.reactions-list {
  @apply flex gap-[5px] text-xs text-text-muted;
}

.reactions-item {
  @apply flex items-center gap-1;
}

.reactions-icon {
  @apply size-3 saturate-[.7];
}
</style>
