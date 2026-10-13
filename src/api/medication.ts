import request from './request'
import type { Medication, MedicationRecord } from '@/types'

/** 读取用药计划 */
export async function fetchMedications(): Promise<Medication[]> {
  const { data } = await request.get<Medication[]>('/medications.json')
  return data
}

/** 读取用药打卡记录 */
export async function fetchMedicationRecords(): Promise<MedicationRecord[]> {
  const { data } = await request.get<MedicationRecord[]>('/medicationRecords.json')
  return data
}
