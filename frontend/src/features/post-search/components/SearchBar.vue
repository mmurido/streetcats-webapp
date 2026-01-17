<template>
  <div class="search-container">
    <div class="relative">
      <input
        :id="id"
        v-model="displayText"
        type="text"
        placeholder="Search for an address..."
        class="search-input"
        @input="handleSearchInput"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <div v-if="isLoading" class="spinner" />
        <MagnifyingGlassIcon v-else class="h-5 w-5 text-gray-400" />
      </div>
    </div>

    <div
      v-if="showSuggestions && searchSuggestions.length > 0"
      class="suggestions-dropdown"
      id="search-suggestions"
    >
      <div
        v-for="(suggestion, index) in searchSuggestions"
        :key="index"
        class="suggestion-item"
        @click="onSelect(suggestion)"
        data-testid="search-suggestion-item"
      >
        {{ suggestion.formatted_name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useLocationSearch } from '../composables/useLocationSearch'

defineProps<{
  id?: string
}>()

const emit = defineEmits<{
  (
    e: 'suggestionSelected',
    location: {
      lat: number
      lng: number
      type: string
    }
  ): void
}>()

function onSelect(suggestion: any) {
  selectSuggestion(suggestion)

  emit('suggestionSelected', {
    lat: parseFloat(suggestion.lat),
    lng: parseFloat(suggestion.lon || suggestion.lng),
    type: suggestion.type,
  })

  showSuggestions.value = false
}

const {
  displayText,
  searchSuggestions,
  showSuggestions,
  isLoading,
  handleSearchInput,
  selectSuggestion,
} = useLocationSearch()

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.search-container')) {
    showSuggestions.value = false
  }
}

document.addEventListener('click', handleClickOutside)
</script>

<style scoped>
.search-container {
  @apply relative flex-1;
}

.search-input {
  @apply w-full rounded-xl border border-border px-4 py-2 pr-10 text-sm;
}

.spinner {
  @apply h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-400;
}

.suggestions-dropdown {
  @apply absolute z-20 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg;
}

.suggestion-item {
  @apply cursor-pointer px-4 py-2 text-sm text-text-muted hover:bg-surface-hover hover:text-text;
}

.suggestion-item:first-child {
  @apply rounded-t-lg;
}

.suggestion-item:last-child {
  @apply rounded-b-lg;
}

.suggestion-item:not(:last-child) {
  @apply border-b border-border;
}
</style>
