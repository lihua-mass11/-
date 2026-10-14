import request from './request'
import type { MedicationVO, MedicationRecordVO } from '@/types'

/** 读取用药计划 */
export async function fetchMedications(): Promise<MedicationVO[]> {
  const { data } = await request.get<MedicationVO[]>('/medications.json')
  return data
}

/** 读取用药打卡记录 */
export async function fetchMedicationRecords(): Promise<MedicationRecordVO[]> {
  const { data } = await request.get<MedicationRecordVO[]>('/medicationRecords.json')
  return data
}
