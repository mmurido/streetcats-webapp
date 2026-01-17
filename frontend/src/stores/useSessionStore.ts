import { defineStore } from 'pinia'
import { protectedFetch } from '@/utils/api'
import { User } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { useAuthModal } from '@/composables/useAuthModal'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null as User | null,
    isLoading: false,
  }),

  actions: {
    setUser(user: User | null) {
      this.user = user
    },

    async restore() {
      this.isLoading = true
      try {
        const data = await protectedFetch('/users/me')
        this.setUser(data)
      } catch {
        this.setUser(null)
      } finally {
        this.isLoading = false
      }
    },

    async signOut() {
      await protectedFetch('/auth/sign-out', { method: 'POST' })
      this.setUser(null)

      const router = useRouter()
      const route = useRoute()
      const { openSignIn } = useAuthModal()

      if (route.meta.requiresAuth) {
        router.replace({ name: 'HomeView' })
        openSignIn()
      }
    },
  },
})
