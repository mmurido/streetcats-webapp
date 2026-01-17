<template>
  <div class="flex min-h-screen w-screen flex-col">
    <Header class="floating-header" @locationSelected="onLocationSelected" />
    <main class="relative m-2 flex-1">
      <div class="absolute inset-0">
        <SearchMap
          ref="mapRef"
          :center="mapCenter"
          :zoom="mapZoom"
          :posts="searchStore.results"
        />
      </div>

      <SearchPanel
        :posts="searchStore.results"
        @nextPage="searchStore.nextPage"
        @prevPage="searchStore.prevPage"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import SearchMap from '@/features/post-search/components/SearchMap.vue'
import SearchPanel from '@/features/post-search/components/SearchPanel.vue'
import { usePostSearchStore } from '@/features/post-search/stores/usePostSearchStore'
import { nextTick, ref } from 'vue'

const mapRef = ref<InstanceType<typeof SearchMap> | null>(null)
const mapCenter = ref<[number, number]>([40.851775, 14.268124])
const mapZoom = ref(13)

const searchStore = usePostSearchStore()

async function onLocationSelected(loc: {
  lat: number
  lng: number
  type: string
}) {
  mapCenter.value = [loc.lat, loc.lng]
  mapZoom.value = loc.type === 'administrative' ? 15 : 16
  await new Promise((resolve) => setTimeout(resolve, 1000))
  mapRef.value?.searchHere()
}
</script>

<style scoped>
.floating-header {
  @apply fixed left-1/2 z-50 w-[calc(100%-90px)] -translate-x-1/2;
}
</style>
