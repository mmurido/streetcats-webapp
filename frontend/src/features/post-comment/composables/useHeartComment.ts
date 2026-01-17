import { protectedFetch } from '@/utils/api'

export function useHeartCommentApi() {
  async function heartComment(postId: number, commentId: number) {
    try {
      const data = await protectedFetch(
        `/posts/${postId}/comments/${commentId}/hearts`,
        {
          method: 'POST',
        }
      )
      return data
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Fetch failed'
      throw new Error(message)
    }
  }

  async function unheartComment(postId: number, commentId: number) {
    try {
      const data = await protectedFetch(
        `/posts/${postId}/comments/${commentId}/hearts`,
        {
          method: 'DELETE',
        }
      )
      return data
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Fetch failed'
      throw new Error(message)
    }
  }

  return { heartComment, unheartComment }
}
