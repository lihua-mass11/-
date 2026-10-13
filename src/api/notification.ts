import request from './request'
import type { Notification } from '@/types'

/** 读取通知记录 */
export async function fetchNotifications(): Promise<Notification[]> {
  const { data } = await request.get<Notification[]>('/notifications.json')
  return data
}
