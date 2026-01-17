import { api } from '@/utils/api'

export function useFetchPostsApi() {
  async function fetchPosts(
    bounds: {
      north: number
      south: number
      east: number
      west: number
    },
    page: number = 1
  ) {
    try {
      const data = await api('/posts', {
        method: 'GET',
        params: {
          bbox: `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`,
          page: page,
        },
      })
      return data
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Fetch failed'
      throw new Error(message)
    }
  }

  return { fetchPosts }
}
