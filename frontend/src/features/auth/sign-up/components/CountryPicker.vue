<template>
  <fieldset class="w-full space-y-[4px]">
    <label for="country-picker" class="label">
      Country
      <span class="text-text-error">*</span>
    </label>
    <Combobox v-model="selectedCountry">
      <div class="relative">
        <ComboboxInput
          id="country-picker"
          :class="['combobox-input', { 'has-error': error }]"
          :displayValue="(country: any) => (country ? `${country.name}` : '')"
          @input="query = $event.target.value"
          placeholder="Select a country"
        />

        <ComboboxButton class="combobox-button">
          <ChevronUpDownIcon class="combobox-chevron-icon" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          v-if="filteredCountries.length > 0"
          class="combobox-option-list"
        >
          <ComboboxOption
            v-for="country in filteredCountries"
            :key="country.code"
            :value="country"
            class="combobox-option"
          >
            <span v-html="country.emoji" class="size-5"></span>
            <span>{{ country.name }}</span>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </Combobox>
    <p :class="['field-error', error ? 'visible' : 'invisible']">
      {{ error || '&nbsp;' }}
    </p>
  </fieldset>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { getCountryName, getCountryEmoji } from '@/utils/countries'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from '@headlessui/vue'

const props = defineProps<{
  modelValue: string | null
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

countries.registerLocale(enLocale)

const countryList = Object.keys(countries.getAlpha2Codes()).map((code) => ({
  code,
  name: getCountryName(code),
  emoji: getCountryEmoji(code),
}))

const selectedCountry = ref<{
  code: string
  name: string
  emoji: string
} | null>(null)
const query = ref('')

const filteredCountries = computed(() => {
  if (!query.value) return countryList
  return countryList.filter((c) =>
    c.name.toLowerCase().includes(query.value.toLowerCase())
  )
})

watch(selectedCountry, (newCountry, oldCountry) => {
  if (newCountry !== oldCountry) {
    emit('update:modelValue', newCountry?.code ?? null)
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    const foundCountry = newVal
      ? (countryList.find((c) => c.code === newVal) ?? null)
      : null
    if (foundCountry?.code !== selectedCountry.value?.code) {
      selectedCountry.value = foundCountry
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.label {
  @apply block text-sm font-medium text-text;
}

.combobox-input {
  @apply block w-full rounded-xl border border-border px-4 py-2 text-[80%];
}

.combobox-input.has-error {
  @apply ring-[1.5px] ring-border-error;
}

.combobox-button {
  @apply absolute inset-y-0 right-0 flex items-center pr-2;
}

.combobox-chevron-icon {
  @apply size-4 text-text-muted;
}

.combobox-option-list {
  @apply absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-surface;
}

.combobox-option {
  @apply flex cursor-pointer select-none items-center gap-2 p-2 text-sm text-text-muted hover:bg-surface-hover;
}

.field-error {
  @apply text-xs font-medium text-text-error;
}
</style>
