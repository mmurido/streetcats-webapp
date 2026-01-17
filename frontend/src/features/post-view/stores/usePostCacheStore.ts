import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post } from '@/types'
import { useFetchPostApi } from '../composables/useFetchPost'

export const usePostCacheStore = defineStore('postCache', () => {
  const cache = ref<Record<number, Post>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getOrFetchPost(id: number) {
    if (cache.value[id]) return cache.value[id]

    isLoading.value = true
    error.value = null
    try {
      const { fetchPost } = useFetchPostApi()
      const post = await fetchPost(id)
      cache.value[id] = post
      return post
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function addPost(post: Post) {
    cache.value[post.id] = post
  }

  return { cache, isLoading, error, getOrFetchPost, addPost }
})
