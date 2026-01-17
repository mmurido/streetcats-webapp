<template>
  <div class="location-picker">
    <!-- Search Bar -->
    <SearchBar :id="id" @suggestionSelected="onSuggestionSelected" />

    <!-- Map Container -->
    <div class="map-wrapper">
      <div ref="mapContainer" class="map-container"></div>
      <MapZoomControls :zoomIn="zoomIn" :zoomOut="zoomOut" class="z-30" />

      <!-- Flash Message -->
      <Transition name="slide-fade">
        <div v-if="showFlash" class="flash-message">
          <span class="flash-message-text">{{ flashMessage }}</span>
        </div>
      </Transition>
    </div>

    <!-- Address Preview -->
    <div v-if="currentAddress" class="address-preview">
      <MapPinIcon class="size-5 text-text-placeholder" />
      <span class="address-text">{{ currentAddress }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLocationPickerMap } from '../composables/useLocationPickerMap'
import { MapPinIcon } from '@heroicons/vue/24/outline'
import MapZoomControls from '@/components/MapZoomControls.vue'
import { useLocationSearch } from '@/features/post-search/composables/useLocationSearch'
import SearchBar from '@/features/post-search/components/SearchBar.vue'

const props = defineProps<{
  modelValue: {
    lat: number
    lng: number
    display_name: string
  }
  id?: string
}>()

const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: { lat: number; lng: number; display_name: string }
  ): void
}>()

const { selectSuggestion } = useLocationSearch()

const {
  mapContainer,
  map,
  zoomIn,
  zoomOut,
  currentAddress,
  flashMessage,
  showFlash,
} = useLocationPickerMap({ center: [40.851775, 14.268124], zoom: 13 }, emit)

const onSuggestionSelected = async (suggestion: any) => {
  selectSuggestion(suggestion)
  const lat = parseFloat(suggestion.lat)
  const lng = parseFloat(suggestion.lon || suggestion.lng)

  if (map.value) {
    map.value.setView([lat, lng], 16)
  }
}
</script>

<style scoped>
.location-picker {
  @apply flex flex-col gap-4;
}

.search-container {
  @apply relative;
}

.search-input {
  @apply w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm;
}

.spinner {
  @apply h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-400;
}

.suggestions-dropdown {
  @apply absolute z-20 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg;
}

.suggestion-item {
  @apply cursor-pointer px-4 py-2 hover:bg-surface-hover;
}

.suggestion-item:not(:last-child) {
  @apply border-b border-border;
}

.map-wrapper {
  @apply relative z-0 h-[300px] w-full overflow-hidden rounded-xl;
}

.map-container {
  @apply z-10 h-full w-full;
}

.flash-message {
  @apply absolute bottom-[8%] left-0 right-0 z-30 mx-auto flex max-w-xs items-center justify-center rounded-full bg-surface bg-opacity-90 px-4 py-2 shadow-md;
}

.flash-message-text {
  @apply text-sm font-medium text-text;
}

.address-preview {
  @apply flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3;
}

.address-text {
  @apply text-sm text-text;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
