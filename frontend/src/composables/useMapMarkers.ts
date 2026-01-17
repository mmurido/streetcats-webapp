import MapMarker from '@/components/MapMarker.vue'
import MapPopup from '@/components/MapPopup.vue'
import { renderToString } from '@vue/server-renderer'
import { ref, h, defineComponent } from 'vue'
import type { Post } from '@/types'
import { useRouter } from 'vue-router'
import L from 'leaflet'

export function useMapMarkers() {
  const selectedMarker = ref<L.Marker | null>(null)
  const router = useRouter()

  async function buildMarker(isSelected = false) {
    const html = await renderToString(h(MapMarker, { selected: isSelected }))
    return L.divIcon({
      html,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    })
  }

  async function buildPopup(post: Post) {
    const popupComponent = defineComponent({
      props: ['data'],
      setup(props) {
        return () => h(MapPopup, { ...props.data })
      },
    })

    const popupData = {
      id: post.id,
      imageUrl: post.image_urls?.[0] || 'https://placecats.com/200/150',
      title: post.title,
      commentCount: post.comments?.length || 0,
      heartCount: post.heart_count,
      created_at: post.created_at,
    }

    const html = await renderToString(h(popupComponent, { data: popupData }))
    return L.popup({
      className: 'custom-popup',
      maxWidth: 300,
      offset: L.point(5, -25),
      autoPan: false,
    }).setContent(`<div class="popup-content">${html}</div>`)
  }

  function attachPopupEvents(marker: L.Marker, post: Post) {
    marker.on('popupopen', () => {
      const popup = marker.getPopup()?.getElement()
      if (!popup) return
      popup.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.popup-content')) {
          router.push({ name: 'PostView', params: { id: post.id } })
        }
      })
    })
  }

  function attachSelectionEvents(marker: L.Marker) {
    marker.on('click', async () => {
      if (selectedMarker.value && selectedMarker.value !== marker) {
        const prevIcon = await buildMarker(false)
        selectedMarker.value.setIcon(prevIcon)
      }
      const newIcon = await buildMarker(true)
      marker.setIcon(newIcon)
      selectedMarker.value = marker
    })
  }

  return {
    buildMarker,
    buildPopup,
    attachPopupEvents,
    attachSelectionEvents,
    selectedMarker,
  }
}
