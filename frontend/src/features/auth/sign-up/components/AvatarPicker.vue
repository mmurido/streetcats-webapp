<template>
  <div class="relative inline-block">
    <fieldset class="flex items-start">
      <legend class="sr-only">Avatar</legend>
      <div class="relative flex items-center justify-center">
        <img :src="avatarPreview" alt="Profile avatar" class="avatar-preview" />
        <button type="button" class="button" @click="openPicker">
          <PlusIcon class="text-text-muted" />
        </button>

        <input
          id="avatar-picker-input"
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import {
  getImagePreview,
  openFilePicker,
  validateImageFile,
} from '@/utils/file'
import { ref } from 'vue'
import defaultAvatar from '@assets/default-avatar.jpg'
import { PlusIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  avatar: File | null
}>()

const emit = defineEmits<{
  'update:avatar': [file: File | null]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string>(defaultAvatar)

const openPicker = () => {
  openFilePicker(fileInput)
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  if (!file) return

  const { valid, errors } = validateImageFile(file)
  if (!valid) {
    alert(errors.join(', '))
    return
  }

  try {
    avatarPreview.value = await getImagePreview(file)
    emit('update:avatar', file)
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
.avatar-preview {
  @apply size-[70%] rounded-full object-cover;
}

.button {
  @apply absolute right-[15%] top-2 size-[30px];
  @apply p-[5px];
  @apply rounded-full border border-border;
  @apply bg-surface opacity-80 drop-shadow-lg;
}

.button-icon {
  @apply size-[22px] text-text-muted;
}

.button:hover {
  @apply scale-105 opacity-100 transition-all duration-200 ease-out;
}

.button-icon:hover {
  @apply scale-105 text-text;
}
</style>
