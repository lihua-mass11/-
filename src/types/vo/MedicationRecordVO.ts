import type { MedicationRecordStatus } from '../type'

/** 用药打卡记录（按日生成） */
export interface MedicationRecordVO {
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
