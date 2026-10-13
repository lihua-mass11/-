import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { HealthRecord } from '@/types'
import { fetchHealthRecords } from '@/api'

export const useHealthStore = defineStore('health', () => {
  const healthRecords = ref<HealthRecord[]>([])
  const loaded = ref(false)

  /** 某位老人的健康打卡记录（按日期倒序） */
  const recordsOf = computed(() => (elderId: string) =>
    healthRecords.value
      .filter((r) => r.elderId === elderId)
      .sort((a, b) => (a.date < b.date ? 1 : -1)),
  )

  async function init() {
    healthRecords.value = await fetchHealthRecords()
    loaded.value = true
  }

  return { healthRecords, recordsOf, loaded, init }
})
