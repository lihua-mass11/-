import request from './request'
import type { NotificationVO } from '@/types'

/** 读取通知记录 */
export async function fetchNotifications(): Promise<NotificationVO[]> {
  const { data } = await request.get<NotificationVO[]>('/notifications.json')
  return data
}
