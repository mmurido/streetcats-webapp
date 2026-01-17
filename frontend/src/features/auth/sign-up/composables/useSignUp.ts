import { User } from '@/types'
import { api } from '@/utils/api'
import { ref } from 'vue'

export function useSignUpApi() {
  const isLoading = ref(false)

  async function signUp(payload: {
    username: string
    email: string
    password: string
    birthday: string
    country: string
    avatar?: File | null
  }): Promise<User> {
    isLoading.value = true

    try {
      const formData = new FormData()
      formData.append('username', payload.username)
      formData.append('email', payload.email)
      formData.append('password', payload.password)
      formData.append('birthday', payload.birthday)
      formData.append('country', payload.country)
      if (payload.avatar) formData.append('avatar', payload.avatar)

      const data = await api<{ user: User }>('/auth/sign-up', {
        method: 'POST',
        body: formData,
      })

      return data.user
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Sign-up failed'
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  return { signUp, isLoading }
}
