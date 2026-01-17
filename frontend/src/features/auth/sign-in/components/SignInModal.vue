<template>
  <Modal
    title="Sign in"
    width="md"
    :show="show"
    :content-padding="'px-[12%] py-[8%]'"
    @close="onClose"
  >
    <div v-if="toastMessage" class="toast">
      <XCircleIcon class="toast-icon" />
      <span class="toast-text">{{ toastMessage }}</span>
    </div>

    <SignInForm @submit="handleSignIn" ref="signInFormRef" />

    <template #footer>
      <footer class="flex flex-col items-center">
        <button class="submit-button" @click="submit" id="signin-submit">
          <div v-if="isLoading" class="preloader-container">
            <img :src="preloader" alt="Loading..." class="preloader" />
          </div>
          <span v-else>Sign in</span>
        </button>

        <div class="mt-3 text-sm text-text">
          <span>
            Don't have an account yet?
            <button
              @click="switchToSignUp"
              class="font-semibold text-text hover:underline"
            >
              Create one
            </button>
          </span>
        </div>
      </footer>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import Modal from '@components/Modal.vue'
import SignInForm from './SignInForm.vue'
import { useSignInApi } from '../composables/useSignIn'
import { useAuthModal } from '@/composables/useAuthModal'
import preloader from '@assets/preloader.svg'

defineProps<{ show: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { signIn, isLoading } = useSignInApi()
const { openSignUp } = useAuthModal()
const toastMessage = ref<string | null>(null)

const signInFormRef = ref<InstanceType<typeof SignInForm>>()

function onClose() {
  toastMessage.value = null
  emit('close')
}

function switchToSignUp() {
  emit('close')
  openSignUp()
}

async function handleSignIn(payload: {
  identifier: string
  password: string
  rememberMe: boolean
}) {
  toastMessage.value = null
  try {
    await signIn(payload)
    emit('close')
  } catch (err: any) {
    toastMessage.value = err.message
  }
}

function submit() {
  signInFormRef.value?.handleSubmit?.()
}
</script>

<style scoped>
.toast {
  @apply mb-[15px] flex w-full items-center gap-[10px] rounded-lg bg-surface-error px-[20px] py-[8px];
}

.toast-text {
  @apply text-sm font-medium text-text-error;
}

.toast-icon {
  @apply size-[25px] text-text-error;
}

.submit-button {
  @apply h-[40px] w-[60%] rounded-full bg-surface-secondary px-4 py-2 text-sm font-semibold text-text-inverted transition-colors hover:opacity-95;
}

.preloader-container {
  @apply flex h-full w-full items-center justify-center;
}

.preloader {
  @apply size-[50px];
}
</style>
