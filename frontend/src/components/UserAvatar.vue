<template>
  <div data-testid="user-avatar" class="user-avatar" :style="{ width: size, height: size }">
    <img
      v-if="user?.avatar"
      :src="user.avatar"
      alt="Profile"
      class="avatar-image"
    />
    <img v-else :src="defaultAvatar" alt="Default User" class="avatar-image" />
  </div>
</template>

<script setup>
import defaultAvatar from '@/assets/default-avatar.jpg'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  size: {
    type: String,
    default: '40px',
  },
})
</script>

<style scoped>
.user-avatar {
  @apply inline-flex items-center justify-center rounded-full border border-border;
}

.avatar-image {
  @apply h-full w-full rounded-full object-cover;
}
</style>
