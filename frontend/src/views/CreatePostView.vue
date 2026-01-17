<template>
  <div class="flex h-full flex-col">
    <Header type="minimal" />
    <main class="min-h-0 flex-1">
      <div class="layout">
        <article class="container">
          <header class="header">
            <span>Share your cat spotting!</span>
          </header>
          <PostForm @submit="onCreatePost" :isLoading="isLoading" />
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import PostForm from '@/features/post-create/components/PostForm.vue'
import Header from '@/components/Header.vue'
import { useCreatePostApi } from '@/features/post-create/composables/useCreatePost'
import { CreatePostData } from '@/features/post-create/helpers/validation'
import { Post } from '@/types'
import { useRouter } from 'vue-router'

const { createPost, isLoading } = useCreatePostApi()
const router = useRouter()

async function onCreatePost(data: CreatePostData) {
  try {
    const newPost: Post = await createPost(data)
    router.push(`/post/${newPost.id}`).then(() => {
      window.scrollTo(0, 0)
    })
  } catch (err: any) {
    console.log(err.message)
  }
}
</script>

<style scoped>
.layout {
  @apply h-full px-[12%] py-[20px];
}

.container {
  @apply mx-auto flex h-auto max-w-[900px] cursor-default flex-col rounded-xl bg-surface py-[30px];
}

.header {
  @apply mb-[40px] text-2xl font-semibold text-text;
}
</style>
