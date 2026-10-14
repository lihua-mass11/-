import request from './request'
import type { SosRecordVO } from '@/types'

/** 读取紧急求助记录 */
export async function fetchSosRecords(): Promise<SosRecordVO[]> {
  const { data } = await request.get<SosRecordVO[]>('/sosRecords.json')
  return data
}
