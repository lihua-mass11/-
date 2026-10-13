import request from './request'
import type { SosRecord } from '@/types'

/** 读取紧急求助记录 */
export async function fetchSosRecords(): Promise<SosRecord[]> {
  const { data } = await request.get<SosRecord[]>('/sosRecords.json')
  return data
}
