import { useSessionStore } from '@/stores/useSessionStore'
import { User } from '@/types'
import { api } from '@/utils/api'
import { ref } from 'vue'

export function useSignInApi() {
  const session = useSessionStore()
  const isLoading = ref(false)

  async function signIn(payload: {
    identifier: string
    password: string
    rememberMe: boolean
  }): Promise<User> {
    isLoading.value = true

    try {
      const data = await api<{ user: User }>('/auth/sign-in', {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/json' },
      })
      session.setUser(data.user)
      return data.user
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Sign-in failed'
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  return { signIn, isLoading }
}
