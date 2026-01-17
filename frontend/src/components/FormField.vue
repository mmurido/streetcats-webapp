<template>
  <div class="field-container">
    <label v-if="label" :for="id" class="field-label">
      {{ label }}
      <span v-if="required" class="text-text-error">*</span>
    </label>

    <div
      :class="[
        'field-wrapper',
        { 'has-icon': $slots.icon },
        { 'has-toggle': type === 'password' },
        { 'has-error': error },
      ]"
    >
      <!-- Icon slot -->
      <span v-if="$slots.icon" class="field-icon">
        <slot name="icon"></slot>
      </span>

      <!-- Input field -->
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete || 'off'"
        class="field-input"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />

      <!-- Password toggle button -->
      <button
        v-if="type === 'password'"
        type="button"
        class="field-toggle"
        @click="togglePasswordVisibility"
      >
        <EyeIcon v-if="!passwordVisible" class="field-toggle-icon" />
        <EyeSlashIcon v-else class="field-toggle-icon" />
      </button>
    </div>

    <p :class="['field-error', error ? 'visible' : 'invisible']">
      {{ error || '&nbsp;' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

interface Props {
  id: string
  type?: 'text' | 'password' | 'email' | 'number'
  modelValue: string | number
  label?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const passwordVisible = ref(false)

const inputType = computed(() => {
  if (props.type !== 'password') return props.type
  return passwordVisible.value ? 'text' : 'password'
})

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>

<style scoped>
.field-container {
  @apply flex flex-col gap-[4px];
}

.field-label {
  @apply block text-sm font-medium text-text;
}

.field-wrapper {
  @apply relative rounded-lg;
}

.field-input {
  @apply block w-full rounded-xl border border-border px-4 py-2 text-[80%];
}

.field-wrapper.has-error .field-input {
  @apply ring-[1.5px] ring-border-error;
}

.field-wrapper.has-icon .field-input {
  @apply pl-10;
}

.field-wrapper.has-toggle .field-input {
  @apply pr-10;
}

.field-icon {
  @apply pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-placeholder;
}

.field-toggle {
  @apply absolute inset-y-0 right-0 flex items-center pr-[5px];
}

.field-toggle-icon {
  @apply size-full p-[8px] text-text-placeholder hover:text-text-muted;
}

.field-error {
  @apply text-xs font-medium text-text-error;
}
</style>
