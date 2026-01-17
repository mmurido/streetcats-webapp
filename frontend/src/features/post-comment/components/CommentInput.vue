<template>
  <div class="flex gap-[20px]">
    <UserAvatar :user="session.user" :size="'85px'" />
    <div class="container">
      <textarea
        id="comment-input"
        v-model="commentText"
        placeholder="Write your comment here..."
        class="textarea"
        rows="4"
      />
      <div class="mt-2 flex justify-end">
        <BaseButton
          id="submit-comment-button"
          variant="dark"
          text="Post"
          @click="submitComment"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from '@components/UserAvatar.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useSessionStore } from '@/stores/useSessionStore'
import { ref } from 'vue'
const session = useSessionStore()

const emit = defineEmits<{
  (e: 'add-comment', content: string): void
}>()

const commentText = ref('')

const submitComment = () => {
  if (!commentText.value.trim()) return
  emit('add-comment', commentText.value)
  commentText.value = ''
}
</script>

<style scoped>
.container {
  @apply min-h-[80px] w-full min-w-0 flex-1 rounded-[10px] border-[1.5px] border-border bg-surface px-7 py-4;
}

.textarea {
  @apply mt-1 w-full resize-none text-sm placeholder-text-placeholder outline-none;
}
</style>
