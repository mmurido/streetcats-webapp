import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'

export function useLeafletBase(options: L.MapOptions = {}) {
  const mapContainer = ref<HTMLDivElement | null>(null)
  const map = ref<L.Map | null>(null)
  const tileLayer = ref<L.TileLayer | null>(null)

  const defaultTileUrl =
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

  onMounted(() => {
    if (!mapContainer.value || map.value) return

    map.value = L.map(mapContainer.value, {
      zoomControl: false,
      ...options,
    })

    tileLayer.value = L.tileLayer(defaultTileUrl, {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map.value as L.Map)
  })

  onBeforeUnmount(() => {
    if (map.value) {
      map.value.remove()
      map.value = null
      tileLayer.value = null
    }
  })

  const zoomIn = () => {
    map.value?.zoomIn()
  }

  const zoomOut = () => {
    map.value?.zoomOut()
  }

  return {
    mapContainer,
    map,
    tileLayer,
    zoomIn,
    zoomOut,
  }
}
