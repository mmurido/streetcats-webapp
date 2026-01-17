<template>
  <header
    ref="headerRef"
    :class="type === 'full' ? 'header-full' : 'header-minimal'"
  >
    <div class="header-left">
      <RouterLink to="/" :class="type === 'full' ? 'hidden sm:block' : 'block'">
        <img :src="logo" alt="StreetCats Logo" class="logo" />
      </RouterLink>
      <SearchBar
        id="search-bar"
        v-if="type === 'full'"
        @suggestionSelected="onSuggestionSelected"
        class="max-w-[350px]"
      />
    </div>

    <div class="header-right">
      <div class="hidden md:block">
        <BaseButton
          id="create-post-button"
          text="Share"
          variant="dark"
          @click="goToCreatePost"
        >
          <template #icon>
            <PlusIcon class="size-[15px]" />
          </template>
        </BaseButton>
      </div>

      <div class="md:hidden">
        <BaseButton variant="dark" @click="goToCreatePost">
          <template #icon>
            <PlusIcon class="size-[15px]" />
          </template>
        </BaseButton>
      </div>

      <UserMenu />
    </div>
  </header>
</template>

<script setup lang="ts">
import logo from '@assets/logo.svg'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/useUiStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { useAuthModal } from '@/composables/useAuthModal'
import { PlusIcon } from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'
import SearchBar from '@/features/post-search/components/SearchBar.vue'
import UserMenu from '@/features/profile/components/UserMenu.vue'

const headerRef = ref<HTMLElement>()
const uiStore = useUiStore()
const router = useRouter()
const session = useSessionStore()
const { openSignIn } = useAuthModal()

const props = withDefaults(
  defineProps<{
    type?: 'full' | 'minimal'
  }>(),
  {
    type: 'full',
  }
)

const emit = defineEmits<{
  (
    e: 'locationSelected',
    payload: {
      lat: number
      lng: number
      type: string
    }
  ): void
}>()

function onSuggestionSelected(location: {
  lat: number
  lng: number
  type: string
}) {
  emit('locationSelected', location)
}

function goToCreatePost() {
  if (session.user) {
    router.push('/post/new')
  } else {
    openSignIn()
  }
}

onMounted(() => {
  if (headerRef.value) {
    const style = window.getComputedStyle(headerRef.value)
    const marginTop = parseInt(style.marginTop, 10) || 0
    const marginBottom = parseInt(style.marginBottom, 10) || 0
    const totalOffset = headerRef.value.offsetHeight + marginTop + marginBottom
    uiStore.setHeaderOffset(totalOffset)
  }
})
</script>

<style scoped>
.header-full {
  @apply flex;
  @apply h-[60px];
  @apply items-center justify-between;
  @apply mt-[20px] px-[30px];
  @apply rounded-xl;
  @apply bg-surface;
}

.header-minimal {
  @apply flex;
  @apply h-[70px];
  @apply items-center justify-between;
  @apply mx-[45px] mt-[20px] px-[30px] pb-[10px];
  @apply border-b-[1.5px] border-border;
  @apply bg-surface;
}

.header-left {
  @apply flex flex-1 items-center gap-5 pr-[30px];
}

.header-right {
  @apply flex items-center justify-start gap-5;
}

.logo {
  @apply -mb-[5px] mr-5 h-[25px] cursor-pointer sm:h-[30px] md:h-[35px];
}
</style>
