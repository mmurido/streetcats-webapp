<template>
  <fieldset class="w-full space-y-[4px]">
    <legend id="birthday-label" class="field-label">
      Birthday
      <span class="text-text-error">*</span>
    </legend>

    <div
      id="birthday-picker"
      class="birthday-picker"
      role="group"
      aria-labelledby="birthday-label"
    >
      <!-- Month -->
      <Combobox v-model="month" as="div" class="relative w-full">
        <div class="relative">
          <ComboboxInput
            id="birthday-month"
            :class="['field', { 'has-error': error }]"
            placeholder="Month"
            @change="monthQuery = $event.target.value"
            :display-value="(m) => m as string"
          />
          <ComboboxButton class="combobox-button">
            <ChevronUpDownIcon class="combobox-chevron-icon" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          v-if="filteredMonths.length"
          class="combobox-option-list"
        >
          <ComboboxOption
            v-for="m in filteredMonths"
            :key="m"
            :value="m"
            v-slot="{ active }"
          >
            <li class="combobox-option" :class="{ 'bg-surface-hover': active }">
              {{ m }}
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </Combobox>

      <!-- Day -->
      <input
        id="day"
        type="number"
        min="1"
        max="31"
        placeholder="Day"
        v-model.number="day"
        :class="['field', { 'has-error': error }]"
      />

      <!-- Year -->
      <input
        id="year"
        type="number"
        :max="new Date().getFullYear()"
        min="1900"
        placeholder="Year"
        v-model.number="year"
        :class="['field', { 'has-error': error }]"
      />
    </div>

    <p :class="['field-error', error ? 'visible' : 'invisible']">
      {{ error || '&nbsp;' }}
    </p>
  </fieldset>
</template>

<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { ref, computed, watch } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from '@headlessui/vue'

const props = defineProps<{
  modelValue: string | null
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const [initY, initM, initD] = props.modelValue?.split('-') ?? []
const year = ref(initY ?? '')
const month = ref(initM ? months[Number(initM) - 1] : '')
const day = ref(initD ?? '')

const monthQuery = ref('')
const filteredMonths = computed(() =>
  monthQuery.value === ''
    ? months
    : months.filter((m) =>
        m.toLowerCase().includes(monthQuery.value.toLowerCase())
      )
)

watch([year, month, day], ([y, m, d]) => {
  if (y && m && d) {
    const mm = String(months.indexOf(m) + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    emit('update:modelValue', `${y}-${mm}-${dd}`)
  } else {
    emit('update:modelValue', null)
  }
})
</script>

<style scoped>
.field-label {
  @apply block text-sm font-medium text-text;
}

.birthday-picker {
  @apply grid grid-cols-[2fr,1fr,1fr] gap-x-[5px];
}

.field {
  @apply block w-full rounded-xl border border-border px-4 py-2 text-[80%];
}

.field.has-error {
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
