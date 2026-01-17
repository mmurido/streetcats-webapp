<template>
  <div class="map-wrapper">
    <!-- Map -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- Overlay for usable area -->
    <div
      class="usable-area"
      :style="{
        top: uiStore.headerOffset + 'px',
        left: uiStore.isResultsPanelVisible ? uiStore.panelOffset + 'px' : 0,
      }"
    >
      <!-- "Search here" button -->
      <button
        id="search-here-button"
        v-if="showSearchHereButton"
        @click="searchHere"
        :class="[
          'search-here-button',
          uiStore.isResultsPanelVisible ? 'hidden lg:flex' : 'flex',
        ]"
      >
        <MagnifyingGlassIcon class="mag-icon" />
        <span>Search here</span>
      </button>
    </div>

    <div class="hidden lg:flex">
      <MapZoomControls :zoomIn="zoomIn" :zoomOut="zoomOut" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import 'leaflet/dist/leaflet.css'
import { Post } from '@/types'
import { useUiStore } from '@/stores/useUiStore'
import { storeToRefs } from 'pinia'
import { useSearchMap } from '../composables/useSearchMap'
import MapZoomControls from '@/components/MapZoomControls.vue'

const props = defineProps<{
  center: [number, number]
  zoom?: number
  posts: Post[]
}>()

const uiStore = useUiStore()
const { mapPadding } = storeToRefs(uiStore)

const { mapContainer, zoomIn, zoomOut, searchHere, showSearchHereButton } =
  useSearchMap(props, mapPadding)

defineExpose({ searchHere })
</script>

<style scoped>
.map-wrapper {
  @apply relative h-full w-full rounded-xl;
}

.map-container {
  @apply z-0 h-full w-full rounded-xl opacity-90;
}

.usable-area {
  @apply pointer-events-none absolute bottom-0 right-0 m-[10px] flex items-start justify-center;
  transition: left 0.3s ease-in-out;
}

.search-here-button {
  @apply items-center gap-2;
  @apply rounded-full border-[1.5px] border-border;
  @apply bg-surface px-4 py-[4px] text-sm;
  @apply pointer-events-auto hover:bg-surface-hover;
  transition: all 0.2s ease-out;
}

.mag-icon {
  @apply size-[15px] pb-[1px] text-text-muted;
}
</style>
