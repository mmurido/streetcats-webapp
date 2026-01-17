<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Overlay -->
          <div class="overlay" @click="handleOverlayClick"></div>

        <!-- Modal container -->
        <div class="modal-container">
          <!-- Modal content -->
            <div class="modal" :class="widthClass">
              <!-- Header -->
              <header v-if="showHeader" class="header">
                <div class="flex items-center justify-between">
                  <h2>
                    {{ title }}
                  </h2>
                  <button
                    id="close-modal-button"
                    v-if="showCloseButton"
                    class="close-button"
                    @click="closeModal"
                    :aria-label="closeButtonLabel || 'Close modal'"
                  >
                    <XMarkIcon class="size-5" />
                  </button>
                </div>
              </header>

              <!-- Scrollable content area -->
              <main class="content" :class="contentPadding">
                <slot></slot>
              </main>

              <!-- Footer with slot -->
              <footer v-if="$slots.footer" class="footer">
                <slot name="footer"></slot>
              </footer>
            </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, watch } from 'vue'

interface Props {
  show: boolean
  title?: string
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | string
  showHeader?: boolean
  showCloseButton?: boolean
  closeButtonLabel?: string
  contentPadding?: string
  closeOnOverlayClick?: boolean
  preventBodyScroll?: boolean
  resetOnClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Modal',
  width: 'md',
  showHeader: true,
  showCloseButton: true,
  contentPadding: 'px-[25px] py-[15px]',
  closeOnOverlayClick: true,
  preventBodyScroll: true,
  resetOnClose: false,
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'reset'): void
}>()

const widthClass = computed(() => {
  const widthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full',
  }

  return typeof props.width === 'string' && props.width in widthMap
    ? widthMap[props.width as keyof typeof widthMap]
    : props.width
})

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal()
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (props.preventBodyScroll) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
        if (props.resetOnClose) emit('reset')
      }
    }
  }
)
</script>

<style scoped>
.overlay {
  @apply fixed inset-0 bg-black/60 backdrop-blur-sm;
}

.modal-container {
  @apply flex min-h-full items-stretch justify-center p-0;
}

.modal {
  @apply relative flex max-h-screen w-full transform flex-col overflow-hidden rounded-none bg-surface text-left shadow-xl;
}

@media (max-width: 479px) {
  .modal {
    @apply w-screen max-w-full;
  }
}

@media (min-width: 480px) {
  .modal-container {
    @apply items-center p-4;
  }
  .modal {
    @apply max-h-[90vh] rounded-2xl;
  }
}

.header {
  @apply border-b border-border px-6 py-4 text-xl font-medium text-text-muted;
}

.close-button {
  @apply rounded-full p-1 text-text-muted transition-colors hover:opacity-50;
}

.content {
  @apply flex-1 overflow-y-auto;
}

.footer {
  @apply border-t border-border px-6 py-4;
}
</style>
