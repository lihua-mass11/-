import type { NotificationType } from './common'

/** 通知记录 */
export interface Notification {
  id: string
  elderId: string
  type: NotificationType
  title: string
  content: string
  createdAt: string
  read: boolean
  handled: boolean
}
