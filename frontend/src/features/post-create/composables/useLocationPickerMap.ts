import { ref, watch } from 'vue'
import L from 'leaflet'
import { useLeafletBase } from '@/composables/useLeafletBase'
import { useMapMarkers } from '@/composables/useMapMarkers'
import { formatLocationName } from '@/utils/formatLocation'

export function useLocationPickerMap(
  props: { center: [number, number]; zoom?: number },
  emit: (
    event: 'update:modelValue',
    value: { lat: number; lng: number; display_name: string }
  ) => void
) {
  const { mapContainer, map, zoomIn, zoomOut } = useLeafletBase({
    center: props.center,
    zoom: props.zoom || 13,
  })

  const { buildMarker } = useMapMarkers()
  const currentMarker = ref<L.Marker | null>(null)
  const currentAddress = ref<string>('')
  const flashMessage = ref<string>('')
  const showFlash = ref<boolean>(false)

  async function setMarker(latLng: L.LatLng) {
    if (!map.value) return

    // Remove existing marker
    if (currentMarker.value) {
      map.value.removeLayer(currentMarker.value as L.Marker)
    }

    // Create new marker
    const icon = await buildMarker(false)
    currentMarker.value = L.marker(latLng, { icon, draggable: true }).addTo(
      map.value as L.Map
    )

    // Handle marker drag end
    currentMarker.value.on('dragend', async (event) => {
      const marker = event.target
      const position = marker.getLatLng()
      await reverseGeocode(position)
    })

    // Get address for the location
    const address = await reverseGeocode(latLng)
    emit('update:modelValue', {
      lat: latLng.lat,
      lng: latLng.lng,
      display_name: address,
    })
  }

  async function reverseGeocode(latLng: L.LatLng): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng.lat}&lon=${latLng.lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      const address = formatLocationName(data) || 'Address not found'
      currentAddress.value = address
      return address
    } catch (error) {
      currentAddress.value = 'Failed to get address'
      return 'Failed to get address'
    }
  }

  function showFlashMessage(message: string, duration: number = 3000) {
    flashMessage.value = message
    showFlash.value = true
    setTimeout(() => {
      showFlash.value = false
    }, duration)
  }

  function attachMapClickHandler() {
    if (!map.value) return

    map.value.on('click', async (e: L.LeafletMouseEvent) => {
      if (map.value && map.value.getZoom() >= 16) {
        await setMarker(e.latlng)
      } else {
        showFlashMessage('Zoom in closer to place your pin!')
      }
    })
  }

  watch(
    () => map.value,
    (newMap) => {
      if (!newMap) return
      attachMapClickHandler()
      newMap.setView(props.center, props.zoom || 13)
    }
  )

  return {
    mapContainer,
    map,
    zoomIn,
    zoomOut,
    currentAddress,
    flashMessage,
    showFlash,
    setMarker,
  }
}
