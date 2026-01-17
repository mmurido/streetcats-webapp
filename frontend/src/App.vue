<template>
  <div class="flex min-h-screen w-screen flex-col bg-surface font-sans overflow-y-auto">
    <router-view />
    <SignInModal :show="showSignIn" @close="close" />
    <SignUpModal :show="showSignUp" @close="close" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useSessionStore } from './stores/useSessionStore'
import { useAuthModal } from './composables/useAuthModal'
import { useRouter, useRoute } from 'vue-router'
import SignInModal from './features/auth/sign-in/components/SignInModal.vue'
import SignUpModal from './features/auth/sign-up/components/SignUpModal.vue'

const router = useRouter()
const route = useRoute()
const session = useSessionStore()
const { openSignIn } = useAuthModal()
const { showSignIn, showSignUp, close } = useAuthModal()

onMounted(() => {
  session.restore()
})

watch(
  () => session.user,
  (newUser) => {
    if (!newUser && route.meta.requiresAuth) {
      router.replace({ name: 'HomeView' })
      openSignIn()
    }
  }
)

</script>
