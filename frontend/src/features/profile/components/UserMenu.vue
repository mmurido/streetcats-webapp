<template>
  <div
    ref="menuRef"
    class="relative flex items-center justify-end space-x-[8px]"
  >
    <!-- If authenticated, show avatar -->
    <UserAvatar v-if="session.user" :user="session.user" :size="'35px'" />

    <!-- Hamburger button -->
    <button id="open-user-menu" @click="toggleMenu" class="toggle-button">
      <Bars3Icon class="toggle-icon" />
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="menuOpen" class="dropdown">
        <!-- Authenticated -->
        <template v-if="session.user">
          <div class="welcome-text">Hi, @{{ session.user.username }}</div>
          <button id="sign-out-button" @click="handleSignOut" class="option">Sign out</button>
        </template>

        <!-- Not authenticated -->
        <template v-else>
          <button @click="handleSignIn" class="option" id="open-signin-modal">
            Sign in
          </button>
          <button @click="handleSignUp" class="option" id="open-signup-modal">
            Sign up
          </button>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useAuthModal } from '@/composables/useAuthModal'
import { useSessionStore } from '@/stores/useSessionStore'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import UserAvatar from '@components/UserAvatar.vue'

const { openSignIn, openSignUp } = useAuthModal()
const session = useSessionStore()
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)

function handleSignIn() {
  openSignIn()
  toggleMenu()
}

function handleSignUp() {
  openSignUp()
  toggleMenu()
}

function handleSignOut() {
  session.signOut()
  toggleMenu()
}

function handleClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.toggle-button {
  @apply rounded-full p-2 hover:bg-surface-hover;
}

.toggle-icon {
  @apply size-[20px] text-text-muted;
}

.dropdown {
  @apply absolute right-0 top-[55px] z-50 w-[auto] min-w-[170px] overflow-hidden rounded-xl border border-border bg-surface py-[5px] shadow-lg;
}

.option {
  @apply w-full px-[20px] py-2 text-left text-sm text-text-muted hover:bg-surface-hover;
}

.welcome-text {
  @apply px-[20px] py-2 font-semibold text-text whitespace-nowrap;
}
</style>
