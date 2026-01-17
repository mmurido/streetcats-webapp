import type { Ref } from 'vue'

export const openFilePicker = (
  input: Ref<HTMLInputElement | null> | HTMLInputElement | null
): void => {
  let el: HTMLInputElement | null = null

  if (input instanceof HTMLInputElement) {
    el = input
  } else if (input && 'value' in input) {
    el = (input as Ref<HTMLInputElement | null>).value
  }

  el?.click()
}

export const getImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export const isValidImageType = (
  file: File,
  acceptedTypes: string[] = ['image/jpg', 'image/jpeg', 'image/png']
): boolean => acceptedTypes.includes(file.type)

export const isValidImageSize = (file: File, maxSizeMB = 5): boolean =>
  file.size <= maxSizeMB * 1024 * 1024

export const validateImageFile = (
  file: File,
  {
    maxSizeMB = 5,
    acceptedTypes = ['image/jpg', 'image/jpeg', 'image/png'],
  } = {}
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  if (!acceptedTypes.includes(file.type)) errors.push('Invalid file type')
  if (file.size > maxSizeMB * 1024 * 1024) errors.push('File is too large')
  return { valid: errors.length === 0, errors }
}
