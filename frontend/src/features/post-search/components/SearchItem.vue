<template>
  <article data-testid="search-item" class="container" @click="goToDetail(post.id)">
    <div class="content">
      <!-- User info -->
      <div class="user-info">
        <UserAvatar :user="post.user" :size="'25px'" />
        <span class="username">@{{ post.user.username }}</span>
        <span v-html="getCountryEmoji('IT')" class="country-flag" />
        <span class="timestamp">
          ·
          {{
            formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })
          }}
        </span>
      </div>

      <!-- Title -->
      <header class="title">
        <h3>
          {{ post.title }}
        </h3>
      </header>

      <!-- Description -->
      <div class="description">
        <MarkdownRenderer :content="truncatedBody" />
      </div>

      <!-- Images -->
      <div class="images">
        <ImageCarousel :images="post.image_urls" @click.stop />
      </div>

      <!-- Reactions -->
      <footer>
        <ul class="reactions-list">
          <li class="reactions-item">
            <span v-html="emojis.speechBalloon" class="reactions-icon" />
            {{ post.comments?.length || 0 }}
          </li>
          <li class="reactions-item">
            <span v-html="emojis.heart" class="reactions-icon" />
            {{ post.heart_count }}
          </li>
        </ul>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
import { emojis } from '@/utils/emojis'
import { formatDistanceToNow } from 'date-fns'
import { getCountryEmoji } from '@/utils/countries'
import type { Post } from '@/types'
import { useRouter } from 'vue-router'
import UserAvatar from '@components/UserAvatar.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { computed } from 'vue'
import ImageCarousel from '@/features/post-view/components/ImageCarousel.vue'

const props = defineProps<{
  post: Post
}>()

const router = useRouter()
function goToDetail(id: number) {
  router.push({ name: 'PostView', params: { id } })
}

const truncatedBody = computed(() => {
  const maxLength = 100
  if (props.post.description.length <= maxLength) return props.post.description
  return props.post.description.substring(0, maxLength) + '...'
})
</script>

<style scoped>
.container {
  @apply flex cursor-pointer flex-row rounded-xl border border-border bg-surface p-[10px];
}

.image-container {
  @apply aspect-square h-full flex-shrink-0 overflow-hidden rounded-lg;
}

.image {
  @apply h-full w-full object-cover;
}

.content {
  @apply mx-[15px] my-[10px] flex flex-1 flex-col;
}

.user-info {
  @apply flex items-center space-x-[8px];
}

.user-identity {
  @apply flex items-center space-x-[5px];
}

.username {
  @apply text-sm font-medium text-text;
}

.country-flag {
  @apply size-3;
}

.timestamp {
  @apply text-xs text-text-muted;
}

.title {
  @apply mt-[5px] text-base font-semibold;
}

.description {
  @apply break-all text-xs opacity-80;
}

.images {
  @apply mt-[10px] w-full;
}

.reactions-list {
  @apply mt-[15px] flex gap-3 text-base text-text-muted;
}

.reactions-item {
  @apply flex items-center gap-1;
}

.reactions-icon {
  @apply size-4 saturate-[.7];
}

.details-list {
  @apply mt-[10px] flex flex-col text-xs text-text-muted;
}

.details-item {
  @apply flex items-center gap-2;
}

.details-icon {
  @apply size-4 saturate-[.5];
}
</style>
