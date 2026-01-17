<template>
  <Modal
    title="Sign up"
    width="xl"
    :show="show"
    :content-padding="'px-[10%] py-[5%]'"
    @close="onClose"
  >
    <div v-if="toastMessage" class="toast">
      <XCircleIcon class="toast-icon" />
      <span class="toast-text">{{ toastMessage }}</span>
    </div>

    <SignUpForm @submit="handleSignUp" ref="signUpFormRef" />

    <template #footer>
      <footer class="flex flex-col items-center">
        <button class="submit-button" @click="submit" id="signup-submit">
          <div v-if="isLoading" class="preloader-container">
            <img :src="preloader" alt="Loading..." class="preloader" />
          </div>
          <span v-else>Sign up</span>
        </button>

        <div class="mt-3 text-sm text-text">
          <span>
            Already have an account?
            <button
              @click="switchToSignIn"
              class="font-semibold text-text hover:underline"
            >
              Sign in
            </button>
          </span>
        </div>
      </footer>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SignUpForm from './SignUpForm.vue'
import Modal from '@components/Modal.vue'
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { useSignUpApi } from '../composables/useSignUp'
import { useAuthModal } from '@/composables/useAuthModal'
import { useSignInApi } from '../../sign-in/composables/useSignIn'
import preloader from '@assets/preloader.svg'

defineProps<{ show: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { signUp, isLoading } = useSignUpApi()
const { signIn } = useSignInApi()
const { openSignIn } = useAuthModal()
const toastMessage = ref<string | null>(null)

const signUpFormRef = ref<InstanceType<typeof SignUpForm>>()

function onClose() {
  emit('close')
}

function switchToSignIn() {
  toastMessage.value = null
  emit('close')
  openSignIn()
}

async function handleSignUp(payload: {
  username: string
  email: string
  password: string
  confirmPassword: string
  birthday: string
  country: string
  avatar: File | null
}) {
  toastMessage.value = null

  try {
    const payloadForSignUp = {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      birthday: payload.birthday,
      country: payload.country,
      avatar: payload.avatar,
    }

    const payloadForSignIn = {
      identifier: payload.username,
      password: payload.password,
      rememberMe: false,
    }

    await signUp(payloadForSignUp)
    await signIn(payloadForSignIn)
    emit('close')
  } catch (err: any) {
    toastMessage.value = 'Sign-up failed'
  }
}

function submit() {
  signUpFormRef.value?.handleSubmit?.()
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
