import { useLeafletBase } from '@/composables/useLeafletBase'
import { useMapMarkers } from '@/composables/useMapMarkers'
import { watch, ref } from 'vue'
import L from 'leaflet'

interface MiniMapOptions {
  center: [number, number]
  zoom?: number
}

export function useMiniMap(props: MiniMapOptions) {
  const { mapContainer, map, zoomIn, zoomOut } = useLeafletBase({
    center: props.center,
    zoom: props.zoom ?? 15,
    attributionControl: false,
  })

  const { buildMarker } = useMapMarkers()
  const marker = ref<L.Marker | null>(null)

  async function setMarker(coordinates: [number, number]) {
    if (!map.value) return

    if (marker.value) {
      map.value.removeLayer(marker.value as L.Marker)
    }

    const icon = await buildMarker(false)
    marker.value = L.marker(coordinates, { icon }).addTo(map.value as L.Map)

    map.value.setView(coordinates, props.zoom ?? 15, {
      animate: true,
      duration: 1,
    })
  }

  watch(
    [map, () => props.center],
    async ([newMap, newCenter]) => {
      if (newMap && newCenter) {
        await setMarker(newCenter)
      }
    },
    { immediate: true }
  )

  return {
    mapContainer,
    zoomIn,
    zoomOut,
    setMarker,
  }
}
