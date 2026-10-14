import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { NotificationVO } from '@/types'
import { fetchNotifications } from '@/api'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<NotificationVO[]>([])
  const loaded = ref(false)

  /** 某位老人的通知（按时间倒序） */
  const listOf = computed(() => (elderId: string) =>
    notifications.value
      .filter((n) => n.elderId === elderId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  )

  /** 未读通知数 */
  const unreadCount = computed(
    () => (elderId: string) =>
      notifications.value.filter((n) => n.elderId === elderId && !n.read).length,
  )

  async function init() {
    notifications.value = await fetchNotifications()
    loaded.value = true
  }

  function markRead(id: string) {
    const target = notifications.value.find((n) => n.id === id)
    if (target) target.read = true
  }

  function markAllRead(elderId: string) {
    notifications.value.forEach((n) => {
      if (n.elderId === elderId) n.read = true
    })
  }

  function markHandled(id: string) {
    const target = notifications.value.find((n) => n.id === id)
    if (target) {
      target.read = true
      target.handled = true
    }
  }

  return { notifications, listOf, unreadCount, loaded, init, markRead, markAllRead, markHandled }
})
