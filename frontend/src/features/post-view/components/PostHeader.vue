<template>
  <header class="post-header">
    <div class="content">
      <div class="user-info">
        <UserAvatar :user="post.user" :size="'50px'" />
        <div class="column">
          <div class="user-identity">
            <span class="username">@{{ post.user.username }}</span>
            <span
              v-html="getCountryEmoji(post.user.country)"
              class="country-flag"
            />
          </div>

          <span class="timestamp">
            {{
              formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })
            }}
          </span>
        </div>
      </div>

      <h1 data-testid="post-title" class="title">
        {{ post.title }}
      </h1>
    </div>
  </header>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'
import { getCountryEmoji } from '@/utils/countries'
import UserAvatar from '@components/UserAvatar.vue'
import { Post } from '@/types'

defineProps<{
  post: Post
}>()
</script>

<style scoped>
.post-header {
  @apply flex items-start gap-3;
}

.content {
  @apply min-w-0 space-y-[15px];
}

.user-info {
  @apply flex flex-row items-center space-x-[10px];
}

.column {
  @apply flex flex-col;
}

.user-identity {
  @apply flex flex-row items-center space-x-[8px];
}

.username {
  @apply text-lg font-semibold text-text;
}

.country-flag {
  @apply size-[15px];
}

.timestamp {
  @apply text-sm text-text-muted;
}

.title {
  @apply overflow-hidden break-words text-2xl font-extrabold text-gray-900;
}
</style>
