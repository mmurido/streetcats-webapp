<template>
  <div class="flex gap-[20px]">
    <UserAvatar :user="comment.user" :size="'60px'" />

    <div data-testid="comment-box" class="container">
      <div class="header">
        <!-- Left: username and timestamp -->
        <div class="flex items-center gap-2">
          <h4 class="username">@{{ comment.user.username }}</h4>
          <span class="text-xs font-extralight text-text-muted">•</span>
          <span class="text-xs font-extralight text-text-muted">
            {{ formatDistanceToNow(comment.created_at, { addSuffix: true }) }}
          </span>
        </div>

        <!-- Right: heart button -->
        <div class="flex items-center gap-1">
          <button
            data-testid="heart-comment-button"
            :aria-pressed="comment.is_liked"
            v-html="emojis.heart"
            :class="['heart', !comment.is_liked && 'empty-heart']"
            @click="emit('toggle-like', comment.id)"
          />
          <span data-testid="comment-heart-count" class="text-xs text-text-muted">
            {{ comment.heart_count }}
          </span>
        </div>
      </div>

      <!-- Comment body -->
      <p class="text-sm">{{ comment.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emojis } from '@utils/emojis'
import { formatDistanceToNow } from 'date-fns'
import UserAvatar from '@components/UserAvatar.vue'
import { Comment } from '@/types'

defineProps<{
  comment: Comment
}>()

const emit = defineEmits<{
  (e: 'toggle-like', commentId: number): void
}>()
</script>

<style scoped>
.container {
  @apply relative min-h-[80px] min-w-0 flex-1 rounded-[10px] border-[1.5px] border-border bg-surface px-7 py-[20px];
}

.header {
  @apply mb-[12px] flex items-start justify-between;
}

.username {
  @apply text-base font-semibold text-stone-900;
}

.heart {
  @apply h-4 w-4 cursor-pointer transition-transform hover:scale-110;
}

.empty-heart {
  @apply opacity-50 contrast-0;
}
</style>
