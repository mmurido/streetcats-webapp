<template>
  <form id="sign-up-form" @submit="handleSubmit" @focusin="clearAllErrors">
    <div class="grid-container">
      <div class="first-row">
        <div class="avatar-col">
          <AvatarPicker v-model:avatar="form.avatar" />
        </div>
        <div class="auth-col">
          <div class="username-row">
            <FormField
              id="username"
              type="text"
              label="Username"
              placeholder="Enter your username"
              v-model="form.username"
              :error="errors.username"
              required
            />
          </div>
          <div class="email-row">
            <FormField
              id="email"
              type="text"
              label="Email"
              placeholder="Enter your email"
              v-model="form.email"
              :error="errors.email"
              required
            />
          </div>
        </div>
      </div>
      <div class="password-row">
        <div class="password-col">
          <FormField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            v-model="form.password"
            :error="errors.password"
            required
          />
        </div>
        <div class="confirm-password-col">
          <FormField
            id="confirm-password"
            type="password"
            label="Confirm password"
            placeholder="Confirm your password"
            v-model="form.confirmPassword"
            :error="errors.confirmPassword"
            required
          />
        </div>
      </div>

      <div class="birthday-row">
        <BirthdayPicker v-model="form.birthday" :error="errors.birthday" />
      </div>
      <div class="country-row">
        <CountryPicker v-model="form.country" :error="errors.country" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { signUpSchema, SignUpData } from '../helpers/validation'
import AvatarPicker from './AvatarPicker.vue'
import FormField from '@/components/FormField.vue'
import BirthdayPicker from './BirthdayPicker.vue'
import CountryPicker from './CountryPicker.vue'

const form = ref<SignUpData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  country: '',
  birthday: '',
  avatar: null,
})

const errors = reactive<Partial<Record<keyof SignUpData, string>>>({})

const emit = defineEmits<{
  (e: 'submit', payload: SignUpData): void
}>()

function clearAllErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = undefined
  })
}

function handleSubmit() {
  Object.keys(errors).forEach(
    (k) => (errors[k as keyof SignUpData] = undefined)
  )

  const result = signUpSchema.safeParse(form.value)

  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof SignUpData
      errors[key] = issue.message
    }
    return
  }

  emit('submit', result.data)
}

defineExpose({ handleSubmit })
</script>

<style scoped>
.grid-container {
  @apply grid;
  grid-template-rows: auto auto auto auto;
  grid-template-columns: 1fr;
  gap: 8px;
}

.first-row {
  @apply grid gap-4;
  grid-row: 1;
  grid-column: 1;
  grid-template-columns: 1fr 1fr;
}

.avatar-col {
  @apply flex items-center justify-center;
}

.auth-col {
  @apply grid gap-4;
  grid-template-rows: auto auto;
}

.username-row {
  @apply flex items-center justify-center;
}

.username-row > * {
  @apply w-full;
}

.email-row {
  @apply flex items-center justify-center;
}

.email-row > * {
  @apply w-full;
}

.password-row {
  @apply grid grid-cols-2 gap-4;
  grid-row: 2;
}

.password-col {
  @apply flex items-center justify-center;
  grid-row: 2;
  grid-column: 1;
}

.password-col > * {
  @apply w-full;
}

.confirm-password-col {
  @apply flex items-center justify-center;
  grid-row: 2;
  grid-column: 2;
}

.confirm-password-col > * {
  @apply w-full;
}

.birthday-row,
.country-row {
  @apply flex items-center;
}
</style>
