<template>
  <button
    @click="onClick"
    :class="[
      'base-button',
      {
        'light-button': props.variant === 'light',
        'dark-button': props.variant === 'dark',
        'clear-button': props.variant === 'clear',
        'has-text': props.text,
      },
    ]"
  >
    <slot name="icon" v-if="$slots.icon"></slot>
    <span v-if="text">{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string
  variant?: 'light' | 'dark' | 'clear'
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (e: MouseEvent) => emit('click', e)
</script>

<style scoped>
.base-button {
  @apply flex min-h-[30px] w-auto min-w-[30px] items-center justify-center gap-1 rounded-full border text-center text-xs font-medium transition-all duration-200 ease-out;
}

.base-button.has-text {
  @apply px-[15px];
}

.light-button {
  @apply border-border bg-surface text-text-muted;
}

.dark-button {
  @apply border-surface-secondary bg-surface-secondary text-text-inverted;
}

.clear-button {
  @apply border-border bg-surface bg-opacity-90 text-text-muted;
}

.base-button:hover {
  @apply scale-105 bg-opacity-100;
}
</style>
