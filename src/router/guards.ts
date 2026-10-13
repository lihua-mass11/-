import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores'

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore()
    const isPublic = to.meta.public === true

    if (!isPublic && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (isPublic && authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }

    return true
  })

  router.afterEach((to) => {
    const title = to.meta.title as string | undefined
    document.title = title ? `${title} · 银龄守护` : '银龄守护 · 家属端'
  })
}
