<template>
  <div class="wrapper" :style="{ height }">
    <div ref="mapContainer" class="map-container"></div>
    <MapZoomControls :zoomIn="zoomIn" :zoomOut="zoomOut" />
  </div>
</template>

<script setup lang="ts">
import { useMiniMap } from '../composables/useMiniMap'
import MapZoomControls from '@/components/MapZoomControls.vue'

interface Props {
  center: [number, number]
  zoom?: number
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 16,
  height: '300px',
})

const { mapContainer, zoomIn, zoomOut } = useMiniMap({
  center: props.center,
  zoom: props.zoom,
})
</script>

<style scoped>
.wrapper {
  @apply relative w-full rounded-lg;
}

.map-container {
  @apply z-0 h-full w-full rounded-lg opacity-90;
}
</style>
