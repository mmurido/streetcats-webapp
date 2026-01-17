<template>
  <div class="flex h-full flex-col">
    <Header type="minimal" />
    <main class="min-h-0 w-full flex-1">
      <div v-if="post" class="layout">
        <PostHeader :post="post" />
        <MarkdownRenderer :content="post.description" />
        <ImageCarousel :images="post.image_urls" />

        <MiniMap
          :center="[post.location.lat, post.location.lng]"
          :height="'200px'"
        />
        <ReactionsRow
          :heart-count="post.heart_count"
          :comment-count="post.comment_count"
          :is-liked="post.is_liked"
          @toggle-like="handleTogglePostLike"
        />
        <CommentsSection
          :comments="post.comments"
          @add-comment="handleAddComment"
          @toggle-like="handleToggleCommentLike"
        />
      </div>
      <div v-else class="preloader-container">
        <img :src="preloader" alt="Loading..." class="preloader" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import CommentsSection from '@/features/post-comment/components/CommentsSection.vue'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import ImageCarousel from '@/features/post-view/components/ImageCarousel.vue'
import MiniMap from '@/features/post-view/components/MiniMap.vue'
import PostHeader from '@/features/post-view/components/PostHeader.vue'
import ReactionsRow from '@/features/post-view/components/ReactionsRow.vue'
import { usePostCacheStore } from '@/features/post-view/stores/usePostCacheStore'
import { Post } from '@/types'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSessionStore } from '@/stores/useSessionStore'
import { useAuthModal } from '@/composables/useAuthModal'
import { useHeartPostApi } from '@/features/post-view/composables/useHeartPost'
import { useCommentOnPostApi } from '@/features/post-comment/composables/useCommentOnPost'
import { useHeartCommentApi } from '@/features/post-comment/composables/useHeartComment'
import preloader from '@assets/preloader.svg'

const route = useRoute()
const cacheStore = usePostCacheStore()
const session = useSessionStore()
const { openSignIn } = useAuthModal()
const { heartPost, unheartPost } = useHeartPostApi()
const { heartComment, unheartComment } = useHeartCommentApi()
const { commentOnPost } = useCommentOnPostApi()
const post = ref<Post | null>(null)

onMounted(async () => {
  const id = Number(route.params.id)
  post.value = await cacheStore.getOrFetchPost(id)
})

const handleTogglePostLike = async () => {
  if (!post.value) return
  if (!session.user) {
    openSignIn()
    return
  }

  const currentlyLiked = post.value.is_liked
  post.value.is_liked = !currentlyLiked
  post.value.heart_count += currentlyLiked ? -1 : 1

  try {
    if (currentlyLiked) await unheartPost(post.value.id)
    else await heartPost(post.value.id)
  } catch (err) {
    console.error(err)
    post.value.is_liked = currentlyLiked
    post.value.heart_count += currentlyLiked ? 1 : -1
  }
}

const handleToggleCommentLike = async (commentId: number) => {
  if (!post.value || !post.value.comments) return
  if (!session.user) {
    openSignIn()
    return
  }
  const comment = post.value?.comments?.find((c) => c.id === commentId)
  if (!comment) return

  const currentlyLiked = comment.is_liked
  comment.is_liked = !currentlyLiked
  comment.heart_count += currentlyLiked ? -1 : 1

  try {
    if (currentlyLiked) await unheartComment(post.value.id, commentId)
    else await heartComment(post.value?.id, commentId)
  } catch (err) {
    console.error(err)
    comment.is_liked = currentlyLiked
    comment.heart_count += currentlyLiked ? 1 : -1
  }
}

const handleAddComment = async (text: string) => {
  if (!post.value) return

  try {
    const newComment = await commentOnPost(post.value.id, text)

    post.value.comments = post.value.comments
      ? [newComment, ...post.value.comments]
      : [newComment]
    post.value.comment_count += 1
  } catch (err) {
    console.error('Failed to add comment:', err)
  }
}

watch(
  () => session.user,
  async (newUser) => {
    if (!post.value) return

    if (!newUser) post.value.is_liked = false

    delete cacheStore.cache[post.value.id]
    post.value = await cacheStore.getOrFetchPost(post.value.id)
  }
)
</script>

<style scoped>
.layout {
  @apply h-full space-y-[15px] px-[12%] py-[50px] md:px-[16%] lg:px-[18%];
}

.preloader-container {
  @apply flex min-h-screen w-full items-center justify-center;
}

.preloader {
  @apply -mt-[100px] size-[100px] opacity-30;
}
</style>
