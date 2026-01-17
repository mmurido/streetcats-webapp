<template>
  <div
    :class="[
      'marker',
      { 'marker-selected': selected },
      selected ? 'border-accent bg-accent' : 'bg-surface',
    ]"
    data-testid="map-marker"
  >
    <img :src="catFace" alt="Cat Face" class="cat-face" />
  </div>
</template>

<script setup lang="ts">
import catFace from '@assets/cat-face.png'

defineProps<{
  selected?: boolean
}>()
</script>

<style scoped>
.marker {
  @apply flex;
  @apply size-[40px];
  @apply items-center justify-center;
  @apply rounded-full border-[1px] border-border;
  @apply shadow-lg;
}

.marker:hover {
  @apply scale-110 transition-all duration-200 ease-out;
}

.marker-selected {
  filter: drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.8))
    drop-shadow(0px 0px 12px rgba(59, 130, 246, 0.6))
    drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3));
}

.cat-face {
  @apply size-[25px];
}
</style>
