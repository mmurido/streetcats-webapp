import { Post } from '@/types'
import { api } from '@/utils/api'

export function useFetchPostApi() {
  async function fetchPost(id: number): Promise<Post> {
    try {
      const data = await api<Post>(`/posts/${id}`, {
        method: 'GET',
      })
      return data
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Fetch failed'
      throw new Error(message)
    }
  }

  return { fetchPost }
}
