import { protectedFetch } from '@/utils/api'
import { ref } from 'vue'

export function useCreatePostApi() {
  const isLoading = ref(false)

  async function createPost(payload: {
    title: string
    images: File[]
    location: { lat: number; lng: number; display_name: string }
    description: string
  }) {
    isLoading.value = true

    try {
      const formData = new FormData()
      formData.append('title', payload.title)
      formData.append('description', payload.description)
      formData.append('location_name', payload.location.display_name)
      formData.append('location_lat', payload.location.lat.toString())
      formData.append('location_lng', payload.location.lng.toString())
      payload.images.forEach((file) => {
        formData.append('uploaded_images', file)
      })

      const data = await protectedFetch('/posts', {
        method: 'POST',
        body: formData,
      })

      return data
    } catch (err: any) {
      const message =
        err?.response?._data?.error || err?.message || 'Post creation failed'
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  return { createPost, isLoading }
}
