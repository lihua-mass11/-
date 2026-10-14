import type { Router } from 'vue-router'
import { useAuthStore } from '@/store'

/** 判断是否为移动端设备（家属端仅支持 PC 访问） */
function isMobileDevice(): boolean {
  const ua = navigator.userAgent
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua)
}

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    const authStore = useAuthStore()
    const isPublic = to.meta.public === true

    // 错误页直接放行（404 / 403）
    if (to.name === 'error') return true

    // 移动端设备访问 → 403
    if (isMobileDevice()) {
      return { name: 'error', query: { code: '403' } }
    }

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
