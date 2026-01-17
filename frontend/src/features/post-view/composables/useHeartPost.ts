import { protectedFetch } from '@/utils/api'

export function useHeartPostApi() {
  async function heartPost(id: number) {
    try {
      const data = await protectedFetch(`/posts/${id}/hearts`, {
        method: 'POST',
      })
      return data
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Fetch failed'
      throw new Error(message)
    }
  }

  async function unheartPost(id: number) {
    try {
      const data = await protectedFetch(`/posts/${id}/hearts`, {
        method: 'DELETE',
      })
      return data
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Fetch failed'
      throw new Error(message)
    }
  }

  return { heartPost, unheartPost }
}
