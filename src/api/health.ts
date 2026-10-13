import request from './request'
import type { HealthRecord } from '@/types'

/** 读取健康打卡记录 */
export async function fetchHealthRecords(): Promise<HealthRecord[]> {
  const { data } = await request.get<HealthRecord[]>('/healthRecords.json')
  return data
}
