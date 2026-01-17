import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post } from '@/types'
import { useFetchPostsApi } from '../composables/useFetchPosts'

interface Bounds {
  north: number
  south: number
  east: number
  west: number
}

export const usePostSearchStore = defineStore('postSearch', () => {
  const results = ref<Post[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalPages = ref<number | null>(null)
  const lastBounds = ref<Bounds | null>(null)

  const { fetchPosts } = useFetchPostsApi()

  async function loadPosts(bounds: Bounds, page: number = 1) {
    isLoading.value = true
    error.value = null
    try {
      lastBounds.value = bounds
      const data = await fetchPosts(bounds, page)

      results.value = data.results || data
      totalPages.value = data.total_pages || data.totalPages || null
      currentPage.value = page
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  async function nextPage() {
    if (!lastBounds.value) return
    if (totalPages.value && currentPage.value >= totalPages.value) return
    await loadPosts(lastBounds.value, currentPage.value + 1)
  }

  async function prevPage() {
    if (!lastBounds.value) return
    if (currentPage.value <= 1) return
    await loadPosts(lastBounds.value, currentPage.value - 1)
  }

  function clearResults() {
    results.value = []
    currentPage.value = 1
    totalPages.value = null
  }

  return {
    results,
    isLoading,
    error,
    currentPage,
    totalPages,
    loadPosts,
    nextPage,
    prevPage,
    clearResults,
  }
})
