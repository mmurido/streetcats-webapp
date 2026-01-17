import { Comment } from '@/types'
import { protectedFetch } from '@/utils/api'

export function useCommentOnPostApi() {
  async function commentOnPost(postId: number, text: string): Promise<Comment> {
    try {
      const data = await protectedFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      return data as Comment
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Comment creation failed'
      throw new Error(message)
    }
  }

  return { commentOnPost }
}
