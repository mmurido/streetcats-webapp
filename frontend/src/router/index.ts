import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import CreatePostView from '@/views/CreatePostView.vue'
import { useSessionStore } from '@/stores/useSessionStore'
import { useAuthModal } from '@/composables/useAuthModal'
import { nextTick } from 'vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView,
    },
    {
      path: '/post/:id',
      name: 'PostView',
      component: PostView,
      props: true,
    },
    {
      path: '/post/new',
      name: 'CreatePostView',
      component: CreatePostView,
      props: true,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const sessionStore = useSessionStore()
  const { openSignIn } = useAuthModal()

  if (sessionStore.isLoading && to.meta.requiresAuth) {
    await new Promise((resolve) => {
      const checkLoaded = () => {
        if (!sessionStore.isLoading) resolve(true)
        else setTimeout(checkLoaded, 10)
      }
      checkLoaded()
    })
  }

  if (to.meta.requiresAuth && !sessionStore.user) {
    next('/')
    openSignIn()
    return
  }

  next()
})

router.afterEach(async () => {
  await nextTick()
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
})

export default router
