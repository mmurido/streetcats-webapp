import { ref } from 'vue'
import { formatLocationName } from '@/utils/formatLocation'

export function useLocationSearch() {
  const searchQuery = ref('')
  const displayText = ref('')
  const searchSuggestions = ref<any[]>([])
  const showSuggestions = ref(false)
  const isLoading = ref(false)
  const selectedSuggestion = ref<any>(null)

  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  const searchAddress = async () => {
    if (searchQuery.value.length < 3) {
      searchSuggestions.value = []
      return
    }

    isLoading.value = true
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(searchQuery.value)}&limit=5`
      )
      const data = await response.json()
      searchSuggestions.value = data.map((item: any) => ({
        ...item,
        formatted_name: formatLocationName(item),
      }))
    } catch (error) {
      console.error('Search error:', error)
      searchSuggestions.value = []
    } finally {
      isLoading.value = false
    }
  }

  const handleSearchInput = () => {
    showSuggestions.value = true
    selectedSuggestion.value = null
    searchQuery.value = displayText.value
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (searchQuery.value.length > 2) {
      isLoading.value = true
      searchTimeout = setTimeout(searchAddress, 500)
    } else {
      searchSuggestions.value = []
      isLoading.value = false
    }
  }

  const selectSuggestion = (suggestion: any) => {
    selectedSuggestion.value = suggestion
    searchQuery.value = suggestion.display_name
    displayText.value = formatLocationName(suggestion)
    showSuggestions.value = false
    return suggestion
  }

  const clearSearch = () => {
    searchQuery.value = ''
    displayText.value = ''
    searchSuggestions.value = []
    showSuggestions.value = false
    selectedSuggestion.value = null
  }

  return {
    searchQuery,
    displayText,
    searchSuggestions,
    showSuggestions,
    isLoading,
    selectedSuggestion,
    handleSearchInput,
    selectSuggestion,
    clearSearch,
    searchAddress,
  }
}
