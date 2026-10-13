import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Medication, MedicationForm, MedicationRecord } from '@/types'
import { fetchMedicationRecords, fetchMedications } from '@/api'

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export const useMedicationStore = defineStore('medication', () => {
  const medications = ref<Medication[]>([])
  const records = ref<MedicationRecord[]>([])
  const loaded = ref(false)

  /** 某位老人的用药计划 */
  const medicationsOf = computed(() => (elderId: string) =>
    medications.value.filter((m) => m.elderId === elderId),
  )

  /** 某位老人的打卡记录（按时间倒序） */
  const recordsOf = computed(() => (elderId: string) =>
    records.value
      .filter((r) => r.elderId === elderId)
      .sort((a, b) => (a.scheduledTime < b.scheduledTime ? 1 : -1)),
  )

  async function loadMedications() {
    medications.value = await fetchMedications()
  }

  async function loadRecords() {
    records.value = await fetchMedicationRecords()
  }

  async function init() {
    await Promise.all([loadMedications(), loadRecords()])
    loaded.value = true
  }

  function addMedication(form: MedicationForm) {
    const item: Medication = { id: genId('m'), ...form }
    medications.value.unshift(item)
  }

  function updateMedication(id: string, form: MedicationForm) {
    const target = medications.value.find((m) => m.id === id)
    if (target) Object.assign(target, form)
  }

  function removeMedication(id: string) {
    medications.value = medications.value.filter((m) => m.id !== id)
  }

  function toggleEnabled(id: string) {
    const target = medications.value.find((m) => m.id === id)
    if (target) target.enabled = !target.enabled
  }

  return {
    medications,
    records,
    loaded,
    medicationsOf,
    recordsOf,
    init,
    addMedication,
    updateMedication,
    removeMedication,
    toggleEnabled,
  }
})
