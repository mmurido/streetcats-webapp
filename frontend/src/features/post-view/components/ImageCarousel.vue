<template>
  <div class="image-carousel">
    <!-- Content container -->
    <div class="carousel-content">
      <!-- Navigation arrows -->
      <button
        v-if="images.length > 1"
        @click="prevImage"
        class="carousel-arrow carousel-arrow--left"
        aria-label="Previous image"
      >
        <ChevronLeftIcon class="arrow-icon" />
      </button>

      <!-- Current image -->
      <img
        :src="currentImageUrl"
        :alt="`Image ${currentIndex + 1} of ${images.length}`"
        class="carousel-image"
      />

      <!-- Navigation arrows -->
      <button
        v-if="images.length > 1"
        @click="nextImage"
        class="carousel-arrow carousel-arrow--right"
        aria-label="Next image"
      >
        <ChevronRightIcon class="arrow-icon" />
      </button>

      <!-- Progress indicator -->
      <div v-if="images.length > 1" class="carousel-indicators">
        <button
          v-for="(image, index) in images"
          :key="image"
          @click="goToImage(index)"
          class="carousel-indicator"
          :class="{ 'carousel-indicator--active': currentIndex === index }"
          :aria-label="`Go to image ${index + 1}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  images: string[]
}>()

const currentIndex = ref(0)

watch(
  () => props.images,
  () => {
    currentIndex.value = 0
  }
)

const currentImageUrl = computed(() => {
  if (!props.images.length) return ''
  return props.images[currentIndex.value]
})

const nextImage = () => {
  if (props.images.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
  if (props.images.length <= 1) return
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length
}

const goToImage = (index: number) => {
  currentIndex.value = index
}
</script>

<style scoped>
.image-carousel {
  @apply relative mb-4 overflow-hidden rounded-lg;
  aspect-ratio: 16/9;
}

.carousel-content {
  @apply relative z-10 flex h-full items-center justify-center bg-surface-hover;
}

.carousel-image {
  @apply h-full max-w-full object-contain;
}

.carousel-arrow {
  @apply absolute flex size-[30px] items-center justify-center rounded-full bg-white/80 text-white shadow-lg transition-all duration-200;
  top: 45%;
  z-index: 20;
}

.carousel-arrow:hover {
  @apply scale-110 bg-white;
}

.carousel-arrow--left {
  @apply left-4;
}

.carousel-arrow--right {
  @apply right-4;
}

.arrow-icon {
  @apply size-[20px] text-text;
}

.carousel-indicators {
  @apply absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2;
  z-index: 20;
}

.carousel-indicator {
  @apply h-2 w-2 rounded-full bg-white/50 transition-all duration-200;
}

.carousel-indicator:hover {
  @apply scale-125 bg-white/80;
}

.carousel-indicator--active {
  @apply w-6 bg-white;
}
</style>
