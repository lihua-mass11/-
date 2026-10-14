import request from './request'
import type { HealthRecordVO } from '@/types'

/** 读取健康打卡记录 */
export async function fetchHealthRecords(): Promise<HealthRecordVO[]> {
  const { data } = await request.get<HealthRecordVO[]>('/healthRecords.json')
  return data
}
