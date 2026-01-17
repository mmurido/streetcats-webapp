import { ref } from 'vue'

const showSignIn = ref(false)
const showSignUp = ref(false)

export function useAuthModal() {
  function openSignIn() {
    showSignUp.value = false
    showSignIn.value = true
  }

  function openSignUp() {
    showSignIn.value = false
    showSignUp.value = true
  }

  function close() {
    showSignIn.value = false
    showSignUp.value = false
  }

  return {
    showSignIn,
    showSignUp,
    openSignIn,
    openSignUp,
    close,
  }
}
