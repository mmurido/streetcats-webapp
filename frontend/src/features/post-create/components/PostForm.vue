<template>
  <form
    id="post-form"
    @submit.prevent="handleSubmit"
    @focusin="clearAllErrors"
    class="form"
  >
    <!-- Title Row -->
    <div class="label">
      <label for="title">
        Title
        <span class="required-asterisk">*</span>
      </label>
      <span class="error-text">
        {{ errors.title }}
      </span>
    </div>
    <FormField
      id="title"
      type="text"
      v-model="form.title"
      placeholder="Enter a title..."
    />

    <!-- Images Row -->
    <div class="label">
      <label for="images">
        Images
        <span class="required-asterisk">*</span>
      </label>
      <span class="error-text">
        {{ errors.images }}
      </span>
    </div>
    <div class="field-container">
      <ImageUploader id="images" v-model="form.images" />
    </div>

    <!-- Location Row -->
    <div class="label">
      <label for="location-picker">
        Location
        <span class="required-asterisk">*</span>
      </label>
      <span class="error-text">
        {{ errors.location }}
      </span>
    </div>
    <div class="field-container">
      <LocationPicker id="location-picker" v-model="form.location" />
    </div>

    <!-- Description Row -->
    <div class="label">
      <label for="markdown-editor">
        Description
        <span class="required-asterisk">*</span>
      </label>
      <span class="error-text">
        {{ errors.description }}
      </span>
    </div>
    <div class="field-container">
      <MarkdownEditor
        id="markdown-editor"
        v-model="form.description"
        :show-preview="true"
      />
    </div>

    <!-- Submit button -->
    <div class="col-span-2 flex justify-end">
      <button id="submit-post-button" type="submit" class="submit-button">
        <div v-if="isLoading" class="preloader-container">
          <img :src="preloader" alt="Loading..." class="preloader" />
        </div>
        <span v-else>Create post</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import LocationPicker from './LocationPicker.vue'
import MarkdownEditor from './MarkdownEditor.vue'
import { reactive, ref } from 'vue'
import { CreatePostData, createPostSchema } from '../helpers/validation'
import preloader from '@assets/preloader.svg'

defineProps<{
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: CreatePostData): void
}>()

const form = ref<CreatePostData>({
  title: '',
  images: [],
  location: { lat: 0, lng: 0, display_name: '' },
  description: '',
})

const errors = reactive<Partial<Record<keyof CreatePostData, string>>>({})

function clearAllErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = undefined
  })
}

function handleSubmit() {
  Object.keys(errors).forEach(
    (k) => (errors[k as keyof CreatePostData] = undefined)
  )

  const result = createPostSchema.safeParse(form.value)

  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof CreatePostData
      errors[key] = issue.message
    }
    return
  }

  emit('submit', result.data)
}
</script>

<style scoped>
.layout {
  @apply h-full px-[60px] py-[20px] sm:px-[80px] md:px-[10px] lg:px-[140px];
}

.container {
  @apply mx-auto flex h-auto max-w-[900px] cursor-default flex-col rounded-xl bg-surface py-[30px];
}

.form {
  @apply gap-y-[40px] md:grid md:grid-cols-[auto,1fr];
}

.header {
  @apply mb-[40px] text-2xl font-semibold text-text;
}

.label {
  @apply flex flex-col border-border text-lg font-medium text-text-placeholder md:w-[150px] md:border-b lg:w-[200px];
}

.required-asterisk {
  @apply ml-1 text-red-500;
}

.field-container {
  @apply mb-[20px] mt-[15px] flex flex-col gap-[20px] border-b border-border pb-[30px] md:my-[0px] md:pl-[30px];
}

.submit-button {
  @apply flex h-[40px] w-full items-center justify-center gap-2 rounded-full bg-surface-secondary px-[20px] py-2 font-medium text-text-inverted sm:w-[150px];
}

.submit-button:hover {
  @apply transition-all duration-200 ease-out hover:scale-105;
}

.error-text {
  @apply text-sm text-text-error;
}

.preloader-container {
  @apply flex h-full w-full items-center justify-center;
}

.preloader {
  @apply size-[50px];
}
</style>
