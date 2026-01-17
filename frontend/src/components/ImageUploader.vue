<template>
  <div>
    <!-- Upload Area -->
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragOver }"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="upload-content">
        <CloudArrowUpIcon class="upload-icon" />
        <p class="upload-text">
          Drag & drop your images here or click to browse
        </p>
        <p class="file-types">
          JPG, JPEG, PNG, (Max 5MB each, up to 10 images)
        </p>
      </div>

      <input
        :id="id"
        ref="fileInput"
        class="file-input"
        type="file"
        multiple
        accept=".jpg,.jpeg,.png"
        @change="handleFileSelect"
      />
    </div>

    <!-- Preview Area -->
    <div v-if="files.length > 0" class="preview-container">
      <div class="preview-grid">
        <div v-for="(file, index) in files" :key="index" class="preview-item">
          <img :src="file.preview" :alt="file.name" class="preview-bg" />
          <img :src="file.preview" :alt="file.name" class="preview-image" />
          <div class="preview-overlay">
            <button
              type="button"
              @click="removeFile(index)"
              class="preview-button remove-btn"
            >
              <TrashIcon />
            </button>

            <button
              type="button"
              @click="moveFile(index, -1)"
              class="preview-button move-left-btn"
              :disabled="index === 0"
            >
              <ChevronLeftIcon />
            </button>

            <button
              type="button"
              @click="moveFile(index, 1)"
              class="preview-button move-right-btn"
              :disabled="index === files.length - 1"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue'
import {
  TrashIcon,
  CloudArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  id?: string
  modelValue: File[] | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[]): void
}>()

interface UploadFile {
  file: File
  name: string
  size: number
  type: string
  preview: string
}

const isDragOver = ref(false)
const files: Ref<UploadFile[]> = ref([])
const uploadStatus = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const modelFiles = computed<File[]>({
  get: () => props.modelValue ?? [],
  set: (newFiles) => emit('update:modelValue', newFiles),
})

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  isDragOver.value = false
  if (e.dataTransfer?.files) {
    processFiles(e.dataTransfer.files)
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    processFiles(target.files)
    target.value = ''
  }
}

const processFiles = (fileList: FileList) => {
  uploadStatus.value = null

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]

    // Validate file type
    if (!isValidFileType(file)) {
      alert(`"${file.name}" is not a supported image type.`)
      continue
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(`"${file.name}" is too large. Maximum size is 5MB.`)
      continue
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      files.value.push({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: e.target?.result as string,
      })
    }
    reader.readAsDataURL(file)
  }
}

const isValidFileType = (file: File): boolean => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return acceptedTypes.includes(file.type)
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const moveFile = (index: number, direction: number) => {
  if (
    (direction === -1 && index === 0) ||
    (direction === 1 && index === files.value.length - 1)
  ) {
    return
  }

  const newIndex = index + direction
  const fileToMove = files.value[index]

  files.value.splice(index, 1)
  files.value.splice(newIndex, 0, fileToMove)
}

watch(
  files,
  () => {
    const rawFiles = files.value.map((f) => f.file)
    emit('update:modelValue', rawFiles)
  },
  { deep: true }
)
</script>

<style scoped>
.upload-area {
  @apply cursor-pointer rounded-lg border-[2px] border-dashed border-border bg-surface-hover px-[20px] py-[40px] text-center transition-all duration-300 ease-in-out;
}

.upload-area:hover,
.upload-area.drag-over {
  @apply border-accent bg-[#eff6ff];
}

.upload-content {
  @apply pointer-events-none flex flex-col items-center;
}

.upload-icon {
  @apply mb-[10px] size-[50px] text-text-placeholder;
}

.upload-area:hover .upload-icon,
.upload-area.drag-over .upload-icon {
  @apply text-accent;
}

.upload-text {
  @apply mb-[5px] text-xs font-medium text-text sm:text-sm md:text-base;
}

.file-types {
  @apply text-xs text-text-placeholder md:text-sm;
}

.file-input {
  @apply hidden;
}

.preview-container {
  @apply mt-[20px];
}

.preview-grid {
  @apply mb-6 grid grid-cols-3 gap-4 md:grid-cols-4;
}

.preview-item {
  @apply relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-hover;
}

.preview-bg {
  @apply absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-md filter;
}

.preview-image {
  @apply z-10 max-h-full max-w-full object-contain;
}

.preview-overlay {
  @apply absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-in-out;
}

.preview-item:hover .preview-overlay {
  @apply opacity-100;
}

.preview-button {
  @apply absolute flex size-[28px] cursor-pointer items-center justify-center rounded-full bg-surface-secondary p-[5px] text-text-inverted opacity-70 shadow-sm transition-opacity ease-in-out;
}

.preview-button:hover {
  @apply opacity-90;
}

.remove-btn {
  @apply right-[5px] top-[8px];
}

.move-left-btn {
  @apply left-[5px] top-[45%];
}

.move-right-btn {
  @apply right-[5px] top-[45%];
}

.move-left-btn:disabled,
.move-right-btn:disabled {
  @apply cursor-not-allowed opacity-0;
}
</style>
