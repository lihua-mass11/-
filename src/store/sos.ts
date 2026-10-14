import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { SosRecordVO } from '@/types'
import { fetchSosRecords } from '@/api'

export const useSosStore = defineStore('sos', () => {
  const sosRecords = ref<SosRecordVO[]>([])
  const loaded = ref(false)

  /** 某位老人的求助记录（按时间倒序） */
  const recordsOf = computed(() => (elderId: string) =>
    sosRecords.value
      .filter((r) => r.elderId === elderId)
      .sort((a, b) => (a.triggeredAt < b.triggeredAt ? 1 : -1)),
  )

  /** 是否存在未处理的求助 */
  const hasPending = computed(
    () => (elderId: string) =>
      sosRecords.value.some((r) => r.elderId === elderId && r.status === 'pending'),
  )

  async function init() {
    sosRecords.value = await fetchSosRecords()
    loaded.value = true
  }

  function handleSos(id: string) {
    const target = sosRecords.value.find((r) => r.id === id)
    if (target && target.status === 'pending') {
      target.status = 'handled'
      target.handledAt = new Date().toISOString()
    }
  }

  return { sosRecords, recordsOf, hasPending, loaded, init, handleSos }
})
