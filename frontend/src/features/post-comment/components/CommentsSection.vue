<template>
  <div class="space-y-[40px] px-[5%] py-5">
    <div class="relative pb-[25px]">
      <CommentInput
        :class="[{ 'opacity-25': !session.user }]"
        @add-comment="$emit('add-comment', $event)"
      />
      <div
        id="sign-in-prompt"
        v-if="!session.user"
        class="absolute inset-0 flex items-center justify-center"
        @click="openSignIn"
      >
        <span class="sign-in-prompt">Sign in to leave a comment!</span>
      </div>
    </div>

    <CommentItem
      v-if="comments && comments?.length > 0"
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      @toggle-like="emit('toggle-like', comment.id)"
    />

    <div
      v-else
      class="flex w-full flex-col items-center justify-center py-[100px]"
    >
      <span class="text-lg font-medium text-text-muted">
        There are no comments yet
      </span>
      <span class="font-base text-base text-text-placeholder">
        Be the first to comment!
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommentInput from './CommentInput.vue'
import CommentItem from './CommentItem.vue'
import { useSessionStore } from '@/stores/useSessionStore'
import { useAuthModal } from '@/composables/useAuthModal'

const session = useSessionStore()
const { openSignIn } = useAuthModal()

defineProps<{
  comments: any[] | undefined
}>()

const emit = defineEmits<{
  (e: 'add-comment', content: string): void
  (e: 'toggle-like', commentId: number): void
}>()
</script>

<style scoped>
.sign-in-prompt {
  @apply cursor-pointer rounded-full border border-border bg-surface px-[30px] py-[15px] font-medium text-text-muted shadow-sm transition-all ease-out hover:scale-105 hover:text-text;
}
</style>
