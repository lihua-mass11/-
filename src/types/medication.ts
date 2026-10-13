import type { MedicationRecordStatus } from './common'

/** 用药计划 */
export interface Medication {
  id: string
  elderId: string
  name: string
  dosage: string
  frequency: string
  time: string
  note?: string
  enabled: boolean
}

/** 用药计划表单（新增/编辑） */
export interface MedicationForm {
  elderId: string
  name: string
  dosage: string
  frequency: string
  time: string
  note?: string
  enabled: boolean
}

/** 用药打卡记录 */
export interface MedicationRecord {
  id: string
  elderId: string
  medicationId: string
  medicationName: string
  dosage: string
  scheduledTime: string
  takenAt: string | null
  status: MedicationRecordStatus
  date: string
}
