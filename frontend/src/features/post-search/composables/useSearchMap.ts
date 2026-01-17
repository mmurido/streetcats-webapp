import { useLeafletBase } from '@/composables/useLeafletBase'
import { useMapMarkers } from '@/composables/useMapMarkers'
import { useUiStore } from '@/stores/useUiStore'
import type { Post } from '@/types'
import { ref, watch } from 'vue'
import L, { LatLngBounds } from 'leaflet'
import { usePostSearchStore } from '../stores/usePostSearchStore'

export function useSearchMap(
  props: {
    center: [number, number]
    zoom?: number
    posts: Post[]
  },
  mapPadding: any,
  emit?: any
) {
  const { mapContainer, map, zoomIn, zoomOut } = useLeafletBase({
    center: props.center,
    zoom: props.zoom || 13,
  })

  const {
    buildMarker,
    buildPopup,
    attachPopupEvents,
    attachSelectionEvents,
    selectedMarker,
  } = useMapMarkers()

  const uiStore = useUiStore()
  let markersLayer: L.FeatureGroup | null = null
  let lastFetchedBounds = ref<LatLngBounds | null>(null)
  let showSearchHereButton = ref<boolean>(true)
  const searchStore = usePostSearchStore()

  async function searchHere() {
    if (!map.value) return
    const bounds = getUsableBounds()
    if (!bounds) return
    const boundsPayload = {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    }

    await searchStore.loadPosts(boundsPayload, 1)
    lastFetchedBounds.value = bounds
    showSearchHereButton.value = false
  }

  async function renderResults() {
    if (!map.value || !markersLayer) return
    markersLayer.clearLayers()
    const selectedLatLng = selectedMarker.value?.getLatLng()
    selectedMarker.value = null

    for (const post of props.posts) {
      const isSelected =
        selectedLatLng &&
        selectedLatLng.lat === post.location.lat &&
        selectedLatLng.lng === post.location.lng

      const icon = await buildMarker(isSelected)
      const marker = L.marker([post.location.lat, post.location.lng], {
        icon,
      })
      if (isSelected) selectedMarker.value = marker

      const popup = await buildPopup(post)
      marker.bindPopup(popup)
      attachPopupEvents(marker, post)
      attachSelectionEvents(marker)

      markersLayer.addLayer(marker)
    }
  }

  function fitToMarkers() {
    if (!map.value || !markersLayer) return
    const bounds = markersLayer.getBounds()
    if (!bounds.isValid()) return
    const padding = mapPadding.value
    map.value.fitBounds(bounds, {
      paddingTopLeft: [padding.left, padding.top],
      paddingBottomRight: [padding.right, padding.bottom],
    })
  }

  function attachBackgroundClick(map: L.Map) {
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const target = e.originalEvent.target as HTMLElement
      if (target?.closest?.('.leaflet-marker-icon')) return

      if (selectedMarker.value) {
        const unselectedIcon = await buildMarker(false)
        selectedMarker.value.setIcon(unselectedIcon)
        selectedMarker.value = null
      }
    })
  }

  function attachSearchButtonBehavior(map: L.Map) {
    map.on('moveend', () => {
      const currentBounds = map!.getBounds()

      if (
        !lastFetchedBounds.value ||
        !lastFetchedBounds.value.contains(currentBounds)
      ) {
        showSearchHereButton.value = true
      } else {
        showSearchHereButton.value = false
      }
    })
  }

  function getUsableBounds(): L.LatLngBounds | null {
    if (!map.value) {
      console.error('Map is not initialized')
      return null
    }

    const size = map.value.getSize()
    const padding = uiStore.mapPadding

    const topLeft = L.point(padding.left, padding.top)
    const bottomRight = L.point(size.x - padding.right, size.y - padding.bottom)

    const nw = map.value.containerPointToLatLng(topLeft)
    const se = map.value.containerPointToLatLng(bottomRight)

    return L.latLngBounds(nw, se)
  }

  watch(
    () => map.value,
    (newMap) => {
      if (!newMap) return
      markersLayer = L.featureGroup().addTo(newMap as L.Map)
      attachBackgroundClick(newMap as L.Map)
      attachSearchButtonBehavior(newMap as L.Map)
      renderResults()
    }
  )

  watch(
    () => props.center,
    (newCenter) => {
      if (map.value) {
        map.value.setView(newCenter, props.zoom || map.value.getZoom())
      }
    },
    { deep: true }
  )

  watch(
    () => props.zoom,
    (newZoom) => {
      if (map.value && newZoom) {
        map.value.setZoom(newZoom)
      }
    }
  )

  watch(() => props.posts, renderResults, { deep: true })

  watch(mapPadding, () => map.value?.invalidateSize())

  return {
    mapContainer,
    map,
    zoomIn,
    zoomOut,
    fitToMarkers,
    searchHere,
    getUsableBounds,
    showSearchHereButton,
  }
}
