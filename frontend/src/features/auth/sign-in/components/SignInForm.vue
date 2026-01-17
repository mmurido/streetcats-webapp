<template>
  <form
    id="sign-in-form"
    class="space-y-[8px]"
    @submit="handleSubmit"
    @focusin="clearAllErrors"
  >
    <FormField
      id="identifier"
      type="text"
      label="Username or email"
      placeholder="Enter your username or email"
      v-model="identifier"
      :error="errors.identifier"
      autocomplete="username"
    />

    <FormField
      id="password"
      type="password"
      label="Password"
      placeholder="Enter your password"
      v-model="password"
      :error="errors.password"
      autocomplete="current-password"
    />

    <div class="checkbox">
      <input id="remember-me" type="checkbox" v-model="rememberMe" />
      <label for="remember-me">Remember me</label>
    </div>
  </form>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import { ref, reactive } from 'vue'

const identifier = ref('')
const password = ref('')
const rememberMe = ref(false)
const errors = reactive<{ identifier?: string; password?: string }>({})

const emit = defineEmits<{
  (
    e: 'submit',
    payload: { identifier: string; password: string; rememberMe: boolean }
  ): void
}>()

function clearAllErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = undefined
  })
}

function handleSubmit() {
  errors.identifier = undefined
  errors.password = undefined

  if (!identifier.value) errors.identifier = 'Email or username is required'
  if (!password.value) errors.password = 'Password is required'

  if (!errors.identifier && !errors.password) {
    emit('submit', {
      identifier: identifier.value,
      password: password.value,
      rememberMe: rememberMe.value,
    })
  }
}

defineExpose({ handleSubmit })
</script>

<style scoped>
.checkbox {
  @apply flex items-center space-x-[10px];
}

.checkbox input {
  @apply h-4 w-4 rounded border-border;
}

.checkbox label {
  @apply block text-sm text-text;
}
</style>
