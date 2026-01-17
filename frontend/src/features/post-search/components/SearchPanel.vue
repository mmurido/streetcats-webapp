<template>
  <!-- Floating toggle button -->
  <button
    id="toggle-results-panel"
    @click="uiStore.toggleResultsPanel"
    class="toggle-button"
    :style="{
      left: `${uiStore.isResultsPanelVisible ? uiStore.panelOffset - 55 : 25}px`,
    }"
  >
    <ChevronDoubleLeftIcon
      v-if="uiStore.isResultsPanelVisible"
      class="toggle-icon pr-[2px]"
    />
    <ChevronDoubleRightIcon v-else class="toggle-icon pl-[2px]" />
  </button>

  <Transition name="slide">
    <aside v-if="uiStore.isResultsPanelVisible" ref="panelRef" class="panel">
      <!-- Preloader -->
      <div v-if="postSearchStore.isLoading" class="preloader-container">
        <img :src="preloader" alt="Loading..." class="preloader" />
      </div>

      <!-- Results -->
      <section
        v-else-if="posts.length != 0"
        class="results-list"
        ref="scrollContainer"
      >
        <header class="my-[30px]">
          <span class="results-count">{{ posts.length }} results</span>
        </header>
        <SearchItem
          v-for="post in posts"
          :key="post.id"
          :post="post"
          class="mb-6 last:mb-0"
        />

        <div class="pagination-controls">
          <button
            @click="$emit('prevPage')"
            :class="[
              'pagination-arrow',
              postSearchStore.currentPage <= 1
                ? 'pointer-events-none opacity-0'
                : 'opacity-100',
            ]"
          >
            <ChevronLeftIcon class="arrow-icon" />
          </button>

          <span class="pagination-text">
            Page {{ postSearchStore.currentPage }}
            <span v-if="postSearchStore.totalPages">
              of {{ postSearchStore.totalPages }}
            </span>
          </span>

          <button
            @click="$emit('nextPage')"
            :class="[
              'pagination-arrow',
              postSearchStore.totalPages &&
              postSearchStore.currentPage >= postSearchStore.totalPages
                ? 'pointer-events-none opacity-0'
                : 'opacity-100',
            ]"
          >
            <ChevronRightIcon class="arrow-icon" />
          </button>
        </div>
      </section>

      <!-- No results message -->
      <section
        v-else
        class="flex flex-1 items-center justify-center text-text-placeholder"
      >
        <span>No results!</span>
      </section>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import SearchItem from './SearchItem.vue'
import { Post } from '@/types'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/solid'
import { usePostSearchStore } from '../stores/usePostSearchStore'
import preloader from '@assets/preloader.svg'

const uiStore = useUiStore()
const postSearchStore = usePostSearchStore()
const panelRef = ref<HTMLElement>()
const scrollContainer = ref<HTMLElement>()

const props = defineProps<{
  posts: Post[]
}>()

defineEmits<{
  nextPage: []
  prevPage: []
}>()

const calculatePanelOffset = () => {
  if (panelRef.value) {
    const style = window.getComputedStyle(panelRef.value)
    const marginLeft = parseInt(style.marginLeft, 10) || 0
    const marginRight = parseInt(style.marginRight, 10) || 0
    const totalOffset = panelRef.value.offsetWidth + marginLeft + marginRight
    uiStore.setPanelOffset(totalOffset)
  }
}

const updatePanelOffset = () => setTimeout(calculatePanelOffset, 10)

onMounted(() => {
  updatePanelOffset()
  window.addEventListener('resize', updatePanelOffset)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePanelOffset)
})

watch(
  () => uiStore.isResultsPanelVisible,
  (newVal) => {
    if (newVal) {
      if (newVal) updatePanelOffset()
    }
  }
)

watch(
  () => props.posts,
  () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  { deep: true }
)
</script>

<style scoped>
.panel {
  @apply absolute bottom-[15px] top-[85px] flex;
  @apply w-full max-w-[calc(100vw-90px)] lg:w-[550px];
  @apply flex-col;
  @apply mx-[37px] pl-[30px];
  @apply rounded-xl border-[1.5px] border-border;
  @apply bg-surface shadow-xl;
}

.results-count {
  @apply text-sm text-text-muted;
}

.results-list {
  @apply mr-[6px] flex-1 overflow-y-auto pb-[20px] pr-[35px];
}

.pagination-controls {
  @apply mt-[50px] flex items-center justify-center gap-4;
}

.pagination-text {
  @apply text-sm text-text-muted;
}

.pagination-arrow {
  @apply flex size-[30px] items-center justify-center rounded-full transition-all duration-200;
}

.arrow-icon {
  @apply size-[20px] text-text;
}

.toggle-button {
  @apply absolute left-[25px] top-[90px] z-50;
  @apply p-[5px];
  @apply rounded-full;
  @apply bg-surface opacity-90 drop-shadow-lg;
  @apply transition-transform duration-300 ease-in-out;
}

.toggle-icon {
  @apply size-[22px] text-text-muted;
}

.toggle-button:hover {
  @apply scale-105 opacity-100 transition-all duration-200 ease-out;
}

.toggle-icon:hover {
  @apply scale-105 text-text;
}

.preloader-container {
  @apply flex min-h-screen w-full items-center justify-center;
}

.preloader {
  @apply -mt-[100px] size-[80px] opacity-30;
}

/* Slide transition styles */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
